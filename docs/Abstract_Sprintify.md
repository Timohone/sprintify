# Sprintify -- Entwicklung eines Capacity-Planning-Tools mit Jira-Integration

Diplomarbeit der SIW Höheren Fachschule für Wirtschaft und Informatik

Timo Haldi
Hauptstrasse 42, 8357 Guntershausen
Klasse: HF ICT 2023 F

Coach: Ardin Ibraimi

Abgabedatum: 25.04.2026

---

## Inhaltsverzeichnis

1. Einleitung
2. Vorgehen
3. Aktuelle Trends
4. Ergebnisse
   4.1 Architektur und Technologieentscheidungen
   4.2 Jira-Integration und Datensynchronisation
   4.3 Capacity Planning
   4.4 Sprint Analytics und Reporting
   4.5 Sicherheit und Zugriffskontrolle
5. Empfehlung und Schlussfolgerung
6. Kritische Würdigung

---

## Abkürzungsverzeichnis

| Abkürzung | Bedeutung |
|-----------|-----------|
| API | Application Programming Interface |
| JWT | JSON Web Token |
| MSAL | Microsoft Authentication Library |
| RBAC | Rollenbasierte Zugriffskontrolle |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SP | Story Points |
| CSRF | Cross-Site Request Forgery |
| CI/CD | Continuous Integration / Continuous Deployment |

---

## 1 Einleitung

Die Netcloud AG ist ein Schweizer IT-Dienstleister mit Fokus auf Cloud-Infrastruktur und Managed Services. Ich arbeite als Cloud Engineer in der Abteilung Public Cloud Solutions, wo wir Kundenprojekte rund um Microsoft Azure betreuen.

Unsere Projekte laufen nach Scrum. Die Sprint-Planung haben wir bisher in Jira und Kapazitätsverteilung haben wir bisher mit Excel-Tabellen gelöst, die über verschiedene SharePoint-Ordner verstreut waren. Das hat funktioniert, aber nur knapp. Wenn jemand im Team gefragt hat, wie viele Story Points wir im nächsten Sprint realistisch schaffen, musste man sich die Antwort mehr oder weniger zusammenreimen. Historische Velocity-Daten lagen nirgends aufbereitet vor, und die Kapazität einzelner Teammitglieder (Ferien, Teilzeit, interne Projekte) floss nur informell in die Planung ein.

Der Auftrag für diese Diplomarbeit war, eine Webanwendung zu bauen, die diese Lücke schliesst:

- Sprints, User Stories und Teammitglieder automatisch aus Jira übernehmen
- Kapazitätsplanung pro Person und Sprint, aufgeteilt nach Wochen und Kategorien (Ferien, Kundenprojekte, interne Arbeit, Sonstiges)
- Sprint Analytics mit Burndown-Charts, Velocity-Verlauf, Sprintvergleichen und Scope-Change-Tracking

Ich habe in diesem Projekt sowohl die Rolle des Projektleiters als auch die des Entwicklers übernommen.

## 2 Vorgehen

Ich habe mich für ein iteratives Vorgehen in Anlehnung an Scrum entschieden. Als Ein-Mann-Projekt habe ich das Framework vereinfacht: zweiwöchige Iterationen mit definierten Zielen, danach jeweils eine Besprechung der Ergebnisse mit meinem Vorgesetzten.

Das Projekt lief in vier Phasen (Epics) ab:

Phase 1, Analyse und Konzeption (Monat 1-2): Anforderungen mit dem Team aufnehmen, bestehende Tools am Markt evaluieren, Systemarchitektur und Technologien festlegen. In dieser Phase habe ich auch einen ersten UI-Prototyp erstellt.

Phase 2, Backend-Entwicklung (Monat 3-5): Datenbankstruktur aufbauen, REST-API implementieren, Jira-Anbindung entwickeln, Authentifizierung und Autorisierung einrichten.

Phase 3, Frontend-Entwicklung (Monat 5-8): Die React-Oberfläche mit allen Modulen umsetzen: Dashboard, Kapazitätsplanung, Sprint Analytics, Sprint History, Teamverwaltung.

