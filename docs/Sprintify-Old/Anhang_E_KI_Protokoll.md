# Anhang E: KI-Chat-Protokoll und Reflexion

## 1. Eingesetzte KI-Werkzeuge

Im Rahmen dieser Diplomarbeit habe ich **Claude Code** (Anthropic, Modell `claude-opus-4-7`) als KI-gestützten Co-Engineer eingesetzt. Claude Code ist ein agentisches Kommandozeilen-Werkzeug, das direkt im Projektverzeichnis arbeitet, Dateien lesen und schreiben, Shell-Befehle ausführen und Code generieren kann. Die Bedienung erfolgt im Dialog: ich beschreibe die Anforderung, die KI schlägt eine Umsetzung vor, ich prüfe, modifiziere und übernehme oder verwerfe.

Andere KI-Werkzeuge (ChatGPT, GitHub Copilot, Gemini etc.) habe ich für diese Arbeit nicht verwendet.

## 2. Einsatzbereiche

KI habe ich gezielt in folgenden Bereichen eingesetzt:

**Code-Implementierung.** Generierung von Boilerplate (Express-Routes, Sequelize-Modelle, Migrationen), React-Komponenten-Gerüste, repetitive UI-Layouts und initiale Implementierungen von Service-Klassen (z.B. `JiraService`, `JiraSyncService`). Architektur und Datenmodell habe ich vorher definiert; Claude hat die Implementierung umgesetzt, die ich anschliessend gelesen, überarbeitet und integriert habe.

**Dokumentations-Entwürfe.** Erste Fassungen von Abstract, Anhängen und Foliennotizen. Die inhaltlichen Aussagen, Strukturentscheide, Zahlen aus dem Projekt und die kritische Würdigung stammen aus meinen Stichworten und Erfahrungen. Claude hat sie zu Fliesstext ausgearbeitet, ich habe gegengelesen, fachlich korrigiert und an meinen Schreibstil angepasst.

**Sparring und Review.** Strukturkritik, Identifikation von Inkonsistenzen, Vorschläge für alternative Lösungswege. Besonders nützlich bei Architekturentscheidungen (z.B. Custom-Field-Konfiguration in Jira, Sortierreihenfolge der Sprint-Synchronisation).

**Debugging-Hilfe.** Erklärung von Fehlermeldungen, Hypothesen zu unerwartetem Verhalten. Die Validierung in der laufenden Umgebung habe ich immer selbst durchgeführt.

## 3. Methodisches Vorgehen mit KI

Ich habe einen wiederkehrenden Arbeitszyklus etabliert, um KI-Output kontrolliert zu integrieren:

1. **Anforderung formulieren:** Was soll das Modul/die Komponente leisten, welche Constraints gelten, welche Datenstrukturen existieren bereits.
2. **Kontext bereitstellen:** Existierende Codebasis sichtbar machen, damit die Vorschläge zur Architektur passen.
3. **Lösung erzeugen lassen:** Claude generiert einen Vorschlag.
4. **Review:** Ich lese den Code Zeile für Zeile, prüfe auf logische Fehler, fehlende Edge Cases, Sicherheitslücken (z.B. fehlende Authorization-Checks), Performance-Probleme.
5. **Manuelle Anpassung:** Anpassungen an Coding-Stil, Refactoring von Vorschlägen, die nicht zur Architektur passen.
6. **Verifizierung:** Tests in der lokalen Umgebung, Test mit echten Jira-Daten, Logging von unerwartetem Verhalten.
7. **Iteration:** Bei Problemen Rückkopplung an Claude mit konkreten Beobachtungen.

Mein Hintergrund als Cloud Engineer mit Erfahrung in JavaScript/TypeScript, Azure und Infrastrukturthemen hat es mir erlaubt, KI-Vorschläge fachlich zu beurteilen, statt sie ungeprüft zu übernehmen.

## 4. Beispielhafte Sessions

Im Folgenden eine kuratierte Auswahl repräsentativer Interaktionen. Die vollständigen Roh-Logs (JSONL, ca. 5 MB) sind auf Anfrage einsehbar.

### 4.1 Architektur-Entscheid: Many-to-Many Project-User-Beziehung

**Meine Frage:** "Ich brauche eine Lösung, bei der ein User in mehreren Projekten Mitglied sein kann und pro Projekt eine andere Rolle hat (Admin, Member, Viewer). Was sind die Optionen mit Sequelize/PostgreSQL?"

