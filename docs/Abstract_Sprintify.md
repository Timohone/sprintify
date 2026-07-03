# Sprintify -- Entwicklung eines Capacity-Planning-Tools mit Jira-Integration

Diplomarbeit der SIW Höheren Fachschule für Wirtschaft und Informatik

Timo Haldi
Hauptstrasse 42, 8357 Guntershausen
Klasse: HF ICT 2023 F

Coach: Ardin Ibraimi

Abgabedatum: 25.05.2026

---

## Inhaltsverzeichnis

Abkürzungsverzeichnis
Abbildungsverzeichnis
1. Einleitung
2. Vorgehen
   2.1 Iteratives Vorgehen
   2.2 KI-gestützte Entwicklung
3. Aktuelle Trends
4. Ergebnisse
   4.1 Architektur und Technologieentscheidungen
   4.2 Jira-Integration und Datensynchronisation
   4.3 Capacity Planning
   4.4 Sprint Analytics und Reporting
   4.5 Sicherheit und Zugriffskontrolle
   4.6 Retrospektiven
5. Empfehlung und Schlussfolgerung
6. Kritische Würdigung
Quellenverzeichnis
Anhänge
Selbstständigkeitserklärung

---

## Abkürzungsverzeichnis

| Abkürzung | Bedeutung |
|-----------|-----------|
| API | Application Programming Interface |
| JWT | JSON Web Token |
| MSAL | Microsoft Authentication Library |
| REST | Representational State Transfer |
| SPA | Single Page Application |
| SP | Story Points |
| CSRF | Cross-Site Request Forgery |

---

## Abbildungsverzeichnis

| Nr. | Bezeichnung |
|-----|------------|
| Abbildung 1 | Systemarchitektur Sprintify |
| Abbildung 2 | Datenmodell (Entity-Relationship-Diagramm) |
| Abbildung 3 | Kapazitätsplanungsansicht mit SP-Empfehlung |
| Abbildung 4 | Sprint Analytics — Burndown-Chart |

*Abbildungen befinden sich in Anhang D: Technische Dokumentation bzw. werden als Screenshots im finalen PDF eingefügt.*

---

## 1 Einleitung

Die Netcloud AG ist ein Schweizer IT-Dienstleister mit Fokus auf Cloud-Infrastruktur und Managed Services. Ich arbeite als Cloud Engineer in der Abteilung Public Cloud Solutions, wo wir Kundenprojekte rund um Microsoft Azure betreuen.

Unsere Projekte laufen nach Scrum. Die Sprint-Planung lief bisher über Jira, die Kapazitätsverteilung über Excel-Tabellen, verstreut auf verschiedenen SharePoint-Ordnern. Das hat funktioniert, aber nur knapp. Wenn jemand im Team gefragt hat, wie viele Story Points wir im nächsten Sprint realistisch schaffen, musste man sich die Antwort mehr oder weniger zusammenreimen. Historische Velocity-Daten lagen nirgends aufbereitet vor, und die Kapazität einzelner Teammitglieder (Ferien, Teilzeit, interne Projekte) floss nur informell in die Planung ein.

Der Auftrag für diese Diplomarbeit war, eine Webanwendung zu bauen, die diese Lücke schliesst:

- Sprints, User Stories und Teammitglieder automatisch aus Jira übernehmen
- Kapazitätsplanung pro Person und Sprint, aufgeteilt nach Wochen und Kategorien (Ferien, Kundenprojekte, interne Arbeit, Sonstiges)
- Sprint Analytics mit Burndown-Charts, Velocity-Verlauf, Sprintvergleichen und Scope-Change-Tracking

Ich habe in diesem Projekt sowohl die Rolle des Projektleiters als auch die des Entwicklers übernommen.

## 2 Vorgehen

### 2.1 Iteratives Vorgehen

