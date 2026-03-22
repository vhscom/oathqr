import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("oath-example")
export class OathExample extends LitElement {
	@property() label = "";
	@property() issuer = "";
	@property({ type: Number }) digits = 6;
	@property() type: "totp" | "hotp" = "totp";

	@state() private code = "";
	@state() private progress = 70;

	private intervalId = 0;

	static styles = css`
		:host {
			display: block;
		}
		.preview {
			padding: 1rem;
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: 0.5rem;
		}
		h3 {
			margin: 0 0 0.75rem;
			font-size: 0.85rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--color-text-muted);
		}
		.mockup {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0.75rem;
			background: var(--color-bg);
			border-radius: 0.375rem;
		}
		.avatar {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			background: rgba(128, 128, 128, 0.4);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.25rem;
			font-weight: 300;
			color: var(--color-text);
			flex-shrink: 0;
		}
		.detail {
			flex: 1;
			min-width: 0;
		}
		.issuer-label {
			font-weight: 600;
			color: var(--color-text);
			font-size: 0.95rem;
		}
		.account {
			color: var(--color-text-muted);
			font-size: 0.85rem;
		}
		.code {
			font-size: 1.5rem;
			font-weight: 600;
			font-family: monospace;
			color: var(--color-link);
			letter-spacing: 0.05em;
		}
		progress {
			display: block;
			width: 100%;
			height: 3px;
			border: none;
			appearance: none;
			margin-top: 0.5rem;
		}
		progress::-webkit-progress-bar {
			background: var(--color-border);
		}
		progress::-webkit-progress-value {
			background: var(--color-primary);
			transition: width 50ms linear;
		}
		progress::-moz-progress-bar {
			background: var(--color-primary);
		}
	`;

	connectedCallback() {
		super.connectedCallback();
		this.code = this.generateCode();
		this.intervalId = window.setInterval(() => this.tick(), 50);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.clearInterval(this.intervalId);
	}

	private generateCode(): string {
		const raw = Math.random()
			.toString()
			.slice(2)
			.padEnd(this.digits, "0")
			.slice(0, this.digits);
		const mid = Math.floor(this.digits / 2);
		return `${raw.slice(0, mid)} ${raw.slice(mid)}`;
	}

	private tick() {
		if (!this.label && !this.issuer) return;
		this.progress = this.progress <= 0 ? 100 : this.progress - 1;
		if (this.progress === 0) {
			this.code = this.generateCode();
		}
	}

	render() {
		if (!this.label && !this.issuer) return nothing;

		const initial = this.issuer
			? this.issuer[0].toUpperCase()
			: (this.label[0]?.toUpperCase() ?? "?");

		return html`
			<div class="preview">
				<h3>Authenticator Preview</h3>
				<div class="mockup">
					<div class="avatar">${initial}</div>
					<div class="detail">
						<div>
							${
								this.issuer
									? html`<span class="issuer-label">${this.issuer}</span> `
									: nothing
							}
							<span class="account">(${this.label || "account"})</span>
						</div>
						<div class="code">${this.code}</div>
					</div>
				</div>
				${
					this.type === "totp"
						? html`<progress
								aria-hidden="true"
								max="100"
								.value=${this.progress}
							></progress>`
						: nothing
				}
			</div>
		`;
	}
}
