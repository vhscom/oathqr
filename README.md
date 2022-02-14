# OATHqr

> Turn your secrets into scannable QR codes.

OATHqr helps you create security credentials for use with 2FA/MFA authenticator and other OATH-enabled apps. Use it to generate scannable QR codes for OTP apps such as [Aegis](https://getaegis.app/) and [YubiKey](https://docs.yubico.com/yesdk/index.html). Or skip the QR code and paste the formatted `otpauth` URI directly into your [Pass](https://www.passwordstore.org/) client.

## The OATH Group

https://openauthentication.org

## Demo

View the [app running online](https://oathqr.vercel.app) to see how it works.

## Developing

Once you've cloned the project and installed development dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment.

## Rights

OATHqr - Turn your secrets into scannable QR Codes.<br>
Copyright (C) 2022 VHS \<vhsdev@tutanota.com\> (https://vhs.codeberg.page)

OATHqr is made available under the AGPL-3.0-or-later license. See the file COPYING in the source for the complete license text. To purchase a commercial license for the purpose of whitelabeling this application within your organization please [contact the author](https://vhs.codeberg.page/contact).
