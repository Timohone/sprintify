# Expertengespräch – Vorbereitung (Sprintify)

## Ablauf & Methodik

**Tagesablauf:** Präsentation 09:30–10:00 → danach erscheinen die **4 Fragen** auf der Aufgabenkarte → Vorbereitung im Raum bis ~14:00 (**alle Hilfsmittel erlaubt**, auch dieses Dokument) → Antworten präsentieren 14:00–14:30 (Experten stellen nach jeder Antwort Nachfragen) → Rückmeldung 17:00–17:30.

**Der Pflicht-Aufbau jeder Antwort (das ist das Bewertungsprinzip):**
1. **Theorie zuerst** – unabhängig von deinem Projekt: Welche Methoden/Ansätze gibt es? Je Methode 1–2 Sätze Mechanismus + Vor-/Nachteil.
2. **Bezug auf dein Projekt** – „In meinem Projekt würde ich mich für **X** entscheiden, weil **Y** – und so komme ich auf **Z**."
3. **Kurze Würdigung** – Grenzen/Annahmen der gewählten Lösung.

**Zeit-Tipp:** 4 Antworten in ~30 Min = ~7 Min pro Antwort. Nutze die 3.5 h so:
1. Jede Frage einer **Domäne** zuordnen (Preisbildung? Architektur? Sicherheit? …).
2. Die **Theorie-Stichworte** aus dem passenden Kapitel unten übernehmen.
3. Falls Zahlen gefragt: **Rechnung** sauber aufschreiben.
4. Pro Antwort **1 Flipchart/Folie** mit Struktur (Theorie-Methoden → deine Wahl → Ergebnis).

**Bewertungskriterien:** systematische Herleitung · Bezug Theorie↔Praxis · Stringenz · Verständlichkeit · fachliche Richtigkeit · Würdigung/Kontext · Präsentationstechnik.

> Hinweis: Das Beispiel im Merkblatt ist eine **Preisbildungs**-Frage → mindestens eine wirtschaftliche Frage ist sehr wahrscheinlich (SIW = *Wirtschaft und Informatik*).

---

## A) Wirtschaftliche Fragen (hohe Wahrscheinlichkeit)

### F1 – „Zeige auf, wie ein zweckmässiger Verkaufspreis für Sprintify als Dienstleistung eruiert werden könnte."
**Theorie – Preisbildungsmethoden:**
- **Kostenorientiert (Cost-plus):** Selbstkosten ermitteln + Gewinnzuschlag. *+ einfach, deckt Kosten; − ignoriert Zahlungsbereitschaft; bei Software mit ~0 Grenzkosten wenig aussagekräftig.*
- **Konkurrenzorientiert (marktorientiert):** Preis an Wettbewerb ausrichten. *+ marktgerecht, einfach; − ignoriert eigene Kosten, Gefahr Preiskampf.*
- **Nachfrage-/wertorientiert (value-based):** Preis nach wahrgenommenem Kundennutzen/Zahlungsbereitschaft. *+ schöpft Wert ab, höchste Marge; − Nutzen schwer messbar, aufwändig.*
- **Preismodelle (ergänzend):** Abo pro User/Monat, Freemium, Tiered/Staffeln, Pay-per-use.

**Bezug Sprintify:** Ich würde **kombiniert** vorgehen: die **Kosten** als Untergrenze (Betrieb ~CHF 630/Jahr = die Preisuntergrenze), den **Wettbewerb** als Orientierung (Tempo/Roadmaps ≈ CHF 10–16/User/Monat) und den **Wert** als Obergrenze (Nutzen ≈ CHF 9'600–14'400/Jahr Zeitersparnis). Als SaaS würde ich mich **konkurrenz- und wertbasiert** bei z. B. **CHF 8–10 pro User/Monat** positionieren – klar unter den Konkurrenten (Markteintritt), aber weit über den Grenzkosten (Marge).
**Rechnung (Beispiel):** 8 User × CHF 9 × 12 = CHF 864/Jahr Umsatz − CHF 630 Kosten = ~CHF 234 Deckungsbeitrag/Team; skaliert linear mit weiteren Teams (Grenzkosten fast 0).
**Würdigung:** value-based wäre am lukrativsten, ist aber ohne belastbare Nutzenmessung riskant → deshalb der Mix.

