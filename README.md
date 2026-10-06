# Patenhuhn V0.5

Next.js + Supabase + Vercel.

## Neu in V0.5
- ausschließlich personalisierte Patenhühner
- Spendenhuhn-/Eierspenden-Option aus der Bestellung entfernt
- Premium-Paket klar definiert und gilt für alle Hennen einer Patenschaft
- Bestellbestätigung: „Anfrage wird gestellt / Bestätigung per E-Mail“
- Kontaktformular an bobs@posteo.de
- Bestellanfragen werden zusätzlich per Mail an bobs@posteo.de gesendet, sobald Resend konfiguriert ist
- Impressum aktualisiert
- BoBs Eier im Footer und auf der Startseite verlinkt

## Supabase
Nur diese neue Migration EINMAL ausführen:
`supabase/migrations/004_branding_contact_cleanup.sql`

Alte Migrationen NICHT erneut ausführen.

## Vercel Environment Variables
Bereits vorhanden:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Für echten automatischen Mailversand zusätzlich:
- `RESEND_API_KEY`
- `MAIL_FROM`

`MAIL_FROM` muss eine bei Resend freigegebene Absenderadresse/-domain sein. Empfänger ist fest `bobs@posteo.de`.

Ohne Resend-Konfiguration werden Bestellungen und Kontaktanfragen trotzdem sicher in Supabase gespeichert; nur die zusätzliche E-Mail wird dann nicht versendet.

## GitHub
Den INHALT dieses Ordners in das bestehende Repository hochladen, sodass `app/`, `lib/`, `public/`, `supabase/` und `package.json` direkt im Repo-Root liegen.
