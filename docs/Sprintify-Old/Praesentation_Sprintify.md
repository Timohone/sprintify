# Sprintify -- Präsentation Diplomarbeit

**Timo Haldi | HF ICT 2023 F | Coach: Ardin Ibraimi**

Zielzeit: 45--60 Minuten

---

## Folienstruktur

---

### Folie 1 -- Titelfolie (1 min)

**Sprintify -- Entwicklung eines Capacity-Planning-Tools mit Jira-Integration**

- Timo Haldi
- Diplomarbeit SIW Höhere Fachschule für Wirtschaft und Informatik
- HF ICT 2023 F
- Coach: Ardin Ibraimi

---

### Folie 2 -- Agenda (1 min)

1. Vorstellung und Kontext
2. Problemstellung und Auftrag
3. Vorgehen und Projektplanung
4. KI als Co-Engineer (Methodik)
5. Architektur und Technologieentscheidungen
6. Ergebnisse: Die Module im Detail
7. Sprints und Entwicklungsprozess
8. Live-Demo
9. Kritische Würdigung
10. Persönliche Reflexion
11. Fazit und Empfehlung

---

### Folie 3 -- Vorstellung und Kontext (2 min)

**Wer bin ich?**

- Cloud Engineer bei der Netcloud AG, Abteilung Public Cloud Solutions
- Tagesgeschäft: Azure-Kundenprojekte, Infrastruktur, Managed Services
- Team arbeitet nach Scrum mit zweiwöchigen Sprints

**Was macht die Netcloud AG?**

- Schweizer IT-Dienstleister, Fokus auf Cloud-Infrastruktur
- Kunden aus verschiedenen Branchen, unterschiedliche Jira-Setups

Sprechnotiz: Hier kurz die eigene Rolle beschreiben. Nicht zu lange bei der Firma verweilen -- die Experten brauchen nur genug Kontext, um das Problem zu verstehen.

---

### Folie 4 -- Problemstellung (3 min)

**Sprint-Planung bei der Netcloud AG vor Sprintify:**

- Kapazitätsplanung via Excel-Tabellen, verstreut über SharePoint-Ordner
- Kein zentraler Ort für historische Velocity-Daten
- Abwesenheiten (Ferien, Teilzeit, Kundenprojekte) fliessen nur informell in die Planung ein
- Frage "Wie viele Story Points schaffen wir im nächsten Sprint?" konnte niemand datenbasiert beantworten

**Konsequenzen:**

- Regelmässig zu viel oder zu wenig eingeplant
- Sprint-Ziele verfehlt
- Mehr Abstimmungsaufwand, weniger Planungssicherheit

Sprechnotiz: Hier ein konkretes Beispiel aus dem Alltag bringen. Zum Beispiel: "In einem Sprint haben wir 40 SP geplant, zwei Leute waren aber im Urlaub. Am Ende haben wir 22 SP geschafft."

---

### Folie 5 -- Auftrag (2 min)

**Was sollte Sprintify leisten?**

1. Sprints, User Stories und Teammitglieder automatisch aus Jira übernehmen
2. Kapazitätsplanung pro Person und Sprint (aufgeteilt nach Wochen und Kategorien)
3. Sprint Analytics: Burndown-Charts, Velocity-Verlauf, Sprintvergleiche, Scope-Change-Tracking
4. Story-Point-Empfehlung basierend auf Kapazität und historischer Velocity
5. Rollenbasierte Zugriffskontrolle (global + pro Projekt)

**Rahmenbedingungen:**

- Deployment auf Azure App Service
- Ein-Mann-Projekt (Projektleitung und Entwicklung in Personalunion)
- 8 Monate Projektlaufzeit

---

### Folie 6 -- Marktanalyse (2 min)

Bestehende Lösungen und wo sie aufhören:

