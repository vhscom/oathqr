import { css, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
	algorithms,
	digitOptions,
	issuers,
	periods,
	types,
} from "../lib/options.js";
import { formatUri, type OathParams } from "../lib/uri.js";

@customElement("oath-form")
export class OathForm extends LitElement {
	@state() type: "totp" | "hotp" = "totp";
	@state() secret = "";
	@state() label = "";
	@state() issuer = "";
	@state() algorithm = "SHA1";
	@state() digits = 6;
	@state() period = 30;
	@state() counter = 0;
	@state() showSecret = false;
	@state() showUri = false;
	@state() showAdvanced = false;
	@state() qrSize = 256;

	static styles = css`
		:host {
			display: block;
		}
		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		label {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-weight: 500;
			color: var(--color-text);
		}
		.label-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		input,
		select {
			padding: 0.5rem 0.75rem;
			border: 1px solid var(--color-border);
			border-radius: 0.375rem;
			background: var(--color-input-bg);
			color: var(--color-text);
			font-size: 0.95rem;
			font-family: inherit;
		}
		input:focus,
		select:focus {
			outline: 2px solid var(--color-primary);
			outline-offset: -1px;
		}
		.radio-group {
			display: flex;
			gap: 1rem;
		}
		.radio-group label {
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
			font-weight: 400;
			cursor: pointer;
		}
		.toggle-btn {
			background: none;
			border: none;
			color: var(--color-link);
			cursor: pointer;
			font-size: 0.8rem;
			padding: 0;
		}
		.toggle-btn:hover {
			text-decoration: underline;
		}
		.advanced-toggle {
			background: none;
			border: none;
			color: var(--color-link);
			cursor: pointer;
			font-size: 0.9rem;
			padding: 0.5rem 0;
			text-align: left;
			font-family: inherit;
		}
		.advanced {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
			background: var(--color-surface);
			border-radius: 0.375rem;
			border: 1px solid var(--color-border);
		}
		.advanced-note {
			font-size: 0.8rem;
			color: var(--color-text-muted);
			line-height: 1.5;
			margin: 0;
		}
		.uri-output {
			word-break: break-all;
			padding: 0.5rem 0.75rem;
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: 0.375rem;
			font-family: monospace;
			font-size: 0.85rem;
			color: var(--color-text-muted);
			min-height: 2.5rem;
			user-select: all;
		}
		.size-control {
			display: flex;
			align-items: center;
			gap: 0.75rem;
		}
		input[type="range"] {
			flex: 1;
			accent-color: var(--color-primary);
		}
		.size-value {
			font-size: 0.85rem;
			color: var(--color-text-muted);
			min-width: 4ch;
		}
	`;

	private get params(): OathParams {
		return {
			type: this.type,
			secret: this.secret,
			label: this.label,
			issuer: this.issuer,
			algorithm: this.algorithm,
			digits: this.digits,
			period: this.period,
			counter: this.counter,
		};
	}

	private get uri(): string {
		return formatUri(this.params);
	}

	private lastUri = "";
	private lastQrSize = 256;

	updated() {
		const uri = this.uri;
		if (uri === this.lastUri && this.qrSize === this.lastQrSize) return;
		this.lastUri = uri;
		this.lastQrSize = this.qrSize;
		this.dispatchEvent(
			new CustomEvent("oath-change", {
				detail: { uri, params: this.params, qrSize: this.qrSize },
				bubbles: true,
				composed: true,
			}),
		);
	}