**KI-Vorschlag:** Drei Varianten — JSON-Spalte mit Projekt-IDs und Rollen, separate `ProjectUser`-Zwischentabelle mit Rolle, oder eine Tag-basierte Lösung über Junction Table mit Policies.

**Meine Entscheidung und Begründung:** Junction Table `ProjectUser` mit `role`-Enum. Grund: Saubere relationale Modellierung, ermöglicht später einfache Erweiterung um Felder (Beitrittsdatum, projektspezifische Einstellungen), bessere Performance bei Berechtigungs-Joins als eine JSONB-Spalte. Die KI-Vorschlag-Variante 3 (Policy-basiert) habe ich verworfen, weil sie für die aktuelle Anforderung überdimensioniert wäre.

### 4.2 Jira-Sync: Sortierreihenfolge

**Hintergrund:** Bei ersten Tests wurden User Stories falschen Sprints zugeordnet, wenn sie in mehreren Sprints auftauchten (z.B. nach Sprint-Überläufen).

**Meine Frage:** "User Stories landen im falschen Sprint, wenn sie in Jira mehrfach zugeordnet wurden. Welche Logik wäre richtig?"

**KI-Vorschlag:** Sprints chronologisch aufsteigend verarbeiten (ORDER BY startDate ASC), damit beim sequenziellen Update der `sprintId`-Spalte am Ende der **chronologisch letzte** Sprint die Story besitzt, wie es dem aktuellen Zustand in Jira entspricht.

**Meine Validierung:** In der Test-Umgebung mit drei Sprints und überlappenden Stories nachgebildet, Logik bestätigt. Anschliessend dokumentiert (Anhang D, Abschnitt 5).

**Kritische Reflexion:** Der Vorschlag war korrekt, hatte aber einen blinden Fleck — bei zukünftigen Sprints, die in der Zukunft starten, kann die Sortierung anders ausfallen. Habe ich nachträglich abgesichert durch zusätzlichen Filter auf `state != 'future'` bei der Issue-Synchronisation.

### 4.3 Tech-Wahl-Diskussion

**Mein Anliegen:** "Soll ich für das ORM Sequelize, TypeORM oder Prisma einsetzen?"

**KI-Vergleich:** Sequelize — etabliert, gute JS-Integration, Migrations-Support; TypeORM — TS-first, Decorator-Pattern, aber instabil bei manchen Edge Cases; Prisma — modernste DX, exzellente TypeScript-Integration, aber separater Generator-Schritt im Build, weniger Kontrolle über raw queries.

**Meine Entscheidung:** Sequelize. Grund: Im Backend ist Node.js mit `require`-basierten Modulen einfacher zu integrieren, Migrationen funktionieren auch ohne separaten Build-Schritt, und meine bisherige Erfahrung mit Sequelize verkürzt die Einarbeitung. Prisma hätte beim Deployment auf Azure App Service Komplexität hinzugefügt durch den Generate-Step.

## 5. Verifizierung von KI-Aussagen

Gemäss Leitfaden Abschnitt 3.5 müssen Quellen, die durch KI vorgeschlagen werden, verifiziert werden. Folgende Vorgehensweise habe ich angewandt:

- **API-Endpunkte (Jira, MSAL):** Alle in der Arbeit zitierten API-Endpunkte habe ich in der offiziellen Atlassian- bzw. Microsoft-Dokumentation gegengeprüft. Die Quellenangaben im Quellenverzeichnis verweisen direkt auf die offiziellen Dokumentationen mit Zugriffsdatum.
- **Library-Versionen (Express, React, Sequelize):** Aus den `package.json`-Dateien des Projekts abgeleitet, nicht aus KI-Vorschlägen.
- **Scrum-Inhalte:** Mit dem Scrum Guide [Schwaber2020] direkt abgeglichen.
- **Marktanalyse-Aussagen:** Tool-Bezeichnungen (Tempo Timesheets, Jira Advanced Roadmaps, Forecast.app) auf den Hersteller-Websites verifiziert; Preisangaben aus Anhang B basieren auf öffentlich verfügbaren Atlassian- und Tempo-Preisseiten.

In keinem Fall habe ich eine Quelle übernommen, ohne ihre Existenz geprüft zu haben. Halluzinationen sind bei generativen Sprachmodellen ein bekanntes Problem, gerade bei Quellenangaben.

