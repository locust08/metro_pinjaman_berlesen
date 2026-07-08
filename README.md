# Metro Pinjaman Berlesen

Next.js static export for the Metro Pinjaman Berlesen website, with Cloudflare Pages Functions for booking APIs.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build exports static files to `out/`.

## Cloudflare Pages

Use these build settings:

```text
Framework preset: Next.js
Build command: npm run build
Build output directory: out
```

The `functions/` directory provides the `/api/bookings` routes used by the contact form.