| Tool | Stärken | Was fehlt |
|------|---------|-----------|
| Tempo Timesheets | Zeiterfassung, Jira-Plugin | Keine wochenbasierte Kapazitätsplanung |
| Jira Advanced Roadmaps | Portfolio-Planung | Teuer, komplex, keine Team-Kapazitätsansicht |
| Forecast.app | Projektplanung | Keine direkte Jira-Sync, keine SP-Empfehlung |

Keines dieser Tools verbindet wochenbasierte Kapazitätsplanung mit automatischer Jira-Sync und Sprint Analytics in einer Oberfläche. Für kleinere Teams sind sie ausserdem oft zu teuer.

---

### Folie 7 -- Vorgehen (3 min)

**Methodik: Iteratives Vorgehen (angelehnt an Scrum)**

- Zweiwöchige Iterationen mit definierten Zielen
- Vereinfachtes Scrum: Ein-Mann-Projekt, keine Daily Standups, aber regelmässige Besprechung mit dem Vorgesetzten

**Vier Projektphasen:**

| Phase | Zeitraum | Fokus |
|-------|----------|-------|
| 1 -- Analyse & Konzeption | Monat 1--2 | Anforderungen, Evaluation, Architektur, UI-Prototyp |
| 2 -- Backend-Entwicklung | Monat 2--4 | DB-Struktur, REST-API, Jira-Anbindung, Auth |
| 3 -- Frontend-Entwicklung | Monat 4--6 | React-SPA, alle Module |
| 4 -- Integration & Deployment | Monat 6--8 | Azure, Tests mit echten Daten, Bugfixes |

Sprechnotiz: Erklären, warum Scrum als Einzelperson trotzdem Sinn ergibt: feste Iterationen erzwingen regelmässige Standortbestimmung. Erwähnen, dass die Anforderungen sich im Projektverlauf geändert haben, vor allem bei der Jira-Integration.

---

### Folie 7b -- KI als Co-Engineer (2 min)

**KI-gestützte Entwicklung als bewusste methodische Wahl**

- Hintergrund: Cloud Engineer mit jahrelanger Erfahrung in JavaScript/TypeScript und Azure
- Werkzeug: Claude Code (Anthropic) als Co-Engineer im Dialog-Modus
- Eingesetzt für: Boilerplate, repetitive UI-Komponenten, Dokumentations-Entwürfe, Architektur-Sparring

**Mein Arbeitszyklus:**

1. Anforderung präzise formulieren
2. Architektur und Kontext bereitstellen
3. KI generiert Vorschlag
4. Code-Review Zeile für Zeile
5. Manuell anpassen + an Architektur ausrichten
6. Gegen echte Daten validieren

Eigenleistung: Schritte 1, 2, 4, 5, 6. Beschleunigung: Schritt 3.

**Warum transparent?**

- 2026 ist KI-gestützte Entwicklung Praxis-Standard, kein Hilfsmittel zweiter Klasse
- KI ersetzt Fachkompetenz nicht — sie verstärkt sie bei kritischer Anwendung
- Halluzinationen, Sicherheitslücken in Vorschlägen, generischer Code: ohne Review entstehen Probleme
- Detaillierte Reflexion und Chat-Protokoll in Anhang E des Abstracts

Sprechnotiz: Hier ist Ehrlichkeit der Trumpf. Nicht apologetisch ("ich habe nur ein bisschen KI verwendet") und nicht prahlerisch ("die KI hat alles für mich gemacht"), sondern sachlich: KI als modernes Werkzeug, das ich gezielt eingesetzt und kritisch überwacht habe. Diese Folie nimmt potenziellen Fragen aus dem Expertengespräch den Wind aus den Segeln.

---

### Folie 8 -- Architekturübersicht (3 min)