### F2 – „Wie würdest du die Make-or-Buy-Entscheidung (Eigenentwicklung vs. Kauf) systematisch begründen?"
**Theorie:**
- **Entscheidungskriterien:** Total Cost of Ownership (Einmalig + laufend), strategische Bedeutung/Differenzierung, vorhandenes Know-how, Time-to-Market, Anpassbarkeit, Abhängigkeit/Lock-in, Wartung/Betrieb, Risiko.
- **Methoden:** TCO-Vergleich, **Nutzwertanalyse** (gewichtete Kriterien), Kostenvergleichsrechnung.
- **Faustregel:** Standard-/Commodity-Funktionen → **buy**; differenzierende Kernfunktionen → **make**.
- *make: volle Kontrolle/Anpassung, aber Aufwand+Wartung; buy: schnell+gewartet, aber Lizenzkosten+Lock-in+passt evtl. nicht.*

**Bezug Sprintify:** Meine Marktanalyse zeigte: die **differenzierende Funktion** (Kapazität × Velocity → SP-Empfehlung, mit Jira-Sync pro Projekt) war **nicht kaufbar**. Dazu: vorhandenes JS/TS-Know-how, sehr tiefe Betriebskosten (bestehende Azure-Infra), geringer Zeitaufwand durch iteratives Vorgehen + KI. → **make** gerechtfertigt.
**TCO-Vergleich:** Buy = CHF 960–1'536/Jahr **wiederkehrend** und deckt die Kernfunktion trotzdem nicht ab. Make = einmaliger Entwicklungsaufwand + CHF 630/Jahr Betrieb.
**Würdigung:** Gegen make spricht die Wartungslast (Bus-Faktor 1) – deshalb Empfehlung: Tests ausbauen, Wissen dokumentieren.

### F3 – „Wie weist man die Wirtschaftlichkeit eines solchen Projekts nach?"
**Theorie:**
- **Statische Verfahren:** Kostenvergleich · Rentabilität (**ROI = Gewinn/Kapitaleinsatz**) · **Amortisation** (Payback = Investition ÷ jährl. Rückfluss). *+ einfach; − ignoriert Zeitwert des Geldes.*
- **Dynamische Verfahren:** **Kapitalwert (NPV)** – diskontierte Cashflows · interner Zinsfuss (IRR) · Annuität. *+ berücksichtigt Zeitwert; − Annahmen (Zinssatz, Prognose).*
- **Qualitativ:** **Nutzwertanalyse** für nicht-monetäre Nutzen; Kosten-Wirksamkeits-Analyse.

