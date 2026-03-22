# OATHqr

> Turn your secrets into scannable QR codes.

OATHqr helps users create security credentials for use with 2FA/MFA and
other [OATH-enabled](https://openauthentication.org) apps. Use it to generate scannable QR codes for one-time password
authenticator apps such as [Aegis](https://getaegis.app/) or [YubiKey](https://docs.yubico.com/yesdk/index.html). Or
skip the QR code altogether and paste the formatted `otpauth` URI it creates directly
into [OpenPGP](https://www.openpgp.org/software/)-activated password managers such as the
remarkable [Pass](https://www.passwordstore.org/) standard unix password manager.

## Use Cases

- Ease migration between authenticator solutions.
- Customize auth URI data and access advanced security features.
- Enable users to work directly with auth strings to discourage camera use.
- Discourage users from saving secrets to cleartext files they cannot read.
- Consolidate account credentials within encrypted password managers.

## Highlights

- Makes no external requests and runs offline-first.
- No data leaves your browser — zero network calls, zero storage.
- Privacy shield auto-engages when credentials change.
- Provides accessible form for more inclusive design.
- Adjusts color scheme based on system preference.
- Includes native desktop build target via Tauri.

## Development

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 24+)
- [Rust](https://rustup.rs/) (for native builds only)

### Web

Install dependencies and start a development server:

```shell
bun install
bun run dev
```

### Native

Complete the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and then:

```bash
bun run tauri:dev
```

## Building

### Web

```bash
bun run build
```

Preview the production build with `bun run preview`.

### Native

```bash
bun run tauri:build
```

## Testing

```bash
bun run test
```

Runs Playwright end-to-end tests against the dev server covering all components, form interactions, QR generation, security attributes, and privacy controls.

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run check` | Lint and format check (Biome) |
| `bun run fix` | Auto-fix lint and format issues |
| `bun run test` | Run Playwright e2e tests |
| `bun run clean` | Remove build artifacts |
| `bun run tauri:dev` | Start Tauri dev environment |
| `bun run tauri:build` | Build native desktop app |

## License

OATHqr - Turn your secrets into scannable QR Codes.<br>
Copyright (C) 2022 VHS \<vhsdev@tutanota.com\> (https://vhs.codeberg.page)

OATHqr is made available under the AGPL-3.0-or-later license. See the file COPYING in the source for the complete
license text.
