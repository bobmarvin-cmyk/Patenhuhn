# Patenhuhn.de V0.7.4

Diese Version verbindet die Urkundenauswahl und die Urkundenerstellung durchgängig:

1. Kundin/Kunde wählt bei `/bestellen` eine der vier echten Vorlagen: Klassisch, Natur, Mittelalter oder Comic.
2. Die Auswahl wird mit der Bestellung in `contact_data.certificate_style` gespeichert.
3. Beim Anlegen der Patenschaft übernimmt die bestehende Datenbankfunktion aus Migration 005 den gewählten Stil nach `sponsorships.certificate_style`.
4. Im Admin-Urkundenstudio ist genau diese Vorlage vorausgewählt. Dort können Hühnername, Empfänger, Ausstellungsdatum, Hühnerfoto und digitale Signatur ergänzt werden.
5. Die Live-Vorschau und der PDF-Download verwenden dieselbe `Certificate`-Komponente wie die Auswahl im Bestellformular.
6. Dieselbe gespeicherte Urkunde erscheint im persönlichen Hühnerpatenprofil.

## Update
Keine neue Supabase-Migration nötig, sofern Migration 005 bereits ausgeführt wurde.

Den Inhalt dieses Ordners direkt in das bestehende GitHub-Repository hochladen.