## 6. Kritische Würdigung des KI-Einsatzes

**Was funktioniert hat:**

- Massive Zeitersparnis bei Boilerplate und repetitiven Aufgaben. Was früher Tage gebraucht hätte (z.B. CRUD-Endpunkte mit Validierung für sieben Modelle), war in Stunden machbar.
- Schnelles Durchspielen von Architekturoptionen, ohne jede Variante prototypen zu müssen.
- Konsistente Code-Qualität bei der Generierung (Naming, Struktur), solange die Anforderung präzise war.
- Beim Schreiben dieser Diplomarbeit: gute Hilfe für ersten Strukturentwurf und sprachlichen Feinschliff.

**Was nicht gut funktioniert hat:**

- KI-Vorschläge waren manchmal **zu generisch** und mussten an die konkrete Architektur angepasst werden. Wer blind übernimmt, baut sich Inkonsistenzen ein.
- **Halluzinationen bei Library-Funktionen** sind real. Mehrfach wurden Funktionen oder Konfigurationsoptionen vorgeschlagen, die in der genutzten Version nicht existierten. Ohne Verifizierung gegen die Dokumentation wäre das eingeflossen.
- **Sicherheitslücken** in initialen Vorschlägen: fehlende Authorization-Checks, naive SQL-Abfragen ohne Eingabevalidierung. Hier war die manuelle Nachkontrolle entscheidend.
- **Falsches Selbstvertrauen:** KI klingt überzeugend, auch wenn der Vorschlag fachlich falsch ist. Das ist die grösste Falle für unerfahrene Entwickler.

**Schlussfolgerung für die Praxis:**

KI-gestützte Entwicklung beschleunigt erfahrene Entwickler erheblich, ersetzt aber Fachkompetenz nicht. Im Gegenteil: Wer KI-Output sinnvoll einsetzen will, muss in der Lage sein, Vorschläge fachlich zu prüfen, anzupassen und im Zweifel zu verwerfen. Für diese Diplomarbeit war der Workflow:

> Anforderungen verstehen → Architektur entwerfen → KI generieren lassen → kritisch reviewen → anpassen → testen → integrieren.

Schritte 1, 2, 4, 5, 6 und 7 sind meine Eigenleistung. Schritt 3 ist die Beschleunigung durch KI. Dieser Workflow ist meines Erachtens das realistische Bild moderner Software-Entwicklung 2026, und ich habe ihn bewusst nicht versteckt, sondern transparent dokumentiert.

## 7. Vollständigkeit des Protokolls

Die Roh-Logs aller Claude-Code-Sessions zu diesem Projekt sind lokal als JSONL-Dateien gespeichert. Verschiedene Sessions über den gesamten Projektzeitraum wurden eingesetzt — von Code-Implementierung in der Backend- und Frontend-Phase über Dokumentations-Entwürfe bis zur finalen Review. Das hier vorliegende Protokoll ist eine **lesbare Kuratierung** der wesentlichen Interaktionen — die Roh-Logs umfassen einige Tausend Einzelaufrufe (Datei-Lesungen, Code-Ausführungen, Sub-Agent-Aufrufe) und sind für menschliche Lektüre ungeeignet. Auf Anfrage stelle ich die vollständigen Roh-Logs zur Einsichtnahme zur Verfügung.

## 8. Auszüge aus dem Roh-Protokoll

Die folgenden Auszüge stammen unverändert aus den Claude-Code-Session-Logs. Die Original-Prompts sind in englischer Sprache geführt (Claude Code wird primär auf Englisch bedient). Sie sollen einen authentischen Eindruck vermitteln, wie KI während der Entwicklungsphase eingesetzt wurde — von strukturierter Analyse über Verifizierung bis zur iterativen Implementierung.

### 8.1 Auszug: Datenmodell-Analyse (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > Read and summarize the following files in detail:
> > 1. `backend/src/models/index.js` (all associations)
> > 2. `backend/src/models/Company.js`
> > 3. `backend/src/models/User.js`
> > 4. `backend/src/models/Sprint.js`
> > 5. `backend/src/models/CapacityPlan.js`
> > 6. `backend/src/models/UserStory.js`
> > 7. `backend/src/models/Project.js`
> > 8. `backend/src/models/ProjectUser.js`
> > 9. `backend/src/middleware/auth.js`
> > 10. `backend/src/app.js`
> > 11. `backend/package.json`
> >
> > I need to understand what fields exist, what needs to be removed (Stripe, multi-tenancy, license), and what the current auth flow looks like.

