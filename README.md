# Haargenau — unverbindliche Website-Demo

Freigegebener Gestaltungsentwurf in Creme, Anthrazit und Terrakotta. Keine offizielle Salonwebsite und keine Behauptung einer Beauftragung. Eigene SVG-Illustration, keine Salonsfotos. Keine externen Fonts, Tracker oder Formulare. Meta noindex/nofollow ist eine Suchmaschinenanweisung, kein Zugriffsschutz.

## Quelle
http://www.haargenau-ffm.de/ — dort veröffentlichte Adresse, Telefon und Öffnungszeiten übernommen. Aktualität vor Produktivstart durch den Salon bestätigen. Leistungen und Preise sind nicht verifiziert. Der Konzeptbereich beschreibt bewusst nur die Gestaltungsrichtung.

## Entwicklung / Prüfung
`python3 -m http.server 8765 --bind 127.0.0.1`

`python3 -m unittest discover -s tests -v`

`npm ci && node tests/browser-check.js`

Browserprüfung benötigt Google Chrome am macOS-Standardpfad oder CHROME_PATH. Vier Viewports (320, 390, 768, 1440), Navigation, Telefon- und Kartenlink-Ziele, no-JS, reduzierte Bewegung, Overflow, Konsole, externe Requests und axe WCAG A/AA werden geprüft. Bericht: docs/browser-results.json.

## Veröffentlichung
GitHub Pages aus Branch main, Ordner /. Bestehende Salon-Domain unverändert. Demo vor einem tatsächlichen Verkauf um abgestimmte Leistungen, Originalbilder mit Nutzungsrechten und erforderliche Anbieter-/Datenschutzinformationen ergänzen.
