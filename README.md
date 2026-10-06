# Patenhuhn.de V0.7.3

Erweiterung von V0.7.2:
- echtes Urkundenstudio im Adminbereich
- Patenschaft auswählen und Urkundendaten live bearbeiten
- Live-Vorschau der vier Urkundenstile
- Hühnerfoto direkt im Urkundenstudio hochladen
- PDF der Admin-Vorschau herunterladen
- gespeicherte digitale Unterschrift erscheint in der Vorschau und im Kundenprofil
- Registrierung unterscheidet jetzt klar zwischen direkter Freischaltung und erwarteter E-Mail-Bestätigung
- Bestätigungslink führt nach `/login?confirmed=1`

## Supabase
Keine neue Migration nötig, wenn 005 bereits ausgeführt wurde.

Für Bestätigungsmails muss Supabase Auth entsprechend konfiguriert sein. Bei Nutzung des Supabase-Standard-Mailservers bestehen Einschränkungen; für echte Kundennutzung sollte ein eigener SMTP-Dienst eingerichtet oder die E-Mail-Bestätigung bewusst deaktiviert werden.
