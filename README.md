# Patenhuhn V0.2

Erste echte Next.js-Web-App für Patenhuhn.

## Enthalten
- Startseite
- Supabase Login
- Digitaler Hühnerstall
- Demo-Huhn „Lotta“ wenn noch kein Benutzer eingeloggt ist
- Versuch, aktive Patenschaft + Eiertransaktionen aus Supabase zu laden
- 6-Eier-pro-Woche-Darstellung

## Environment Variables
In Vercel anlegen:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Die Variablen sind bei Vercel als `config` sichtbar, nicht als `secret`.

## Wichtig
`.env.local` niemals in GitHub hochladen.

## GitHub Upload
Den **Inhalt dieses Ordners** in das bestehende Repository `Patenhuhn` hochladen. Vorhandene README darf ersetzt werden.

## Vercel
Nach dem Commit sollte Vercel automatisch neu deployen. Falls nicht: Deployments -> Redeploy.

## Nächste Version
V0.3: Registrierung, echte Patenschaftsauswahl, Abholcode/QR-Code und Hof-Einlösung.
