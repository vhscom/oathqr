# OATHgen

> Turn your secrets into scannable QR codes.

OATHgen helps you create security credentials for use with 2FA/MFA authenticator and other OATH-enabled apps. Use it to generate scannable QR codes for OTP apps such as [Aegis](https://getaegis.app/) and [YubiKey](https://docs.yubico.com/yesdk/index.html). Or skip the QR code and paste the formatted `otpauth` URI directly into your [Pass](https://www.passwordstore.org/) client.

## Demo

View the [app running online](https://oathgen.vercel.app) to see how it works.

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

Copyright (C) 2022 VHS \<vhsdev@tutanota.com\> (https://vhs.codeberg.page)

OATHgen is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

To purchase a commercial license please [contact the author](https://vhs.codeberg.page/contact).
