# Patenhuhn – Kernlogik V0.1

## Vertragslogik
- Eine aktive Patenschaft gehört genau einem Paten und einem Patenhuhn.
- Standard: **6 Eier pro Huhn und Kalenderwoche**.
- Nicht abgeholte Eier bleiben als Guthaben erhalten.
- Die reale Ausgabe kann aus dem Bestand des Hofs erfolgen; das Patenhuhn repräsentiert die Patenschaft.

## Digitaler Stall
- Die 6 Wochen-Eier können im Frontend über die Woche optisch verteilt erscheinen.
- Buchhalterisch wird pro Woche genau **eine +6-Gutschrift** erzeugt.
- Die Datenbank verhindert doppelte Wochen-Gutschriften.

## Abholcode
1. Pate wählt eine Eiermenge.
2. System prüft verfügbares Guthaben.
3. Eier werden sofort aus dem freien Guthaben reserviert.
4. Es entsteht ein einmaliger Code, z. B. `HUHN-A1B2-C3D4`.
5. Hof scannt/gibt den Code ein.
6. Code wird `redeemed` und kann nie erneut genutzt werden.
7. Wird ein offener Code storniert, gehen die Eier zurück ins Guthaben.

## Warum Reservierung sofort abgezogen wird
Damit ein Pate nicht gleichzeitig mehrere Codes für dieselben Eier erzeugen kann.

## Noch offen für V0.2
- automatische Wochen-Gutschrift per Supabase Cron
- Ablauf offener Codes + automatische Rückbuchung
- QR-Code im Frontend
- Kundenstall UI
- Hof-Dashboard / Scanner
- Adminbereich
- Geschenkpatenschaften
- Zahlungen
