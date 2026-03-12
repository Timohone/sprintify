# Anhang D: Technische Dokumentation

## 1. Systemarchitektur

```mermaid
graph TB
    subgraph Client["Frontend (Browser)"]
        SPA["React 18 SPA<br/>TypeScript, Vite, Tailwind CSS"]
    end

    subgraph Azure["Azure Cloud"]
        subgraph Backend["Backend (Node.js)"]
            Express["Express.js Server"]
            MW["Middleware Stack<br/>JWT Auth, CSRF, Rate Limiting,<br/>Input Sanitization"]
            Routes["Route-Module<br/>auth, projects, sprints,<br/>userStories, capacityPlans,<br/>users, jira, statistics,<br/>retrospectives, export"]
            Services["Services<br/>JiraService, JiraSyncService,<br/>SyncScheduler"]
        end
        DB[("PostgreSQL<br/>Sequelize ORM")]
        Scheduler["SyncScheduler<br/>node-cron<br/>*/15 * * * *"]
    end

    subgraph External["Externe Systeme"]
        EntraID["Microsoft Entra ID<br/>OAuth 2.0 / OIDC"]
        Jira["Jira Cloud<br/>REST API v2<br/>Agile API v1.0"]
    end

    SPA -->|"HTTPS / REST"| Express
    Express --> MW --> Routes
    Routes --> Services
    Routes --> DB
    Services --> DB
    Services -->|"Basic Auth"| Jira
    SPA -->|"MSAL.js"| EntraID
    Express -->|"Token-Validierung"| EntraID
    Scheduler -->|"alle 15 Min"| Services
```

Die Applikation folgt einer klassischen Three-Tier-Architektur. Das Frontend ist eine statische React-SPA, die auf Azure App Service gehostet wird und per REST-API mit dem Express.js-Backend kommuniziert. Die Authentifizierung erfolgt via Microsoft Entra ID (MSAL.js im Frontend, JWT-Validierung im Backend). Die Jira-Integration nutzt Basic Auth mit API-Tokens pro Projekt, was eine Multi-Projekt-Konfiguration mit unterschiedlichen Jira-Instanzen ermöglicht.

## 2. Datenmodell

```mermaid
erDiagram
    User ||--o{ ProjectUser : "hat"
    User ||--o{ CapacityPlan : "hat"
    User ||--o{ UserStory : "ist zugewiesen"
    Project ||--o{ ProjectUser : "hat"
    Project ||--o{ Sprint : "hat"
    Project ||--o{ UserStory : "hat"
    Project ||--o{ Retrospective : "hat"
    Sprint ||--o{ UserStory : "enthält"
    Sprint ||--o{ CapacityPlan : "hat"
    Sprint ||--|| Retrospective : "hat"

    User {
        uuid id PK
        string email UK
        string firstName
        string lastName
        string entraId UK
        enum role "admin | member"
        boolean isActive
        date lastLogin
        string jiraAccountId
        string jiraDisplayName
    }

    Project {
        uuid id PK
        string name
        string jiraProjectKey
        string jiraBoardId
        string jiraServerUrl
        string jiraUsername
        string jiraApiToken
        jsonb jiraConfig
        jsonb config
        boolean isActive
    }

    ProjectUser {
        uuid id PK
        uuid projectId FK
        uuid userId FK
        enum role "admin | member | viewer"
    }

    Sprint {
        uuid id PK
        string name
        uuid projectId FK
        date startDate
        date endDate
        text goal
        enum status "planning | active | completed"
        float velocityTarget
        float actualVelocity
        jsonb burndownData
        string jiraSprintId
        string state
        date completeDate
    }

    UserStory {
        uuid id PK
        string title
        text description
        float storyPoints
        enum priority "Low | Medium | High | Critical"
        enum status "To Do | In Progress | Done"
        uuid assigneeId FK
        uuid sprintId FK
        uuid projectId FK
        string jiraKey
        string jiraId
        string epicKey
        string storyType
        date sprintAssignedAt
    }

    CapacityPlan {
        uuid id PK
        uuid userId FK
        uuid sprintId FK
        float availableHours
        float allocatedHours
        jsonb weeklyCapacity
        jsonb availabilityDays
    }

    Retrospective {
        uuid id PK
        uuid sprintId FK "UK"
        uuid projectId FK
        text wentWell
        text needsImprovement
        jsonb actionItems
    }
```

