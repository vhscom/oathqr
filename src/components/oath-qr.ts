import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import QRCode from "qrcode";

@customElement("oath-qr")
export class OathQr extends LitElement {
	@property() uri = "";
	@property({ type: Number }) size = 256;
	@state() private shielded = true;

	static styles = css`
		:host {
			display: block;
			text-align: center;
		}
		.qr-container {
			display: inline-block;
			position: relative;
			cursor: pointer;
			border-radius: 0.5rem;
			overflow: hidden;
		}
		canvas {
			display: block;
		}
		.shield {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--color-shield);
			backdrop-filter: blur(8px);
			transition: opacity 0.2s;
		}
		.shield.revealed {
			opacity: 0;
			pointer-events: none;
		}
		.shield span {
			color: var(--color-text);
			font-size: 0.9rem;
			padding: 0.5rem 1rem;
			background: var(--color-surface);
			border-radius: 0.375rem;
			border: 1px solid var(--color-border);
		}
		.placeholder {
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--color-surface);
			border: 2px dashed var(--color-border);
			border-radius: 0.5rem;
			color: var(--color-text-muted);
			font-size: 0.9rem;
		}
	`;

	willUpdate(changed: Map<string, unknown>) {
		if (changed.has("uri") && this.uri) {
			this.shielded = true;
		}
	}

	async updated(changed: Map<string, unknown>) {
		if (changed.has("uri") || changed.has("size")) {
			if (this.uri) {
				await this.renderQr();
			}
		}
	}

	private async renderQr() {
		const canvas = this.shadowRoot?.querySelector("canvas");
		if (!canvas || !this.uri) return;
		try {
			await QRCode.toCanvas(canvas, this.uri, {
				width: this.size,
				margin: 2,
				color: { dark: "#000000", light: "#ffffff" },
			});
		} catch {
			// invalid URI — canvas stays blank
		}
	}

	private toggleShield() {
		this.shielded = !this.shielded;
	}

	render() {
		if (!this.uri) {
			return html`
				<div
					class="placeholder"
					style="width:${this.size}px;height:${this.size}px;margin:0 auto;"
				>
					Enter credentials to generate QR
				</div>
			`;
		}

		return html`
			<div
				class="qr-container"
				@click=${this.toggleShield}
				@keydown=${(e: KeyboardEvent) => {
					if (e.key === "Enter" || e.key === " ") this.toggleShield();
				}}
				role="button"
				tabindex="0"
				aria-label=${
					this.shielded ? "Click to reveal QR code" : "Click to hide QR code"
				}
			>
				<canvas></canvas>
				<div class="shield ${this.shielded ? "" : "revealed"}">
					<span>Click to reveal</span>
				</div>
			</div>
		`;
	}
}
