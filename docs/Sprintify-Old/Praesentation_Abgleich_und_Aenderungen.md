# Sprintify-Präsentation — Abgleich & Änderungsprotokoll

Stand: 01.07.2026 · Datei: `Sprintify_Praesentation_final.pptx` (40 Folien) · Original `Sprintify_Praesentation.pptx` unverändert.

## Rahmenbedingungen (aus Leitfaden V2.7)
- **Dauer 45–60 Min Pflicht** (Über-/Unterschreitung = Punktabzug) → 40 Folien sind angemessen.
- **Pflicht-Grundstruktur:** Vorstellung/Zielsetzung/Auftrag → Vorgehen & Ergebnisse → kritische Würdigung → persönliche Reflektion → Abschluss. **Erfüllt.**
- **Bewertet:** Ablauf/Struktur/Rhetorik · Sprache · Foliengestaltung (Layout, Lesbarkeit, **Rechtschreibung**) · **Mediengestaltung (mehrere Medien, Kreativität)** · überzeugende Ergebnisdarstellung.
- **Zielpublikum = die Experten** (nicht die Firma) → Ziel ist, sie von der Empfehlung zu überzeugen.

## Inhaltlicher Abgleich (Folien ↔ Arbeit ↔ App ↔ Code)

### Verifiziert korrekt (gegen echten Code geprüft)
- 7 Datenmodelle, 10 Route-Module, React 19, Rollen (global admin/member; Projekt admin/member/viewer) — **stimmen mit dem Code überein**.
- Security-Baseline: Helmet + CORS implementiert, CSRF/Rate-Limiting/Sanitisierung **geplant** — Code bestätigt (nur helmet + cors vorhanden). Folie 13 ist korrekt.
- Jira (REST v2 + Agile v1, 15-Min-Sync, aufsteigende Reihenfolge), SP-Formel + 6 Sprints, Analytics 4 Tabs, Kapazität 4 Kategorien, Azure App Service, 4 Phasen/~8 Monate — korrekt.
- Hinweis: Die `CLAUDE.md` im Repo ist veraltet (nennt „Company"-Modell, superadmin/manager/developer) — **die Arbeit und die Folien sind korrekt, nicht die CLAUDE.md**.

### Behobene Fehler / Falschaussagen
| Folie | Vorher | Nachher |
|---|---|---|
| 19 Forecast | „Best / Average / Worst Case" (nicht in App/Arbeit) | An App angeglichen: Ø-Velocity, verbleibende SP, geschätzte Sprints, Fertigstellungsdatum |
| 3 Agenda / 23 Divider | „Live-Demo" | „Sprintify im Einsatz" (es gibt nur Screenshots) |
| 24–35 Screenshots | Echte Namen (inkl. Coach A. Ibraimi), E-Mails, Kundendaten (NCCE/Amazon), Projektcodes (NCPCS/PCS), Jira-URL, Debug-Badge „Jobs" | **Vollständig anonymisiert** (Blur), App-Funktion & echte Kennzahlen bleiben sichtbar |

### Geschlossene Lücken
- **KI in der Kritischen Würdigung (Folie 36):** ergänzt „KI beschleunigt — mit konsequenter manueller Review". Verweis auf Anhang E & F auf Folie 9. (KI war zuvor nur methodisch, nicht in der Reflexion.)
- **Neue Folie 38 „Wirtschaftlichkeit":** Kostenvergleich (Sprintify CHF 630 vs. Tempo 960 / Roadmaps 1'536) + Zeitersparnis 80–120 Std. + ROI CHF 9'600–14'400. Stärkstes Argument zum „Überzeugen der Experten"; war zuvor gar nicht enthalten.

## Design- & Foliengestaltung
- Header-Balken: grauen „Billig"-Schatten entfernt (alle Content-Folien).
- Footer: abgeschnittene dunkle Logo-Box entfernt → sauberes Logo-Mark + dezente Foliennummer.
- Bullets deckweit vereinheitlicht (echte Bullets/Nummerierung statt gemischter Einzüge/getippter „•").
- **Zwei native Diagramme neu gebaut** (Mediengestaltung): Architektur (3-Tier + Jira/Entra ID) und Datenmodell (ER-Stil, 7 Entitäten, Kardinalitäten).
- Screenshots mit Caption-Leiste (Modul + Kurzbeschreibung) → geführter Walkthrough.
- Marktanalyse (7): Pro/Contra wieder klar (grün +, rot −).
- Rechtschreib-/Typografie-Pass (Schweizer ss, „–" statt „ - ", „Single-Tenant-Architektur").

## Offene Empfehlungen (optional, sprachlich im Vortrag)
- Screenshots sind anonymisiert (Blur). Im Vortrag kurz erwähnen: „aus Datenschutzgründen unkenntlich gemacht".
- Zeitprobe halten: 40 Folien × ~1–1.5 Min ≈ 45–55 Min. Ziel-Korridor 45–60 Min beachten.
- Forecast (Folie 19/24) im Expertengespräch mit dem Dashboard-Screenshot belegen können.
