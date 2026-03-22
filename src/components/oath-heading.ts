import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("oath-heading")
export class OathHeading extends LitElement {
	@property({ type: Boolean }) native = false;

	static styles = css`
		:host {
			display: block;
			text-align: center;
		}
		h1 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--color-primary);
			margin: 0 0 0.25rem;
		}
		p {
			color: var(--color-text-muted);
			margin: 0;
		}
	`;

	render() {
		if (this.native) return nothing;
		return html`
			<h1>OATHqr</h1>
			<p>Turn your secrets into scannable QR codes.</p>
		`;
	}
}