Ich habe mich für ein iteratives Vorgehen in Anlehnung an Scrum entschieden. Als Ein-Mann-Projekt habe ich das Framework vereinfacht: zweiwöchige Iterationen mit definierten Zielen, danach jeweils eine Besprechung der Ergebnisse mit meinem Vorgesetzten.

Das Projekt lief über rund acht Monate in vier Phasen ab:

Phase 1, Analyse und Konzeption (Monat 1-2): Anforderungen mit dem Team aufnehmen, bestehende Tools am Markt evaluieren, Systemarchitektur und Technologien festlegen. In dieser Phase habe ich auch einen ersten UI-Prototyp erstellt.

Phase 2, Backend-Entwicklung (Monat 2-4): Datenbankstruktur aufbauen, REST-API implementieren, Jira-Anbindung entwickeln, Authentifizierung und Autorisierung einrichten.

Phase 3, Frontend-Entwicklung (Monat 4-6): Die React-Oberfläche mit allen Modulen umsetzen: Dashboard, Kapazitätsplanung, Sprint Analytics, Sprint History, Teamverwaltung.

Phase 4, Integration und Deployment (Monat 6-8): Deployment auf Azure App Service, Tests mit echten Jira-Daten, Fehlerbehebung, Performance-Optimierung.

Das iterative Vorgehen hat sich gelohnt. Die Anforderungen haben sich im Projektverlauf mehrfach geändert, vor allem bei der Jira-Integration. Jira ist je nach Projekt unterschiedlich konfiguriert, und vieles davon zeigt sich erst, wenn man mit echten Daten arbeitet.

### 2.2 KI-gestützte Entwicklung

Als Cloud Engineer arbeite ich seit Jahren mit JavaScript/TypeScript, Azure-Infrastruktur und CI/CD-Werkzeugen. Für dieses Projekt habe ich Claude Code (Anthropic) als KI-gestützten Co-Engineer eingesetzt, um die Implementierung repetitiver Code-Teile, das initiale Aufsetzen von Komponenten und die Erstellung von Dokumentationsentwürfen zu beschleunigen. Architektur, Datenmodell, Sicherheitskonzept und sämtliche Designentscheidungen lagen bei mir. Mein fachlicher Hintergrund hat es mir erlaubt, KI-Vorschläge zu prüfen, anzupassen oder zu verwerfen, statt sie ungeprüft zu übernehmen.

Der konkrete Arbeitszyklus: Anforderung formulieren → Kontext und Architektur bereitstellen → Lösung erzeugen lassen → Code-Review → manuelle Anpassung → Verifizierung mit echten Daten. Schritte 1, 2, 4, 5 und 6 sind meine Eigenleistung; Schritt 3 die Beschleunigung durch KI.

Die kritische Reflexion zum KI-Einsatz, repräsentative Sessions und die Verifizierung der zitierten Quellen finden sich in **Anhang E (KI-Chat-Protokoll und Reflexion)**.

## 3 Aktuelle Trends

In der Praxis nutzen die meisten Scrum-Teams die Velocity als Planungsgrundlage (vgl. Cohn 2005, S. 87 ff. [Cohn2005]). Für eine realistische Sprint-Planung reicht das allein aber nicht. Teams müssen Abwesenheiten, Teilzeitpensen und nicht-projektbezogene Tätigkeiten berücksichtigen, wenn sie einen Sprint planen. Excel-Listen sind dafür ein verbreitetes, aber umständliches Mittel.

Am Markt gibt es Tools wie Tempo Timesheets [Tempo2026], Jira Advanced Roadmaps (Bestandteil von Jira Premium) [Atlassian2026] oder Forecast.app [Forecast2026]. Diese decken Teilbereiche ab. Was ich bei der Evaluation nicht gefunden habe, war ein Tool, das wochenbasierte Kapazitätsplanung mit automatischer Jira-Synchronisation und Sprint Analytics in einer Oberfläche verbindet. Die kommerziellen Lösungen sind ausserdem für kleinere Teams oft zu teuer oder zu aufwendig in der Einrichtung.