**Antwort (zusammengefasst):** Strukturierte Übersicht aller Sequelize-Modelle mit Feldern, Datentypen und Beziehungen. Identifikation der nicht mehr benötigten Tenant-/Stripe-Felder aus einer früheren Codebasis-Version. Empfehlung: Company-Modell entfernen, Multi-Tenancy-Logik in den Routes zurückbauen.

**Meine Folge-Entscheidung:** Übernommen. Single-Tenant-Architektur bewusst gewählt, weil Sprintify zunächst nur bei der Netcloud AG eingesetzt wird. Refactoring in den nächsten zwei Iterationen umgesetzt.

### 8.2 Auszug: Verifizierung von Doku-Behauptungen gegen Code (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > In `/Users/timohaldi/.../sprintify`, verify these specific claims from the abstract/presentation. For each one, tell me if it's TRUE or FALSE and give evidence:
> >
> > 1. "14 Route-Module" — count the actual route files in `backend/src/routes/`
> > 2. "Stripe-Anbindung" / "Stripe-Integration" — is there any Stripe code? Check services, routes, package.json
> > 3. "Scheduler synchronisiert alle 15 Minuten" — check `backend/services/SyncScheduler.js`, what's the actual interval?
> > 4. "customfield_10016" as default Story Points field — check `JiraService` or `JiraSyncService`
> > 5. "Agile API v1.0" and "REST API v2" — verify the actual Jira API URLs used
> > 6. "OAuth 2.0 Authorization Code Flow" with MSAL — check if MSAL is actually used in frontend and backend
> > 7. "automatisch leere Kapazitätspläne für alle Projektmitglieder" — check if capacity plans are auto-created, which route does this?
> > 8. "Sprint History zeigt die Velocity als Trendlinie" — is there actually a Sprint History page in frontend?
> > 9. "Retrospective" model — confirm it exists and is used
> >
> > Be specific with file paths and line numbers.

**Antwort (zusammengefasst):** Detaillierter Verifizierungsbericht mit konkreten Datei-Verweisen und Zeilennummern. Wichtigste Korrektur: nicht 14, sondern **10 Route-Module** existieren tatsächlich. Stripe-Code: keine Spuren. Cron-Intervall: korrekt 15 Minuten. Story-Points-Feld, Jira-API-URLs, MSAL-Einsatz, Retrospective-Modell: alle bestätigt.

**Meine Folge-Entscheidung:** Doku auf 10 Route-Module korrigiert. Diese Art Self-Audit habe ich in mehreren Phasen wiederholt, um Inkongruenzen zwischen Doku und Code zu vermeiden — gerade weil KI-generierte Doku-Entwürfe gerne Zahlen erfinden.

### 8.3 Auszug: Frontend-Strukturanalyse (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > I need to understand the current app structure. Please find and read these files:
> > 1. The sidebar/navigation component (look in `frontend/src/components/` or `frontend/src/layouts/`)
> > 2. The Sprint model definition (`backend/src/models/` — look for `Sprint.js` or in `index.js`)
> > 3. The CapacityPlan model definition
> > 4. The User model definition
> > 5. The current sidenav/layout component
> >
> > Also search for "dev" user references — grep for `role.*dev` or `name.*dev` in models or seed files.

**Antwort (zusammengefasst):** Strukturierte Übersicht der Frontend-Layouts und Backend-Modelle. Layout-Komponente nutzt React-Router und Lucide-Icons. Keine Dev-User-Referenzen mehr im Seed (waren in alter Version).

**Meine Folge-Entscheidung:** Bestätigung, dass nach dem Refactoring keine Test-User-Spuren mehr im Produktiv-Code sind. Hat mir Zeit für eigene Suche gespart.

### 8.4 Auszug: Source-Code- vs. Build-Artefakte-Prüfung (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > I need to determine what is source code vs build artifacts in this repo. Check:
> >
> > 1. `backend/` — is this actual source code or compiled output? Look at the JS files in `backend/src/` — are they readable source or minified/bundled?
> > 2. `frontend/` — is this source code (with `package.json`, `src/` folder, components) or just built static files?
> > 3. List the top-level contents of both `backend/` and `frontend/`
> > 4. Check if frontend has any `.jsx`, `.tsx`, `src/` folder, or `package.json` with dependencies like react
> >
> > Be thorough — read a few files to determine if they're source or build artifacts.

