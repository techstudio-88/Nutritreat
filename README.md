# Rackhouse

Gym management SaaS: owner/staff panel (`/admin`), member PWA (`/portal`), and an animated landing page.

## Stack
Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS 3, Framer Motion, Supabase.

## Run
```
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

## Status
- Done: Supabase schema + RLS (applied via migration), landing page, admin shell + 10 pages, portal shell + 5 pages. Data on the pages is demo data (`src/lib/demo.ts`).
- Next: replace demo data with Supabase queries, Razorpay checkout, WhatsApp via Twilio, Inngest cron jobs, PWA manifest + service worker.
