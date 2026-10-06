# Patenhuhn V0.6

Komplette GitHub-Version der Patenhuhn-Webanwendung.

## Neu in V0.6
- ruhiger Freiland-/Mobilstall-Look mit Hof-Hintergrund
- Login robuster gegen falsch eingetragene Supabase-URL mit `/auth/v1` oder anderem Pfad
- „Name auf der Urkunde“ → „Urkunde ausgestellt für“
- abweichende E-Mail für Eierempfang entfernt
- Urkundenstile: Klassisch, Natur, Mittelalter, Comic
- „Eierguthaben“ in der Kundensprache weitgehend durch „digitales Nest“ ersetzt
- „Welsumer“ aus Demo-/Stallanzeige entfernt
- Text bei Code-Einlösung ohne „echten“
- ausführlichere Leistungen der Patenschaft
- Premium bleibt für alle Hennen einer Patenschaft
- automatische Bestell-/Kontaktmail über Resend vorbereitet

## Supabase
Für V0.6 ist **keine neue SQL-Migration nötig**, wenn `003_full_cycle.sql` und `004_branding_contact_cleanup.sql` bereits gelaufen sind.

Alte Migrationen niemals erneut ausführen.

## Vercel Environment Variables

### Supabase
```text
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Bei `NEXT_PUBLIC_SUPABASE_URL` am besten wirklich nur die Basis-URL verwenden, also **ohne** `/auth/v1`, `/rest/v1` oder weitere Pfade. V0.6 normalisiert die URL zusätzlich automatisch.

### Resend / automatische E-Mails
```text
RESEND_API_KEY=re_...
MAIL_FROM=Patenhuhn <anfragen@deine-verifizierte-domain.de>
```

Bestell- und Kontaktmails werden an `bobs@posteo.de` geschickt. Die im Formular eingegebene Kundenmail wird als Reply-To gesetzt.

Für Resend muss der Absender bzw. die Domain im Resend-Konto verifiziert werden. Ohne Resend-Konfiguration werden Bestellungen/Kontaktanfragen weiterhin in Supabase gespeichert; nur der zusätzliche Mailversand bleibt aus.

## GitHub / Vercel
Den **Inhalt** dieses Ordners in das bestehende Repository hochladen, sodass `app/`, `public/`, `package.json` usw. direkt im Repository-Root liegen. Vercel sollte danach automatisch neu deployen.
