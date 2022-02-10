# Offline 2FA QR Code Generator

> Save your 2FA secrets, then use this to scan them again.

This is an offline 2FA QR code generator made with SvelteKit that helps you make QR codes from 2FA secrets. Inspired by [the jQuery version](https://stefansundin.github.io/2fa-qr/) by Stefan Sundin.

## Demo

View the [app running online](https://2fa-qr-svelte.vercel.app).

## Motivation

Stefan's QR code generator contains several external requests meaning it cannot run offline. In addition, the jQuery version relies on web fonts provided by Google which makes the application less accessible to users in Mainland China and pings Google every time you load the page. I have addressed those concerns in this version, which runs offline and does not make any external requests.

## Differences

Summary of differences from the jQuery version:

- Adds strict same-origin CSP via HTTP request headers.
- Makes no external requests for dependencies.
- Generates sharper QR codes composed of pure vectors.
- QR code containing secret cannot be saved to device.
- Dark mode applied based on user preference.
- Uses a native font stack and doesn't rely on Google.
- Adjusts form validation logic to make it more friendly.
- Missing ability to paste custom `otpauth` URIs directly.
- Missing dynamic Authenticator app preview card.

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

Copyright (C) 2022 VHS

This work is released under the terms of the GPL-3.0-or-later license. See the file COPYING in the source code for full license text.
