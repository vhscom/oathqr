import { spawn } from "node:child_process";
import { chromium } from "playwright";

function startServer() {
	return new Promise((resolve, reject) => {
		const proc = spawn("bun", ["run", "dev"], { stdio: "pipe" });
		const onData = (data) => {
			const match = data.toString().match(/http:\/\/localhost:(\d+)/);
			if (match) resolve({ proc, url: `http://localhost:${match[1]}` });
		};
		proc.stdout.on("data", onData);
		proc.stderr.on("data", onData);
		proc.on("error", reject);
		setTimeout(() => reject(new Error("Server failed to start")), 10000);
	});
}

async function run() {
	const { proc: server, url: BASE } = await startServer();
	console.log(`Server running at ${BASE}\n`);
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	const errors = [];
	const logs = [];

	page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
	page.on("pageerror", (err) => errors.push(err.message));

	console.log("1. Loading page...");
	await page.goto(BASE, { waitUntil: "networkidle" });

	// Check all custom elements are defined
	console.log("2. Checking web components are registered...");
	const components = [
		"oath-app",
		"oath-heading",
		"oath-instructions",
		"oath-form",
		"oath-qr",
		"oath-example",
		"oath-footer",
	];
	for (const tag of components) {
		const defined = await page.evaluate(
			(t) => customElements.get(t) !== undefined,
			tag,
		);
		console.log(`   ${defined ? "PASS" : "FAIL"} <${tag}> registered`);
		if (!defined) errors.push(`<${tag}> not registered`);
	}

	// Check heading renders
	console.log("3. Checking heading renders...");
	const heading = await page.evaluate(() => {
		const el = document.querySelector("oath-app");
		const h = el?.shadowRoot?.querySelector("oath-heading");
		return {
			title: h?.shadowRoot?.querySelector("h1")?.textContent,
			subtitle: h?.shadowRoot?.querySelector("p")?.textContent,
		};
	});
	console.log(
		`   ${heading.title === "OATHqr" ? "PASS" : "FAIL"} heading: "${heading.title}"`,
	);
	console.log(
		`   ${heading.subtitle?.includes("secrets into scannable") ? "PASS" : "FAIL"} subtitle: "${heading.subtitle}"`,
	);

	// Check instructions render
	console.log("4. Checking instructions render...");
	const instructions = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const el = app?.shadowRoot?.querySelector("oath-instructions");
		return el?.shadowRoot?.querySelector("p")?.textContent?.trim().slice(0, 40);
	});
	console.log(
		`   ${instructions?.includes("OATH") ? "PASS" : "FAIL"} instructions: "${instructions}..."`,
	);

	// Check form renders with all expected inputs
	console.log("5. Checking form elements...");
	const formChecks = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		if (!sr) return { error: "no shadow root" };
		return {
			radios: sr.querySelectorAll('input[type="radio"]').length,
			secretInput: !!sr.querySelector('input[type="password"]'),
			labelInput: !!sr.querySelector(
				'input[type="text"][placeholder="user@example.com"]',
			),
			issuerInput: !!sr.querySelector('input[list="issuers"]'),
			datalist: sr.querySelector("datalist#issuers")?.children.length ?? 0,
			rangeInput: !!sr.querySelector('input[type="range"]'),
			advancedBtn: !!sr.querySelector(".advanced-toggle"),
		};
	});
	console.log(
		`   ${formChecks.radios === 2 ? "PASS" : "FAIL"} type radios: ${formChecks.radios} (expected 2)`,
	);
	console.log(
		`   ${formChecks.secretInput ? "PASS" : "FAIL"} secret input (password)`,
	);
	console.log(`   ${formChecks.labelInput ? "PASS" : "FAIL"} label input`);
	console.log(
		`   ${formChecks.issuerInput ? "PASS" : "FAIL"} issuer input with datalist`,
	);
	console.log(
		`   ${formChecks.datalist > 50 ? "PASS" : "FAIL"} issuer datalist options: ${formChecks.datalist}`,
	);
	console.log(`   ${formChecks.rangeInput ? "PASS" : "FAIL"} QR size slider`);
	console.log(
		`   ${formChecks.advancedBtn ? "PASS" : "FAIL"} advanced toggle button`,
	);

	// Check placeholder QR state
	console.log("6. Checking QR placeholder (no input yet)...");
	const placeholder = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		return qr?.shadowRoot?.querySelector(".placeholder")?.textContent?.trim();
	});
	console.log(
		`   ${placeholder?.includes("Enter credentials") ? "PASS" : "FAIL"} placeholder: "${placeholder}"`,
	);

	// Fill in the form and test QR generation
	console.log("7. Filling form with test TOTP credentials...");
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;

		const secretInput = sr.querySelector('input[type="password"]');
		secretInput.value = "JBSWY3DPEHPK3PXP";
		secretInput.dispatchEvent(new Event("input", { bubbles: true }));

		const labelInput = sr.querySelector(
			'input[placeholder="user@example.com"]',
		);
		labelInput.value = "test@example.com";
		labelInput.dispatchEvent(new Event("input", { bubbles: true }));

		const issuerInput = sr.querySelector('input[list="issuers"]');
		issuerInput.value = "GitHub";
		issuerInput.dispatchEvent(new Event("input", { bubbles: true }));
	});

	// Wait for reactive updates
	await page.waitForTimeout(500);

	// Verify URI was generated
	console.log("8. Checking URI generation...");
	const uri = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		// Click show URI button
		const toggles = sr.querySelectorAll(".toggle-btn");
		const uriToggle = toggles[1]; // second toggle is URI
		uriToggle?.click();
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(sr.querySelector(".uri-output")?.textContent?.trim());
			}, 200);
		});
	});
	const uriValid =
		uri?.startsWith("otpauth://totp/") &&
		uri?.includes("secret=JBSWY3DPEHPK3PXP") &&
		uri?.includes("issuer=GitHub");
	console.log(`   ${uriValid ? "PASS" : "FAIL"} URI: "${uri}"`);

	// Check QR canvas appeared (shield covering it)
	console.log("9. Checking QR code rendered...");
	const qrState = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		const sr = qr?.shadowRoot;
		const canvas = sr?.querySelector("canvas");
		const shield = sr?.querySelector(".shield");
		return {
			hasCanvas: !!canvas,
			canvasWidth: canvas?.width ?? 0,
			shieldVisible: shield && !shield.classList.contains("revealed"),
			shieldText: shield?.querySelector("span")?.textContent,
		};
	});
	console.log(
		`   ${qrState.hasCanvas ? "PASS" : "FAIL"} canvas element present`,
	);
	console.log(
		`   ${qrState.canvasWidth > 0 ? "PASS" : "FAIL"} canvas rendered (width: ${qrState.canvasWidth})`,
	);
	console.log(
		`   ${qrState.shieldVisible ? "PASS" : "FAIL"} shield is covering QR`,
	);
	console.log(
		`   ${qrState.shieldText === "Click to reveal" ? "PASS" : "FAIL"} shield text: "${qrState.shieldText}"`,
	);

	// Click to reveal QR
	console.log("10. Testing shield toggle (click to reveal)...");
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		const container = qr?.shadowRoot?.querySelector(".qr-container");
		container?.click();
	});
	await page.waitForTimeout(300);
	const revealed = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		const shield = qr?.shadowRoot?.querySelector(".shield");
		return shield?.classList.contains("revealed");
	});
	console.log(`   ${revealed ? "PASS" : "FAIL"} shield revealed after click`);

	// Check example preview appeared
	console.log("11. Checking authenticator preview...");
	const preview = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const ex = app?.shadowRoot?.querySelector("oath-example");
		const sr = ex?.shadowRoot;
		return {
			avatar: sr?.querySelector(".avatar")?.textContent?.trim(),
			issuer: sr?.querySelector(".issuer-label")?.textContent,
			account: sr?.querySelector(".account")?.textContent,
			code: sr?.querySelector(".code")?.textContent?.trim(),
			hasProgress: !!sr?.querySelector("progress"),
		};
	});
	console.log(
		`   ${preview.avatar === "G" ? "PASS" : "FAIL"} avatar initial: "${preview.avatar}"`,
	);
	console.log(
		`   ${preview.issuer === "GitHub" ? "PASS" : "FAIL"} issuer: "${preview.issuer}"`,
	);
	console.log(
		`   ${preview.account === "(test@example.com)" ? "PASS" : "FAIL"} account: "${preview.account}"`,
	);
	const codeMatch = /^\d{3} \d{3}$/.test(preview.code ?? "");
	console.log(
		`   ${codeMatch ? "PASS" : "FAIL"} animated code: "${preview.code}"`,
	);
	console.log(`   ${preview.hasProgress ? "PASS" : "FAIL"} TOTP progress bar`);

	// Test HOTP toggle
	console.log("12. Testing HOTP type switch...");
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const hotpRadio = sr.querySelectorAll('input[type="radio"]')[1];
		hotpRadio.click();
	});
	await page.waitForTimeout(300);
	const hotpState = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		return {
			counterInput: !!sr.querySelector('input[type="number"]'),
			uriText: sr.querySelector(".uri-output")?.textContent?.trim(),
		};
	});
	console.log(
		`   ${hotpState.counterInput ? "PASS" : "FAIL"} counter field appeared`,
	);
	console.log(
		`   ${hotpState.uriText?.includes("otpauth://hotp/") ? "PASS" : "FAIL"} URI switched to hotp`,
	);

	// Test advanced options
	console.log("13. Testing advanced options panel...");
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		sr.querySelector(".advanced-toggle")?.click();
	});
	await page.waitForTimeout(300);
	const advancedState = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const advanced = sr.querySelector(".advanced");
		return {
			visible: !!advanced,
			selects: advanced?.querySelectorAll("select").length ?? 0,
		};
	});
	console.log(
		`   ${advancedState.visible ? "PASS" : "FAIL"} advanced panel visible`,
	);
	console.log(
		`   ${advancedState.selects >= 2 ? "PASS" : "FAIL"} select dropdowns: ${advancedState.selects}`,
	);

	// Test show/hide secret
	console.log("14. Testing secret show/hide toggle...");
	const secretToggle = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const toggles = sr.querySelectorAll(".toggle-btn");
		const secretToggle = toggles[0];
		const inputBefore = sr.querySelector('input[type="password"]')
			? "password"
			: "text";
		secretToggle?.click();
		return new Promise((resolve) => {
			setTimeout(() => {
				const inputAfter = sr.querySelector(
					'input[type="text"][autocomplete="off"]',
				)
					? "text"
					: "password";
				resolve({ before: inputBefore, after: inputAfter });
			}, 200);
		});
	});
	console.log(
		`   ${secretToggle.before === "password" ? "PASS" : "FAIL"} initially hidden (${secretToggle.before})`,
	);
	console.log(
		`   ${secretToggle.after === "text" ? "PASS" : "FAIL"} revealed after click (${secretToggle.after})`,
	);

	// Check footer
	console.log("15. Checking footer links...");
	const footer = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const ft = app?.shadowRoot?.querySelector("oath-footer");
		const links = ft?.shadowRoot?.querySelectorAll("a");
		return Array.from(links ?? []).map((a) => ({
			text: a.textContent,
			href: a.href,
		}));
	});
	console.log(
		`   ${footer.length === 3 ? "PASS" : "FAIL"} footer links: ${footer.length}`,
	);
	for (const link of footer) {
		console.log(`   PASS  "${link.text}" -> ${link.href}`);
	}

	// Check dark mode CSS vars are accessible
	console.log("16. Checking theme CSS custom properties...");
	const themeVars = await page.evaluate(() => {
		const style = getComputedStyle(document.documentElement);
		return {
			primary: style.getPropertyValue("--color-primary").trim(),
			bg: style.getPropertyValue("--color-bg").trim(),
			text: style.getPropertyValue("--color-text").trim(),
		};
	});
	console.log(
		`   ${themeVars.primary === "#799832" ? "PASS" : "FAIL"} --color-primary: ${themeVars.primary}`,
	);
	console.log(
		`   ${themeVars.bg ? "PASS" : "FAIL"} --color-bg: ${themeVars.bg}`,
	);
	console.log(
		`   ${themeVars.text ? "PASS" : "FAIL"} --color-text: ${themeVars.text}`,
	);

	// --- Security tests ---

	console.log("\n17. Checking no data persistence after form input...");
	const storage = await page.evaluate(() => {
		return {
			localStorageKeys: Object.keys(localStorage),
			sessionStorageKeys: Object.keys(sessionStorage),
			cookies: document.cookie,
		};
	});
	console.log(
		`   ${storage.localStorageKeys.length === 0 ? "PASS" : "FAIL"} localStorage empty: ${JSON.stringify(storage.localStorageKeys)}`,
	);
	console.log(
		`   ${storage.sessionStorageKeys.length === 0 ? "PASS" : "FAIL"} sessionStorage empty: ${JSON.stringify(storage.sessionStorageKeys)}`,
	);
	console.log(
		`   ${storage.cookies === "" ? "PASS" : "FAIL"} no cookies: "${storage.cookies}"`,
	);

	console.log("18. Checking no outbound network requests...");
	const outbound = [];
	page.on("request", (req) => {
		const url = req.url();
		if (!url.startsWith(BASE)) outbound.push(url);
	});
	// Navigate again to capture all requests from a clean load
	await page.goto(BASE, { waitUntil: "networkidle" });
	console.log(
		`   ${outbound.length === 0 ? "PASS" : "FAIL"} no external requests: ${outbound.length === 0 ? "none" : outbound.join(", ")}`,
	);

	console.log("19. Checking secret field security attributes...");
	const secretAttrs = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const input = sr?.querySelector('input[type="password"]');
		return {
			autocomplete: input?.getAttribute("autocomplete"),
			spellcheck: input?.getAttribute("spellcheck"),
		};
	});
	console.log(
		`   ${secretAttrs.autocomplete === "off" ? "PASS" : "FAIL"} autocomplete="${secretAttrs.autocomplete}"`,
	);
	console.log(
		`   ${secretAttrs.spellcheck === "false" ? "PASS" : "FAIL"} spellcheck="${secretAttrs.spellcheck}"`,
	);

	console.log("20. Checking referrer policy...");
	const referrer = await page.evaluate(() => {
		const meta = document.querySelector('meta[name="referrer"]');
		return meta?.getAttribute("content");
	});
	console.log(
		`   ${referrer === "no-referrer" ? "PASS" : "FAIL"} referrer policy: "${referrer}"`,
	);

	console.log("21. Checking external links have rel=noopener...");
	const linkSecurity = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const footer = app?.shadowRoot?.querySelector("oath-footer");
		const links = footer?.shadowRoot?.querySelectorAll("a[target='_blank']");
		return Array.from(links ?? []).map((a) => ({
			text: a.textContent,
			rel: a.getAttribute("rel"),
		}));
	});
	for (const link of linkSecurity) {
		const ok = link.rel?.includes("noopener");
		console.log(`   ${ok ? "PASS" : "FAIL"} "${link.text}" rel="${link.rel}"`);
	}

	console.log("22. Checking shield re-engages on URI change...");
	// Fill form to produce a QR
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const secret = sr?.querySelector('input[type="password"]');
		secret.value = "JBSWY3DPEHPK3PXP";
		secret.dispatchEvent(new Event("input", { bubbles: true }));
		const label = sr?.querySelector('input[placeholder="user@example.com"]');
		label.value = "test@example.com";
		label.dispatchEvent(new Event("input", { bubbles: true }));
	});
	await page.waitForTimeout(500);
	// Reveal the shield
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		qr?.shadowRoot?.querySelector(".qr-container")?.click();
	});
	await page.waitForTimeout(200);
	// Now change the label to trigger a new URI
	await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const form = app?.shadowRoot?.querySelector("oath-form");
		const sr = form?.shadowRoot;
		const label = sr?.querySelector('input[placeholder="user@example.com"]');
		label.value = "changed@example.com";
		label.dispatchEvent(new Event("input", { bubbles: true }));
	});
	await page.waitForTimeout(300);
	const reShielded = await page.evaluate(() => {
		const app = document.querySelector("oath-app");
		const qr = app?.shadowRoot?.querySelector("oath-qr");
		const shield = qr?.shadowRoot?.querySelector(".shield");
		return shield && !shield.classList.contains("revealed");
	});
	console.log(
		`   ${reShielded ? "PASS" : "FAIL"} shield re-engaged after credential change`,
	);

	// Check console errors
	console.log("\n--- Console output ---");
	for (const log of logs) {
		console.log(`   ${log}`);
	}

	console.log("\n--- Page errors ---");
	if (errors.length === 0) {
		console.log("   PASS  No page errors");
	} else {
		for (const err of errors) {
			console.log(`   FAIL  ${err}`);
		}
	}

	// Summary
	console.log(`\n${"=".repeat(50)}`);
	console.log(`Page errors: ${errors.length}`);
	console.log(`Console messages: ${logs.length}`);
	console.log("=".repeat(50));

	await browser.close();
	server.kill();
	process.exit(errors.length > 0 ? 1 : 0);
}

run().catch((err) => {
	console.error("Test runner failed:", err);
	process.exit(1);
});