**Grafik: Systemarchitektur (Client-Server)**

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────┐
│  React 19 SPA   │────>│  Node.js / Express    │────>│PostgreSQL│
│  TypeScript     │<────│  Sequelize ORM        │<────│          │
│  Vite + Tailwind│     │  10 Route-Module      │     └──────────┘
└─────────────────┘     │  Middleware-Stack      │
                        │  (JWT, CSRF, Rate Lim.)│
                        └──────────┬─────────────┘
                                   │
                                   v
                        ┌──────────────────────┐
                        │  Jira Cloud           │
                        │  REST API v2          │
                        │  Agile API v1.0       │
                        └──────────────────────┘
```

**Technologie-Stack:**

- Backend: Node.js, Express.js, Sequelize, PostgreSQL
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Auth: Microsoft Entra ID (MSAL) + JWT Fallback
- Deployment: Azure App Service

Sprechnotiz: Begründen, warum diese Technologien. Node.js: vorhandene JavaScript-Erfahrung, asynchrone Verarbeitung passt zur Jira-API. PostgreSQL: relationale Datenstruktur, Many-to-Many zwischen Usern und Projekten. React: Komponentenbasiert, grosse Community.

---

### Folie 9 -- Datenmodell (2 min)

**7 Modelle und ihre Beziehungen:**

```
Project ──< Sprint ──< UserStory
Project ──< ProjectUser >── User
Sprint  ──< CapacityPlan >── User
Sprint  ──< Retrospective
```

- **Retrospective:** Sprint-Rückblicke mit Action Items
- **ProjectUser:** Many-to-Many mit Rollen (admin, member, viewer)
- **CapacityPlan:** Pro User und Sprint, enthält wochenweise Kapazitätsdaten

Sprechnotiz: Kurz halten. Die Experten brauchen das Datenmodell als Grundlage, um die folgenden Module zu verstehen.

---

### Folie 10 -- Sicherheit und Zugriffskontrolle (2 min)

**Authentifizierung:**

- Microsoft Entra ID mit MSAL (OAuth 2.0 Authorization Code Flow)
- Fallback: lokale JWT-basierte Authentifizierung
- Tokens in HTTP-only Cookies

**Autorisierung auf zwei Ebenen:**

- Global: Admin und Member (Admin kann Projekte/User verwalten)
- Pro Projekt: Admin, Member, Viewer (über ProjectUser-Tabelle)

**Sicherheits-Baseline:**

- Helmet (HTTP-Security-Headers, CSP, X-Frame-Options, HSTS)
- CORS mit konfigurierbarem Origin und Credentials-Flag
- JWT-Validierung via jwks-rsa gegen Entra-ID-Public-Keys

**Geplante Erweiterungen für produktiven Rollout:**

- CSRF-Token-Validierung
- Rate Limiting auf API-Ebene
- Erweiterte Input-Sanitisierung

**Single-Tenant:** Eine Instanz pro Organisation, keine Mandantentrennung nötig für den aktuellen Einsatz bei der Netcloud AG

---

### Folie 11 -- Jira-Integration (4 min)

**Die grösste technische Herausforderung des Projekts**

**Zwei APIs:**

- REST API v2: Issues (User Stories)
- Agile API v1.0: Boards und Sprints

**Synchronisation in drei Schritten:**

1. Boards und Sprints abrufen (Agile API)
2. Issues pro Sprint synchronisieren (REST API)
3. Jira-Benutzer mit lokalen Benutzern verknüpfen (Account-ID oder E-Mail)

**Besonderheiten:**

- Story Points: Konfigurierbares Custom Field (Standard: `customfield_10016`)
- Status-Mapping: Jira-Status auf einheitliches Schema (To Do / In Progress / Done)
- Pro Projekt eigene Jira-Instanz (verschiedene Kunden = verschiedene Setups)
- Scheduler: Automatische Synchronisation alle 15 Minuten

**Fallstrick Synchronisationsreihenfolge:**

Stories können in mehreren Sprints vorkommen. Chronologisch aufsteigend synchronisieren, damit die Zuordnung zum neuesten Sprint gewinnt. Bei absteigender Reihenfolge landen Stories im falschen Sprint.

Sprechnotiz: Das war der schwierigste Teil. Nicht wegen der API, sondern wegen der unterschiedlichen Konfigurationen bei verschiedenen Kunden. Am besten ein konkretes Beispiel bringen, z.B. dass ein Kunde Story Points in einem anderen Custom Field hatte.

---

### Folie 12 -- Modul: Capacity Planning (4 min)

**Screenshot: Kapazitätsplanungsseite**

**Funktionen:**

- Wochenweise Aufschlüsselung pro Teammitglied
- 4 Kategorien: Holiday, Customer, Internal, Other
- Automatische Erstellung leerer Pläne für alle Projektmitglieder
- Aggregierte Ansicht: Gesamtkapazität, Durchschnitt pro Person, Aufteilung nach Kategorie
- Inline-Editing: Team-Leads bearbeiten Pläne direkt in der Tabelle

**SP-Empfehlung (neu):**

- Formel: `empfohlene SP = Avg Velocity x (aktuelle Kapazität / historische Durchschnittskapazität)`
- Berücksichtigt die letzten 6 abgeschlossenen Sprints
- Fallback ohne historische Kapazitätsdaten: Avg Velocity
- Wird direkt auf der Kapazitätsplanungsseite angezeigt

Sprechnotiz: Erklären, warum die SP-Empfehlung für die Sprint-Planung relevant ist: "Wenn zwei Leute im Urlaub sind, sinkt die Kapazität um 25%. Die Empfehlung passt die SP automatisch nach unten an." Das war vorher Bauchgefühl.

---

### Folie 13 -- Modul: Sprint Analytics (3 min)

**Vier Ansichten:**

1. **Overview:** Kennzahlen des aktuellen Sprints + Burndown-Chart (ideal vs. tatsächlich)
2. **Compare:** Aktuelle Velocity vs. vorheriger Sprint + Langzeit-Benchmarks
3. **Changes:** Scope-Änderungen (Stories, die während des Sprints hinzugekommen sind)
4. **Team Performance:** Velocity und Completion Rate pro Person (Balkendiagramm)

**Screenshots der vier Ansichten**

Sprechnotiz: Für jede Ansicht kurz erklären, welche Frage sie beantwortet. Overview: "Sind wir auf Kurs?" Compare: "Werden wir besser oder schlechter?" Changes: "Warum haben wir das Sprint-Ziel verfehlt?" Team Performance: "Ist die Arbeit gleichmässig verteilt?"

---

### Folie 14 -- Modul: Sprint History & Forecast (2 min)

**Sprint History:**

- Velocity über alle abgeschlossenen Sprints als Balkendiagramm
- Grundlage für datenbasierte Schätzung zukünftiger Sprints

**Forecast:**

- Verbleibende Backlog-Punkte
- Geschätzte Anzahl verbleibender Sprints (Best/Average/Worst Case)
- Geschätztes Fertigstellungsdatum

---

### Folie 15 -- Sprints und Entwicklungsprozess (4 min)

**Wie habe ich Sprintify entwickelt? Zweiwöchige Sprints, angelehnt an Scrum.**

**Phase 1 -- Analyse & Konzeption (Monat 1--2):**

- Sprint 1--2: Anforderungserhebung, Interviews mit dem Team
- Sprint 3: Marktanalyse, Technologieevaluation, Architekturentscheid
- Ergebnis: UI-Prototyp, Architekturskizze, Technologie-Stack definiert

**Phase 2 -- Backend-Entwicklung (Monat 2--4):**

- Sprint 4--5: Datenmodell, Grundgerüst Express-API, Auth-Middleware
- Sprint 6--7: Jira-Integration (erster Versuch, Probleme mit Custom Fields)
- Sprint 8: Jira-Sync überarbeitet, Scheduler implementiert
- Ergebnis: Funktionierende API mit Jira-Anbindung

**Phase 3 -- Frontend-Entwicklung (Monat 4--6):**

- Sprint 9--10: Dashboard, Projektverwaltung, Sprintübersicht
- Sprint 11: Kapazitätsplanung, wochenbasierte Eingabe
- Sprint 12--13: Sprint Analytics (Burndown, Velocity, Compare, Team Performance)
- Ergebnis: Vollständige React-SPA

**Phase 4 -- Integration & Deployment (Monat 6--8):**

- Sprint 14: Azure App Service Deployment
- Sprint 15: Tests mit Produktivdaten, Bugfixes
- Sprint 16: SP-Empfehlung, Performance-Optimierung, Feinschliff
- Ergebnis: Produktionsreife Applikation

Sprechnotiz: Straff halten (4 min für 16 Sprints = ca. 15 s pro Sprint im Schnitt). Nicht jeden Sprint einzeln durchgehen — den roten Faden zeigen: Phase 1 schnell, Phase 2 wegen Jira-Schwierigkeiten zwei Sprints länger als geplant, Phase 3 mit klaren Modulen, Phase 4 Deployment + nachgereichte SP-Empfehlung. Das zeigt, warum iteratives Vorgehen richtig war.

---

### Folie 16 -- Deployment und Betrieb (2 min)

**Azure App Service:**

- Kein eigener Server, zentrale Updates, automatische Skalierung
- Backend als App Service, Frontend als pre-built Static Files
- PostgreSQL als Managed Database

**Konfiguration:**

- Umgebungsvariablen über Azure App Settings
- Runtime-Injection im Frontend (`inject-config.js`)
- Datenbankmigrationen via Sequelize CLI

---

### Folie 17 -- Live-Demo (5 min)

**Fokus-Demo (4 Kernansichten):**

1. Dashboard kurz -- Projekt-KPIs, Velocity-Trend (45 s)
2. Kapazitätsplanung -- Wochenweise Eingabe + **SP-Empfehlung in Aktion** (1 min 30 s)
3. Sprint Analytics -- Burndown-Chart + Compare-Ansicht (1 min 30 s)
4. Sprint History -- Velocity-Balkendiagramm (45 s)

Sprechnotiz: Die Demo straff halten, 5 Minuten ist hart. Login, Scope Changes und Retrospective bewusst weglassen — wenn ein Experte nachfragt, kann ich es im Expertengespräch zeigen. Vorher 2-3× durchspielen mit Timer. Demo-Backup: Screenshots auf den Folien 23-34 der pptx sind bereits eingebunden, falls Jira oder Azure nicht erreichbar sind.

---

### Folie 18 -- Kritische Würdigung (4 min)

**Was gut gelaufen ist:**

- Iteratives Vorgehen hat sich bewährt: Anforderungen haben sich mehrfach geändert, vor allem bei der Jira-Integration
- Die Applikation läuft mit Produktivdaten und die Ergebnisse stimmen
- Die SP-Empfehlung gab es so in keinem der evaluierten Tools

**Was ich anders machen würde:**

- Jira-Integration: Ein Spike mit einem Minimal-Prototyp zu Beginn hätte den Aufwand realistischer gemacht. Die Vielfalt der Konfigurationen (Custom Fields, Status-Bezeichnungen, Board-Strukturen) habe ich unterschätzt
- Code-Reviews: Als Ein-Mann-Projekt fehlte ein zweites Paar Augen. Automatisierte Tests hätten das teilweise kompensiert, habe ich aber nur punktuell geschrieben
- Single-Tenant: Die App ist für eine Organisation gebaut. Falls sie bei mehreren Kunden laufen soll, müsste man Mandantentrennung ergänzen (z.B. Company-Modell mit separaten Schemas)

---

### Folie 19 -- Persönliche Reflexion (3 min)

**Was ich gelernt habe:**

- Die grösste Herausforderung bei Integrationsprojekten steckt selten in der eigenen Codebasis. Sie steckt in den Eigenheiten und Inkonsistenzen des Systems, an das man anbindet
- Allein arbeiten hat zwei Seiten: schnelle Entscheidungen, aber keine Code-Reviews
- Ohne Iterationen hätte ich die wechselnden Anforderungen nicht auffangen können
- Vorher hatte ich vor allem Frontend und Infrastruktur--Erfahrung. Durch das Projekt kann ich jetzt auch Backend dazu.

**Was ich mitnehme für zukünftige Projekte:**

- Integrationen mit externen Systemen immer mit einem Spike starten
- Automatisierte Tests von Anfang an schreiben, nicht "wenn noch Zeit ist"
- Auch als Solo-Entwickler Code-Reviews simulieren: den eigenen Code nach einem Tag nochmal lesen

---

### Folie 20 -- Empfehlung und nächste Schritte (2 min)

**Empfehlung:** Sprintify produktiv einsetzen in der Abteilung Public Cloud Solutions.

**Nächste Schritte:**

1. Jira-Anbindung über einen schreibgeschützten Service-Account
2. Einführungsschulung für das Team
3. Feedback sammeln in den ersten drei Sprints
4. Automatisierte Tests ausbauen
5. Mittelfristig: Mobile Ansicht für Stand-ups

**Konsequenzen ohne Sprintify:**

- Sprint-Planung bleibt auf Excel angewiesen
- Schätzungen basieren auf Bauchgefühl statt auf Daten
- Regelmässig verfehlte Sprint-Ziele, mehr Abstimmungsaufwand

---

### Folie 21 -- Abschluss (1 min)

**Sprintify in einem Satz:**

Sprintify gibt dem Team eine datenbasierte Antwort auf die Frage: "Wie viele Story Points schaffen wir im nächsten Sprint?"

**Fragen?**

---

## Zeitplan Übersicht

| Block | Folien | Dauer |
|-------|--------|-------|
| Vorstellung, Problem, Auftrag | 1--5 | 9 min |
| Marktanalyse, Vorgehen | 6--7 | 5 min |
| KI als Co-Engineer | 7b | 2 min |
| Architektur, Datenmodell, Sicherheit | 8--10 | 7 min |
| Jira-Integration | 11 | 4 min |
| Module (Capacity, Analytics, History) | 12--14 | 9 min |
| Entwicklungsprozess, Deployment | 15--16 | 6 min |
| Live-Demo (Fokus auf 4 Kernansichten) | 17 | 5 min |
| Kritische Würdigung, Reflexion | 18--19 | 7 min |
| Empfehlung, Abschluss | 20--21 | 3 min |
| **Gesamt** | | **~57 min** |

Hinweis: 57 min lässt 3 Minuten Puffer vor dem 60-min-Limit. Bei nervöser Erstdurchführung neigt man dazu, schneller zu reden — also eher kein Problem.

---

## Tipps zur Vorbereitung

- **Demo-Backup:** Screenshots aller Bildschirme als Folien vorbereiten, falls Jira oder Azure nicht erreichbar ist.
- **Zeitpuffer:** Die Demo ist der flexibelste Teil. Falls die Zeit knapp wird, nur die Kapazitätsplanung und das Burndown-Chart zeigen.
- **Sprache:** Laut Leitfaden darf in Mundart, Hochdeutsch oder Englisch präsentiert werden. Bei Hochdeutsch oder Mundart: Fachbegriffe konsistent verwenden (Sprint, Velocity, Story Points bleiben auf Englisch).
- **Expertengespräch:** Nach der Präsentation kommen 4 Fragen mit 3.5 Stunden Vorbereitungszeit. Mögliche Themen: Erweiterung auf Multi-Tenancy, Alternative Technologien, Jira-Sync-Fehlerbehandlung, Testabdeckung.
