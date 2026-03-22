import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("oath-instructions")
export class OathInstructions extends LitElement {
	@property({ type: Boolean }) native = false;

	static styles = css`
		:host {
			display: block;
			padding: 1rem;
			background: var(--color-surface);
			border-radius: 0.5rem;
			border: 1px solid var(--color-border);
		}
		p {
			margin: 0;
			line-height: 1.6;
			color: var(--color-text);
		}
	`;

	render() {
		return html`
			<p>
				Enter your OATH credential details below to generate a QR code. Scan
				the code with your authenticator app (e.g. Aegis, Google
				Authenticator, YubiKey).
				${
					this.native
						? html`This app works entirely offline.`
						: html`No data leaves your browser.`
				}
			</p>
		`;
	}
}
