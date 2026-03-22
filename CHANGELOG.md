# Changelog

## 2.0.0

### Breaking Changes

- Replaced Svelte/SvelteKit with Lit web components
- Replaced Tailwind CSS with vanilla CSS custom properties
- Replaced pnpm with bun
- Upgraded Tauri from v1 to v2
- Requires Node.js 24+ (or Bun)

### Added

- Lit custom elements: `oath-app`, `oath-form`, `oath-qr`, `oath-heading`, `oath-example`, `oath-instructions`, `oath-footer`
- QR privacy shield with backdrop blur and auto-re-engage on credential change
- QR placeholder state when no credentials entered
- Authenticator preview with configurable digit count
- Biome for linting and formatting
- Playwright end-to-end test suite
- Tauri v2 capabilities with minimal permissions
- Content Security Policy for native builds
- Dark mode via CSS custom properties and `prefers-color-scheme`

### Changed

- Options simplified from `{ name, value }` objects to plain arrays
- URI formatting rewritten with `URLSearchParams` for proper encoding
- Issuer list expanded from 50 to 77 entries
- QR rendering switched from `svelte-qr` to `qrcode` canvas API
- Tauri window sized to 520x860 (was 800x600)

### Removed

- SvelteKit, Svelte, svelte-forms, svelte-qr
- Tailwind CSS, PostCSS, autoprefixer
- ESLint, Prettier
- Changesets versioning
- Service worker
- PWA manifest and screenshots
- Custom SVG icon components