Die zentrale Beziehung ist die Many-to-Many-Verknüpfung zwischen User und Project über die Zwischentabelle ProjectUser, die eine projektspezifische Rollenzuweisung (admin, member, viewer) ermöglicht. User Stories gehören sowohl zu einem Project als auch optional zu einem Sprint, wodurch ein Backlog ohne Sprint-Zuordnung abgebildet werden kann. Jede Retrospective ist über einen Unique Constraint genau einem Sprint zugeordnet.

## 3. API-Endpunkte

| Modul | Methode | Pfad | Beschreibung |
|-------|---------|------|--------------|
| Auth | GET | `/api/auth/me` | Aktuellen User aus JWT-Token lesen |
| Projects | GET | `/api/projects` | Alle aktiven Projekte mit Mitgliedern |
| Projects | GET | `/api/projects/:id` | Einzelnes Projekt mit Mitgliedern |
| Projects | POST | `/api/projects` | Neues Projekt anlegen (Admin) |
| Projects | PUT | `/api/projects/:id` | Projekt aktualisieren (Admin) |
| Projects | POST | `/api/projects/:id/members` | Mitglied zu Projekt hinzufügen (Admin) |
| Projects | DELETE | `/api/projects/:id/members/:userId` | Mitglied aus Projekt entfernen (Admin) |
| Sprints | GET | `/api/sprints` | Sprints auflisten (Filter: projectId) |
| Sprints | GET | `/api/sprints/:id` | Sprint mit Stories und Capacity Plans |
| Sprints | POST | `/api/sprints` | Neuen Sprint anlegen |
| Sprints | PUT | `/api/sprints/:id` | Sprint aktualisieren |
| User Stories | GET | `/api/user-stories` | Stories auflisten (Filter: sprintId, projectId) |
| User Stories | GET | `/api/user-stories/:id` | Einzelne User Story mit Assignee |
| User Stories | PUT | `/api/user-stories/:id` | User Story aktualisieren |
| Capacity Plans | GET | `/api/capacity-plans` | Capacity Plans auflisten (Filter: sprintId, userId); erstellt automatisch Plans für alle Projektmitglieder |
| Capacity Plans | POST | `/api/capacity-plans` | Capacity Plan anlegen oder aktualisieren (Upsert) |
| Capacity Plans | PUT | `/api/capacity-plans/:id` | Capacity Plan aktualisieren |
| Capacity Plans | DELETE | `/api/capacity-plans/:id` | Capacity Plan löschen |
| Users | GET | `/api/users` | Alle User auflisten |
| Users | GET | `/api/users/:id` | Einzelnen User lesen |
| Users | PATCH | `/api/users/:id` | User-Rolle oder Status ändern (Admin) |
| Users | DELETE | `/api/users/:id` | User löschen inkl. Abhängigkeiten (Admin) |
| Jira | POST | `/api/jira/test-connection/:projectId` | Jira-Verbindung testen (Admin) |
| Jira | POST | `/api/jira/sync/:projectId` | Selektiver Sync: Users, Sprints, Issues (Admin) |
| Jira | POST | `/api/jira/full-sync/:projectId` | Vollständiger Sync aller Daten (Admin) |
| Jira | GET | `/api/jira/sync-status` | Status des SyncSchedulers (Admin) |
| Retrospectives | GET | `/api/retrospectives` | Retrospective für Sprint laden (Query: sprintId) |
| Retrospectives | POST | `/api/retrospectives` | Neue Retrospective anlegen |
| Retrospectives | PATCH | `/api/retrospectives/:id` | Retrospective aktualisieren |
| Statistics | GET | `/api/statistics/sprint/:sprintId` | Sprint-Statistiken (Stories, Capacity, Status/Priority Breakdown) |
| Statistics | GET | `/api/statistics/project/:projectId/velocity` | Velocity-Chart der letzten 20 abgeschlossenen Sprints |
| Statistics | GET | `/api/statistics/project/:projectId/dashboard` | Dashboard-Kennzahlen (Sprints, Stories, Completion Rate) |
| Statistics | GET | `/api/statistics/sprint/:sprintId/team-performance` | Team-Performance pro Mitglied |
| Statistics | GET | `/api/statistics/sprint/:sprintId/burndown` | Burndown-Chart (ideal + actual) |
| Statistics | GET | `/api/statistics/sprint/:sprintId/comparison` | Sprint-Vergleich mit Vorgänger und Benchmarks |
| Statistics | GET | `/api/statistics/project/:projectId/forecast` | Velocity-Forecast mit Capacity-Faktor |
| Export | GET | `/api/export/sprint/:sprintId/report` | Sprint-Report als JSON |

