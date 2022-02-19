# OATHqr

> Turn your secrets into scannable QR codes.

OATHqr helps users create security credentials for use with 2FA/MFA and other [OATH-enabled](https://openauthentication.org) apps. Use it to generate scannable QR codes for one-time password authenticator apps such as [Aegis](https://getaegis.app/) or [YubiKey](https://docs.yubico.com/yesdk/index.html). Or skip the QR code altogether and paste the formatted `otpauth` URI it creates directly into [OpenPGP](https://www.openpgp.org/software/)-activated password managers such as the remarkable [Pass](https://www.passwordstore.org/) standard unix password manager.

## Use Cases

- Ease migration between authenticator solutions.
- Customize auth URI data and access advanced security features.
- Enable users to work directly with auth strings to discourage camera use.
- Discourage users from saving secrets to cleartext files they cannot read.
- Consolidate account credentials within encrypted password managers.
## Highlights

- Makes no external requests and runs offline-first.
- Installable to mobile device home screens.
- Defaults browser to strict Content-Security Policy.
- Informs users when they are using a trusted origin.
- Discourages user from saving QR code to a file.
- Proactively disables [FLoC surveillance](https://www.eff.org/deeplinks/2021/03/googles-floc-terrible-idea) in Chrome.
- Provides accessible form for more inclusive design.
- Promotes ethical software alternatives to Google.
- Adjusts color scheme based on system preference.
- Includes native build target with isolation enabled.

## Screenshots

OATHqr adapts its colors based on your current system preference:

|              Prefers Light               |              Prefers Dark               |
| :--------------------------------------: | :-------------------------------------: |
| ![Light Mode](./static/screenshot1.webp) | ![Dark Mode](./static/screenshot2.webp) |

## Demo

View the [online demo](https://oathqr.vercel.app) to test it out and see how it works.

## Developing

Depending on your target environment.
### Web

Once you've cloned the project and installed development dependencies with `pnpm install`, start a development server:


```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Native

Once you've cloned the project, completed the [Tauri prerequisites](https://tauri.studio/docs/getting-started/prerequisites/) and installed development dependencies with `pnpm install`, start a development server:

```bash
pnpm tauri dev
```

## Building

### Web

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

### Native

To create a native version of your app:

```bash
pnpm tauri build
```

## Rights

OATHqr - Turn your secrets into scannable QR Codes.<br>
Copyright (C) 2022 VHS \<vhsdev@tutanota.com\> (https://vhs.codeberg.page)

OATHqr is made available under the AGPL-3.0-or-later license. See the file COPYING in the source for the complete license text. To purchase a commercial license for the purpose of whitelabeling this application within your organization please [contact the author](https://vhs.codeberg.page/contact).