Phase 4, Integration und Deployment (Monat 9-11): Deployment auf Azure App Service, Tests mit echten Jira-Daten, Fehlerbehebung, Performance-Optimierung.

Das iterative Vorgehen hat sich gelohnt. Die Anforderungen haben sich im Projektverlauf mehrfach geändert, vor allem bei der Jira-Integration. Jira ist je nach Projekt unterschiedlich konfiguriert, und vieles davon zeigt sich erst, wenn man mit echten Daten arbeitet.

## 3 Aktuelle Trends

Scrum sieht die Velocity als Planungsgrundlage vor, aber in der Praxis reicht das nicht. Teams müssen Abwesenheiten, Teilzeitpensen und nicht-projektbezogene Tätigkeiten berücksichtigen, wenn sie einen Sprint planen. Excel-Listen sind dafür ein verbreitetes, aber umständliches Mittel.

Am Markt gibt es Tools wie Tempo Timesheets, Jira Advanced Roadmaps oder Forecast.app. Diese decken Teilbereiche ab. Was ich bei der Evaluation nicht gefunden habe, war ein Tool, das wochenbasierte Kapazitätsplanung mit automatischer Jira-Synchronisation und Sprint Analytics in einer Oberfläche verbindet. Die kommerziellen Lösungen sind ausserdem für kleinere Teams oft zu teuer oder zu aufwendig in der Einrichtung.

Im Bereich Deployment hat sich die Bereitstellung über Cloud-Plattformen wie Azure App Service durchgesetzt. Der Vorteil: kein eigener Server, zentrale Updates, automatische Skalierung.

Für die Authentifizierung wird zunehmend OpenID Connect mit Microsoft Entra ID verwendet. Damit lässt sich Single Sign-On umsetzen, und die Benutzerverwaltung entfällt grösstenteils, da keine separaten Zugangsdaten nötig sind.

## 4 Ergebnisse

### 4.1 Architektur und Technologieentscheidungen

Sprintify ist eine Client-Server-Applikation. Das Backend läuft auf Node.js mit Express.js und nutzt Sequelize als ORM für PostgreSQL. Das Frontend ist eine React 18 SPA, geschrieben in TypeScript mit Vite als Build-Tool und Tailwind CSS für das Styling.

Die API besteht aus 10 Route-Modulen (unter `/api/*`), einer Service-Schicht für Jira-Synchronisation sowie Middleware für Sicherheit (JWT-Authentifizierung, CSRF-Schutz, Rate Limiting, Input-Sanitisierung). Die Datenbank hat sieben Modelle: User, Project, ProjectUser, Sprint, UserStory, CapacityPlan und Retrospective.

Node.js habe ich gewählt, weil ich bereits Erfahrung mit JavaScript/TypeScript hatte und die asynchrone Verarbeitung gut zur Jira-API passt. PostgreSQL war naheliegend, weil die Datenstruktur relational ist. Besonders die Many-to-Many-Beziehung zwischen Usern und Projekten profitiert davon.

### 4.2 Jira-Integration und Datensynchronisation

Die Jira-Anbindung war der Teil der Arbeit, der mir am meisten Kopfzerbrechen bereitet hat. Sprintify kommuniziert über zwei APIs mit Jira: die REST API v2 für Issues und die Agile API v1.0 für Boards und Sprints. Jedes Projekt kann eine eigene Jira-Instanz haben, da verschiedene Teams verschiedene Setups verwenden.

Die Synchronisation läuft in drei Schritten: Zuerst werden über die Agile API die Boards und deren Sprints abgerufen. Dann werden alle Issues pro Sprint synchronisiert. Story Points liest das System über ein konfigurierbares Custom Field aus (Standard: `customfield_10016`). Der Jira-Status wird auf ein einheitliches Schema gemappt (To Do, In Progress, Done). Zuletzt werden Jira-Benutzer anhand ihrer Account-ID oder E-Mail-Adresse mit lokalen Benutzern verknüpft.

Ein Scheduler synchronisiert alle 15 Minuten automatisch. Ein Detail, das ich erst spät bemerkt habe: Die Reihenfolge der Synchronisation ist wichtig. Stories können in mehreren Sprints vorkommen. Wenn man die Sprints chronologisch aufsteigend synchronisiert, gewinnt die Zuordnung zum neuesten Sprint. Bei absteigender Reihenfolge landen Stories im falschen Sprint.

