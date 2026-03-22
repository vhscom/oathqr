import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("oath-footer")
export class OathFooter extends LitElement {
	static styles = css`
		:host {
			display: block;
			text-align: center;
			padding: 2rem 0 1rem;
			color: var(--color-text-muted);
			font-size: 0.85rem;
		}
		p {
			margin: 0 0 0.25rem;
		}
		a {
			color: var(--color-link);
		}
	`;

	render() {
		return html`
			<p>
				Made by
				<a href="https://vhs.codeberg.page" target="_blank" rel="noopener"
					>VHS</a
				>.
			</p>
			<p>
				<a
					href="https://docs.yubico.com/yesdk/users-manual/application-oath/uri-string-format.html"
					target="_blank"
					rel="noopener"
					>URI string format</a
				>
				&middot;
				<a
					href="https://codeberg.org/vhs/oathqr"
					target="_blank"
					rel="noopener"
					>Source</a
				>
			</p>
		`;
	}
}
