# Royal Oak Club

Next.js app voor een AP Royal Oak horloge database — referenties, afbeeldingen, filters.

## Status
Live op https://royaloakclub.vercel.app/ — auto-deploy bij push naar `main`.

## Stack
- Next.js 16.2.6 (Turbopack), TypeScript, Tailwind CSS
- Supabase (URL: https://tiinckbwtmwrmmpuhfsy.supabase.co)
- Vercel (auto-deploy)

## Env-vars (`.env.local`, staat nooit in git — `.gitignore` vangt `.env*`)

| Variabele | Opmerking |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tiinckbwtmwrmmpuhfsy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | nieuwe-stijl publishable key (`sb_publishable_…`); hoort publiek te zijn en staat dus gewoon in de browserbundel |
| `SUPABASE_SERVICE_KEY` | **geheim** — omzeilt RLS, volledige DB-toegang |
| `RESEND_API_KEY` | **geheim** — kan mail versturen |

Deze repo is **publiek**. De onderste twee mogen er nooit in belanden.
Nieuwe machine? Kopieer `.env.local` van een machine die hem al heeft:

```bash
scp ~/Projects/royal-oak-club/royaloakclub/.env.local frankdebruijn@macstudanfrank5.home:~/Projects/royal-oak-club/royaloakclub/
```

## Repo
https://github.com/FrankdeBruijn/royaloakclub

## Locaties

| Waar | Pad | Rol |
|---|---|---|
| **NAS** | `/Volumes/NAS-MOBILE/MAINFRAME/Projecten/royaloakclub` | hier is V3 gebouwd; bereikbaar vanaf MacBook én Mac Studio |
| **MacBook** | `~/Projects/royal-oak-club/royaloakclub` | lokale clone (verplaatst onder klantmap 2026-07-23) |
| **Mac Studio** | `~/Projects/royal-oak-club/royaloakclub` | lokale clone (verplaatst onder klantmap 2026-07-23) |

Drie clones = **GitHub is de scheidsrechter**. Begin op elke machine met `git pull`.

Backups: `royaloakclub-backup/` en `royaloakclub-wayback/` staan ín de NAS-projectmap
(niet in `~`). Ze zijn nu ge-gitignored — ze horen niet in deze publieke repo.

SSH: MacBook → Mac Studio werkt (`ssh frankdebruijn@macstudanfrank5.home`, sleutel
ingesteld). Andersom niet: op de MacBook staat Remote Login uit.

**Werk je op de NAS-kopie?** Zet dan `git config core.fileMode false` — anders meldt
git 39 gewijzigde bestanden die in werkelijkheid alleen van rechten verschillen (SMB-ruis).
Dat is daar al ingesteld.

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
