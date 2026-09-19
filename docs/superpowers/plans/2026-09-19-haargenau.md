# Haargenau Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Eine hochwertige, ehrliche, lokal lauffähige Salon-Demo mit überprüften Kontaktdaten erstellen.

**Architecture:** Eine semantische HTML-Seite, ein Stylesheet und eine optionale, bewusst funktionslose JS-Datei. Lokales SVG ist die einzige Grafik; Navigation und Kontakt funktionieren ohne JavaScript.

**Tech Stack:** HTML5, CSS, SVG, Python unittest, Browser-Prüfung; keine Produktionsabhängigkeiten.

## Global Constraints
- Ausschließlich /Users/work/haargenau-demo, eigener Git-Branch demo, kein Publish.
- Belegte Fakten und Design aus docs/brief.md; keine erfundenen Leistungen, Preise, Rezensionen oder Teamdaten.
- Sichtbare Demo-Hinweise in Header/Footer; noindex ohne robots.txt-Sperre.
- Hero exakt „Haargenau. Ihr Friseur in Frankfurt.“; Telefon und Google Maps verlinken.
- Lokale Assets, keine externen Fonts/Tracker/Formulare; zugängliche Navigation ohne JS.

### Task 1: Contract zuerst
**Files:** Create tests/test_site.py, docs/brief.md.
**Interfaces:** Tests lesen index.html, styles.css, script.js und lokale Assets vom Projektstamm.
- [ ] Python-unittest mit HTMLParser schreiben: semantische Struktur, Fakten, Demo-Hinweise, noindex, Linkziele, lokale Assets, keine Formulare/externen Ressourcen.
- [ ] `python3 -m unittest discover -s tests -v` ausführen: erwartete Assertion, dass index.html fehlt.

### Task 2: Statische Website
**Files:** Create index.html, styles.css, script.js, assets/hair-illustration.svg.
**Interfaces:** IDs #besuch, #konzept, #kontakt; styles.css über link; script.js über defer; SVG über img.
- [ ] HTML mit Skip-Link, Header, Hero, Besuchsdaten, Konzeptvorschlag und Footer schreiben.
- [ ] CSS mit Tokens `--cream: #f5f0e7`, `--ink: #292a25`, `--clay: #9b4934` und Breakpoints 900/600px implementieren. Fokusmarkierung, reduzierte Bewegung, mobile Touch-Ziele und Print-Layout einbauen.
- [ ] Eigene SVG-Bogenillustration erstellen; keine Fotografie behaupten.
- [ ] Contract mit `python3 -m unittest discover -s tests -v` erneut prüfen: alle Tests grün.

### Task 3: Integration und Übergabe
**Files:** Create README.md, docs/test-results.md, .gitignore, tests/browser-check.js.
**Interfaces:** Lokaler HTTP-Server unter 127.0.0.1:8765; Browser prüft echte Seite.
- [ ] `python3 -m http.server 8765 --bind 127.0.0.1` starten; HTTP-Antwort prüfen.
- [ ] Desktop 1440px, Tablet 768px, Mobil 390px und 320px im Browser prüfen: keine horizontalen Überläufe, korrekter Titel und Inhalt, funktionierende Anker, keine externen Ressourcen, keine Console-Fehler. JavaScript deaktivieren und Reduced Motion prüfen.
- [ ] Desktop- und Mobile-Screenshot sichern; tatsächliche Ergebnisse dokumentieren, keine nicht ausgeführten Tests behaupten.
- [ ] README mit Start-/Testbefehlen, Faktenquelle, Demo-Grenzen und GSD-Blocker schreiben.
- [ ] `git add . && git commit -m "feat: build verified Haargenau static website demo"` ausführen; `git status --short`, `git log -1 --oneline`, `git remote -v` prüfen.