### 4.3 Capacity Planning

Pro Teammitglied und Sprint kann die verfügbare Arbeitszeit wochenweise aufgeschlüsselt werden. Die Kategorien sind Holiday (Ferien und Feiertage), Customer (Kundenprojektarbeit), Internal (Meetings, Weiterbildung, Service Entwicklung) und Other (sonstige Abwesenheiten).

Wenn ein Sprint zum ersten Mal aufgerufen wird, erstellt das System automatisch leere Kapazitätspläne für alle Projektmitglieder. Die Wochen orientieren sich am Start- und Enddatum des Sprints. Team-Leads oder Mitarbeiter bearbeiten die Pläne direkt in der Weboberfläche und sehen die aggregierten Zahlen: Gesamtkapazität des Teams, Durchschnitt pro Person und Aufteilung nach Kategorie.

Aus den Kapazitätsdaten leitet Sprintify eine Story-Point-Empfehlung für den kommenden Sprint ab. Die Formel dafür lautet: empfohlene SP = durchschnittliche Velocity multipliziert mit dem Kapazitätsfaktor. Der Kapazitätsfaktor ergibt sich aus dem Verhältnis der aktuellen Sprint-Kapazität zur durchschnittlichen Kapazität der letzten sechs abgeschlossenen Sprints. Wenn das Team im nächsten Sprint also weniger verfügbare Stunden hat als im Schnitt, fällt die Empfehlung entsprechend tiefer aus. Falls keine historischen Kapazitätsdaten vorliegen, greift das System auf die durchschnittliche Velocity zurück. Die Empfehlung wird direkt auf der Kapazitätsplanungsseite angezeigt, zusammen mit der aktuellen und der historischen Kapazität.

### 4.4 Sprint Analytics und Reporting

Das Analytics-Modul hat vier Ansichten.

Die Overview zeigt die Kennzahlen des aktuellen Sprints (Story Points, Completion Rate, verbleibende Tage) und ein Burndown-Chart. Das Chart vergleicht die ideale Abarbeitungslinie mit dem tatsächlichen Verlauf, der aus den Abschlusszeitpunkten der einzelnen Stories berechnet wird.

Unter Compare lässt sich die aktuelle Sprint-Velocity dem vorherigen Sprint gegenüberstellen und mit Langzeit-Benchmarks vergleichen (Durchschnitt und Bestwert aller abgeschlossenen Sprints). So sieht man, ob sich die Teamleistung verbessert, verschlechtert oder gleichbleibt.

Changes zeigt, welche Stories während eines Sprints zum Scope hinzugekommen sind. In unserer Erfahrung sind solche Scope-Änderungen einer der häufigsten Gründe, warum Sprint-Ziele nicht erreicht werden.

Team Performance zeigt Velocity und Completion Rate pro Person als Balkendiagramm. Die Ansicht ist nicht für individuelle Leistungsbewertung gedacht, sondern dafür, Überlastung oder ungleiche Verteilung zu erkennen.

Die Sprint History zeigt die Velocity über alle abgeschlossenen Sprints als Balkendiagramm. Damit lassen sich zukünftige Sprints datenbasiert schätzen.

### 4.5 Sicherheit und Zugriffskontrolle

Die Authentifizierung läuft über Microsoft Entra ID mit MSAL. Im Frontend wird der OAuth 2.0 Authorization Code Flow verwendet, im Backend werden die JWT-Tokens validiert. Als Fallback gibt es eine lokale JWT-basierte Authentifizierung.

Die Autorisierung arbeitet auf zwei Ebenen. Global gibt es die Rollen Admin und Member. Auf Projektebene steuert die ProjectUser-Tabelle den Zugriff mit drei Rollen: Admin, Member und Viewer. Admins können Projekte und Benutzer verwalten, Viewer haben nur Lesezugriff.

Die Applikation ist als Single-Tenant-Lösung konzipiert, also eine Instanz pro Organisation. CSRF-Schutz, Rate Limiting und Input-Sanitisierung sind als Middleware umgesetzt.