Im Bereich Deployment hat sich die Bereitstellung über Cloud-Plattformen wie Azure App Service durchgesetzt [Microsoft2026a]. Der Vorteil: kein eigener Server, zentrale Updates, automatische Skalierung.

Für die Authentifizierung wird zunehmend OpenID Connect [OpenID2014] auf Basis von OAuth 2.0 [Hardt2012] mit Microsoft Entra ID [Microsoft2026b] verwendet. Damit lässt sich Single Sign-On umsetzen, und die Benutzerverwaltung entfällt grösstenteils, da keine separaten Zugangsdaten nötig sind.

Velocity wird im Scrum Guide selbst nicht als Pflichtmetrik definiert, ist aber in der Praxis das verbreitetste Werkzeug zur Sprint-Planung. Der Scrum Guide betont empirische Prozesssteuerung (Transparenz, Inspektion, Adaption), was eine datenbasierte Kapazitätsplanung nahelegt [Schwaber2020].

Immer mehr Teams ersetzen manuelle Methoden (Excel, Confluence-Seiten) durch spezialisierte Tools, die historische Daten automatisch auswerten. Die Herausforderung liegt dabei oft nicht in der Datenerhebung selbst, sondern in der Integration mit bestehenden Systemen wie Jira, da jede Organisation eigene Konfigurationen verwendet.

## 4 Ergebnisse

### 4.1 Architektur und Technologieentscheidungen

Sprintify ist eine Client-Server-Applikation. Das Backend läuft auf Node.js mit Express.js [Express2025] und nutzt Sequelize [Sequelize2025] als ORM für PostgreSQL. Das Frontend ist eine React 19 SPA [React2025], geschrieben in TypeScript mit Vite als Build-Tool und Tailwind CSS für das Styling.

Die API besteht aus 10 Route-Modulen (unter `/api/*`), einer Service-Schicht für Jira-Synchronisation sowie einer Sicherheitsbaseline mit JWT-Authentifizierung und Helmet-basierten HTTP-Security-Headers. Die Datenbank hat sieben Modelle: User, Project, ProjectUser, Sprint, UserStory, CapacityPlan und Retrospective (siehe Abbildung 1 und 2).

Node.js habe ich gewählt, weil ich bereits Erfahrung mit JavaScript/TypeScript hatte und das event-driven, non-blocking I/O-Modell [NodeJS2026] gut zur Jira-API passt, bei der viele parallele HTTP-Calls anfallen. PostgreSQL [PostgreSQL2026] war naheliegend, weil die Datenstruktur relational ist und ACID-Transaktionen für die Konsistenz von Sprint- und Story-Daten wichtig sind. Besonders die Many-to-Many-Beziehung zwischen Usern und Projekten profitiert davon.

### 4.2 Jira-Integration und Datensynchronisation

Die Jira-Anbindung war der Teil der Arbeit, der mir am meisten Kopfzerbrechen bereitet hat. Sprintify kommuniziert über zwei APIs mit Jira: die REST API v2 für Issues [Atlassian2025a] und die Agile API v1.0 für Boards und Sprints [Atlassian2025b]. Jedes Projekt kann eine eigene Jira-Instanz haben, da verschiedene Teams verschiedene Setups verwenden.

Die Synchronisation läuft in drei Schritten: Zuerst werden über die Agile API die Boards und deren Sprints abgerufen. Dann werden alle Issues pro Sprint synchronisiert. Story Points liest das System über ein konfigurierbares Custom Field aus (Standard: `customfield_10016`). Der Jira-Status wird auf ein einheitliches Schema gemappt (To Do, In Progress, Done). Zuletzt werden Jira-Benutzer anhand ihrer Account-ID oder E-Mail-Adresse mit lokalen Benutzern verknüpft.