**Antwort (zusammengefasst):** Backend ist echter Source-Code (lesbare ES-Module, vollständige `src/`-Struktur, Test-Setup mit Jest). Frontend war zum Analyse-Zeitpunkt teils pre-built — Empfehlung, eine saubere Vite/React-19-Variante neu aufzubauen.

**Meine Folge-Entscheidung:** Frontend in der nächsten Iteration komplett neu aufgesetzt mit React 19 + Vite + TypeScript + Tailwind, damit Source und Build sauber getrennt sind. Dieser Fund hat einen ganzen Sprint gekostet, war aber notwendig.

### 8.5 Auszug: Initiale Codebase-Erkundung (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > Explore this codebase thoroughly. I need to understand:
> > 1. What frameworks/languages are used (frontend and backend)
> > 2. How to build, run, test, and lint
> > 3. Project structure and architecture
> > 4. Any existing CLAUDE.md, README.md, .cursorrules, .cursor/rules/, .github/copilot-instructions.md files
> > 5. Package.json files (both root, frontend, backend) — read their contents
> > 6. Any configuration files (tsconfig, eslint, vite, etc.)
> > 7. Database setup, ORM, API structure
> >
> > Read the key config files and provide detailed findings.

**Antwort (zusammengefasst):** Strukturierte Erstanalyse: Node.js + Express + Sequelize Backend, React + Vite + TypeScript Frontend, PostgreSQL als DB, Jest für Tests. Erste Architektur-Skizze daraus abgeleitet.

**Meine Folge-Entscheidung:** Diese erste Bestandsaufnahme war Grundlage für alle nachfolgenden Architekturentscheide. Statt sofort Code zu schreiben, habe ich systematisch den Bestand verstanden.

### 8.6 Auszug: Rollen- und Tenant-Modell-Analyse (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > In `/Users/timohaldi/.../sprintify`, find out:
> >
> > 1. What roles exist in the system? Check backend models (User model, ProjectUser model), middleware/auth, and any role-related constants. Are there really 5 roles (superadmin, admin, manager, developer, member)? Or fewer?
> >
> > 2. Where can roles be managed in the frontend? Search for role-related UI in `frontend/src/` — look for role selection dropdowns, user management pages, team management, invitation flows.
> >
> > 3. Is there actual multi-tenancy (Company model with multiple tenants)? Or is the app designed for a single company/tenant? Check how Company is used — is there company switching, company registration, multiple companies?

**Antwort (zusammengefasst):** Befund: nur 2 globale Rollen (Admin, Member) und 3 projektspezifische Rollen (Admin, Member, Viewer) im aktiven Code — die behaupteten 5 Rollen aus einer Vorgängerversion existieren nicht mehr. Multi-Tenancy ist technisch noch im Modell, aber funktional nicht genutzt.

**Meine Folge-Entscheidung:** Klare Reduktion auf das tatsächlich benötigte Rollenmodell. Multi-Tenancy entfernt — Sprintify ist Single-Tenant für die Netcloud AG, das vereinfacht Logik und reduziert Angriffsfläche.

### 8.7 Auszug: Jira-Service-Codereview (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > Read the following files and return their full contents:
> > 1. `backend/src/services/JiraService.js`
> > 2. `backend/src/services/JiraSyncService.js`
> > 3. `backend/services/SyncScheduler.js`
> >
> > Also check `backend/package.json` for the current dependencies list.

**Antwort (zusammengefasst):** Vollständige Auflistung der drei Service-Klassen mit allen Methoden. JiraService kapselt API-Calls (Boards, Sprints, Issues, User-Suche). JiraSyncService orchestriert den Sync-Ablauf. SyncScheduler nutzt `node-cron` mit `*/15 * * * *`.

**Meine Folge-Entscheidung:** Konzept der Trennung zwischen API-Wrapper (`JiraService`) und Sync-Orchestrierung (`JiraSyncService`) bewusst beibehalten — sauberere Verantwortlichkeiten, einfachere Tests.