## 5 Empfehlung und Schlussfolgerung

### 5.1 Empfehlung

Ich empfehle, Sprintify in der Abteilung Public Cloud Solutions produktiv einzusetzen. Die Applikation erfüllt die definierten Anforderungen und das Team kann damit Sprints datenbasiert planen.

Für den laufenden Betrieb empfehle ich zwei Massnahmen: Erstens, die produktive Jira-Anbindung über einen schreibgeschützten Service-Account laufen lassen, damit keine persönlichen Zugangsdaten hinterlegt werden müssen. Zweitens, die automatisierten Tests ausbauen, um die Wartbarkeit zu sichern.

### 5.2 Nächste Schritte

Nach dem Go-Live sollte eine Einführungsschulung für das Team stattfinden. In den ersten drei Sprints sollte gezielt Feedback gesammelt werden, das in die Weiterentwicklung einfliesst. Mittelfristig wäre eine mobile Ansicht sinnvoll, damit das Tool auch während Stand-ups auf dem Handy nutzbar ist.

### 5.3 Konsequenzen bei Nicht-Eintreten

Ohne Sprintify bleibt die Kapazitätsplanung auf verteilte Excel-Listen angewiesen. Sprint-Schätzungen basieren weiterhin auf Erfahrungswerten statt auf historischen Velocity-Daten. Das bedeutet in der Praxis: regelmässig zu viel oder zu wenig eingeplant, verfehlte Sprint-Ziele und mehr Abstimmungsaufwand im Team.

## 6 Kritische Würdigung

Die Arbeit hat erreicht, was sie sollte: Sprintify synchronisiert Daten aus Jira, bietet eine wochenbasierte Kapazitätsplanung und liefert Sprint Analytics. Die Applikation läuft mit produktiven Daten und die Ergebnisse stimmen.

Es gibt aber Dinge, die ich rückblickend anders machen würde.

Die Jira-Integration hat deutlich mehr Zeit gebraucht als ich eingeplant hatte. Das Problem war nicht die API selbst, sondern die Vielfalt der Konfigurationen. Jedes Projekt nutzt andere Custom Fields, andere Status-Bezeichnungen, andere Board-Strukturen. Ich bin da mehrfach in Sackgassen gelaufen und musste Teile der Synchronisation neu schreiben. Ein Spike mit einem Minimal-Prototyp gleich zu Beginn hätte mir geholfen, den Aufwand realistischer einzuschätzen.

Das Projekt alleine umzusetzen hatte zwei Seiten. Ich konnte Entscheidungen schnell treffen und musste mich mit niemandem abstimmen. Aber mir fehlte ein zweites Paar Augen. Ohne Code-Reviews schleichen sich Fehler ein, die man selbst nicht sieht. Automatisierte Tests hätten das teilweise auffangen können, aber die habe ich aus Zeitgründen nur punktuell geschrieben.

Die Applikation ist aktuell als Single-Tenant-Lösung aufgebaut. Für den Einsatz bei der Netcloud AG reicht das. Falls Sprintify aber einmal bei mehreren Organisationen eingesetzt werden soll, müsste eine Mandantentrennung ergänzt werden, zum Beispiel über ein Company-Modell mit separaten Schemas pro Mandant.

Trotz dieser Einschränkungen bin ich zufrieden mit dem Ergebnis. Das Tool löst ein konkretes Problem, das uns im Alltag regelmässig gebremst hat. Was ich aus dem Projekt vor allem mitgenommen habe: Die grösste Herausforderung bei Integrationsprojekten steckt selten in der eigenen Codebasis. Sie steckt in den Eigenheiten und Inkonsistenzen des Systems, an das man anbindet.

---

## Selbstständigkeitserklärung

Ich erkläre hiermit, dass ich die Ergebnisse der Diplomarbeit selbständig und eigenhändig erstellt habe. Zudem bezeuge ich, dass die eingereichte Diplomarbeit nicht bereits für eine andere Prüfung eingesetzt wurde.

Ort, Datum: _______________________________

Vorname Name: _______________________________

Unterschrift: _______________________________