Ein Scheduler synchronisiert alle 15 Minuten automatisch. Ein Detail, das ich erst spät bemerkt habe: Die Reihenfolge der Synchronisation ist wichtig. Stories können in mehreren Sprints vorkommen. Wenn man die Sprints chronologisch aufsteigend synchronisiert, gewinnt die Zuordnung zum neuesten Sprint. Bei absteigender Reihenfolge landen Stories im falschen Sprint.

### 4.3 Capacity Planning

Pro Teammitglied und Sprint kann die verfügbare Arbeitszeit wochenweise aufgeschlüsselt werden. Die Kategorien sind Holiday (Ferien und Feiertage), Customer (Kundenprojektarbeit), Internal (Meetings, Weiterbildung, Service Entwicklung) und Other (sonstige Abwesenheiten).

Wenn ein Sprint zum ersten Mal aufgerufen wird, erstellt das System automatisch leere Kapazitätspläne für alle Projektmitglieder. Die Wochen orientieren sich am Start- und Enddatum des Sprints. Team-Leads oder Mitarbeiter bearbeiten die Pläne direkt in der Weboberfläche und sehen die aggregierten Zahlen: Gesamtkapazität des Teams, Durchschnitt pro Person und Aufteilung nach Kategorie.

Aus den Kapazitätsdaten leitet Sprintify eine Story-Point-Empfehlung für den kommenden Sprint ab. Die Formel dafür lautet: empfohlene SP = durchschnittliche Velocity multipliziert mit dem Kapazitätsfaktor. Der Kapazitätsfaktor ergibt sich aus dem Verhältnis der aktuellen Sprint-Kapazität zur durchschnittlichen Kapazität der letzten sechs abgeschlossenen Sprints. Wenn das Team im nächsten Sprint also weniger verfügbare Stunden hat als im Schnitt, fällt die Empfehlung entsprechend tiefer aus. Falls keine historischen Kapazitätsdaten vorliegen, greift das System auf die durchschnittliche Velocity zurück. Die Empfehlung wird direkt auf der Kapazitätsplanungsseite angezeigt, zusammen mit der aktuellen und der historischen Kapazität (siehe Abbildung 3).

### 4.4 Sprint Analytics und Reporting

Das Analytics-Modul hat vier Ansichten.

Die Overview zeigt die Kennzahlen des aktuellen Sprints (Story Points, Completion Rate, verbleibende Tage) und ein Burndown-Chart (siehe Abbildung 4). Das Chart vergleicht die ideale Abarbeitungslinie mit dem tatsächlichen Verlauf, der aus den Abschlusszeitpunkten der einzelnen Stories berechnet wird.

Unter Compare lässt sich die aktuelle Sprint-Velocity dem vorherigen Sprint gegenüberstellen und mit Langzeit-Benchmarks vergleichen (Durchschnitt und Bestwert aller abgeschlossenen Sprints). So sieht man, ob sich die Teamleistung verbessert, verschlechtert oder gleichbleibt.

Changes zeigt, welche Stories während eines Sprints zum Scope hinzugekommen sind. In unserer Erfahrung sind solche Scope-Änderungen einer der häufigsten Gründe, warum Sprint-Ziele nicht erreicht werden.

Team Performance zeigt Velocity und Completion Rate pro Person als Balkendiagramm. Die Ansicht ist nicht für individuelle Leistungsbewertung gedacht, sondern dafür, Überlastung oder ungleiche Verteilung zu erkennen.

Die Sprint History zeigt die Velocity über alle abgeschlossenen Sprints als Balkendiagramm. Damit lassen sich zukünftige Sprints datenbasiert schätzen.

### 4.5 Sicherheit und Zugriffskontrolle

Die Authentifizierung läuft über Microsoft Entra ID [Microsoft2026b] mit MSAL [Microsoft2025]. Im Frontend wird der in RFC 6749 [Hardt2012] beschriebene OAuth 2.0 Authorization Code Flow verwendet, im Backend werden die JWT-Tokens validiert. Als Fallback gibt es eine lokale JWT-basierte Authentifizierung.

