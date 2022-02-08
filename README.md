# 2fa-qr-svelte

> Save your 2FA secrets, then use this to scan them again.

This is a 2FA QR code generator made with SvelteKit that helps you make QR codes from 2FA secrets. Based on [the original](https://stefansundin.github.io/2fa-qr/) by Stefan Sundin.

## Motivation

Stefan's original QR code generator contains several external requests meaning it cannot run offline. In addition, the original version relies on web fonts provided by Google which decreases privacy and makes the application less accessible to users in Mainland China. I have addressed those problems in this version, which can run fully offline once built and does not rely on Google for web font display.

## Developing

Once you've cloned the project and installed dependencies with `pnpm install`, start a development server:

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