**Bezug Sprintify:** Nutzen (Zeitersparnis) CHF 9'600–14'400/Jahr, Betriebskosten CHF 630/Jahr → laufender ROI **sofort deutlich positiv**. Bewertet man die Entwicklung (~300 h × CHF 120 ≈ CHF 36'000) als Investition, ergibt sich eine **Amortisation** von ~2.5–3.75 Jahren allein über die Zeitersparnis. Dazu **qualitativer Nutzen**: weniger verfehlte Sprint-Ziele, weniger Abstimmung, Planungswissen im Tool statt im Kopf.
**Würdigung:** Zahlen beruhen auf einer Schätzung der Zeitersparnis (Annahme); ich habe konservativ gerechnet.

### F4 – „Wie würdest du systematisch das beste Tool/die beste Option auswählen?"
**Theorie – Nutzwertanalyse (Scoring-Modell):** Kriterien definieren → **gewichten** (Summe 100 %) → Optionen je Kriterium bewerten (z. B. 1–5) → gewichtete Summe → höchster **Nutzwert** gewinnt. Ergänzend: **K.-o.-Kriterien** (Muss-Anforderungen), Kosten-Nutzen-Vergleich, paarweiser Vergleich. *+ macht qualitative Kriterien vergleichbar & transparent; − Gewichte/Bewertungen subjektiv.*

**Bezug Sprintify:** Ich würde Tempo / Advanced Roadmaps / Forecast.app / Eigenbau anhand gewichteter Kriterien bewerten – z. B. wochenbasierte Kapazitätsplanung (25 %), Jira-Sync (20 %), SP-Empfehlung (20 %), Kosten (15 %), Anpassbarkeit (10 %), Aufwand (10 %). Die SP-Empfehlung ist ein **K.-o.-Kriterium**, das nur der Eigenbau erfüllt → Eigenbau mit höchstem Nutzwert. (Matrix kann ich live aufzeichnen.)

---

## B) Projektmanagement

### F5 – „Wie wählt man ein geeignetes Vorgehensmodell für ein Softwareprojekt?"
**Theorie:**
- **Plangetrieben (Wasserfall/V-Modell):** sequenzielle Phasen, Anforderungen vorab fixiert. *+ planbar, gut bei stabilen Anforderungen/Compliance; − unflexibel, spätes Feedback.*
- **Agil (Scrum/Kanban):** iterativ-inkrementell, **empirische Prozesssteuerung** (Transparenz–Inspektion–Adaption). *+ flexibel, frühes Feedback, Risiko sinkt; − geringere Vorhersagbarkeit, Disziplin nötig.*
- **Hybrid:** plangetriebener Rahmen + agile Umsetzung.
- **Auswahlkriterien:** Stabilität der Anforderungen, Projekt-/Teamgrösse, Kundeneinbindung, Risiko/Unsicherheit.

**Bezug Sprintify:** **Iterativ, angelehnt an Scrum**, weil die Anforderungen – v. a. bei der Jira-Integration – **unsicher waren und sich änderten**; empirisches Vorgehen passt zum Erkundungscharakter. Als Solo-Projekt vereinfacht: keine Scrum-Rollen, 2-Wochen-Iterationen mit definierten Zielen + Review mit dem Vorgesetzten (ersetzt das fehlende Team-Feedback).
**Würdigung:** Ich verzichte auf die Vorhersagbarkeit eines Plans; das war akzeptabel, weil das Projektziel klar, der Weg dahin aber offen war.

### F6 – „Zeige auf, wie der Aufwand bzw. die Kapazität für einen Sprint geschätzt werden kann." (**Kernthema deiner Arbeit!**)
**Theorie – Schätzmethoden:**
- **Expertenschätzung:** Erfahrung/Bauchgefühl. *+ schnell; − subjektiv, Bias.*
- **Analogieschätzung:** Vergleich mit ähnlichen, abgeschlossenen Aufgaben. *+ realistisch bei guter Datenbasis; − braucht Historie.*
- **Parametrisch/algorithmisch (Function Points, COCOMO):** Formel aus Grössenmetriken. *+ objektiv, wiederholbar; − Kalibrierung aufwändig.*
- **Bottom-up (WBS):** Teilaufgaben schätzen und summieren. *+ genau; − aufwändig, Vollständigkeitsrisiko.*
- **Agil – Planning Poker / Story Points:** **relative** Schätzung im Team-Konsens; über die **Velocity** (SP/Sprint) auf Zeit umgerechnet. *+ Team-Konsens, relativ statt absolut; − nur mit Velocity-Historie, teamspezifisch.*
- **Drei-Punkt/PERT:** (optimistisch + 4×wahrscheinlich + pessimistisch) ÷ 6.

**Bezug Sprintify:** Genau hier setzt meine Arbeit an. Reine Velocity greift zu kurz, weil sie die **Verfügbarkeit** ignoriert. Sprintify kombiniert **velocity-basierte Schätzung** mit einem **Kapazitätsfaktor**: *empfohlene SP = Ø-Velocity × (aktuelle Kapazität ÷ Ø-Kapazität der letzten 6 Sprints)*. So fliesst z. B. Ferienzeit automatisch ein.
**Würdigung / eigener Fall:** Meinen **Projekt**aufwand habe ich per Experten-/Analogieschätzung geschätzt und die Jira-Integration **unterschätzt** → Lehre: bei hoher Unsicherheit einen **Spike** vorschalten (empirisch statt raten).

---

## C) Software Engineering / Informatik

### F7 – „Wie triffst du eine Technologie- bzw. Architekturentscheidung systematisch?"
**Theorie:**
- **Kriterien:** funktionale & **nicht-funktionale** Anforderungen (Performance, Skalierbarkeit, Sicherheit, Wartbarkeit), Team-Know-how, Reife/Community/Support, Lizenz/Kosten, Ökosystem, Zukunftssicherheit.
- **Methoden:** **Prototyp/Spike**, **Nutzwertanalyse**, **Architecture Decision Records (ADR)**, Trade-off-Analyse (ATAM).
- **Architekturstile:** Monolith · **modularer Monolith** · Microservices; n-Schichten-Architektur; Client-Server. *Monolith: einfach, eine Deployment-Einheit, aber skaliert nur als Ganzes. Microservices: unabhängig deploy-/skalierbar, aber hohe Betriebs- und Verteilungs­komplexität.*

**Bezug Sprintify:** **3-Schichten-Monolith** – für ein Ein-Mann-Projekt dieser Grösse wären Microservices Overkill (Netz-/Betriebskomplexität ohne Nutzen). Stack nach Kriterien: **Node.js** (vorhandenes Know-how + event-driven passt zu vielen parallelen Jira-Calls), **React 19/TS** (SPA, Typsicherheit), **PostgreSQL** (relational, ACID). Solche Entscheide würde ich als **ADR** festhalten.
**Würdigung:** Der Monolith limitiert die unabhängige Skalierung einzelner Teile – bei diesem Lastprofil (ein Team) irrelevant.

### F8 – „Wie wählst du die Datenbank und modellierst die Daten?"
**Theorie:**
- **Relational (SQL):** festes Schema, **ACID**, Joins, **Normalisierung** (1.–3. NF gegen Redundanz/Anomalien). *+ Konsistenz, mächtige Abfragen, reif; − starres Schema, horizontale Skalierung schwerer.*
- **NoSQL** (Dokument/Key-Value/Spalten/Graph): flexibles Schema, horizontale Skalierung, **BASE/eventual consistency**. *+ Flexibilität & Skalierung; − schwächere Transaktionen/Konsistenz.*
- **Auswahlkriterien:** Datenstruktur (relational?), Konsistenzbedarf, Abfragemuster, Skalierung.

**Bezug Sprintify:** **PostgreSQL**, weil die Daten klar relational sind (Project→Sprint→Story) und eine **Many-to-Many-Beziehung** (User↔Project) sauber über die Zwischentabelle **ProjectUser** abgebildet wird. **ACID** ist wichtig für die Konsistenz von Sprint-/Story-Daten. Extreme Skalierung ist nicht nötig (Single-Tenant, ein Team) → kein NoSQL-Bedarf. Das Modell ist normalisiert (7 Entitäten).

### F9 – „Wie sicherst du die Qualität der Software / wie testest du?"
**Theorie:**
- **Testpyramide:** viele **Unit-**Tests (schnell, isoliert) < weniger **Integrations-** < wenige **E2E/UI-**Tests (langsam, brüchig).
- **Testarten:** Unit · Integration · System · Akzeptanz; funktional vs. nicht-funktional (Last, Sicherheit).
- **TDD (test-first):** *+ besseres Design, Sicherheitsnetz; − initial langsamer.*
- **Weitere QS:** **CI/CD**, Code-Reviews, statische Analyse/Linting, Definition of Done; Qualitätsmerkmale nach **ISO 25010** (Wartbarkeit, Zuverlässigkeit, Sicherheit …).

**Bezug Sprintify (ehrlich – bekannte Schwäche):** Ich habe **nur punktuell** getestet. Richtig wäre die Testpyramide: **Unit-Tests** für die kritische Logik (SP-Formel, Status-Mapping, Sync-Reihenfolge), **Integrationstests** für die Jira-Anbindung mit Mocks, wenige **E2E**-Tests, alles in einer **CI-Pipeline** auf Azure. Reviews habe ich teilweise über KI + den Vorgesetzten simuliert.
**Würdigung:** Fehlende Testabdeckung ist mein grösstes Wartbarkeitsrisiko → steht als erster Punkt auf den nächsten Schritten.

### F10 – „Wie sicherst du eine Webanwendung ab?"
**Theorie:**
- **Defense in Depth** (mehrere Schichten), **Least Privilege**.
- **AuthN vs. AuthZ.** Auth-Methoden: Session/Cookie · **Token/JWT** · **OAuth 2.0 / OIDC** · SSO. *JWT: zustandslos/skalierbar, aber schlecht widerrufbar; Session: einfach widerrufbar, aber serverseitiger State.*
- **OWASP Top 10** (Broken Access Control, Injection, Auth-Fehler …).
- **Massnahmen:** TLS/HTTPS, **Security-Header** (CSP/HSTS/X-Frame-Options via Helmet), **CSRF-Schutz**, Input-Validierung/Sanitisierung, **Rate Limiting**, Secrets-Management.

**Bezug Sprintify:** **Entra ID + OAuth 2.0/OIDC** → SSO und **kein eigener Passwort-Store** (eliminiert Brute-Force/Credential-Angriffe). JWT-Validierung im Backend; **zweistufige Rollen** gegen Broken Access Control. **Helmet + CORS** umgesetzt; **CSRF, Rate Limiting, Sanitisierung** bewusst als nächste Härtungsphase geplant (in der Diplomphase nur internes Netz). Secrets in **Azure App Settings**, nicht im Code.
**Würdigung:** Die Härtung vor dem produktiven Go-Live ist Voraussetzung – das benenne ich offen.

### F11 – „Welches Cloud-/Deployment-Modell ist zweckmässig und warum?"
**Theorie:**
- **IaaS** (VM, du verwaltest OS+App) · **PaaS** (Plattform, du bringst Code) · **SaaS** (fertige Software). *IaaS: max Kontrolle, viel Betrieb. PaaS: wenig Betrieb, weniger Kontrolle. SaaS: kein Betrieb, keine Anpassung.*
- **Deployment-Strategien:** Blue-Green · Canary · Rolling; **CI/CD**.

**Bezug Sprintify:** **Azure App Service = PaaS** + **Managed PostgreSQL (DBaaS)**. Begründung: Solo-Projekt ohne Kapazität für Serverbetrieb → PaaS nimmt mir OS-Patching, Skalierung und Verfügbarkeit ab; zentrale Updates. Trade-off: weniger Kontrolle als IaaS – für diese Grösse genau richtig.

### F12 – „Wie würdest du das System mandantenfähig / skalierbar machen?"
**Theorie:**
- **Skalierung:** vertikal (grösserer Server) vs. **horizontal** (mehr Instanzen; erfordert **stateless** + Load Balancer).
- **Multi-Tenancy-Modelle:** (a) **DB pro Mandant** (max. Isolation, teurer) · (b) gemeinsame DB, **Schema pro Mandant** · (c) gemeinsame DB+Schema mit **Tenant-ID** (günstig, geringere Isolation). *Abwägung Isolation/Sicherheit ↔ Kosten/Wartung.*

**Bezug Sprintify:** Aktuell **Single-Tenant** (bewusste Einschränkung aus meiner kritischen Würdigung). Für mehrere Organisationen würde ich ein **Company-Modell** einführen und je nach Isolationsbedarf **Schema pro Mandant** (mittlere Isolation) oder **Tenant-ID** (günstig) wählen. Horizontal skalierbar, weil das Backend durch **JWT weitgehend stateless** ist.

---

## D) KI-Einsatz

### F13 – „Wie setzt man generative KI in der Entwicklung verantwortungsvoll ein?"
**Theorie:**
- **Chancen:** Produktivität, Boilerplate, Prototyping, Lernhilfe/Sparring.
- **Risiken:** **Halluzinationen** (erfundene APIs/Funktionen), Sicherheitslücken im generierten Code, **Lizenz/Urheberrecht**, **Datenschutz** (keine sensiblen Daten in Prompts), Über-Vertrauen/Deskilling, Reproduzierbarkeit.
- **Governance:** **Human-in-the-Loop**, Review-Pflicht, **Verifikation** gegen echte Daten, **Transparenz/Dokumentation**, klare Grenzen (welche Aufgaben ja/nein).

**Bezug Sprintify:** Claude Code als **Co-Engineer**, fester **6-Schritt-Zyklus**; jede Ausgabe **Zeile für Zeile reviewt** und gegen echte Daten verifiziert. Architektur, Datenmodell und Sicherheit lagen bei mir. **Keine Kundendaten** in Prompts, **vollständige Protokollierung** in Anhang E/F.
**Würdigung / Kernlehre:** KI **beschleunigt einen erfahrenen Entwickler erheblich, ersetzt Fachkompetenz aber nicht** – wer ungeprüft übernimmt, baut sich Inkonsistenzen, Sicherheitslücken oder erfundene Funktionen ein.

---

## Schnell-Checkliste für den Vorbereitungsraum
- [ ] Jede der 4 Fragen einer Domäne oben zuordnen.
- [ ] Antwort **strukturieren**: Theorie-Methoden (mit +/−) → **meine Wahl + Begründung** → **Ergebnis/Zahl** → kurze Würdigung.
- [ ] Bei Zahlenfragen: Rechnung sauber aufschreiben (Kosten CHF 630 · Konkurrenz 960/1'536 · Nutzen 9'600–14'400 · Stundensatz 120 · ~300 h Aufwand).
- [ ] Pro Antwort 1 Flipchart/Folie mit der Struktur.
- [ ] Auf **Nachfragen** gefasst sein – die kommen nach jeder Antwort.
- [ ] Nach dem Gespräch: Unterlagen (inkl. Flipchart-Fotos) in die Aufgabenkarte im Teams hochladen.
