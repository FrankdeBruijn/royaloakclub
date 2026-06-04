# Royal Oak Club

Next.js app voor een AP Royal Oak horloge database — referenties, afbeeldingen, filters.

## Status
Live op https://royaloakclub.vercel.app/ — auto-deploy bij push naar `main`.

## Stack
- Next.js 16.2.6 (Turbopack), TypeScript, Tailwind CSS
- Supabase (URL: https://tiinckbwtmwrmmpuhfsy.supabase.co)
- Vercel (auto-deploy)
- `.env.local` aanwezig op MacBook met legacy JWT anon key

## Repo
https://github.com/FrankdeBruijn/royaloakclub

## Locaties
- **MacBook:** `~/Projects/royaloakclub`
- **Mac Studio:** SSH via `ssh frankdebruijn@macstudanfrank5.home` (sleutel ingesteld)
- **Backups:** `~/royaloakclub-wayback/` op Mac Studio

## Lokaal draaien
```bash
npm run dev
```

## Deployen
```bash
git push origin main   # Vercel pakt dit automatisch op
```

## Opgeloste bugs (mei 2026)
- Mobiele responsive grid (1→2→3 kolommen)
- Namen overflow (min-w-0, break-words)
- HTML entities gedecodeerd (Pictet &amp; → Pictet &)
- Volledige referentie via image bestandsnaam (zonder .jpg)
- Pocketwatch URL-param filter
- Image error handling in gallery en grid
- Next.js bijgewerkt naar 16.2.6
- Terug-knop ging naar homepage i.p.v. database
- 147 horloges zonder afbeelding verborgen, toggle knop toegevoegd
- Favicon: Grande Complication (€896.990)
- Paginatitel: "Royal Oak Club"
