# Patenhuhn MVP V0.1

Erster technischer Kern für den Neubau der Patenhuhn-Plattform.

## Enthalten
- Höfe
- Hühner
- Kundenprofile
- Patenschaften
- 6 Eier pro Woche als konfigurierbarer Standard
- Eier-Kontobuch statt unsicherem Einzelzähler
- einmalige Abholcodes
- Reservierung und Storno
- Einlösen durch Hof/Admin
- grundlegende RLS-Regeln

## Empfohlener Stack
- Next.js App Router
- Supabase Postgres + Auth
- Vercel

Für aktuelle Next.js/Supabase-Projekte sollte Auth serverseitig mit `@supabase/ssr` und Cookie-Sessions eingerichtet werden.

## Start
1. Neues Supabase-Projekt anlegen.
2. Datei `supabase/migrations/001_core.sql` einmal im SQL Editor ausführen.
3. Danach keine Migration ein zweites Mal ausführen.
4. Next.js-App separat anlegen und Supabase verbinden.
5. `.env.local` niemals veröffentlichen oder in ZIP/Git einchecken.

## Nächster Entwicklungsschritt
V0.2: echte Next.js-Oberfläche mit Login und dem ersten digitalen Hühnerstall.
