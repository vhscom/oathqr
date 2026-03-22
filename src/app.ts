import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { OathParams } from "./lib/uri.js";

import "./components/oath-example.js";
import "./components/oath-footer.js";
import "./components/oath-form.js";
import "./components/oath-heading.js";
import "./components/oath-instructions.js";
import "./components/oath-qr.js";

@customElement("oath-app")
export class OathApp extends LitElement {
	@state() private uri = "";
	@state() private params: OathParams | null = null;
	@state() private qrSize = 256;
	@state() private isNative = false;

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			max-width: 40rem;
			margin: 0 auto;
			padding: 2rem 1rem;
		}
	`;

	connectedCallback() {
		super.connectedCallback();
		this.isNative = "__TAURI_INTERNALS__" in window;
	}

	private handleChange(e: CustomEvent) {
		this.uri = e.detail.uri;
		this.params = e.detail.params;
		this.qrSize = e.detail.qrSize;
	}

	render() {
		return html`
			<oath-heading .native=${this.isNative}></oath-heading>
			<oath-instructions .native=${this.isNative}></oath-instructions>
			<oath-form @oath-change=${this.handleChange}></oath-form>
			<oath-qr .uri=${this.uri} .size=${this.qrSize}></oath-qr>
			<oath-example
				.label=${this.params?.label ?? ""}
				.issuer=${this.params?.issuer ?? ""}
				.digits=${this.params?.digits ?? 6}
				.type=${this.params?.type ?? "totp"}
			></oath-example>
			<oath-footer></oath-footer>
		`;
	}
}
