# Patenhuhn V0.4

V0.4 verbindet den kompletten Kernablauf:

1. Kunde registriert sich / meldet sich an.
2. Kunde bestellt eine Patenschaft unter `/bestellen`.
3. Admin legt Höfe und Hühner unter `/admin` an.
4. Admin ordnet einer Bestellung exakt so viele verfügbare Hühner zu wie bestellt wurden.
5. Die Datenbank legt echte Patenschaften an, markiert Hühner als vergeben und schreibt die erste Wochenration gut.
6. Im digitalen Stall `/stall` sieht der Kunde seine Hühner und sein Eierguthaben.
7. Der Kunde erzeugt für eine gewünschte Eiermenge einen einmaligen Abholcode inklusive QR-Code.
8. Hof/Admin löst den Code unter `/hof` ein. Derselbe Code kann danach nicht erneut verwendet werden.
9. Offene Codes können vom Kunden storniert werden; die reservierten Eier werden zurückgebucht.

## GitHub / Vercel

Den **Inhalt dieses Ordners** in das bestehende GitHub-Repository hochladen. `app`, `lib`, `public`, `package.json` usw. müssen direkt im Repository-Root liegen.

Vercel benötigt weiterhin:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`.env.local` niemals in GitHub hochladen.

## Supabase

Auf einer bestehenden Datenbank **nur die neue Migration einmal ausführen**:

`supabase/migrations/003_full_cycle.sql`

`001_core.sql` und bereits ausgeführte Migrationen **nicht erneut ausführen**.

Die 003-Migration ist absichtlich tolerant, falls V0.3/002 noch nicht oder bereits ausgeführt wurde.

## Admin machen

Nach der Registrierung einmal im Supabase SQL Editor ausführen (E-Mail ersetzen):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'DEINE-EMAILADRESSE'
);
```

Danach ab- und wieder anmelden.

## Wichtige Seiten

- `/` Startseite
- `/registrieren` Registrierung
- `/login` Login
- `/bestellen` Patenschaft bestellen
- `/stall` digitaler Hühnerstall
- `/admin` Administration
- `/hof` Eiercode einlösen
- `/impressum` Impressum
- `/datenschutz` Datenschutz-Arbeitsstand