### 8.8 Auszug: Bug-Investigation Jira-User-Import (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > I need to understand why Jira sync isn't importing users. Look at:
> > 1. `backend/src/services/JiraSyncService.js` — how does it handle user/assignee data from Jira?
> > 2. `backend/src/services/JiraService.js` — what user-related methods exist?
> > 3. `backend/src/routes/jira.js` — what sync endpoints exist?
> > 4. `backend/src/models/User.js` — the `jiraAccountId` field
> > 5. `backend/src/models/UserStory.js` — the `assigneeId` field
> >
> > Tell me exactly how the sync flow works and where user creation/matching happens (or doesn't). Be thorough.

**Antwort (zusammengefasst):** Diagnose: Der initiale User-Import-Flow nutzte einen Endpunkt, der je nach Jira-Konfiguration leere Listen zurückgab. Empfehlung: dreistufiger Fallback (v3 → v2 → Project-Roles-API) implementieren.

**Meine Folge-Entscheidung:** Fallback-Strategie implementiert (siehe Anhang D § 5). Ohne diese Analyse hätte ich vermutlich noch lange erfolglos mit der falschen API herumprobiert.

### 8.9 Auszug: Backend-Frontend-Integrations-Analyse (Januar 2026)

> **Prompt an Claude Code (original):**
>
> > I need to understand several backend routes and how they connect to the frontend. Read these files fully:
> >
> > 1. `backend/src/routes/statistics.js` — all endpoints, especially sprint/:sprintId and sprint-related stats
> > 2. `backend/src/routes/sprints.js` — how sprints are fetched
> > 3. `backend/src/routes/capacityPlans.js` — how capacity plans work
> > 4. `frontend/src/pages/CapacityPlanning.tsx` — full file, how it fetches data
> > 5. `frontend/src/pages/SprintAnalytics.tsx` lines 278-340 — how it fetches sprint data and what fields it expects (especially check what fields like `totalStories`, `completedStories`, `velocity`, `completionRate`, `daysRemaining` it reads from the stats response)

**Antwort (zusammengefasst):** API-Contract-Map zwischen Backend-Endpunkten und Frontend-Komponenten. Identifikation von 3 Stellen, an denen Frontend-Felder nicht zur Backend-Response passten.

**Meine Folge-Entscheidung:** API-Contracts auf beiden Seiten angeglichen, statt einseitig zu ändern. Das ist genau der Wert, den Code-Reviews bringen — ich konnte den Sync zwischen zwei Schichten validieren, ohne beides selbst querzulesen.

### 8.10 Auszug: Gesamt-Review nach Frontend-Refactoring (März 2026)

> **Prompt an Claude Code (original):**
>
> > Explore the Sprintify project thoroughly. I need a comprehensive overview:
> >
> > 1. Frontend: Look at `frontend/src/` — components, pages, routing, features implemented
> > 2. Backend: Look at `backend/src/` — routes, controllers, services, models, middleware
> > 3. Docs: Look at everything in `docs/` directory
> > 4. Any README, documentation files in root or subdirectories
> > 5. Check `frontend/index.html` and `frontend/src/App.tsx` for the app structure
> > 6. Check `backend/src/models/` for all database models
> > 7. Check `backend/src/routes/` for all API endpoints
> > 8. Check if there are tests (`backend/tests` or similar)
> >
> > Give me a detailed summary of:
> > - What features are fully implemented
> > - What the app actually does (from code)

**Antwort (zusammengefasst):** Vollständige Inventarisierung nach Abschluss der Implementierungsphase: 7 Models, 10 Routes, 9 Frontend-Pfade, 4 Sprint-Analytics-Views, Jira-Sync mit Scheduler. Lücken: Test-Coverage punktuell.

**Meine Folge-Entscheidung:** Diese Inventarliste wurde Grundlage für die Doku-Struktur. Statt aus dem Kopf zu beschreiben, was implementiert ist, habe ich den Code-Stand als Wahrheits-Quelle genommen — was Halluzinationen in der Doku verhindert.

---

**Hinweis zur Vollständigkeit:** Diese zehn Auszüge sind eine repräsentative Auswahl aus mehreren Dutzend Sub-Agent-Sessions. Die vollständigen JSONL-Logs (mehrere MB) stehen auf Anfrage zur Einsicht. Spätere Review-Sessions sind nicht abgedruckt, weil sie keine technischen Implementierungsdetails enthalten, sondern formales Polishing der Abgabe-Dokumente.