Die Autorisierung arbeitet auf zwei Ebenen. Global gibt es die Rollen Admin und Member. Auf Projektebene steuert die ProjectUser-Tabelle den Zugriff mit drei Rollen: Admin, Member und Viewer. Admins können Projekte und Benutzer verwalten, Viewer haben nur Lesezugriff.

Die Applikation ist als Single-Tenant-Lösung konzipiert, also eine Instanz pro Organisation. Als Sicherheitsbaseline kommen Helmet für HTTP-Security-Headers (u.a. Content Security Policy, X-Frame-Options, HSTS) sowie eine restriktive CORS-Konfiguration zum Einsatz. Für den produktiven Rollout ist eine zusätzliche Härtung vorgesehen — insbesondere CSRF-Schutz über Token-Validierung, Rate Limiting auf API-Ebene und dedizierte Input-Sanitisierung. Diese Erweiterungen orientieren sich an den OWASP Top 10 [OWASP2021] und sind als nächster Schritt nach dem Go-Live priorisiert.

### 4.6 Retrospektiven

Als Nebenfunktion bietet Sprintify ein einfaches Retrospektiven-Modul. Pro Sprint können die Teammitglieder festhalten, was gut lief (Went Well), was verbessert werden soll (Needs Improvement) und welche konkreten Action Items daraus folgen. Die Retrospective ist über einen Unique Constraint genau einem Sprint zugeordnet, sodass historisch nachvollziehbar bleibt, welche Verbesserungen wann beschlossen wurden. Das Modul ist bewusst schlank gehalten — es soll nicht spezialisierte Retrospektiven-Tools ersetzen, sondern eine Basis-Dokumentation an der Stelle anbieten, an der das Team ohnehin die Sprint-Daten anschaut.

## 5 Empfehlung und Schlussfolgerung

### 5.1 Empfehlung

Ich empfehle, Sprintify in der Abteilung Public Cloud Solutions produktiv einzusetzen. Die Applikation erfüllt die definierten Anforderungen und das Team kann damit Sprints datenbasiert planen.

Für den laufenden Betrieb empfehle ich drei Massnahmen: Erstens, die produktive Jira-Anbindung über einen schreibgeschützten Service-Account laufen lassen, damit keine persönlichen Zugangsdaten hinterlegt werden müssen. Zweitens, die automatisierten Tests ausbauen, um die Wartbarkeit zu sichern. Drittens, die Sicherheitsbaseline um CSRF-Token-Validierung, Rate Limiting und erweiterte Input-Sanitisierung ergänzen, bevor die Applikation produktiv geht.

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

Eine zweite Erkenntnis betrifft den KI-Einsatz: Generative KI beschleunigt einen erfahrenen Entwickler erheblich, ersetzt Fachkompetenz aber nicht. Wer Vorschläge unkritisch übernimmt, baut sich Inkonsistenzen, Sicherheitslücken oder Halluzinationen in den Code. Genau deshalb war für mich die manuelle Reviewphase nach jedem KI-Output entscheidend. Eine ausführlichere Reflexion dazu findet sich in Anhang E.

## Quellenverzeichnis

[Atlassian2025a]
Atlassian: Jira Cloud REST API (v2). API-Dokumentation.
https://developer.atlassian.com/cloud/jira/platform/rest/v2/ , 18.10.2025/14:15

[Atlassian2025b]
Atlassian: Jira Software Cloud Agile REST API. API-Dokumentation.
https://developer.atlassian.com/cloud/jira/software/rest/ , 18.10.2025/14:40

[Atlassian2026]
Atlassian: Jira Software Cloud — Plans & Pricing.
https://www.atlassian.com/software/jira/pricing , 14.05.2026/11:20

