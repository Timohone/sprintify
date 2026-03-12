# Anhang B: Wirtschaftlichkeit

## 1. Entwicklungskosten

Die Entwicklung von Sprintify erstreckte sich über 12 Monate Projektlaufzeit mit geschätzt 450 Stunden Eigenleistung neben dem regulären Arbeitspensum. Der gesamte Technology Stack basiert auf Open-Source-Technologien: VS Code als Editor, Node.js und Express.js als Backend-Framework, React für das Frontend, PostgreSQL als Datenbank und Git für die Versionskontrolle. Lizenzkosten für Entwicklungstools fielen keine an.

Externe Dienstleister wurden nicht beigezogen. Sämtliche eingesetzten npm-Pakete stehen unter permissiven Open-Source-Lizenzen (MIT, Apache 2.0) und verursachen keine laufenden Lizenzkosten. Die Jira-Anbindung nutzt die REST API von Atlassian, die im bestehenden Jira-Cloud-Abonnement der Netcloud AG enthalten ist.

Da die Entwicklung im Rahmen dieser Diplomarbeit erfolgte, fallen die Personalkosten nicht als zusätzliche Projektkosten an. Bei einer hypothetischen Vollkostenrechnung mit einem internen Stundensatz von CHF 120 läge der Entwicklungsaufwand bei CHF 54'000 — ein Betrag, der bei einer Eigenentwicklung ausserhalb einer Diplomarbeit gegen kommerzielle Alternativen abgewogen werden müsste.

## 2. Laufende Betriebskosten

Sprintify wird auf der bestehenden Azure-Infrastruktur der Netcloud AG betrieben. Die monatlichen Kosten setzen sich wie folgt zusammen:

| Position | Monatlich (CHF) | Jährlich (CHF) |
|---|---|---|
| Azure App Service (B1) | 15–30 | 180–360 |
| Azure Database for PostgreSQL (Flexible Server, Burstable B1ms) | 20–40 | 240–480 |
| Microsoft Entra ID | 0 (in M365-Lizenz enthalten) | 0 |
| Domain/SSL | 0 (Azure managed) | 0 |
| **Gesamt** | **35–70** | **420–840** |

Die Bandbreite ergibt sich aus der nutzungsabhängigen Abrechnung von Azure. Der realistische Mittelwert liegt bei ca. CHF 630 pro Jahr.

**Vergleich mit kommerziellen Alternativen:**

- **Tempo Timesheets:** ca. CHF 10/User/Monat. Bei 8 Teammitgliedern ergibt das CHF 960/Jahr — und deckt nur Zeiterfassung ab, keine Kapazitätsplanung.
- **Jira Advanced Roadmaps:** Teil von Jira Premium, ca. CHF 16/User/Monat. Bei 8 Nutzern sind das CHF 1'536/Jahr.
- **Sprintify:** ca. CHF 630/Jahr (Mittelwert), deckt Kapazitätsplanung und Sprint Analytics ab.

## 3. Nutzen

### Quantifizierbarer Nutzen

**Sprint-Planung vorher (mit Excel):**

- Kapazitätsdaten sammeln: ca. 15 Minuten pro Person pro Sprint
- Excel aktualisieren und konsolidieren: ca. 30 Minuten (Scrum Master)
- Bei 8 Personen und 26 Sprints pro Jahr: ca. 80–100 Stunden Gesamtaufwand jährlich

**Sprint-Planung mit Sprintify:**

- Kapazitätsdaten eingeben: ca. 5 Minuten pro Person (direkt im Tool)
- Konsolidierung: automatisch
- Geschätzte Zeitersparnis: 50–70 Stunden pro Jahr

**Weniger verfehlte Sprint-Ziele:**

Durch die datenbasierte Story-Point-Empfehlung auf Basis historischer Velocity-Daten entfällt ein Grossteil der Schätzung nach Bauchgefühl. Konservativ geschätzt spart das 1–2 Stunden Re-Planung pro Sprint, also 26–52 Stunden pro Jahr.

### Qualitativer Nutzen

- **Transparenz:** Jedes Teammitglied sieht die aktuelle Kapazitätsverteilung im Team.
- **Datenbasierte Argumentation** gegenüber Stakeholdern. Statt Schätzungen lassen sich konkrete Velocity-Trends der letzten 6 Sprints heranziehen.
- **Historische Daten** als Grundlage für kontinuierliche Verbesserung in Sprint Retrospectives.
- **Weniger Abhängigkeit von Einzelpersonen.** Das Planungswissen liegt im Tool, nicht im Kopf des Scrum Masters.

## 4. Kosten-Nutzen-Verhältnis

| Position | Betrag (CHF/Jahr) |
|---|---|
| Betriebskosten | ~630 |
| Zeitersparnis (80–120h × CHF 120 interner Stundensatz) | 9'600–14'400 |
| **Netto-Nutzen** | **~9'000–13'800** |

Der ROI ist bereits im ersten Betriebsjahr positiv. Die Entwicklungskosten sind als Diplomarbeit abgedeckt und belasten das Projektbudget nicht. Selbst bei konservativer Schätzung übersteigt der jährliche Nutzen die Betriebskosten um den Faktor 15–20.

## 5. Fazit

Die laufenden Kosten von Sprintify sind tiefer als jede kommerzielle Alternative und amortisieren sich durch die Zeitersparnis bei der Sprint-Planung innerhalb weniger Wochen. Der grösste Nutzen liegt nicht in direkten Kosteneinsparungen, sondern in der verbesserten Planungsqualität und der damit verbundenen Reduktion von verfehlten Sprint-Zielen.
