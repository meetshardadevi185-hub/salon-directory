# TrimCircle — home page

Next.js (App Router) site, statically exported: English at `/`, Hindi at `/hi/`, animated with GSAP + ScrollTrigger + Flip + Lenis.

```bash
npm install
npm run dev      # http://localhost:3000  (Hindi: /hi/)
npm run build    # → out/  (deploy this folder to Vercel/Netlify/any static host)
npm start        # serve out/ locally to check the production build
```

## Where things live
- `app/(en)/` — English route at `/`. `app/[locale]/` — every other ready locale (`/hi/`, …). Each has its own root layout so `<html lang>` is correct per page.
- `components/HomePage.tsx` — the whole page markup (server component). `components/RootDocument.tsx` — `<html>`, metadata, hreflang, font preloads.
- `lib/site-effects.ts` — search, filters, menus and all motion; runs once after hydration via `components/SiteEffects.tsx`.
- `messages/en.json`, `messages/hi.json` — every word on the page (ICU plurals, next-intl compatible). `hi.json` is an AI draft: get a native speaker to review before launch.
- `i18n/locales.mjs` — all 13 Indian languages registered (incl. Urdu RTL). To launch one: add `messages/<code>.json`, set `ready: true`, add its Noto font to `styles/fonts.css`, rebuild.
- `data/home.mjs` — **set `whatsappNumber` and `siteUrl`**; categories, looks and salons are SAMPLE data.
- `public/assets/photos/` — placeholder art (marked "Example photo"). Replace with real Agra salon photos, same file names, WebP, same aspect ratio.
- `styles/site.css`, `styles/fonts.css` — styles and self-hosted fonts. `PLAN.md` — design + motion plan.

# salon-directory