[Cohn2005]
Cohn, Mike: Agile Estimating and Planning. Prentice Hall PTR, Upper Saddle River 2005. ISBN 978-0-13-147941-8.

[Express2025]
OpenJS Foundation: Express.js — Fast, unopinionated, minimalist web framework for Node.js.
https://expressjs.com/ , 22.09.2025/16:20

[Forecast2026]
Forecast: Resource & Project Management Software.
https://www.forecast.app/ , 14.05.2026/12:05

[Hardt2012]
Hardt, Dick (Hrsg.): The OAuth 2.0 Authorization Framework. RFC 6749, IETF, Oktober 2012.
https://datatracker.ietf.org/doc/html/rfc6749 , 14.05.2026/13:40

[Microsoft2025]
Microsoft: Microsoft Authentication Library (MSAL) Overview. Dokumentation.
https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview , 03.11.2025/10:45

[Microsoft2026a]
Microsoft: Azure App Service overview.
https://learn.microsoft.com/en-us/azure/app-service/overview , 14.05.2026/14:10

[Microsoft2026b]
Microsoft: What is Microsoft Entra ID?
https://learn.microsoft.com/en-us/entra/fundamentals/whatis , 14.05.2026/14:25

[NodeJS2026]
OpenJS Foundation: About Node.js.
https://nodejs.org/en/about , 14.05.2026/15:10

[OpenID2014]
Sakimura, Nat; Bradley, John; Jones, Michael; de Medeiros, Breno; Mortimore, Chuck: OpenID Connect Core 1.0 incorporating errata set 1. OpenID Foundation, November 2014.
https://openid.net/specs/openid-connect-core-1_0.html , 14.05.2026/13:55

[OWASP2021]
OWASP Foundation: OWASP Top 10:2021. Open Worldwide Application Security Project.
https://owasp.org/Top10/ , 14.05.2026/15:35

[PostgreSQL2026]
PostgreSQL Global Development Group: PostgreSQL: About.
https://www.postgresql.org/about/ , 14.05.2026/15:25

[React2025]
Meta Platforms: React — A JavaScript library for building user interfaces.
https://react.dev/ , 22.09.2025/16:50

[Schwaber2020]
Schwaber, Ken; Sutherland, Jeff: The Scrum Guide. The Definitive Guide to Scrum: The Rules of the Game. November 2020.
https://scrumguides.org/scrum-guide.html , 12.09.2025/09:30

[Sequelize2025]
Sequelize: Sequelize ORM — Feature-rich ORM for Node.js.
https://sequelize.org/ , 22.09.2025/17:10

[Sutherland2014]
Sutherland, Jeff: Scrum: The Art of Doing Twice the Work in Half the Time. Crown Business, New York 2014. ISBN 978-0-385-34645-0.

[Tempo2026]
Tempo Software: Tempo Timesheets — Time Tracking for Jira.
https://marketplace.atlassian.com/apps/6572/tempo-timesheets , 14.05.2026/11:45

## Anhänge

- **Anhang A:** Theorie- und Methodenreflexion
- **Anhang B:** Wirtschaftlichkeit
- **Anhang C:** Visierter Antrag zur Diplomarbeit *(vom Auftraggeber und Studiengangleiter unterschrieben — separat beiliegend)*
- **Anhang D:** Technische Dokumentation (Architektur, Datenmodell, API-Übersicht)
- **Anhang E:** KI-Chat-Protokoll und Reflexion
- **Anhang F:** Vollständiges KI-Chat-Protokoll (Prompts und Antworten aus Claude-Code-Sessions)

---

## Selbstständigkeitserklärung

Ich erkläre hiermit, dass ich die Ergebnisse der Diplomarbeit selbständig und eigenhändig erstellt habe. Zudem bezeuge ich, dass die eingereichte Diplomarbeit nicht bereits für eine andere Prüfung eingesetzt wurde.

Ort, Datum: _______________________________

Vorname Name: _______________________________

Unterschrift: _______________________________
