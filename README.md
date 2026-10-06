# Patenhuhn.de V0.7.1

V0.7.1 erweitert die bestehende V0.6 um die vollständige Urkundenfunktion und das Patenhuhn.de-Branding.

## Neu
- Patenhuhn.de als Markenname in Header/Footer
- originales BoBs-Eier-Logo lokal eingebunden und verlinkt
- altes Patenhuhn-Plakat als Wiedererkennungselement auf der Startseite (ohne „Bekannt von früher“)
- vier echte Urkundenlayouts: Klassisch, Natur, Mittelalter, Comic
- Klassisch bewusst schlichter gestaltet
- Wunschname(n) und Urkundenstil werden beim Anlegen der Patenschaft übernommen
- Admin kann pro Huhn ein Foto hochladen
- Admin kann mit Maus/Finger/Stift digital unterschreiben
- ohne digitale Signatur bleibt eine Linie für die handschriftliche Unterschrift
- Urkunde erscheint im persönlichen Patenprofil
- PDF-Download direkt aus dem Patenprofil
- Bestellung/Kontakt: Supabase speichert zuerst; danach öffnet sich `mailto:bobs@posteo.de`
- Resend ist nicht mehr erforderlich

## GitHub
Den Inhalt dieses Ordners direkt in das bestehende Repository hochladen. `app/`, `public/`, `package.json` usw. müssen im Repository-Hauptverzeichnis liegen.

## Supabase
Nur die neue Migration einmal ausführen:

`supabase/migrations/005_certificates_branding.sql`

001, 002, 003 und 004 **nicht erneut ausführen**.

Die Migration ergänzt:
- Urkundendaten an `sponsorships`
- globale digitale Urkunden-Unterschrift
- Storage-Bucket `chicken-photos`
- Admin-Policies für Hühnerfotos
- Übernahme von Wunschname und Urkundenstil aus einer Bestellung bei `fulfill_order`

## Ablauf
1. Kunde bestellt und wählt Wunschname, Urkundenempfänger und Stil.
2. Anfrage wird in Supabase gespeichert und das Mailprogramm öffnet sich.
3. Admin lädt unter `/admin` das Hühnerfoto hoch und ordnet freie Henne(n) zu.
4. Beim Anlegen der Patenschaft werden Namen und Urkundendaten übernommen.
5. Eine im Admin hinterlegte digitale Signatur erscheint automatisch; ansonsten bleibt die Unterschriftslinie frei.
6. Kunde sieht seine Urkunde unter `/stall` und kann sie als PDF herunterladen.

## Vercel
Benötigt weiterhin nur:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`RESEND_API_KEY` und `MAIL_FROM` sind nicht mehr nötig.


## V0.7.1 Build-Fix

`app/api/send-mail/route.ts` ist jetzt eine dependency-freie Legacy-Route. Sie überschreibt die alte Resend-Version im GitHub-Repository, damit Vercel keine `resend`-Abhängigkeit mehr benötigt.