	render() {
		return html`
			<form @submit=${(e: Event) => e.preventDefault()}>
				<label>
					Type
					<div class="radio-group">
						${types.map(
							(t) => html`
								<label>
									<input
										type="radio"
										name="type"
										.value=${t}
										.checked=${this.type === t}
										@change=${() => {
											this.type = t;
										}}
									/>
									${t.toUpperCase()}
								</label>
							`,
						)}
					</div>
				</label>

				<label>
					<div class="label-row">
						Secret
						<button
							type="button"
							class="toggle-btn"
							@click=${() => {
								this.showSecret = !this.showSecret;
							}}
						>
							${this.showSecret ? "Hide" : "Show"}
						</button>
					</div>
					<input
						type=${this.showSecret ? "text" : "password"}
						.value=${this.secret}
						placeholder="JBSWY3DPEHPK3PXP"
						@input=${(e: InputEvent) => {
							this.secret = (e.target as HTMLInputElement).value;
						}}
						autocomplete="off"
						spellcheck="false"
						required
					/>
				</label>

				<label>
					Label
					<input
						type="text"
						.value=${this.label}
						placeholder="user@example.com"
						@input=${(e: InputEvent) => {
							this.label = (e.target as HTMLInputElement).value;
						}}
						required
					/>
				</label>

				<label>
					Issuer
					<input
						type="text"
						list="issuers"
						.value=${this.issuer}
						placeholder="GitHub"
						@input=${(e: InputEvent) => {
							this.issuer = (e.target as HTMLInputElement).value;
						}}
					/>
					<datalist id="issuers">
						${issuers.map((i) => html`<option value=${i}></option>`)}
					</datalist>
				</label>

				${
					this.type === "hotp"
						? html`
							<label>
								Counter
								<input
									type="number"
									.value=${String(this.counter)}
									min="0"
									@input=${(e: InputEvent) => {
										this.counter =
											Number.parseInt(
												(e.target as HTMLInputElement).value,
												10,
											) || 0;
									}}
								/>
							</label>
						`
						: nothing
				}

				<button
					type="button"
					class="advanced-toggle"
					@click=${() => {
						this.showAdvanced = !this.showAdvanced;
					}}
				>
					${this.showAdvanced ? "\u25be" : "\u25b8"} Advanced options
				</button>

				${
					this.showAdvanced
						? html`
							<div class="advanced">
								<label>
									Algorithm
									<select
										.value=${this.algorithm}
										@change=${(e: Event) => {
											this.algorithm = (e.target as HTMLSelectElement).value;
										}}
									>
										${algorithms.map(
											(a) =>
												html`<option
													value=${a}
													?selected=${this.algorithm === a}
												>
													${a}
												</option>`,
										)}
									</select>
								</label>

								<label>
									Digits
									<select
										.value=${String(this.digits)}
										@change=${(e: Event) => {
											this.digits = Number.parseInt(
												(e.target as HTMLSelectElement).value,
												10,
											);
										}}
									>
										${digitOptions.map(
											(d) =>
												html`<option
													value=${d}
													?selected=${this.digits === d}
												>
													${d}
												</option>`,
										)}
									</select>
								</label>

								${
									this.type === "totp"
										? html`
											<label>
												Period (seconds)
												<select
													.value=${String(this.period)}
													@change=${(e: Event) => {
														this.period = Number.parseInt(
															(e.target as HTMLSelectElement).value,
															10,
														);
													}}
												>
													${periods.map(
														(p) =>
															html`<option
																value=${p}
																?selected=${this.period === p}
															>
																${p}s
															</option>`,
													)}
												</select>
											</label>
										`
										: nothing
								}
								<p class="advanced-note">
									Advanced options are ignored by Google
									Authenticator but may be supported by other
									apps. Yubico, for example, is known to
									support these options.
								</p>
							</div>
						`
						: nothing
				}

				<label>
					<div class="label-row">
						URI
						<button
							type="button"
							class="toggle-btn"
							@click=${() => {
								this.showUri = !this.showUri;
							}}
						>
							${this.showUri ? "Hide" : "Show"}
						</button>
					</div>
					<div class="uri-output">
						${
							this.showUri
								? this.uri || "Fill in the fields above"
								: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
						}
					</div>
				</label>

				<label>
					<div class="label-row">
						QR Size
						<span class="size-value">${this.qrSize}px</span>
					</div>
					<div class="size-control">
						<input
							type="range"
							min="180"
							max="330"
							.value=${String(this.qrSize)}
							@input=${(e: InputEvent) => {
								this.qrSize = Number.parseInt(
									(e.target as HTMLInputElement).value,
									10,
								);
							}}
						/>
					</div>
				</label>
			</form>
		`;
	}
}