## 4. Frontend-Seitenstruktur

| Pfad | Komponente | Beschreibung |
|------|-----------|--------------|
| `/` | Dashboard | Projektübersicht mit KPIs, Velocity-Trend und Story-Fortschritt |
| `/sprint` | SprintView | Aktiver Sprint mit Story-Liste, Status-Board und Sprint-Statistiken |
| `/history` | SprintHistory | Chronologische Übersicht aller abgeschlossenen Sprints |
| `/analytics` | SprintAnalytics | Sprint-Vergleich, Burndown-Chart und Forecast |
| `/capacity` | CapacityPlanning | Wochenweise Kapazitätsplanung pro Teammitglied |
| `/team` | TeamMembers | Teamverwaltung mit Rollen und Jira-Zuordnung |
| `/projects` | Projects | Projektverwaltung (Erstellen, Konfigurieren, Mitglieder) |
| `/retro` | Retrospectives | Sprint-Retrospektive (Went Well, Needs Improvement, Action Items) |
| `/projects/:id/settings` | ProjectSettings | Jira-Konfiguration, Sync-Einstellungen, Projektdetails |

Die Authentifizierung wird über MSAL.js gesteuert: nicht authentifizierte User sehen ausschliesslich die Login-Seite (`LoginPage`), die einen Redirect zu Microsoft Entra ID auslöst. Alle anderen Routen sind nur innerhalb des `AuthenticatedTemplate` erreichbar.

## 5. Jira-Synchronisation

```mermaid
flowchart TD
    A["Trigger"] -->|"SyncScheduler (cron */15 * * * *)<br/>oder manueller API-Call"| B["Aktive Projekte laden"]
    B --> C{"Projekt hat<br/>Jira-Config?"}
    C -->|Nein| Z["Übersprungen"]
    C -->|Ja| D["Verbindung testen<br/>GET /rest/api/2/serverInfo"]
    D -->|Fehlgeschlagen| Z2["Fehler loggen"]
    D -->|OK| E["Users importieren<br/>GET /rest/api/3/user/assignable/search<br/>Fallback: API v2, dann Project Roles"]
    E --> F["Boards abrufen<br/>GET /rest/agile/1.0/board"]
    F --> G["Sprints pro Board laden<br/>GET /rest/agile/1.0/board/{boardId}/sprint"]
    G --> H["Sprints in DB speichern<br/>findOrCreate mit jiraSprintId"]
    H --> I{"Sprints mit<br/>jiraSprintId<br/>vorhanden?"}
    I -->|Ja| J["Sprints chronologisch sortieren<br/>ORDER BY startDate ASC"]
    I -->|Nein| K["Alle Issues via JQL laden<br/>GET /rest/api/2/search"]
    J --> L["Pro Sprint: Issues laden<br/>GET /rest/agile/1.0/sprint/{sprintId}/issue"]
    L --> M["Story Points auslesen<br/>Custom Field (default: customfield_10016)<br/>konfigurierbar via jiraConfig.storyPointsField"]
    K --> M
    M --> N["Status-Mapping<br/>done/closed/resolved -> Done<br/>in progress/review/testing -> In Progress<br/>Alles andere -> To Do"]
    N --> O["User-Matching<br/>1. jiraAccountId<br/>2. Email-Adresse"]
    O --> P["Datenbank-Update<br/>findOrCreate / update<br/>mit jiraId als Identifier"]
    P --> Q["lastSync-Timestamp aktualisieren"]
```

Die chronologische Sortierung der Sprints (`ORDER BY startDate ASC`) bei der Issue-Synchronisation ist ein bewusster Design-Entscheid. Wenn eine User Story in Jira mehreren Sprints zugeordnet war (z.B. durch Sprint-Überläufe), wird sie durch die aufsteigende Verarbeitung dem letzten Sprint zugewiesen, in dem sie auftaucht. Da `importUserStories` den `sprintId` bei jedem Update überschreibt, gewinnt der chronologisch letzte Sprint — was dem aktuellen Zustand in Jira entspricht.

Das Story-Points-Feld ist pro Projekt konfigurierbar (Standard: `customfield_10016`), da Jira-Instanzen unterschiedliche Custom Fields verwenden. Der User-Import nutzt eine dreistufige Fallback-Strategie: zuerst die v3-API, dann v2, und als letzten Ausweg die Project-Roles-API, um maximale Kompatibilität mit unterschiedlichen Jira-Cloud-Konfigurationen zu gewährleisten.
