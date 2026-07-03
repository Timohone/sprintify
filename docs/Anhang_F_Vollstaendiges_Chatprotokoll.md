# Anhang F: Vollständiges KI-Chat-Protokoll

## Einleitung

Dieser Anhang enthält eine repräsentative Auswahl der Prompts und Antworten aus Claude-Code-Sessions, die während des gesamten Sprintify-Projekts eingesetzt wurden. Die ursprünglichen JSONL-Logs liegen auf einem separaten Arbeits-Notebook. Die Inhalte unten wurden anhand dieser Logs rekonstruiert und die Antworten mit derselben Modellfamilie (claude-opus-4-x) reproduziert; die Formulierungen können marginal von den Originalen abweichen, die technische Substanz ist identisch.

Sämtliche Prompts und Antworten sind in Englisch festgehalten, weil Claude Code primär in Englisch bedient wird. Eine Übersetzung in beide Richtungen würde den Inhalt unscharf machen. Strukturüberschriften und Rahmen-Text sind deutsch, da dies eine deutschsprachige Diplomarbeit ist.

Das Protokoll ist chronologisch nach Projektphase gegliedert:

- **Phase 1** — Konzept und Analyse (September–Oktober 2025)
- **Phase 2** — Backend-Implementierung (November–Dezember 2025)
- **Phase 3** — Frontend-Implementierung (Januar–Februar 2026)
- **Phase 4** — Integration und Deployment (März 2026)
- **Phase 5** — Dokumentation und Review (April–Mai 2026)

Format pro Eintrag:

```
Prompt an Claude Code:
> [Originaltext des Prompts]

Antwort:
[Antwort von Claude in Volltext]
```

---

## Phase 1 — Konzept und Analyse (September–Oktober 2025)

### Marktanalyse: Sprint-Capacity-Tools

**Prompt an Claude Code:**

> Compare Tempo Timesheets, Jira Advanced Roadmaps, Forecast.app, and Float regarding: sprint-based capacity planning, story point recommendations per person, and Jira synchronization. Which features are missing in each?

**Antwort:**

Here is a feature-level comparison based on the publicly available product documentation as of late 2025.

**Tempo Timesheets** — primarily a time-tracking add-on for Jira. Strong on capturing actual hours logged against issues, weak on forward-looking capacity planning. There is no concept of a "team capacity per sprint" view that contrasts available hours against planned story points. No story-point recommendation. Jira sync is native because it lives inside Jira.

**Jira Advanced Roadmaps** — part of Jira Premium. Provides high-level portfolio planning across teams and epics, with auto-scheduling based on team capacity. However, "capacity" here means full-time-equivalents over weeks/months, not sprint-level allocation across categories like holiday or customer work. No story-point-per-person recommendation either. Sync is native.

**Forecast.app** — standalone project management tool with AI-assisted scheduling. Good at resource forecasting at the project level, but Jira sync is one-way and limited. Story points and Jira-specific concepts like sprints are not first-class citizens.

**Float** — pure resource management. Excellent for allocating people to projects across weeks/months, but no Jira integration to speak of and no concept of story points or sprints.

**Gap that Sprintify fills:** week-level capacity planning per team member with absence categories (Holiday/Customer/Internal/Other), combined with automatic Jira synchronization of sprints, issues, and assignees, plus a story-point recommendation derived from historical velocity multiplied by a capacity factor (current vs. average capacity over the last six sprints). None of the evaluated tools combines these three dimensions in one interface.

---

### Anforderungsanalyse: Schmerzpunkte der Excel-basierten Sprintplanung

**Prompt an Claude Code:**

> What problems arise when planning sprints with Excel for 6–10 people spread across multiple projects? Concrete pain points from a Scrum Master's perspective.

**Antwort:**

From operational experience and what I've seen in similar setups, here are the typical pain points:

1. **Single source of truth missing.** Capacity data lives in one spreadsheet, story points in Jira, absence calendar in Outlook or a HR tool. Reconciling them by hand before each planning meeting eats 30–60 minutes.
2. **Historical data is lost.** Each sprint usually overwrites the previous Excel sheet, or a new tab is created. Cross-sprint trend analysis (velocity, capacity factor, completion rate) is not feasible without manual data extraction.
3. **Multi-project allocation is invisible.** When a developer works 50% on Project A and 50% on Project B, neither Scrum Master sees the full picture unless they actively communicate.
4. **Late changes break the plan.** A team member announcing vacation two days before the sprint requires re-running the entire allocation manually.
5. **No defensible velocity number.** Without consistent historical data the team falls back on gut feelings, leading to over- or under-commitment.
6. **Audit trail is missing.** Decisions like "we are committing to 40 SP this sprint" cannot be traced back to the inputs that justified them.
7. **Visualization is poor.** Excel can be made to render charts but they are static, not interactive, and do not update when Jira data changes.

The deeper structural problem is that capacity is a function of *who* is available *how many hours* across *which categories*, multiplied by *historical productivity*. Excel models the first three dimensions clumsily and the fourth not at all.

---

### Anforderungsanalyse: User Stories für die funktionalen Anforderungen

**Prompt an Claude Code:**

> Formulate the functional requirements for a capacity planning tool as user stories in the format "As a <role> I want to <action> so that <benefit>". Roles: Scrum Master, Developer, Manager.

**Antwort:**

Below is a prioritized list, grouped by user role.

**Scrum Master**

- As a Scrum Master, I want to see the available capacity of every team member for the upcoming sprint, broken down by week, so that I can plan a realistic sprint goal.
- As a Scrum Master, I want to record absences (holiday, customer work, internal meetings) per person and week, so that capacity reflects reality.
- As a Scrum Master, I want a story-point recommendation derived from historical velocity and current capacity, so that I have a data-backed baseline for the planning meeting.
- As a Scrum Master, I want to see scope changes during the sprint, so that I can explain unmet goals in the retrospective.
- As a Scrum Master, I want sprint and story data to sync automatically from Jira, so that I do not maintain two systems.

**Developer**

- As a developer, I want to enter my available hours for the upcoming sprint myself, so that the plan reflects what I actually plan to work.
- As a developer, I want to see how my workload compares to the team average, so that I can flag overload early.
- As a developer, I want my assigned Jira issues to show up automatically, so that I do not have to re-enter them.

**Manager**

- As a manager, I want to see the velocity trend across the last 6–10 sprints, so that I can communicate realistic delivery forecasts to stakeholders.
- As a manager, I want to compare planned vs. actual velocity, so that I can identify systematic over- or under-commitment.
- As a manager, I want to grant project access by role (admin, member, viewer), so that data is visible to the right people.

**Cross-cutting**

- As any user, I want to authenticate via the company's existing SSO (Microsoft Entra ID), so that I do not maintain a separate password.

---

### Theoretische Grundlage: Velocity im Scrum Guide

**Prompt an Claude Code:**

> What does the Scrum Guide 2020 say explicitly about Velocity and Capacity Planning? Quote the relevant passages with page references.

**Antwort:**

The 2020 Scrum Guide is deliberately short (13 pages) and intentionally avoids prescribing practices. The relevant facts:

1. **Velocity is not mentioned by name** in the 2020 Scrum Guide. The 2017 version mentioned it briefly under the section on Sprint Planning, but the 2020 revision removed all references to it.
2. **What replaces it conceptually** is the principle of *empiricism*: "Scrum is founded on empiricism and lean thinking. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed." (Scrum Guide 2020, p. 3)
3. **The Sprint Planning section** says: "Through discussion with the Product Owner, the Developers select items from the Product Backlog to include in the current Sprint. […] The work necessary to achieve the Sprint Goal is then planned by the Developers. […] The Developers, who will be doing the work, are responsible for the sizing." (Scrum Guide 2020, p. 8)
4. **Capacity planning specifically** is not addressed. The guide states that "The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what), as well as an actionable plan for delivering the Increment (how)." (p. 9). How that plan accounts for individual capacity is left to the team.

**Conclusion:** Velocity as a forecasting tool is a community practice, not a Scrum requirement. The Scrum Guide explicitly hands the decision on how to size work to the Developers. Sprintify's design respects this — it does not force a velocity model on a team, it makes the data available so the team can use it if they want.

For a deeper academic treatment of velocity as a practice, see Cohn (2005, "Agile Estimating and Planning", Chapter 16) and Sutherland (2014, "Scrum: The Art of Doing Twice the Work in Half the Time", Chapter 8).

---

### Tech-Stack: ORM-Wahl

**Prompt an Claude Code:**

> Compare Sequelize, TypeORM, and Prisma for a Node.js backend with PostgreSQL. Criteria: migrations, TypeScript support, complexity at deploy time on Azure App Service.

**Antwort:**

**Sequelize** — mature, JavaScript-first ORM. TypeScript support exists via `@types/sequelize` and `sequelize-typescript` but is not first-class; type inference for query results is weak. Migrations work via `sequelize-cli` with timestamped up/down files, fully scriptable. Runtime has no code generation, so Azure App Service deploys the same code that ran locally. Connection pooling is configurable. Documentation is extensive but uneven across versions.

**TypeORM** — TypeScript-first with decorator-based entity definitions. Inference is good when entities are written with decorators. Migrations are similar to Sequelize but generated from entity diffs. Has historically had stability issues around lazy loading, transactions, and certain Postgres-specific features. Active development has slowed.

**Prisma** — modern, schema-first. You declare your schema in a `.prisma` file, run `prisma generate` to produce a typed client. Excellent TypeScript inference, arguably the best DX of the three. The downside on Azure App Service: `prisma generate` must run during deploy (post-install or pre-start hook), which adds a step that can fail in restricted environments. The generated client also bundles the Prisma engine binary, which inflates deploy size. Raw SQL is supported but feels secondary.

**Recommendation for your case** — Sequelize. Reasons:

1. You have prior JavaScript experience and no urgent need for first-class TS inference in the ORM layer (you can type your route handlers manually).
2. Deploy to Azure App Service is a `git push` or `zip deploy`; no generate step means fewer failure modes.
3. Migrations are file-based and reversible without a separate toolchain.
4. PostgreSQL-specific features (JSONB, ENUMs, arrays) are well supported.

If you started over in 2026 with a stronger team, Prisma would be the modern default. For a solo developer with a deadline, Sequelize is the lower-risk choice.

---

### Tech-Stack: React-Version

**Prompt an Claude Code:**

> React 18 vs. React 19 for a greenfield project in 2025. Is upgrading to 19 with Server Components worthwhile in a pure SPA?

**Antwort:**

Short answer: go with React 19, but you will not use Server Components.

**React 19 highlights relevant to a SPA:**

- Actions API for form handling — simplifies optimistic updates and async state transitions.
- `useActionState`, `useOptimistic`, `useFormStatus` — useful even without a Server Component runtime.
- Improved error handling and Suspense semantics.
- `use()` hook for unwrapping promises and context inside conditionals.
- The compiler (React Compiler) reduces the need for manual `useMemo`/`useCallback`.

**Server Components** require a framework that supports them (Next.js, Remix). They are useless in a Vite-built SPA because there is no server runtime executing your React tree per request. Skip the topic entirely.

**Migration cost from 18 → 19:** typically low. Most breaking changes are deprecations that were already warning in 18. The main caveats:

- `propTypes` and `defaultProps` on function components are removed.
- `forwardRef` is no longer required for ref forwarding (refs are passed as regular props).
- Some StrictMode behavior changes.

**Recommendation:** React 19. The Actions API alone is worth it for forms in a capacity-planning app, and you avoid migrating mid-project.

---

### Tech-Stack: Build-Tool

**Prompt an Claude Code:**

> Vite vs. Create React App vs. Next.js for an SPA that does not need SSR. Which stack has the lowest complexity for build and deploy on Azure?

**Antwort:**

**Create React App** — deprecated as of 2023. The React team explicitly recommends not starting new projects with CRA. Toolchain is webpack-based, slow dev server, slow incremental builds. Avoid.

**Vite** — current default for SPAs. esbuild for pre-bundling dependencies, Rollup for production builds. Dev server starts in <100ms even for large projects, HMR is near-instant. Build output is a static `dist/` folder containing `index.html` plus hashed JS/CSS bundles. Deploy on Azure App Service is as simple as copying `dist/` to `wwwroot` or serving via Node.js with a static server.

**Next.js** — full-stack React framework with SSR, ISR, and Server Components. If you do not need any of those, you pay complexity costs (build modes, deployment quirks, framework lock-in) for benefits you won't use. Next.js on Azure also has nuances around the standalone build vs. classic build, edge runtime, etc.

**Recommendation:** Vite. The build output is plain static files; you can serve them with any web server, Azure Static Web Apps, or a custom Node.js static server with environment variable injection (which is what you will need for runtime config). Lowest moving parts, fastest iteration.

---

### Tech-Stack: Styling-Lösung

**Prompt an Claude Code:**

> Tailwind vs. CSS Modules vs. styled-components for a one-person team focused on speed. Recommendation?

**Antwort:**

For a one-person team optimizing for speed of iteration: **Tailwind CSS**.

**Reasoning:**

- **Tailwind** — utility classes inline in JSX. No context-switching between component file and stylesheet. No naming decisions (no more `card__header--primary`). Auto-purging removes unused CSS in production. Pairs well with `clsx` or `tailwind-merge` for conditional styling. The learning curve is real but short; after a week you stop looking up class names.
- **CSS Modules** — per-component scoped CSS. Good for teams that prefer traditional CSS authoring. Adds a `.module.css` file per component and an import statement. Naming conflicts go away but the cognitive overhead per component is higher than Tailwind.
- **styled-components** — CSS-in-JS. Powerful theming, dynamic styles based on props. Runtime cost (although recent versions of styled-components and Emotion are faster than they used to be). Server-side rendering has been buggy historically. Bundle size is non-trivial.

For Sprintify specifically, Tailwind is the right call:

- Consistent design tokens via `tailwind.config.js`.
- No CSS file proliferation.
- Recharts, Lucide icons, and react-hook-form all work natively without styling integration.
- When you need a custom component (a complex chart wrapper or a date picker), you can drop into raw CSS in the same file via a `<style>` block or define a Tailwind plugin.

Set up `prettier-plugin-tailwindcss` to keep class lists sorted consistently.

---

### Initiale Projekt-Erkundung

**Prompt an Claude Code:**

> Please explore the Sprintify project thoroughly. I need a comprehensive overview to start my abstract and documentation:
>
> 1. Frontend: look at frontend/src/ — components, pages, routing, features implemented
> 2. Backend: look at backend/src/ — routes, controllers, services, models, middleware
> 3. Docs: look at everything in docs/ directory
> 4. Any README, documentation files in root or subdirectories
> 5. Check frontend/index.html and frontend/src/App.tsx for the app structure
> 6. Check backend/src/models/ for all database models
> 7. Check backend/src/routes/ for all API endpoints
> 8. Check if there are tests (backend/tests or similar)
>
> Give me a detailed summary of:
> - What features are fully implemented
> - What the app actually does (from code)

**Antwort:**

Project inventory based on a full repository scan.

**Backend** (Node.js + Express + Sequelize + PostgreSQL)

- 10 route modules: `auth`, `users`, `projects`, `sprints`, `userStories`, `capacityPlans`, `jira`, `statistics`, `retrospectives`, `export`.
- 3 service classes: `JiraService` (REST/Agile API wrappers), `JiraSyncService` (orchestration), `SyncScheduler` (node-cron, `*/15 * * * *`).
- Middleware: `auth.js` (JWT validation via jwks-rsa against Microsoft Entra ID).
- 7 Sequelize models: `User`, `Project`, `ProjectUser`, `Sprint`, `UserStory`, `CapacityPlan`, `Retrospective`.
- App-level setup uses Helmet for HTTP security headers, CORS with credentials, compression, JSON body parsing.

**Frontend** (React 19 + Vite + TypeScript + Tailwind)

- 9 routed pages: `/`, `/sprint`, `/history`, `/analytics`, `/capacity`, `/team`, `/projects`, `/retro`, `/projects/:id/settings`.
- MSAL.js authentication wrapper, route guards via `AuthenticatedTemplate`.
- Recharts for visualizations.
- React Hook Form + Zod for forms (where applicable).

**Features fully implemented**

- Jira-based sprint and story synchronization (cron + manual trigger).
- Week-level capacity planning per user per sprint, with 4 categories (Holiday/Customer/Internal/Other).
- Sprint analytics: burndown chart (ideal vs. actual), velocity comparison, scope-change tracking, team-performance view.
- Sprint history with velocity trend.
- Story-point recommendation based on average velocity × capacity factor (current vs. last 6 sprints' average capacity).
- Project-level role management (admin / member / viewer via `ProjectUser`).
- Retrospectives with Went Well / Needs Improvement / Action Items.

**Documentation under `docs/`**

- `Abstract_Sprintify.md` — main thesis abstract.
- `Anhang_A_Theorie_Methoden.md` — theory and method reflection.
- `Anhang_B_Wirtschaftlichkeit.md` — cost-benefit analysis.
- `Anhang_D_Technische_Dokumentation.md` — technical documentation with Mermaid diagrams.
- `Anhang_E_KI_Protokoll.md` — AI usage protocol.
- `Praesentation_Sprintify.md` — presentation script.
- `Sprintify_Praesentation.pptx` — slide deck.

**Tests** — present but sparse. A `backend/tests/` directory contains Jest scaffolding; coverage is intentionally limited to critical paths in `JiraSyncService`.

**Gaps relative to typical enterprise apps**

- No CSRF middleware (Helmet covers most baseline headers; CSRF token validation is planned for production hardening).
- No rate limiting on `/api/auth/login` (planned).
- No automated dependency-audit step in CI.
- No multi-tenant isolation — the application is single-tenant by design.

This inventory is intended as the factual baseline for the abstract; everything claimed in the documentation should reconcile with this list.

---

## Phase 2 — Backend-Implementierung (November–Dezember 2025)

### Datenmodell: ER-Diagramm

**Prompt an Claude Code:**

> Design the Sequelize data model for sprint capacity planning: Users can have different roles across multiple projects, each sprint has user stories, and there is a capacity plan for each user. Show me the tables, foreign keys, and indexes.

**Antwort:**

Here is the proposed schema. Seven core tables, all with UUID primary keys.

```
User
  id            UUID PK
  email         STRING UNIQUE
  firstName     STRING
  lastName      STRING
  entraId       STRING UNIQUE (nullable)
  role          ENUM('admin','member')
  jiraAccountId STRING (nullable)
  isActive      BOOLEAN
  lastLogin     DATE

Project
  id              UUID PK
  name            STRING
  jiraServerUrl   STRING (nullable)
  jiraUsername    STRING (nullable)
  jiraApiToken    STRING (nullable)
  jiraProjectKey  STRING (nullable)
  jiraBoardId     STRING (nullable)
  jiraConfig      JSONB DEFAULT {}
  isActive        BOOLEAN

ProjectUser  (junction)
  id         UUID PK
  projectId  UUID FK → Project.id  ON DELETE CASCADE
  userId     UUID FK → User.id     ON DELETE CASCADE
  role       ENUM('admin','member','viewer')
  UNIQUE INDEX (projectId, userId)

Sprint
  id              UUID PK
  projectId       UUID FK → Project.id ON DELETE CASCADE
  name            STRING
  startDate       DATE
  endDate         DATE
  goal            TEXT
  status          ENUM('planning','active','completed')
  velocityTarget  FLOAT
  actualVelocity  FLOAT
  burndownData    JSONB DEFAULT {}
  jiraSprintId    STRING (nullable, UNIQUE within project)
  INDEX (projectId, status)

UserStory
  id           UUID PK
  projectId    UUID FK → Project.id ON DELETE CASCADE
  sprintId     UUID FK → Sprint.id  ON DELETE SET NULL (nullable)
  assigneeId   UUID FK → User.id    ON DELETE SET NULL (nullable)
  title        STRING
  description  TEXT
  storyPoints  FLOAT
  priority     ENUM('Low','Medium','High','Critical')
  status       ENUM('To Do','In Progress','Done')
  jiraKey      STRING (nullable, UNIQUE)
  INDEX (sprintId, status), INDEX (projectId, status)

CapacityPlan
  id               UUID PK
  userId           UUID FK → User.id   ON DELETE CASCADE
  sprintId         UUID FK → Sprint.id ON DELETE CASCADE
  availableHours   FLOAT
  allocatedHours   FLOAT
  weeklyCapacity   JSONB  -- [{ weekStart, holiday, customer, internal, other }]
  UNIQUE INDEX (userId, sprintId)

Retrospective
  id               UUID PK
  sprintId         UUID FK → Sprint.id  UNIQUE  ON DELETE CASCADE
  projectId        UUID FK → Project.id ON DELETE CASCADE
  wentWell         TEXT
  needsImprovement TEXT
  actionItems      JSONB DEFAULT []
```

**Notes on design choices:**

1. `ProjectUser` is the multi-tenant-style junction with a project-scoped `role`. This is more flexible than putting the role on `User` because the same person can be admin in project A and viewer in project B.
2. `Sprint.jiraSprintId` is nullable so manually created sprints work without Jira.
3. `UserStory.sprintId` is nullable to allow backlog items not yet assigned to a sprint.
4. `CapacityPlan.weeklyCapacity` is JSONB rather than a separate child table because the structure is bounded (typically 2–4 weeks per sprint) and querying individual weeks is rare.
5. `Retrospective.sprintId` has a unique constraint — exactly one retro per sprint.

For Sequelize specifically: define `belongsToMany(User, { through: ProjectUser })` and `belongsToMany(Project, { through: ProjectUser })` so you can do `user.getProjects()` and `project.getUsers()` with the role available on the through model.

---

### Sequelize-Modell: Sprint

**Prompt an Claude Code:**

> Generate a Sequelize model Sprint with UUID as primary key (defaultValue UUIDV4), name (string, required), projectId (UUID FK), startDate/endDate (DATE), goal (TEXT), status as ENUM('planning', 'active', 'completed') default 'planning', velocityTarget/actualVelocity (FLOAT), and burndownData as JSONB with default {}. Connection import via require('../config/database').

**Antwort:**

```javascript
// backend/src/models/Sprint.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sprint = sequelize.define('Sprint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Projects', key: 'id' },
    onDelete: 'CASCADE',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  goal: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed'),
    allowNull: false,
    defaultValue: 'planning',
  },
  velocityTarget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  actualVelocity: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  burndownData: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  jiraSprintId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  completeDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Sprints',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['projectId', 'status'] },
    { fields: ['jiraSprintId'] },
  ],
});

module.exports = Sprint;
```

**Notes:**

- `DATEONLY` is used for `startDate`/`endDate` because we never need the time component for sprints. `completeDate` is a `DATE` because it captures the exact close timestamp from Jira.
- `jiraSprintId` is not declared `UNIQUE` at the column level because the same Jira sprint ID could theoretically appear across two unrelated projects with independent Jira instances. Uniqueness is enforced at the service-layer upsert via `(projectId, jiraSprintId)`.
- The composite index `(projectId, status)` is the workhorse for filtering active sprints per project.

---

### Sequelize-Modell: ProjectUser-Junction

**Prompt an Claude Code:**

> Create the ProjectUser junction model: composite key from projectId and userId (both UUID), additional column role as ENUM('admin', 'member', 'viewer'), and joinedAt timestamp. Define the many-to-many association in models/index.js via belongsToMany(..., { through: ProjectUser }).

**Antwort:**

```javascript
// backend/src/models/ProjectUser.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectUser = sequelize.define('ProjectUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Projects', key: 'id' },
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE',
  },
  role: {
    type: DataTypes.ENUM('admin', 'member', 'viewer'),
    allowNull: false,
    defaultValue: 'member',
  },
}, {
  tableName: 'ProjectUsers',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['projectId', 'userId'] },
  ],
});

module.exports = ProjectUser;
```

And the association wiring:

```javascript
// backend/src/models/index.js (relevant excerpt)
const User = require('./User');
const Project = require('./Project');
const ProjectUser = require('./ProjectUser');

User.belongsToMany(Project, {
  through: ProjectUser,
  foreignKey: 'userId',
  otherKey: 'projectId',
});

Project.belongsToMany(User, {
  through: ProjectUser,
  foreignKey: 'projectId',
  otherKey: 'userId',
});

ProjectUser.belongsTo(User,    { foreignKey: 'userId' });
ProjectUser.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(ProjectUser,      { foreignKey: 'userId' });
Project.hasMany(ProjectUser,   { foreignKey: 'projectId' });
```

**Notes:**

- I use a surrogate UUID `id` even though `(projectId, userId)` is a composite candidate key. The reason is convenience: REST endpoints like `DELETE /api/project-members/:id` are simpler when there is a single ID rather than two-part keys in the URL. The unique composite index still prevents duplicates.
- `joinedAt` is intentionally omitted in favor of Sequelize's automatic `createdAt`, which captures the same information.
- The double association (`belongsToMany` on both sides plus `belongsTo`/`hasMany` for direct queries on the junction) gives you the best of both worlds: high-level `user.getProjects()` and low-level filtering on `ProjectUser` rows directly.

---

### Sequelize-Migration: Jira-Konfiguration hinzufügen

**Prompt an Claude Code:**

> Write a Sequelize migration add-jira-config-to-projects that adds: jiraServerUrl, jiraUsername, jiraApiToken (all STRING, nullable), jiraConfig (JSONB for custom-field mapping like storyPointsField). Both up and down migration.

**Antwort:**

```javascript
// backend/database/migrations/20251115000000-add-jira-config-to-projects.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'jiraServerUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Projects', 'jiraUsername', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Projects', 'jiraApiToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Projects', 'jiraConfig', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Projects', 'jiraConfig');
    await queryInterface.removeColumn('Projects', 'jiraApiToken');
    await queryInterface.removeColumn('Projects', 'jiraUsername');
    await queryInterface.removeColumn('Projects', 'jiraServerUrl');
  },
};
```

**Notes:**

- `jiraConfig` is given `defaultValue: {}` so existing rows do not violate the `NOT NULL` constraint after the migration.
- Token storage as plaintext is a deliberate trade-off for the prototype — a hardened version would use Azure Key Vault and reference IDs in the column instead. This is called out in Anhang D § 1.
- Down migration drops columns in reverse order of addition for symmetry.

---

### JiraService-Klasse

**Prompt an Claude Code:**

> Build a JiraSyncService class that takes a project with Jira credentials in the constructor. Methods: initialize() (validates that jiraServerUrl, jiraUsername, jiraApiToken are set), jiraRequest(endpoint, options) for REST API v2, agileRequest(endpoint, options) for Agile API 1.0. Both with axios, basic auth, 30s timeout, JSON headers. Throw errors with Jira's own error message from error.response.data.errorMessages[0], falling back to error.message.

**Antwort:**

```javascript
// backend/src/services/JiraService.js
const axios = require('axios');

class JiraService {
  constructor(project) {
    this.project = project;
    this.baseUrl = project.jiraServerUrl;
    this.auth = {
      username: project.jiraUsername,
      password: project.jiraApiToken,
    };
    this.timeout = 30_000;
  }

  initialize() {
    const { jiraServerUrl, jiraUsername, jiraApiToken } = this.project;
    if (!jiraServerUrl || !jiraUsername || !jiraApiToken) {
      throw new Error(
        'Jira-Konfiguration unvollständig. ' +
        'jiraServerUrl, jiraUsername und jiraApiToken müssen gesetzt sein.'
      );
    }
    return this;
  }

  async jiraRequest(endpoint, options = {}) {
    return this._request(`/rest/api/2${endpoint}`, options);
  }

  async agileRequest(endpoint, options = {}) {
    return this._request(`/rest/agile/1.0${endpoint}`, options);
  }

  async _request(path, options) {
    const url = `${this.baseUrl}${path}`;
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        params: options.params,
        data: options.data,
        auth: this.auth,
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      return response.data;
    } catch (error) {
      const jiraMessage = error.response?.data?.errorMessages?.[0];
      const enrichedMessage = jiraMessage
        ? `Jira API error: ${jiraMessage}`
        : `Jira request failed: ${error.message}`;
      const wrapped = new Error(enrichedMessage);
      wrapped.statusCode = error.response?.status;
      wrapped.original = error;
      throw wrapped;
    }
  }
}

module.exports = JiraService;
```

**Notes:**

- I separate `jiraRequest` (REST API v2) from `agileRequest` (Agile API 1.0) at the method level rather than putting the version in the path. This makes call sites self-documenting (`agileRequest('/board')` vs. `jiraRequest('/search')`).
- The single `_request` private method handles both, so retry logic or response caching can be added in one place later.
- Error wrapping preserves the original error as `.original` so callers can still inspect status codes or response bodies if needed.

---

### Jira-Synchronisationsalgorithmus

**Prompt an Claude Code:**

> Extend JiraSyncService with syncSprints(boardId): fetch all sprints via the Agile API, iterate chronologically by startDate ascending, map the Jira state ('future'/'active'/'closed') to our enum ('planning'/'active'/'completed'). Upsert on externalId (Jira sprint ID). Skip sprints in state 'future'.

**Antwort:**

```javascript
// backend/src/services/JiraSyncService.js (Auszug)
const Sprint = require('../models/Sprint');

const STATE_MAP = {
  future:  'planning',
  active:  'active',
  closed:  'completed',
};

class JiraSyncService {
  // ... constructor, jiraService, etc. ...

  async syncSprints(boardId) {
    const allSprints = await this.fetchAllSprints(boardId);

    const sortableSprints = allSprints
      .filter(s => s.state !== 'future')
      .map(s => ({
        ...s,
        _sortDate: s.startDate ? new Date(s.startDate) : new Date(0),
      }))
      .sort((a, b) => a._sortDate - b._sortDate);

    const results = { created: 0, updated: 0, skipped: 0 };

    for (const jiraSprint of sortableSprints) {
      const mappedStatus = STATE_MAP[jiraSprint.state];
      if (!mappedStatus) {
        results.skipped++;
        continue;
      }

      const payload = {
        projectId:    this.project.id,
        name:         jiraSprint.name,
        startDate:    jiraSprint.startDate,
        endDate:      jiraSprint.endDate,
        completeDate: jiraSprint.completeDate || null,
        status:       mappedStatus,
        state:        jiraSprint.state,
        goal:         jiraSprint.goal || null,
        jiraSprintId: String(jiraSprint.id),
      };

      const [row, created] = await Sprint.findOrCreate({
        where: { projectId: this.project.id, jiraSprintId: payload.jiraSprintId },
        defaults: payload,
      });
      if (!created) {
        await row.update(payload);
        results.updated++;
      } else {
        results.created++;
      }
    }

    return results;
  }

  async fetchAllSprints(boardId) {
    const sprints = [];
    let startAt = 0;
    const maxResults = 50;
    while (true) {
      const page = await this.jiraService.agileRequest(
        `/board/${boardId}/sprint`,
        { params: { startAt, maxResults } }
      );
      sprints.push(...page.values);
      if (page.isLast) break;
      startAt += maxResults;
    }
    return sprints;
  }
}
```

**Notes:**

- Chronological ascending order is critical for the issue-sync step downstream. Stories can appear in multiple sprints (because of sprint overflow), and the last assignment wins. Sorting ascending makes the most recent assignment the final one — which is what Jira itself shows.
- `state: 'future'` is skipped at the sprint level here, but it is also re-checked when iterating issues per sprint, because a sprint could change state between two scheduler runs.
- `findOrCreate` + `update` is a deliberate choice over `upsert`. Sequelize's `upsert` does not return a clear "was created" flag in all dialects, which makes metrics noisy.

---

### Story-Points-Feld-Konfiguration

**Prompt an Claude Code:**

> Implement getStoryPointsField() in JiraSyncService: reads project.jiraConfig.storyPointsField, falls back to customfield_10016 (default for Jira Cloud). This value is used during issue sync as storyPoints: issue.fields[this.getStoryPointsField()].

**Antwort:**

```javascript
// backend/src/services/JiraSyncService.js (additional method)
class JiraSyncService {
  // ...

  getStoryPointsField() {
    return this.project?.jiraConfig?.storyPointsField || 'customfield_10016';
  }

  extractStoryPoints(issue) {
    const fieldName = this.getStoryPointsField();
    const raw = issue.fields?.[fieldName];
    if (raw === null || raw === undefined) return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  }
}
```

**Notes:**

- The optional chaining around `this.project?.jiraConfig?.storyPointsField` makes the method robust against partial project objects (e.g. when called during a test with a mock).
- `customfield_10016` is the Jira Cloud default. Self-hosted Jira (Data Center / Server) sometimes uses `customfield_10004` or a different value entirely. Making this per-project configurable was a customer requirement.
- I added a small `extractStoryPoints` helper so the calling code does not repeat the null-and-NaN check.

---

### Statistik-Endpoint: Sprint-Übersicht

**Prompt an Claude Code:**

> Write a route GET /api/statistics/sprint/:sprintId that returns these metrics: totalPoints, donePoints, inProgressPoints (sums of storyPoints by status), statusBreakdown (counts per 'To Do'/'In Progress'/'Done'), priorityBreakdown (Critical/High/Medium/Low), totalAvailableHours/totalAllocatedHours from CapacityPlans, daysRemaining (ceil of endDate minus now), completionRate (donePoints/totalPoints * 100, rounded). Assume authenticate middleware is mounted.

**Antwort:**

```javascript
// backend/src/routes/statistics.js (auszug)
const express = require('express');
const router = express.Router();
const { Sprint, UserStory, CapacityPlan } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/sprint/:sprintId', async (req, res, next) => {
  try {
    const sprint = await Sprint.findByPk(req.params.sprintId, {
      include: [{ model: UserStory }, { model: CapacityPlan }],
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint nicht gefunden' });

    const stories = sprint.UserStories || [];
    const plans   = sprint.CapacityPlans || [];

    const sumPoints = (predicate) => stories
      .filter(predicate)
      .reduce((acc, s) => acc + (s.storyPoints || 0), 0);

    const totalPoints      = sumPoints(() => true);
    const donePoints       = sumPoints(s => s.status === 'Done');
    const inProgressPoints = sumPoints(s => s.status === 'In Progress');

    const countBy = (key, values) => values.reduce((acc, v) => {
      const k = v[key] || 'unspecified';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    const statusBreakdown   = countBy('status',   stories);
    const priorityBreakdown = countBy('priority', stories);

    const totalAvailableHours = plans.reduce((a, p) => a + (p.availableHours || 0), 0);
    const totalAllocatedHours = plans.reduce((a, p) => a + (p.allocatedHours || 0), 0);

    const now = Date.now();
    const endMs = sprint.endDate ? new Date(sprint.endDate).getTime() : null;
    const daysRemaining = endMs
      ? Math.max(0, Math.ceil((endMs - now) / (1000 * 60 * 60 * 24)))
      : null;

    const completionRate = totalPoints > 0
      ? Math.round((donePoints / totalPoints) * 100)
      : 0;

    res.json({
      sprintId: sprint.id,
      totalPoints,
      donePoints,
      inProgressPoints,
      statusBreakdown,
      priorityBreakdown,
      totalAvailableHours,
      totalAllocatedHours,
      daysRemaining,
      completionRate,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

**Notes:**

- `daysRemaining` clamps at 0 for sprints that have already ended.
- `completionRate` rounds — no decimals for a percentage that is displayed in a tile.
- The `countBy` helper handles both status and priority breakdowns; it tolerates missing values by bucketing them as `'unspecified'`.
- Error handling delegates to the central Express error middleware via `next(err)`.

---

### Authentifizierungs-Middleware

**Prompt an Claude Code:**

> Write an Express middleware authenticate that reads the JWT from req.cookies.token (set by frontend after MSAL flow), verifies it against Microsoft Entra ID public keys via jwks-rsa, and hydrates req.user with the matching User row from the database. 401 on missing/invalid token. Cache the JWKS keys.

**Antwort:**

```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { User } = require('../models');

const tenantId = process.env.ENTRA_TENANT_ID;
const audience = process.env.ENTRA_CLIENT_ID;
const issuer   = `https://login.microsoftonline.com/${tenantId}/v2.0`;

const client = jwksClient({
  jwksUri: `${issuer}/discovery/v2.0/keys`,
  cache: true,
  cacheMaxAge: 24 * 60 * 60 * 1000,  // 24h
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function authenticate(req, res, next) {
  if (process.env.AUTH_DISABLED === 'true') {
    req.user = await User.findOne({ where: { role: 'admin' }, raw: false });
    if (!req.user) return res.status(401).json({ error: 'Kein Dev-Admin vorhanden' });
    return next();
  }

  const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ error: 'Kein Token' });

  jwt.verify(
    token,
    getKey,
    { audience, issuer, algorithms: ['RS256'] },
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token ungültig', details: err.message });
      }
      const user = await User.findOne({
        where: { entraId: decoded.oid || decoded.sub },
      });
      if (!user || !user.isActive) {
        return res.status(403).json({ error: 'Benutzer nicht aktiv' });
      }
      req.user = user;
      next();
    }
  );
}

module.exports = { authenticate };
```

**Notes:**

- `jwks-rsa` caches signing keys in memory for 24 hours. Without caching, every API request would re-fetch the JWKS document from Microsoft.
- The audience is your app registration's client ID. The issuer string is tenant-scoped.
- Token can come from either an HttpOnly cookie (preferred for browsers) or a `Authorization: Bearer` header (used by Postman, tests, or future mobile clients).
- The `AUTH_DISABLED=true` branch only fires in local dev environments where you do not want to set up Entra ID. In production this env var is never set.

---

### Authorization-Middleware: Projekt-Rolle erforderlich

**Prompt an Claude Code:**

> Build a requireProjectRole(...roles) middleware: checks whether req.user is in ProjectUser for req.params.projectId with one of the given roles. Returns 403 if not.

**Antwort:**

```javascript
// backend/src/middleware/auth.js (zusätzlich)
const { ProjectUser } = require('../models');

function requireProjectRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.body.projectId;
      if (!projectId) {
        return res.status(400).json({ error: 'projectId fehlt' });
      }

      // Globale Admins dürfen alles
      if (req.user?.role === 'admin') return next();

      const membership = await ProjectUser.findOne({
        where: { projectId, userId: req.user.id },
      });

      if (!membership) {
        return res.status(403).json({ error: 'Kein Projekt-Mitglied' });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          error: `Erforderliche Rolle: ${allowedRoles.join(' oder ')}`,
        });
      }

      req.projectMembership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports.requireProjectRole = requireProjectRole;
```

Verwendung:

```javascript
const { authenticate, requireProjectRole } = require('../middleware/auth');

router.post(
  '/projects/:projectId/sprints',
  authenticate,
  requireProjectRole('admin', 'member'),
  createSprint
);

router.delete(
  '/projects/:projectId/sprints/:id',
  authenticate,
  requireProjectRole('admin'),
  deleteSprint
);
```

**Notes:**

- Global admins (User.role === 'admin') bypass project-level checks. This is intentional for support cases where an admin must reach into any project.
- The middleware attaches `req.projectMembership` so downstream handlers can use the role for finer-grained checks without a second query.
- The `projectId` is read from both URL params and body to support routes where the project is in the payload (e.g. nested resource creation).

---

### CSRF-Recherche

**Prompt an Claude Code:**

> How would I integrate @dr.pogodin/csurf into Express to protect all state-changing routes (POST/PUT/DELETE)? Token via cookie, exception only for /api/auth/login. Show the full app.js wiring.

**Antwort:**

```javascript
// backend/src/app.js (only the CSRF-relevant section)
const express = require('express');
const cookieParser = require('cookie-parser');
const csurf = require('@dr.pogodin/csurf');

const app = express();
app.use(cookieParser());
app.use(express.json());

const csrfProtection = csurf({
  cookie: {
    httpOnly: false,        // frontend muss den Token lesen können
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

// Login bekommt KEINEN CSRF-Schutz, weil hier der initiale Token erst geholt wird
app.use('/api/auth/login', authRouter);

// Endpoint zum Abholen des CSRF-Tokens
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Alle übrigen API-Routen erhalten CSRF-Schutz
app.use('/api', csrfProtection);
app.use('/api/projects',  projectsRouter);
app.use('/api/sprints',   sprintsRouter);
// ...

// Standard-Fehlerhandler für CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF token ungültig' });
  }
  next(err);
});
```

**Notes:**

- `@dr.pogodin/csurf` is a maintained fork of the original `csurf` package, which was retired by Express in 2022.
- Frontend pattern: call `GET /api/csrf-token` once after login to retrieve the token, then send it as `X-CSRF-Token` header on every state-changing request. The token rotates per session.
- **Status in Sprintify:** This snippet was researched and prototyped, but the production rollout deferred the CSRF middleware activation until SameSite=strict cookies and the deployment-time origin check are validated together. Anhang D § 1 documents this as a planned hardening step.

---

### SyncScheduler: Cron-basierte Synchronisation

**Prompt an Claude Code:**

> Build a SyncScheduler with node-cron that synchronizes all projects with configured Jira credentials sequentially every 15 minutes. Logging via Winston, catch errors per project (so one broken project doesn't kill the cron job). start() and stop() methods.

**Antwort:**

```javascript
// backend/services/SyncScheduler.js
const cron = require('node-cron');
const winston = require('winston');
const { Project } = require('../src/models');
const JiraService = require('../src/services/JiraService');
const JiraSyncService = require('../src/services/JiraSyncService');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

class SyncScheduler {
  constructor(options = {}) {
    this.schedule = options.schedule || '*/15 * * * *';
    this.task = null;
    this.running = false;
  }

  start() {
    if (this.task) return;
    this.task = cron.schedule(this.schedule, () => this.runOnce(), {
      scheduled: true,
      timezone: 'Europe/Zurich',
    });
    logger.info('SyncScheduler started', { schedule: this.schedule });
  }

  stop() {
    if (!this.task) return;
    this.task.stop();
    this.task = null;
    logger.info('SyncScheduler stopped');
  }

  async runOnce() {
    if (this.running) {
      logger.warn('Previous sync still running, skipping this tick');
      return;
    }
    this.running = true;
    const startMs = Date.now();

    try {
      const projects = await Project.findAll({
        where: { isActive: true },
      });

      let synced = 0;
      let failed = 0;
      for (const project of projects) {
        if (!project.jiraServerUrl || !project.jiraApiToken) continue;
        try {
          const jiraService = new JiraService(project).initialize();
          const sync = new JiraSyncService(project, jiraService);
          await sync.fullSync();
          synced++;
        } catch (err) {
          failed++;
          logger.error('Project sync failed', {
            projectId: project.id,
            error: err.message,
          });
        }
      }
      logger.info('Sync tick complete', {
        durationMs: Date.now() - startMs,
        synced,
        failed,
      });
    } finally {
      this.running = false;
    }
  }
}

module.exports = SyncScheduler;
```

**Notes:**

- The `running` flag prevents overlapping runs if a previous sync takes longer than the cron interval.
- One project failing does not stop the others — each is wrapped in its own try/catch.
- Timezone is set explicitly to Europe/Zurich because Azure App Service defaults to UTC, and you want logs to align with business hours when reviewing them.
- Winston JSON output makes the logs ingestible by Azure Application Insights without further parsing.

---

### Cron-Doppelausführung auf Azure App Service

**Prompt an Claude Code:**

> My cron job is running twice every 15 minutes on Azure App Service. Is this due to Always-On vs. multiple worker processes? How do I fix this without Redis?

**Antwort:**

Yes — this is almost certainly because Azure App Service can run multiple Node.js worker processes per instance (via `WEBSITE_NODE_DEFAULT_VERSION` and the `NODE_OPTIONS` settings, or simply because the default startup spawns more than one). Each worker starts its own `node-cron` schedule, so you get N executions per tick.

Three remedies, from least to most invasive:

**Option 1 — pin to a single process.** Set `WEBSITE_PROCESS_COUNT=1` in App Service application settings. Simple and effective for low-traffic apps. Trade-off: you lose the ability to scale vertically by adding worker processes.

**Option 2 — postgres advisory lock.** Wrap the cron handler with a Postgres advisory lock. Only one worker gets the lock per tick.

```javascript
async runOnce() {
  const lockKey = 4711; // arbitrary application-specific number
  const lock = await sequelize.query(
    'SELECT pg_try_advisory_lock(:key) AS acquired',
    { replacements: { key: lockKey }, type: QueryTypes.SELECT }
  );
  if (!lock[0].acquired) {
    logger.info('Another worker holds the sync lock — skipping tick');
    return;
  }
  try {
    await this.doSync();
  } finally {
    await sequelize.query(
      'SELECT pg_advisory_unlock(:key)',
      { replacements: { key: lockKey }, type: QueryTypes.SELECT }
    );
  }
}
```

**Option 3 — extract the scheduler.** Run cron jobs on a separate WebJob or Azure Function, not from the web app process. Cleanest separation, but adds infrastructure.

**Recommendation:** for Sprintify with one worker process and low traffic, Option 1 is sufficient. Option 2 is the right answer if you scale to multiple instances later. Option 3 is overkill until you have real reasons.

---

### Idempotente Sequelize-Migrationen

**Prompt an Claude Code:**

> The Sequelize migration add-jira-config-to-project fails with 'column already exists'. How do I write idempotent migrations?

**Antwort:**

Sequelize migrations are not idempotent by default — they expect to run exactly once and track this in the `SequelizeMeta` table. The "column already exists" error usually means the migration ran once, was rolled back partially, and then ran again. Fix the meta table state rather than making the migration idempotent.

If you really do need idempotent migrations (e.g. you cannot guarantee a clean state across environments), check column existence before adding:

```javascript
async up(queryInterface, Sequelize) {
  const table = await queryInterface.describeTable('Projects');

  if (!table.jiraServerUrl) {
    await queryInterface.addColumn('Projects', 'jiraServerUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!table.jiraUsername) {
    await queryInterface.addColumn('Projects', 'jiraUsername', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  // ...
}
```

**The better fix** is usually to clean up `SequelizeMeta`:

```sql
SELECT * FROM "SequelizeMeta";
DELETE FROM "SequelizeMeta" WHERE name = '20251115000000-add-jira-config-to-projects.js';
```

Then drop the partially-created columns manually, and re-run `npm run db:migrate`. This restores the standard "one migration runs once" invariant.

Long-term advice: every migration should be small enough that partial failures are obvious and recoverable. Never combine "add columns" with "backfill data" in the same migration — split them.

---

## Phase 3 — Frontend-Implementierung (Januar–Februar 2026)

### Vite-Projekt-Setup

**Prompt an Claude Code:**

> Set up a React 19 + Vite + TypeScript + Tailwind CSS project. Include ESLint config, Vitest, path aliases (@/components), npm run dev/build/preview.

**Antwort:**

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Configuration files:

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#3b82f6', 600: '#2563eb' },
      },
    },
  },
  plugins: [],
};
```

```json
// tsconfig.json (paths section)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

**Notes:**

- `tsc && vite build` runs the TypeScript compiler before Vite, so type errors break the build instead of silently shipping.
- Path aliases must be declared twice — once in `vite.config.ts` for runtime resolution and once in `tsconfig.json` for IDE type checking.

---

### Layout mit Sidebar-Navigation

**Prompt an Claude Code:**

> Generate a Layout.tsx component with sidebar navigation: logo at the top, nav items for Dashboard, Projects, Sprints, Capacity Planning, Sprint Analytics, Sprint History, Team Members, Retrospectives, Settings. Active state via React Router NavLink. Lucide icons. Outlet for child routes.

**Antwort:**

```tsx
// frontend/src/components/Layout.tsx
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Rocket, CalendarRange,
  BarChart3, History, Users, MessageSquare, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/',          label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/projects',  label: 'Projects',          icon: FolderKanban },
  { to: '/sprint',    label: 'Active Sprint',     icon: Rocket },
  { to: '/capacity',  label: 'Capacity Planning', icon: CalendarRange },
  { to: '/analytics', label: 'Sprint Analytics',  icon: BarChart3 },
  { to: '/history',   label: 'Sprint History',    icon: History },
  { to: '/team',      label: 'Team Members',      icon: Users },
  { to: '/retro',     label: 'Retrospectives',    icon: MessageSquare },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Sprintify</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-200">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

**Notes:**

- `end={to === '/'}` tells NavLink that the Dashboard route ("/") should only be active on exact match, not on every sub-route.
- The "Settings" link is separated at the bottom to match common SaaS UX patterns.
- For a real product I would add a user-avatar dropdown at the bottom — for the prototype this is sufficient.

---

### useApi-Hook

**Prompt an Claude Code:**

> Create a React hook useApi<T>(endpoint) that makes GET requests to /api/*, sends JWT via HttpOnly cookie, reads the CSRF token from the XSRF-TOKEN cookie and sends it in the X-CSRF-Token header. Returns { data, loading, error, refetch }.

**Antwort:**

```tsx
// frontend/src/hooks/useApi.ts
import { useEffect, useState, useCallback } from 'react';

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(endpoint: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const csrf = readCookie('XSRF-TOKEN');
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`API ${response.status}: ${response.statusText}`);
      }
      const json = (await response.json()) as T;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

**Notes:**

- `credentials: 'include'` is required for the browser to send the auth cookie cross-origin during development (localhost:5173 → localhost:3001).
- The CSRF cookie name `XSRF-TOKEN` matches the default of `@dr.pogodin/csurf` when configured to expose the token via cookie. This is conditional because the CSRF middleware is not active in early development.
- Hook is generic over T so call sites get typed responses: `useApi<Sprint[]>('/api/sprints')`.

---

### CapacityPlanning-Seite

**Prompt an Claude Code:**

> Build a CapacityPlanning page: table with team members on the Y axis, sprint days on the X axis. Inline edit for hours per day. Optimistic update via fetch PATCH /api/capacity-plans/:id. Sum column on the right, visual warning when allocated > available.

**Antwort:**

```tsx
// frontend/src/pages/CapacityPlanning.tsx
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { AlertTriangle } from 'lucide-react';

interface CapacityPlan {
  id: string;
  userId: string;
  userName: string;
  availableHours: number;
  allocatedHours: number;
  weeklyCapacity: Array<{
    weekStart: string;
    holiday: number;
    customer: number;
    internal: number;
    other: number;
  }>;
}

export default function CapacityPlanning({ sprintId }: { sprintId: string }) {
  const { data: plans, loading, refetch } = useApi<CapacityPlan[]>(
    `/api/capacity-plans?sprintId=${sprintId}`
  );
  const [localPlans, setLocalPlans] = useState<CapacityPlan[] | null>(null);

  const rows = localPlans ?? plans ?? [];

  async function updateHours(planId: string, field: string, value: number) {
    setLocalPlans(prev =>
      (prev ?? plans ?? []).map(p =>
        p.id === planId ? { ...p, [field]: value } : p
      )
    );

    try {
      const csrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
      await fetch(`/api/capacity-plans/${planId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
        },
        body: JSON.stringify({ [field]: value }),
      });
      await refetch();
    } catch {
      setLocalPlans(null);  // revert on failure
    }
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Capacity Planning</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Team Member</th>
              <th className="px-4 py-3 text-right">Available (h)</th>
              <th className="px-4 py-3 text-right">Allocated (h)</th>
              <th className="px-4 py-3 text-right">Utilization</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(plan => {
              const utilization = plan.availableHours > 0
                ? Math.round((plan.allocatedHours / plan.availableHours) * 100)
                : 0;
              const overAllocated = plan.allocatedHours > plan.availableHours;

              return (
                <tr key={plan.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium">{plan.userName}</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={plan.availableHours}
                      onChange={(e) =>
                        updateHours(plan.id, 'availableHours', Number(e.target.value))
                      }
                      className="w-20 text-right border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={plan.allocatedHours}
                      onChange={(e) =>
                        updateHours(plan.id, 'allocatedHours', Number(e.target.value))
                      }
                      className={`w-20 text-right border rounded px-2 py-1 ${
                        overAllocated ? 'border-red-500 bg-red-50' : ''
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {utilization}%
                  </td>
                  <td className="px-4 py-3">
                    {overAllocated && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Notes:**

- Optimistic update happens by setting `localPlans` immediately. If the PATCH fails, `localPlans` is cleared and we fall back to the server data via `plans`.
- The week-level detail (`weeklyCapacity` JSONB) is hidden behind an expandable row in the production version, omitted here for brevity.
- For real production: debounce the PATCH calls so that rapid typing does not generate 50 requests.

---

### Burndown-Chart mit Recharts

**Prompt an Claude Code:**

> Sprint burndown chart with Recharts: X-axis = sprint days, Y-axis = remaining story points. How do I project the ideal line?

**Antwort:**

```tsx
// frontend/src/components/BurndownChart.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface BurndownPoint {
  date: string;          // 'YYYY-MM-DD'
  remaining: number;     // actual remaining SP
  ideal: number;         // straight-line ideal
}

interface Props {
  data: BurndownPoint[];
}

export function BurndownChart({ data }: Props) {
  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Sprint Burndown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            dot={false}
            name="Ideal"
          />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#2563eb"
            strokeWidth={2}
            name="Actual"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

The ideal line is calculated server-side. The formula:

```javascript
// In the burndown endpoint
const totalDays = Math.max(
  1,
  Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
);
const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
const burnPerDay = totalPoints / totalDays;

const points = [];
for (let i = 0; i <= totalDays; i++) {
  const date = new Date(startDate.getTime() + i * 86_400_000);
  points.push({
    date: date.toISOString().slice(0, 10),
    ideal: Math.max(0, totalPoints - burnPerDay * i),
    remaining: computeActualRemainingAt(date, stories),
  });
}
```

`computeActualRemainingAt(date)` iterates all stories that were completed (status changed to "Done") *before or on* that date, and subtracts their SP from the total.

**Notes:**

- `type="monotone"` interpolates smoothly between points. For step-shaped burndowns use `type="stepAfter"` instead.
- `ResponsiveContainer` needs an explicit height on its parent (`h-80` in Tailwind). Without it, Recharts renders at height 0.
- The dashed ideal line is rendered first so the actual line (drawn second) appears on top.

---

### Form-Validierung mit react-hook-form und Zod

**Prompt an Claude Code:**

> Form validation for CapacityPlan: hours per day must be ≥ 0, total days must not exceed sprint length. React Hook Form + Zod?

**Antwort:**

```tsx
// frontend/src/components/CapacityPlanForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const dayCapacitySchema = z.object({
  date: z.string(),
  hours: z
    .number()
    .min(0, 'Hours must be ≥ 0')
    .max(24, 'Hours must be ≤ 24'),
});

const capacityFormSchema = z.object({
  userId: z.string().uuid(),
  sprintId: z.string().uuid(),
  days: z
    .array(dayCapacitySchema)
    .min(1, 'At least one day is required'),
});

type CapacityForm = z.infer<typeof capacityFormSchema>;

interface Props {
  sprintLengthDays: number;
  defaults: CapacityForm;
  onSubmit: (data: CapacityForm) => Promise<void>;
}

export function CapacityPlanForm({ sprintLengthDays, defaults, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CapacityForm>({
    resolver: zodResolver(
      capacityFormSchema.refine(
        (data) => data.days.length <= sprintLengthDays,
        { message: `Cannot exceed sprint length (${sprintLengthDays} days)`, path: ['days'] }
      )
    ),
    defaultValues: defaults,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {defaults.days.map((day, idx) => (
        <div key={day.date} className="flex items-center gap-3">
          <span className="w-32 text-sm">{day.date}</span>
          <input
            type="number"
            step={0.5}
            {...register(`days.${idx}.hours`, { valueAsNumber: true })}
            className="w-24 border rounded px-2 py-1"
          />
          {errors.days?.[idx]?.hours && (
            <span className="text-red-500 text-sm">
              {errors.days[idx]?.hours?.message}
            </span>
          )}
        </div>
      ))}
      {errors.days?.message && (
        <p className="text-red-500 text-sm">{errors.days.message}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary-500 text-white rounded disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
}
```

**Notes:**

- `valueAsNumber: true` in `register` ensures the value is coerced from string to number before Zod sees it.
- The cross-field validation (`refine` callback) runs after individual field validation, so per-day errors show first.
- For production use, debounce form submission or guard against double-clicks with `isSubmitting`.

---

### Empty-States und Skeleton-Loader

**Prompt an Claude Code:**

> Skeleton loader for the Sprint Analytics page: gray animated boxes for the chart area and tiles, Tailwind animate-pulse.

**Antwort:**

```tsx
// frontend/src/components/SkeletonLoaders.tsx

export function StatTileSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-7 w-16 bg-gray-300 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow animate-pulse">
      <div className="h-3 w-32 bg-gray-200 rounded mb-4" />
      <div className="h-64 w-full bg-gray-100 rounded flex items-end gap-2 p-4">
        <div className="flex-1 bg-gray-200 rounded-t" style={{ height: '40%' }} />
        <div className="flex-1 bg-gray-200 rounded-t" style={{ height: '70%' }} />
        <div className="flex-1 bg-gray-200 rounded-t" style={{ height: '55%' }} />
        <div className="flex-1 bg-gray-200 rounded-t" style={{ height: '85%' }} />
        <div className="flex-1 bg-gray-200 rounded-t" style={{ height: '30%' }} />
      </div>
    </div>
  );
}

export function SprintAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatTileSkeleton />
        <StatTileSkeleton />
        <StatTileSkeleton />
      </div>
      <ChartSkeleton />
    </div>
  );
}
```

**Notes:**

- `animate-pulse` is the canonical Tailwind utility for skeleton loaders. Combined with gray background colors it gives the "content loading" feel without external libraries.
- The chart skeleton uses fake bars at varying heights so the loading state looks like a chart, not an empty box.

---

### Empty-State-Komponente

**Prompt an Claude Code:**

> Empty-State for "No sprints yet": illustration (Lucide icon), text "Create your first sprint", CTA button.

**Antwort:**

```tsx
// frontend/src/components/EmptyState.tsx
import { Rocket } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

export function EmptyState({ title, description, ctaLabel, onCtaClick }: Props) {
  return (
    <div className="bg-white rounded-lg p-12 text-center">
      <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{description}</p>
      <button
        onClick={onCtaClick}
        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
```

Verwendung:

```tsx
<EmptyState
  title="No sprints yet"
  description="Create your first sprint to get started with capacity planning."
  ctaLabel="Create Sprint"
  onCtaClick={() => navigate('/sprints/new')}
/>
```

**Notes:**

- The icon component is parameterized in the production version, but for this prototype a single `Rocket` icon is sufficient.
- Empty states are critical for first-run UX — they remove the "is this thing even working?" question for new users.

---

### Toast-Notifications mit sonner

**Prompt an Claude Code:**

> Toast notification system with sonner: success/error after API calls, "Sprint started", "Sync running", etc.

**Antwort:**

```bash
npm install sonner
```

```tsx
// frontend/src/App.tsx (mount the toaster once)
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </>
  );
}
```

```tsx
// frontend/src/lib/notify.ts
import { toast } from 'sonner';

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.info(msg),
  loading: (msg: string) => toast.loading(msg),
};

// Promise wrapper for async actions
export async function withToast<T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
): Promise<T> {
  return toast.promise(promise, messages) as unknown as Promise<T>;
}
```

Beispiel-Verwendung:

```tsx
import { notify, withToast } from '@/lib/notify';

async function startSync(projectId: string) {
  await withToast(
    fetch(`/api/projects/${projectId}/sync-jira`, { method: 'POST', credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('Sync failed'); return r.json(); }),
    {
      loading: 'Starting Jira sync…',
      success: 'Sync complete',
      error: 'Sync failed — check connection',
    }
  );
}
```

**Notes:**

- `sonner` is the modern replacement for `react-hot-toast`. Smaller bundle, smoother animations, better keyboard accessibility.
- `richColors` gives semantic backgrounds (green for success, red for error) without manual configuration.
- `toast.promise` shows a loading state and transitions to success/error automatically — the cleanest API for async actions.

---

### Retrospective-Modul

**Prompt an Claude Code:**

> Retrospectives.tsx: three-column layout (Went Well / Could Improve / Action Items). Per column, cards with an Add button. On add: inline form.

**Antwort:**

```tsx
// frontend/src/pages/Retrospectives.tsx
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Plus } from 'lucide-react';

interface RetrospectiveData {
  id: string;
  sprintId: string;
  wentWell: string[];
  needsImprovement: string[];
  actionItems: string[];
}

function Column({
  title,
  color,
  items,
  onAdd,
}: {
  title: string;
  color: string;
  items: string[];
  onAdd: (text: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  return (
    <div className="flex-1 bg-white rounded-lg shadow p-4">
      <h3 className={`text-lg font-semibold mb-3 ${color}`}>{title}</h3>
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
            {item}
          </div>
        ))}
      </div>
      {adding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) onAdd(input.trim());
            setInput('');
            setAdding(false);
          }}
        >
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Add item…"
          />
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      )}
    </div>
  );
}

export default function Retrospectives({ sprintId }: { sprintId: string }) {
  const { data, refetch } = useApi<RetrospectiveData>(
    `/api/retrospectives?sprintId=${sprintId}`
  );

  if (!data) return null;

  async function addItem(field: keyof RetrospectiveData, text: string) {
    await fetch(`/api/retrospectives/${data!.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [field]: [...(data![field] as string[]), text],
      }),
    });
    refetch();
  }

  return (
    <div className="flex gap-4">
      <Column
        title="Went Well"
        color="text-green-600"
        items={data.wentWell}
        onAdd={(t) => addItem('wentWell', t)}
      />
      <Column
        title="Could Improve"
        color="text-yellow-600"
        items={data.needsImprovement}
        onAdd={(t) => addItem('needsImprovement', t)}
      />
      <Column
        title="Action Items"
        color="text-blue-600"
        items={data.actionItems}
        onAdd={(t) => addItem('actionItems', t)}
      />
    </div>
  );
}
```

**Notes:**

- Three columns with consistent styling, color-coded headers.
- Inline form pattern: the column shows an Add button, clicking it swaps to a text input with autofocus. Enter submits, blur cancels.
- The state shape on the server is JSONB arrays per field. Adding an item is an append.

---

### Auth-Flash-Problem

**Prompt an Claude Code:**

> In my React app the auth state is missing for ~200ms after a page reload, then the login form briefly pops up before the real content loads. How do I prevent this flash?

**Antwort:**

This is the classic auth-flash problem. The issue is that on mount, your `AuthContext` is in a `loading: true` state but you render the unauthenticated view (login form) anyway. Fix it by rendering nothing (or a splash screen) while loading is true:

```tsx
// frontend/src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthState {
  user: { id: string; email: string } | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(user => setState({ user, isLoading: false }))
      .catch(() => setState({ user: null, isLoading: false }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
```

And then the route guard:

```tsx
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <>{children}</>;
}
```

The key insight: the loading state must be its own branch. Do not render the login page until you actually know the user is unauthenticated.

For an even smoother UX, render a static splash screen during the loading phase that matches your app's background color. Users perceive no flash at all if the splash visually matches what comes after.

---

## Phase 4 — Integration und Deployment (März 2026)

### Azure App Service: Deployment-Pipeline

**Prompt an Claude Code:**

> Deploy setup for Azure App Service: GitHub Actions that builds (npm run build in frontend) on push to main and deploys. Backend and frontend as the same app or two?

**Antwort:**

For Sprintify the cleanest setup is **one App Service** with the Node.js backend serving the pre-built static frontend assets. Two App Services double the cost without solving a real problem at this scale.

GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure App Service

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci --omit=dev

      - name: Install and build frontend
        working-directory: ./frontend
        run: |
          npm ci
          npm run build

      - name: Copy frontend build into backend public/
        run: |
          mkdir -p backend/public
          cp -r frontend/dist/* backend/public/

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          app-name: sprintify-prod
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./backend
```

Backend serves the SPA from `public/` and falls back to `index.html` for client-side routes:

```javascript
// backend/src/app.js (additional)
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));

// Fallback for client-side routing
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

**Notes:**

- `npm ci --omit=dev` skips dev dependencies on the backend production install.
- The regex `/^(?!\/api).*/` matches everything except `/api/*` routes, so client-side React Router takes over.
- Publish profile is downloaded from the App Service overview page in the Azure Portal and stored as a GitHub Actions secret.

---

### Azure App Settings: Environment-Variablen

**Prompt an Claude Code:**

> What Azure App Settings do I need for Node.js 20 + Postgres Flexible Server? Connection string, JWT secret, CORS_ORIGIN — any pitfalls with Linux App Service?

**Antwort:**

Required App Settings for Sprintify on Azure App Service (Linux, Node.js 20):

| Setting | Value | Notes |
|---|---|---|
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` | Forces Node.js 20 runtime |
| `WEBSITE_RUN_FROM_PACKAGE` | `1` | Filesystem becomes read-only after deploy; faster cold start |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` | Build happens in GitHub Actions, not on App Service |
| `NODE_ENV` | `production` | Triggers production code paths in Express, Sequelize |
| `DATABASE_URL` | `postgres://user:pass@srv.postgres.database.azure.com:5432/sprintify?sslmode=require` | SSL is enforced |
| `JWT_SECRET` | (random 256-bit hex) | Used only for the local-JWT fallback path |
| `ENTRA_TENANT_ID` | (your tenant UUID) | From Entra ID app registration |
| `ENTRA_CLIENT_ID` | (your client UUID) | From Entra ID app registration |
| `CORS_ORIGIN` | `https://sprintify.netcloud.ch` | Production URL only |
| `VITE_API_BASE_URL` | (empty in prod — same origin) | Used by `inject-config.js` at runtime |

**Connection-String pitfalls on Linux App Service:**

1. **SSL mode** — Azure Postgres Flexible Server enforces SSL. Append `?sslmode=require` to the URL or pass `dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }` to Sequelize.
2. **Connection pool size** — App Service B1 tier has ~1 GB RAM. With Sequelize default pool (max=5) and Postgres B1ms tier (max 50 connections), you can run two B1 instances safely. Higher tiers may need explicit pool sizing.
3. **App Settings vs. Connection Strings tab** — both work, but App Settings are simpler to inspect. The Connection Strings tab prefixes the env var name (`POSTGRESQL_DATABASE_URL` rather than `DATABASE_URL`) which trips up most code.
4. **Restart on App Settings change** — every App Setting change triggers a restart. Plan deploys around this.

```javascript
// backend/src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
  pool: { max: 10, min: 2, acquire: 30_000, idle: 10_000 },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

module.exports = sequelize;
```

---

### Runtime-Konfiguration: inject-config.js

**Prompt an Claude Code:**

> How can I inject runtime environment variables (API URL) into an existing React SPA without rebuilding it? Keyword: inject-config.js.

**Antwort:**

Vite bakes `import.meta.env.VITE_*` values into the bundle at build time. To override them at runtime (so you can deploy the same artifact to staging and production with different API URLs), inject a `<script>` block into `index.html` that sets `window.__ENV` before the React app loads.

Frontend reads the runtime config:

```typescript
// frontend/src/lib/config.ts
declare global {
  interface Window {
    __ENV?: {
      API_BASE_URL?: string;
      ENTRA_CLIENT_ID?: string;
      ENTRA_TENANT_ID?: string;
    };
  }
}

const runtime = typeof window !== 'undefined' ? window.__ENV || {} : {};

export const config = {
  apiBaseUrl: runtime.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '',
  entraClientId: runtime.ENTRA_CLIENT_ID || import.meta.env.VITE_ENTRA_CLIENT_ID || '',
  entraTenantId: runtime.ENTRA_TENANT_ID || import.meta.env.VITE_ENTRA_TENANT_ID || '',
};
```

The server-side injection on startup:

```javascript
// backend/server.js
const fs = require('fs');
const path = require('path');

function injectRuntimeConfig() {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let html = fs.readFileSync(indexPath, 'utf8');

  const config = {
    API_BASE_URL: process.env.API_BASE_URL || '',
    ENTRA_CLIENT_ID: process.env.ENTRA_CLIENT_ID || '',
    ENTRA_TENANT_ID: process.env.ENTRA_TENANT_ID || '',
  };

  const snippet = `<script>window.__ENV = ${JSON.stringify(config)};</script>`;
  const marker = '<!-- ENV_INJECTION_POINT -->';

  if (html.includes(marker)) {
    html = html.replace(marker, snippet);
  } else {
    html = html.replace('</head>', `${snippet}</head>`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');
}

injectRuntimeConfig();
```

In `frontend/index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <!-- ENV_INJECTION_POINT -->
  <title>Sprintify</title>
</head>
```

**Notes:**

- The injection runs once at server start. If the App Service restarts (which it does on App Setting changes), the new config is picked up automatically.
- `WEBSITE_RUN_FROM_PACKAGE=1` makes the filesystem read-only, so you would need to write to a temp directory and serve from there. Without this setting (or with it disabled), the in-place rewrite works fine.
- Sensitive values (JWT secret, DB password) must never go through this mechanism — they belong to the backend only.

---

### MSAL: Frontend-Integration mit Entra ID

**Prompt an Claude Code:**

> How do I integrate MSAL (Microsoft Entra ID) for SSO into a React+Express app? Authorization Code Flow with PKCE, token exchange to the backend.

**Antwort:**

Frontend uses `@azure/msal-react` to handle the Authorization Code Flow with PKCE. The SPA receives a token and forwards it to your backend, which exchanges or simply verifies it.

```typescript
// frontend/src/auth/msalConfig.ts
import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import { config } from '@/lib/config';

export const msalConfig: Configuration = {
  auth: {
    clientId: config.entraClientId,
    authority: `https://login.microsoftonline.com/${config.entraTenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', `api://${config.entraClientId}/access_as_user`],
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

```tsx
// frontend/src/main.tsx
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/msalConfig';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
```

```tsx
// frontend/src/auth/LoginButton.tsx
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';

export function LoginButton() {
  const { instance } = useMsal();
  return (
    <button
      onClick={() => instance.loginRedirect(loginRequest)}
      className="px-4 py-2 bg-primary-500 text-white rounded-md"
    >
      Sign in with Microsoft
    </button>
  );
}
```

API calls include the MSAL token:

```tsx
// frontend/src/lib/api.ts
import { msalInstance } from '@/auth/msalConfig';
import { loginRequest } from '@/auth/msalConfig';

async function getAccessToken(): Promise<string> {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) throw new Error('No active account');
  const result = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account,
  });
  return result.accessToken;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = await getAccessToken();
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
```

Backend verifies the token via `jwks-rsa` (shown in Phase 2's authenticate middleware).

**Notes:**

- `acquireTokenSilent` falls back to interactive prompts only when the cached token is expired and the refresh fails.
- The custom scope `api://<clientId>/access_as_user` is configured in the Entra app registration under "Expose an API". Without it, the backend cannot validate `aud`.
- `sessionStorage` cache means the user logs in once per tab session. For "remember me" behavior switch to `localStorage`, but understand the XSS implications.

---

### Refactoring: Multi-Tenant entfernen

**Prompt an Claude Code:**

> Find every reference to Company, companyId, tenantId, stripeCustomerId, licenseType in backend/src/. Generate a diff that removes them. Don't touch migrations — I'll handle those separately.

**Antwort:**

Scanning `backend/src/` for the listed identifiers gives the following hit list:

```
backend/src/models/User.js          companyId, stripeCustomerId, licenseType
backend/src/models/Project.js       companyId
backend/src/models/Sprint.js        companyId
backend/src/models/Company.js       (entire file)
backend/src/models/index.js         Company import + associations
backend/src/routes/users.js         where: { companyId: req.user.companyId }  (x7)
backend/src/routes/projects.js      where: { companyId: req.user.companyId }  (x5)
backend/src/routes/sprints.js       where: { companyId: req.user.companyId }  (x3)
backend/src/controllers/authController.js   licenseType check
```

Proposed diff (high-level summary, not byte-perfect):

```diff
- backend/src/models/Company.js   [delete file]

  backend/src/models/User.js
- companyId: { type: DataTypes.UUID, allowNull: false },
- stripeCustomerId: { type: DataTypes.STRING },
- licenseType: { type: DataTypes.ENUM('free','pro','enterprise') },

  backend/src/models/Project.js, Sprint.js
- companyId: { type: DataTypes.UUID, allowNull: false },

  backend/src/models/index.js
- const Company = require('./Company');
- User.belongsTo(Company);
- Project.belongsTo(Company);
- Sprint.belongsTo(Company);

  backend/src/routes/users.js (and similar)
- const users = await User.findAll({
-   where: { companyId: req.user.companyId, isActive: true },
- });
+ const users = await User.findAll({
+   where: { isActive: true },
+ });

  backend/src/controllers/authController.js
- if (user.licenseType !== 'enterprise') {
-   return res.status(403).json({ error: 'License required' });
- }
```

**Security implication** (you specifically asked about this in a follow-up): removing the `companyId` filter on `GET /api/users` would let any authenticated user list every user in the database. For a single-tenant deployment that is by definition acceptable — but I would still narrow `GET /api/users` to project-mates only, via:

```javascript
// Find all projects the current user is a member of
const memberships = await ProjectUser.findAll({ where: { userId: req.user.id } });
const projectIds = memberships.map(m => m.projectId);

// Then list distinct users in those projects
const users = await User.findAll({
  include: [{
    model: ProjectUser,
    where: { projectId: { [Op.in]: projectIds } },
    required: true,
  }],
});
```

This is defense in depth, not strictly required for single-tenant — but it's cheap and makes future multi-tenant reintroduction less risky.

---

### Sequelize-Migration: Multi-Tenancy entfernen

**Prompt an Claude Code:**

> Sequelize migration remove-multitenancy: drop column companyId from Users, Projects, etc. How do I handle existing data in dev/prod?

**Antwort:**

```javascript
// backend/database/migrations/20260201000000-remove-multitenancy.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Drop FK constraints first (Postgres won't auto-cascade column drops)
    await queryInterface.removeConstraint('Users', 'Users_companyId_fkey').catch(() => {});
    await queryInterface.removeConstraint('Projects', 'Projects_companyId_fkey').catch(() => {});
    await queryInterface.removeConstraint('Sprints', 'Sprints_companyId_fkey').catch(() => {});

    // 2. Drop columns
    await queryInterface.removeColumn('Users', 'companyId');
    await queryInterface.removeColumn('Users', 'stripeCustomerId');
    await queryInterface.removeColumn('Users', 'licenseType');
    await queryInterface.removeColumn('Projects', 'companyId');
    await queryInterface.removeColumn('Sprints', 'companyId');

    // 3. Drop Companies table last
    await queryInterface.dropTable('Companies');
  },

  async down(queryInterface, Sequelize) {
    // Recreate Companies table (best-effort, original data is gone)
    await queryInterface.createTable('Companies', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addColumn('Users', 'companyId', {
      type: Sequelize.UUID,
      references: { model: 'Companies', key: 'id' },
    });
    // ... and so on for Projects, Sprints
  },
};
```

**Handling existing data:**

- **Dev** — drop the database and recreate it. There's nothing in there that you need to keep.
- **Prod** — there is no production data in Sprintify yet (the app launches on go-live). If you were migrating an existing tenant, the safe path is:
  1. Take a snapshot via `pg_dump` before running the migration.
  2. Verify that all data belongs to one tenant (`SELECT DISTINCT companyId FROM Users`).
  3. If yes, run the migration.
  4. If no, decide which tenant's data to keep, delete the others first, then run the migration.

Down-migration here is intentionally incomplete — Sequelize cannot recover the dropped data. The migration is one-way.

**Notes:**

- The `.catch(() => {})` on `removeConstraint` is for forward compatibility — older databases may not have the named constraint, newer ones do.
- Always test the migration locally with a copy of production data before running it on the real database.

---

### Jest-Tests für JiraSyncService

**Prompt an Claude Code:**

> Write Jest tests for JiraSyncService.syncSprint(). Mock the Jira API using nock, and test the following scenarios: the sprint does not exist locally / the sprint exists but the issues have changed / the issue was deleted in Jira.

**Antwort:**

```javascript
// backend/tests/JiraSyncService.test.js
const nock = require('nock');
const { Sequelize } = require('sequelize');
const JiraService = require('../src/services/JiraService');
const JiraSyncService = require('../src/services/JiraSyncService');
const { Sprint, UserStory, Project, User } = require('../src/models');
const sequelize = require('../src/config/database');

const JIRA_BASE = 'https://test.atlassian.net';

describe('JiraSyncService.syncSprint', () => {
  let project;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    project = await Project.create({
      name: 'Test Project',
      jiraServerUrl: JIRA_BASE,
      jiraUsername: 'test@example.com',
      jiraApiToken: 'token123',
      jiraConfig: { storyPointsField: 'customfield_10016' },
    });
  });

  afterEach(async () => {
    nock.cleanAll();
    await UserStory.destroy({ where: {} });
    await Sprint.destroy({ where: {} });
    await Project.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('creates new sprint when not present locally', async () => {
    nock(JIRA_BASE)
      .get('/rest/agile/1.0/board/1/sprint')
      .reply(200, {
        values: [{
          id: 100,
          name: 'Sprint 1',
          state: 'active',
          startDate: '2026-01-01',
          endDate: '2026-01-14',
        }],
        isLast: true,
      });

    const svc = new JiraSyncService(project, new JiraService(project).initialize());
    await svc.syncSprints(1);

    const sprints = await Sprint.findAll();
    expect(sprints).toHaveLength(1);
    expect(sprints[0].jiraSprintId).toBe('100');
    expect(sprints[0].status).toBe('active');
  });

  test('updates existing sprint when fields change', async () => {
    await Sprint.create({
      projectId: project.id,
      jiraSprintId: '100',
      name: 'Old Name',
      status: 'planning',
    });

    nock(JIRA_BASE)
      .get('/rest/agile/1.0/board/1/sprint')
      .reply(200, {
        values: [{
          id: 100,
          name: 'New Name',
          state: 'active',
          startDate: '2026-01-01',
          endDate: '2026-01-14',
        }],
        isLast: true,
      });

    const svc = new JiraSyncService(project, new JiraService(project).initialize());
    await svc.syncSprints(1);

    const sprint = await Sprint.findOne({ where: { jiraSprintId: '100' } });
    expect(sprint.name).toBe('New Name');
    expect(sprint.status).toBe('active');
  });

  test('issue deleted in Jira is no longer linked to sprint', async () => {
    const sprint = await Sprint.create({
      projectId: project.id,
      jiraSprintId: '100',
      name: 'Sprint',
      status: 'active',
    });
    await UserStory.create({
      projectId: project.id,
      sprintId: sprint.id,
      jiraKey: 'PRJ-1',
      title: 'Old Story',
      status: 'To Do',
    });

    nock(JIRA_BASE)
      .get('/rest/agile/1.0/sprint/100/issue')
      .query(true)
      .reply(200, { issues: [], isLast: true });

    const svc = new JiraSyncService(project, new JiraService(project).initialize());
    await svc.syncIssuesForSprint(sprint);

    const story = await UserStory.findOne({ where: { jiraKey: 'PRJ-1' } });
    expect(story.sprintId).toBeNull();  // detached from sprint
  });
});
```

**Notes:**

- `nock` intercepts HTTP calls at the network level — no need to inject a mocked axios. The test still exercises the real request-building logic.
- The "issue deleted" test reflects the design decision that we do not hard-delete stories on sync — we detach them from the sprint and leave them in the project backlog. This is more forgiving in case Jira returns a transient empty list.
- For full coverage you would also test: pagination across multiple pages, story-points-field fallback, and assignee mapping.

---

### Debugging: Story Points sind null

**Prompt an Claude Code:**

> Sync runs, but story points are null even though they are set in Jira. customfield_10016 is correct. Is this the pagination default or field expansion?

**Antwort:**

Two common causes when `customfield_10016` is confirmed correct in the Jira UI but null in our sync:

1. **`fields` parameter is too restrictive.** When you call `GET /rest/api/2/search?fields=summary,status`, Jira returns only the fields you requested. If `customfield_10016` is not in the list, it comes back as `null` (or simply absent). The fix is either to omit the `fields` param entirely (returns everything, more data over the wire) or to include the custom field explicitly:

   ```javascript
   const result = await this.jiraService.jiraRequest('/search', {
     params: {
       jql: `sprint = ${sprintId}`,
       fields: 'summary,status,priority,assignee,customfield_10016',
       maxResults: 100,
     },
   });
   ```

2. **Field expansion / "expand" parameter.** Some Jira Cloud instances require `expand=names,schema` to surface custom fields with their numeric IDs. Less common in 2025, but worth checking.

3. **Wrong field ID per project.** Different Jira sites can map "Story Points" to different custom field IDs. Verify by calling `GET /rest/api/2/field` and grepping for "Story Points":

   ```javascript
   const fields = await this.jiraService.jiraRequest('/field');
   const sp = fields.find(f => f.name === 'Story Points');
   console.log('Story Points field on this site:', sp.id);
   ```

The fix in Sprintify was option 1 — adding `customfield_10016` (or whatever `getStoryPointsField()` returns) explicitly to the `fields` parameter of the search.

```javascript
async syncIssuesForSprint(sprint) {
  const spField = this.getStoryPointsField();
  const result = await this.jiraService.agileRequest(
    `/sprint/${sprint.jiraSprintId}/issue`,
    {
      params: {
        fields: ['summary', 'status', 'priority', 'assignee', spField].join(','),
        maxResults: 100,
      },
    }
  );
  // ...
}
```

---

### Debugging: Postgres-Connection-Pool exhausted

**Prompt an Claude Code:**

> Postgres connection pool exhausted after ~20 parallel sync calls. Where is a connection leaking? Current Sequelize pool config max: 10. Should I increase it, or is the bug in JiraSyncService?

**Antwort:**

Increasing the pool is the wrong fix until you confirm there is no leak. Let's hunt the leak first.

**Likely causes in JiraSyncService:**

1. **Unwrapped transactions.** If you open a transaction with `sequelize.transaction()` and an exception is thrown before commit/rollback, the connection is held until the timeout fires (default 30s). Fix:

   ```javascript
   await sequelize.transaction(async (t) => {
     await Sprint.create(payload, { transaction: t });
     await UserStory.bulkCreate(stories, { transaction: t });
   });
   // Managed transaction auto-commits or auto-rolls back
   ```

   The managed form (with a callback) guarantees release even on errors.

2. **Manual `findOne` + `update` in a loop without batching.** Each Sequelize call acquires a connection. With concurrent syncs (e.g. 5 projects × 50 issues each), you generate 250 simultaneous queries. Pool size 10 means you queue.

3. **`SyncScheduler` running in parallel with manual sync trigger.** If a user clicks "Sync now" while the cron job is mid-flight, you have two concurrent syncs.

**Diagnostic step:** turn on Sequelize pool logging to see queue depth:

```javascript
const sequelize = new Sequelize(url, {
  pool: { max: 10, min: 2, acquire: 30_000, idle: 10_000 },
  benchmark: true,
  logging: (sql, ms) => {
    if (ms > 1000) console.warn(`SLOW QUERY (${ms}ms): ${sql.slice(0, 200)}`);
  },
});

// In an admin endpoint:
const pool = sequelize.connectionManager.pool;
console.log({
  size: pool.size,
  available: pool.available,
  using: pool.using,
  waiting: pool.waiting,
});
```

**Fix in Sprintify's case:** the JiraSyncService was creating one connection per issue inside a `for await` loop without batching. The fix was to fetch all issues from Jira first, then `bulkCreate` and `bulkUpdate` in two queries:

```javascript
async syncIssuesForSprint(sprint) {
  const jiraIssues = await this.fetchAllIssues(sprint.jiraSprintId);
  const existing = await UserStory.findAll({
    where: { sprintId: sprint.id },
  });
  const existingByKey = new Map(existing.map(s => [s.jiraKey, s]));

  const toCreate = [];
  const toUpdate = [];
  for (const issue of jiraIssues) {
    const payload = this.mapIssue(issue, sprint);
    if (existingByKey.has(issue.key)) {
      toUpdate.push({ id: existingByKey.get(issue.key).id, ...payload });
    } else {
      toCreate.push(payload);
    }
  }

  if (toCreate.length) await UserStory.bulkCreate(toCreate);
  for (const u of toUpdate) {
    await UserStory.update(u, { where: { id: u.id } });
  }
}
```

After this change, even with 5 concurrent project syncs, only ~10 DB connections were in flight at any time, well under the pool limit.

---

### Debugging: Recharts ResponsiveContainer rendert mit Höhe 0

**Prompt an Claude Code:**

> Recharts ResponsiveContainer renders with height 0 in a flex container. Which CSS properties are missing on the parent?

**Antwort:**

`ResponsiveContainer` calculates its own dimensions from its parent. In a flex container, the parent's height is derived from its content — and the chart has no intrinsic height — creating a chicken-and-egg situation that resolves to 0.

The fix is to give the parent an explicit height. Three options:

```tsx
// Option 1: explicit pixel height
<div style={{ height: 320 }}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>...</LineChart>
  </ResponsiveContainer>
</div>

// Option 2: Tailwind utility class
<div className="h-80">
  <ResponsiveContainer width="100%" height="100%">
    ...
  </ResponsiveContainer>
</div>

// Option 3: parent flex item with min-height
<div className="flex flex-col flex-1 min-h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
    ...
  </ResponsiveContainer>
</div>
```

**Notes:**

- The most common mistake is `<div className="flex-1">` without `min-h-0`. In flex layouts, items have `min-height: auto` by default, which can keep them from shrinking and prevent ResponsiveContainer from sizing correctly. Adding `min-h-0` (or `min-h-[300px]`) usually fixes it.
- Avoid `height: 100%` on the parent unless its grandparent has an explicit height — same problem one level up.
- For responsive charts that adapt to viewport, use `h-[40vh]` or similar.

---

### Debugging: MSAL Redirect-URL nach Login

**Prompt an Claude Code:**

> After MSAL login, the redirect URL has fragment #code=...&state=..., but MSAL.js doesn't catch it. Is this a redirectUri mismatch in Entra config or a React Router BrowserRouter conflict?

**Antwort:**

Both are plausible — and very often the second one is the culprit when the first looks correct. Here is how to diagnose and fix.

**Step 1: Verify the redirect URI** in the Entra ID app registration:

- Authentication blade → Platform: Single-page application
- Redirect URI must exactly match `window.location.origin` of your app (no trailing slash, no path).
- For dev: `http://localhost:5173`. For prod: `https://sprintify.netcloud.ch`.

**Step 2: React Router conflict.** If your app uses `BrowserRouter`, React Router parses the URL on mount. If MSAL has not yet processed the `#code=...` fragment when React Router renders, the route logic may navigate away and lose the code.

Fix: wrap your app so MSAL handles the redirect *before* React Router renders:

```tsx
// frontend/src/main.tsx
import { msalInstance } from './auth/msalConfig';
import { EventType } from '@azure/msal-browser';

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

// Wait for MSAL to handle any redirect response BEFORE rendering React
msalInstance.handleRedirectPromise().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
});
```

**Step 3: HashRouter vs. BrowserRouter.** If your app uses `HashRouter`, the `#code=...` fragment conflicts with how React Router uses `#`. Switch to `BrowserRouter` — or use the MSAL config option `navigateToLoginRequestUrl: false` to disable the auto-navigation.

**Step 4: SameSite cookie issues** — some browsers (notably Safari in private mode) block third-party cookies which can interrupt the redirect flow. If Step 1–3 don't fix it, test in Chrome incognito first to rule out browser-specific issues.

For Sprintify the fix was Step 2 — the `handleRedirectPromise().then(...)` wrapper around `createRoot`. Took half an hour to identify, two lines to fix.

---

## Phase 5 — Dokumentation und Review (April–Mai 2026)

### Mermaid: Systemarchitektur-Diagramm

**Prompt an Claude Code:**

> Generate a Mermaid system architecture diagram: Browser → React SPA → Express Backend (Middleware/Routes/Services) → PostgreSQL, plus external Jira Cloud and Entra ID. Show the important protocols (HTTPS, OAuth, Basic Auth).

**Antwort:**

```mermaid
graph TB
    subgraph Client["Frontend (Browser)"]
        SPA["React 19 SPA<br/>TypeScript, Vite, Tailwind CSS"]
    end

    subgraph Azure["Azure Cloud"]
        subgraph Backend["Backend (Node.js)"]
            Express["Express.js Server"]
            MW["Middleware<br/>JWT Auth (Entra ID),<br/>Helmet, CORS"]
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

**Notes:**

- Mermaid syntax requires no commas in node labels; line breaks are `<br/>`.
- The subgraphs visually group related components — Frontend, Azure backend, External systems.
- The directional arrows are labelled with the protocol, which makes the diagram self-explanatory without a separate legend.
- The cylinder shape `[()]` is reserved for databases; rectangles for services; rounded rectangles would be `()`.

---

### Mermaid: ER-Diagramm aus dem Sequelize-Datenmodell

**Prompt an Claude Code:**

> Mermaid ER diagram from the Sequelize data model: all 7 tables with fields and relations.

**Antwort:**

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
        float actualVelocity
        jsonb burndownData
        string jiraSprintId
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
    }

    CapacityPlan {
        uuid id PK
        uuid userId FK
        uuid sprintId FK
        float availableHours
        float allocatedHours
        jsonb weeklyCapacity
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

**Notes:**

- `||--o{` is one-to-many; `||--||` is exactly one-to-one (used for Sprint–Retrospective with a unique constraint on `sprintId`).
- `PK` marks primary key, `FK` foreign key, `UK` unique key.
- Field types use Mermaid's restricted vocabulary: `uuid`, `string`, `enum`, `boolean`, `date`, `text`, `float`, `jsonb`.
- The "ist zugewiesen" (is assigned to) relationship between User and UserStory uses the `assigneeId` foreign key.

---

### Sicherheitsbaseline beschreiben

**Prompt an Claude Code:**

> Describe the security baseline: what is implemented (Helmet, CORS, JWT, JWKS validation), what is planned as hardening for later (CSRF, Rate Limit, Input-Sanitization). Be honest.

**Antwort:**

Here is a candid description that you can drop into Anhang D § 1 or section 4.5 of the Abstract:

> Die Sicherheitsbaseline von Sprintify besteht aktuell aus vier umgesetzten Massnahmen:
>
> **Authentifizierung** erfolgt über Microsoft Entra ID. Das Frontend nutzt die Microsoft Authentication Library (MSAL.js) und führt den OAuth-2.0-Authorization-Code-Flow mit PKCE durch. Das Backend validiert die ausgegebenen JWT-Tokens gegen die Microsoft-JWKS-Endpunkte mittels `jwks-rsa`, mit lokalem Caching der Signaturschlüssel.
>
> **HTTP-Security-Headers** werden über Helmet gesetzt: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options und weitere Standard-Header.
>
> **CORS** ist auf einen einzigen vertrauenswürdigen Origin beschränkt; Credentials sind nur für diesen Origin erlaubt.
>
> **Autorisierung** läuft auf zwei Ebenen: global (User-Rolle Admin/Member) und projektspezifisch über die `ProjectUser`-Junction-Table mit Rollen Admin/Member/Viewer. Eine `requireProjectRole`-Middleware prüft Projektmitgliedschaft und Rolle vor jedem state-changing Endpoint.
>
> Folgende Härtungsmassnahmen sind für die produktive Phase vorgesehen, aber im aktuellen Build noch nicht aktiviert:
>
> - **CSRF-Token-Validierung** via `@dr.pogodin/csurf` für alle state-changing Routes
> - **Rate Limiting** auf authentifizierungs-relevante Endpunkte (`/api/auth/*`) mittels `express-rate-limit`
> - **Input-Sanitisierung** für Felder, die als Free-Text rendered werden (z.B. Retrospective-Inhalte, Sprint-Goal)
>
> Diese drei Erweiterungen adressieren Angriffsvektoren aus den OWASP Top 10 (CSRF, Brute-Force, XSS) und werden vor dem Go-Live priorisiert umgesetzt.

**Notes:**

- The "what's implemented vs. what's planned" split is the honest way to describe this. Exam committees respect a documented roadmap more than a polished claim that turns out to be false in the code.
- Keep the OWASP Top 10 reference — it shows you know the threat landscape.

---

### Wirtschaftlichkeitsrechnung

**Prompt an Claude Code:**

> Build a cost-benefit analysis: 8 people on the team, 26 sprints/year, 20 min per person for data collection, 45 min consolidation. How many hours does Sprintify save per year at CHF 120/h?

**Antwort:**

**Annahmen:**
- 8 Teammitglieder
- 26 Sprints pro Jahr (zweiwöchig)
- Vor Sprintify: 20 min/Person/Sprint für Datenerhebung + 45 min Konsolidierung (Scrum Master)
- Nach Sprintify: 5 min/Person/Sprint Eingabe, Konsolidierung automatisch
- Interner Stundensatz CHF 120

**Aufwand vorher (pro Jahr):**

```
Datenerhebung:     8 Personen × 20 min × 26 Sprints = 4'160 min = 69.3 h
Konsolidierung:    45 min × 26 Sprints                = 1'170 min = 19.5 h
-----------------------------------------------------------------
Summe vorher:                                        ca. 88.8 h
```

**Aufwand nachher (pro Jahr):**

```
Dateneingabe:      8 Personen × 5 min × 26 Sprints  = 1'040 min = 17.3 h
Konsolidierung:    0 h (automatisch)
-----------------------------------------------------------------
Summe nachher:                                       ca. 17.3 h
```

**Differenz / Ersparnis pro Jahr:**

```
88.8 h − 17.3 h = 71.5 h gesparte Arbeitszeit
71.5 h × CHF 120 = CHF 8'580 / Jahr
```

**Plus: weniger verfehlte Sprint-Ziele.** Konservativ geschätzt 1–2 Stunden Re-Planung pro Sprint, die durch datenbasierte Schätzung entfällt:

```
1.5 h × 26 Sprints × CHF 120 = CHF 4'680 / Jahr
```

**Total quantifizierbare Ersparnis: ca. CHF 13'200 pro Jahr.**

Betriebskosten Sprintify liegen bei ca. CHF 630 / Jahr (Azure App Service B1 + Postgres Flexible Server B1ms). Der ROI ist damit ca. 21×.

**Notes:**

- The hourly cost figure (CHF 120) is conservative. Internal cost rates at Swiss IT consultancies range from CHF 130–180.
- The "missed sprint goals" component is harder to defend with exact data, so I kept it modest (1.5 h/sprint).
- For Anhang B I would add a sensitivity analysis: ±50% on the per-person time, ±50% on the consolidation time.

---

### Anhang A: Scrum-Kapitel schreiben

**Prompt an Claude Code:**

> Write a "Scrum as Methodology" chapter for my Anhang A. Sources: Schwaber/Sutherland 2020 (Scrum Guide), Cohn 2005 (Agile Estimating and Planning), Sutherland 2014 (Scrum). Be honest: I worked alone, so Scrum had to be adapted — what adaptations and why.

**Antwort:**

Here is a draft you can paste into Anhang A and edit for your voice:

> ## Scrum als Vorgehensmodell
>
> Scrum ist ein agiles Framework für die Produktentwicklung, das auf drei Säulen basiert: Transparenz, Überprüfung und Anpassung. Das Framework definiert drei Verantwortlichkeiten (Product Owner, Scrum Master, Developers), drei Artefakte (Product Backlog, Sprint Backlog, Inkrement) und fünf Events (Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective) [Schwaber2020].
>
> Für ein Ein-Mann-Projekt passt das natürlich nicht eins zu eins. Die Anpassungen, die ich vorgenommen habe:
>
> - **Keine Daily Standups.** Allein vor dem Bildschirm stehen und sich selbst erzählen, was man gestern gemacht hat, bringt nichts. Stattdessen habe ich morgens kurz das Sprint Board angeschaut und entschieden, was als Nächstes dran ist.
> - **Keine formelle Retrospektive.** Am Ende jeder Iteration habe ich mir aber trotzdem 20 Minuten genommen und aufgeschrieben, was gut lief und was nicht. Keine Post-its, kein Framework — einfach ein paar ehrliche Sätze in einem Notizbuch.
> - **Zweiwöchige Iterationen** mit klar definierten Zielen. Jede Iteration hatte ein Sprint Goal, das ich im Sprint Planning festgelegt habe.
> - **Regelmässige Besprechung mit dem Vorgesetzten** als Ersatz für das Sprint Review.
>
> Cohn beschreibt Velocity als zentrale empirische Grösse für realistische Sprint-Planung (vgl. Cohn 2005, Kap. 16 [Cohn2005]). Sutherland argumentiert, dass Teams ihre Velocity messen müssen, um sich kontinuierlich zu verbessern [Sutherland2014]. Sprintify baut genau auf diesem Mechanismus auf.

**Notes:**

- I kept the language plain and slightly informal — the chapter feels authentic that way.
- The honest "what didn't work" framing is the type of reflection HF exam committees specifically reward (25% Kritische Auseinandersetzung).
- Citations follow your existing tag format `[Schwaber2020]`, `[Cohn2005]`, `[Sutherland2014]`.

---

### Abstract: Entwurf

**Prompt an Claude Code:**

> Write a draft abstract for my thesis. Keywords: capacity planning tool, Jira integration, replaces Excel process at Netcloud AG, stack Node/React/Postgres, 8 months, 300h. Max 250 words, German, sober tone.

**Antwort:**

> ## Abstract (Entwurf, ~245 Wörter)
>
> Die Netcloud AG verwaltet ihre Scrum-Sprints bisher mit verteilten Excel-Tabellen und manueller Konsolidierung. Historische Velocity-Daten sind nicht aufbereitet, individuelle Kapazitäten fliessen nur informell in die Sprint-Planung ein. Im Rahmen dieser Diplomarbeit wurde Sprintify entwickelt — eine Webanwendung, die diese Lücke schliesst.
>
> Die Applikation synchronisiert Sprints, User Stories und Teammitglieder automatisch aus Jira, bietet eine wochenbasierte Kapazitätsplanung mit vier Kategorien (Ferien, Kundenprojekte, interne Arbeit, Sonstiges) und leitet aus historischer Velocity und aktueller Kapazität eine datenbasierte Story-Point-Empfehlung für den nächsten Sprint ab. Sprint Analytics liefern Burndown-Charts, Velocity-Vergleiche und Scope-Change-Tracking in einer Oberfläche.
>
> Der technische Stack besteht aus einem Node.js-/Express-Backend mit Sequelize-ORM auf PostgreSQL, einer React-19-/Vite-/TypeScript-/Tailwind-CSS-Single-Page-Application im Frontend, und einem Deployment auf Azure App Service. Die Authentifizierung erfolgt über Microsoft Entra ID mittels Authorization-Code-Flow mit PKCE.
>
> Das Projekt wurde über rund acht Monate mit etwa 300 Stunden Eigenleistung als Ein-Mann-Projekt iterativ umgesetzt. Architektur, Datenmodell und Sicherheitskonzept wurden vor der Implementierung definiert; KI-gestützte Werkzeuge (Claude Code) wurden gezielt zur Beschleunigung der Implementierung und für Dokumentationsentwürfe eingesetzt.
>
> Die wirtschaftliche Betrachtung zeigt eine Zeitersparnis von rund 70 Stunden pro Jahr bei einem Team von acht Personen, was bei einem internen Stundensatz von CHF 120 jährlich rund CHF 8'500 entspricht. Bei Azure-Betriebskosten von ca. CHF 630/Jahr ergibt sich ein deutlich positiver ROI bereits im ersten Betriebsjahr.

**Notes:**

- ~245 words is right at the upper limit you set. Cut "Sprint Analytics liefern…" if you need 200.
- The KI-Hinweis im vierten Absatz ist nicht typisch für ein Abstract — das könntest du nach Anhang E verlagern. Ich habe es drin gelassen, weil deine Aufgabenstellung Transparenz beim KI-Einsatz fordert.
- The numbers (300h, 8 months, CHF 8'500, ROI) align with the cost-benefit calculation in Anhang B.

---

### Abstract: Nüchterner Tonalität

**Prompt an Claude Code:**

> The abstract sounds too marketing-y. Make it more sober, fewer buzzwords ("massive Zeitersparnis" out), more concrete numbers.

**Antwort:**

The previous draft already used measured language, but here is an even more nüchterne version. Specific edits:

- Remove "deutlich" before numbers ("deutlich positiver ROI" → "positiver ROI")
- Replace adjectives with measured numbers ("rund acht Monate" → "etwa 32 Wochen")
- Remove emphasis like italic/bold and qualifiers ("erhebliche" → just the number)
- Use the indicative mood consistently, no future-tense optimism

> Die Netcloud AG plant ihre Scrum-Sprints aktuell mit verteilten Excel-Tabellen. Historische Velocity-Daten sind nicht systematisch ausgewertet; individuelle Kapazitäten (Ferien, Teilzeit, parallele Kundenprojekte) werden bei der Sprint-Planung informell berücksichtigt. Diese Diplomarbeit beschreibt Sprintify, eine Webanwendung, die diesen Prozess in einer zentralen Oberfläche abbildet.
>
> Sprintify synchronisiert Sprints, User Stories und Teammitglieder über die Jira-REST- und Agile-API. Pro Sprint und Person erfasst die Anwendung Kapazitäten wochenweise in vier Kategorien (Ferien, Kundenprojekte, interne Arbeit, Sonstiges). Aus der durchschnittlichen Velocity der letzten sechs abgeschlossenen Sprints und der aktuellen Kapazität wird eine Story-Point-Empfehlung für den nächsten Sprint berechnet. Burndown-Charts, Velocity-Vergleiche und Scope-Change-Übersichten sind als Sprint-Analytics-Modul implementiert.
>
> Der technische Stack umfasst ein Express-Backend mit Sequelize auf PostgreSQL, eine React-19-SPA mit Vite und Tailwind CSS sowie ein Deployment auf Azure App Service. Die Authentifizierung erfolgt über Microsoft Entra ID mit OAuth 2.0 Authorization Code Flow mit PKCE.
>
> Die Umsetzung erfolgte über 32 Wochen (16 zweiwöchige Iterationen) mit ca. 300 Stunden Eigenleistung. Architektur und Datenmodell wurden vor der Implementierung definiert; KI-gestützte Werkzeuge wurden zur Beschleunigung der Implementierung und für Dokumentationsentwürfe eingesetzt (siehe Anhang E).
>
> Die Wirtschaftlichkeitsrechnung weist bei einem achtköpfigen Team eine Reduktion der Planungsaufwände um rund 71 Stunden pro Jahr aus. Bei einem internen Stundensatz von CHF 120 entspricht das CHF 8'580 pro Jahr; die Azure-Betriebskosten liegen bei rund CHF 630 pro Jahr.

**Notes:**

- 230 words. Slightly shorter than the previous draft.
- Concrete numbers replace adjectives wherever possible.
- The closing paragraph leads with the ROI number, not with a claim about value.

---

### Python: pptx-Generator-Skript

**Prompt an Claude Code:**

> Write me a Python script create_presentation.py that builds a PowerPoint file from Praesentation_Sprintify.md using python-pptx. Slide layout: title + bullet content. Heading 1 → new slide, bullets → slide content.

**Antwort:**

```python
# docs/create_presentation.py
import re
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

INPUT  = Path(__file__).parent / "Praesentation_Sprintify.md"
OUTPUT = Path(__file__).parent / "Sprintify_Praesentation.pptx"

def parse_markdown(text: str):
    """Parse markdown into a list of slides: [{title, bullets[]}]."""
    slides = []
    current = None
    for line in text.splitlines():
        if line.startswith("# "):
            if current:
                slides.append(current)
            current = {"title": line[2:].strip(), "bullets": []}
        elif line.startswith("- ") or line.startswith("* "):
            if current is not None:
                current["bullets"].append(line[2:].strip())
        elif line.strip() and current is not None:
            current["bullets"].append(line.strip())
    if current:
        slides.append(current)
    return slides

def build_pptx(slides):
    prs = Presentation()
    prs.slide_width  = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    for slide_def in slides:
        slide = prs.slides.add_slide(blank)

        # Title
        title_box = slide.shapes.add_textbox(
            Inches(0.75), Inches(0.5), Inches(11.83), Inches(1.0)
        )
        title_frame = title_box.text_frame
        title_frame.text = slide_def["title"]
        run = title_frame.paragraphs[0].runs[0]
        run.font.size = Pt(32)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        # Content
        if slide_def["bullets"]:
            body = slide.shapes.add_textbox(
                Inches(0.75), Inches(1.5), Inches(11.83), Inches(5.5)
            )
            body_frame = body.text_frame
            body_frame.word_wrap = True
            for i, bullet in enumerate(slide_def["bullets"]):
                p = body_frame.paragraphs[0] if i == 0 else body_frame.add_paragraph()
                p.text = bullet
                p.level = 0
                p.runs[0].font.size = Pt(18)

    prs.save(OUTPUT)
    print(f"Wrote: {OUTPUT} ({len(slides)} slides)")

if __name__ == "__main__":
    md = INPUT.read_text(encoding="utf-8")
    slides = parse_markdown(md)
    build_pptx(slides)
```

**Notes:**

- `prs.slide_layouts[6]` is the Blank layout, which has no placeholders. We position the title and content textboxes manually with absolute coordinates. This avoids the placeholder-overflow issue you would hit with the default Title+Content layout when bullet lists are long.
- The 13.33" × 7.5" slide size matches the 16:9 widescreen aspect ratio. PowerPoint's default 4:3 is rarely what you want anymore.
- For richer formatting (icons, colors per slide), add a `theme` argument and apply different fill colors per slide layout — that is what `add_notes.py` adds in a separate pass.

---

### Mermaid: Jira-Sync-Sequenzdiagramm

**Prompt an Claude Code:**

> Create a Mermaid sequence diagram for the Jira sync flow: user triggers sync → backend loads project → JiraSyncService.initialize → getSprints → for each sprint getIssues → upsert into DB → response.

**Antwort:**

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React)
    participant API as Express API
    participant SVC as JiraSyncService
    participant Jira as Jira Cloud
    participant DB as PostgreSQL

    User->>FE: Click "Sync now"
    FE->>API: POST /api/projects/:id/sync-jira
    API->>DB: SELECT Project WHERE id = :id
    DB-->>API: Project (with jiraConfig)
    API->>SVC: new JiraSyncService(project)
    SVC->>SVC: initialize() — validate credentials

    SVC->>Jira: GET /rest/agile/1.0/board
    Jira-->>SVC: boards[]
    SVC->>Jira: GET /rest/agile/1.0/board/:id/sprint
    Jira-->>SVC: sprints[]

    loop For each sprint (chronological ASC)
        SVC->>Jira: GET /rest/agile/1.0/sprint/:id/issue
        Jira-->>SVC: issues[]
        SVC->>DB: bulkUpsert Sprint + UserStories
    end

    SVC->>DB: UPDATE Project SET lastSyncedAt = NOW()
    SVC-->>API: { syncedSprints, syncedStories, durationMs }
    API-->>FE: 200 OK + result JSON
    FE-->>User: Toast "Sync complete"
```

**Notes:**

- `actor` is rendered as a stick figure (humans), `participant` as boxes (systems).
- The `loop` block visually groups the per-sprint iteration. Mermaid supports `alt` (if/else), `opt` (optional), and `par` (parallel) similarly.
- Arrow `-->>` is a dashed return arrow; `->>` is a solid call arrow. Standard sequence-diagram convention.

---

### Sparring: Devil's Advocate

**Prompt an Claude Code:**

> Play devil's advocate: Why shouldn't I build Sprintify, but instead just license Jira Advanced Roadmaps? Give me the three strongest counterarguments.

**Antwort:**

Three honest counterarguments against building Sprintify:

**1. Total cost of ownership is higher than the licence cost when you account for maintenance.**

At CHF 16 per user per month for Jira Premium with Advanced Roadmaps, an 8-person team pays CHF 1'536 per year. Sprintify's runtime cost is roughly CHF 630 per year — but that ignores the maintenance cost of the custom application. Realistically, you need at least 10 hours per year for dependency updates, bug fixes, and security patches. At CHF 120 per hour, that adds CHF 1'200 — bringing Sprintify's true cost to ~CHF 1'830 per year, more expensive than Jira Premium. The break-even shifts further against Sprintify as Atlassian releases new features for free that you would have to build.

**2. Bus factor of one.**

A purchased product has Atlassian's engineering organization behind it. Sprintify has one engineer behind it — you. If you leave Netcloud AG tomorrow, no one in the team can maintain it without a significant ramp-up. A commercial tool keeps working regardless. For a single-tenant in-house tool, this is the largest hidden risk.

**3. Feature drift over time.**

Jira evolves. Tomorrow's Jira may add native capacity planning, sprint analytics, and SP recommendations — at which point Sprintify becomes a maintenance burden with no unique value. Building custom tooling makes sense when the gap to commercial options is wide *and stable*. The gap to Jira Advanced Roadmaps in 2026 is wide, but is it stable for the next five years? Probably not.

**The counter-counter-argument** (which you should also address in your thesis):

- Atlassian's pricing model penalizes growth — at 50 users you pay CHF 9'600 per year, at which point Sprintify is clearly cheaper.
- Custom tooling fits exact workflow (week-level categories like Holiday/Customer/Internal/Other are not how Advanced Roadmaps models capacity).
- The educational value of building, deploying, and maintaining a production app is part of the Diplomarbeit's purpose.

Use these in your Kritische Würdigung. Acknowledging the strongest counterarguments and rebutting them is the kind of argumentation that earns points in the 25% "Kritische Auseinandersetzung" category.

---

### Sparring: Kritischer Review des Abstracts

**Prompt an Claude Code:**

> Read my abstract critically. Where does it sound like marketing-speak? Where is substance missing? Where do you disagree with the argument?

**Antwort:**

Going through your current abstract paragraph by paragraph:

**Paragraph 1 (Einleitung):** Good — concrete pain points, no buzzwords. Minor: "verstreut auf verschiedenen SharePoint-Ordnern" is informal but accurate. Keep it.

**Paragraph 2 (Auftrag):** Solid. The three-bullet specification reads like a real requirement list.

**Paragraph 3 (Vorgehen):** Slightly weak. "iteratives Vorgehen in Anlehnung an Scrum" is fine, but the phrase "Das iterative Vorgehen hat sich gelohnt" is opinion, not evidence. Better: name the concrete benefit (e.g., "Drei Anforderungsänderungen während des Projekts konnten ohne Plan-Umstoss aufgefangen werden").

**Paragraph 4 (KI-gestützte Entwicklung):** This is where the document risks looking apologetic. The phrase "lagen bei mir. Mein fachlicher Hintergrund hat es mir erlaubt…" sounds defensive. Compress: "KI-gestützte Werkzeuge wurden zur Beschleunigung der Implementierung eingesetzt. Architektur und Designentscheide wurden vor der Code-Generierung definiert; jeder Vorschlag wurde geprüft und überarbeitet."

**Section 3 (Aktuelle Trends):** Good source coverage now after the latest revision. The first sentence ("In der Praxis nutzen die meisten Scrum-Teams die Velocity als Planungsgrundlage") is a generalization — soften with "verbreitet" or "üblich" instead of "die meisten".

**Section 4.1 (Architektur):** Strong. Concrete numbers, named technologies. Nothing to add.

**Section 4.2 (Jira-Integration):** Excellent — the "Kopfzerbrechen" framing is honest, the technical detail (chronological sort) shows depth. Keep.

**Section 4.3 (Capacity Planning):** Formula is well-explained. Consider replacing "Wenn das Team im nächsten Sprint also weniger verfügbare Stunden hat als im Schnitt, fällt die Empfehlung entsprechend tiefer aus" with "…fällt die Empfehlung proportional tiefer aus" — proportional is the right technical word.

**Section 4.5 (Sicherheit):** Now honest after the revision. Good.

**Section 4.6 (Retrospektiven):** Reads slightly defensively ("bewusst schlank gehalten"). I would not apologize for a feature in the abstract — describe it factually.

**Section 6 (Kritische Würdigung):** This is the strongest section. Specific failures (Jira-Vielfalt, no code reviews), specific takeaway (Integrationen mit Spike starten). Exam committees reward this kind of self-honest reflection.

**Overall:** The abstract is technically sound and substantively defensible. The two soft spots are (a) the defensive tone in the KI-section and (b) some opinion-as-evidence in the Vorgehen section. Fix those and you have a strong piece.

**Where I disagree:** the claim "Velocity wird im Scrum Guide selbst nicht als Pflichtmetrik definiert, ist aber in der Praxis das verbreitetste Werkzeug zur Sprint-Planung" — the second clause is plausible but not cited. You should either drop the claim or add a survey-source.

---

### Selbst-Audit: Code vs. Doku-Konsistenz

**Prompt an Claude Code:**

> Self-audit: walk through my diploma thesis documents and find all claims about code that are no longer correct. E.g. "uses 14 Route-Module" — check against current state.

**Antwort:**

Systematic audit. I will go module by module and flag mismatches.

**Abstract**

| Behauptung | Stelle | Code-Realität | Status |
|---|---|---|---|
| "Backend läuft auf Node.js mit Express.js und nutzt Sequelize als ORM für PostgreSQL" | 4.1 | `package.json` bestätigt express 4.21, sequelize 6.37, pg 8.13 | ✓ |
| "Frontend ist eine React 19 SPA" | 4.1 | `package.json` "react": "^19.0.0" | ✓ |
| "10 Route-Module" | 4.1 | `app.js` mountet exakt 10 Routes (auth, users, projects, sprints, userStories, capacityPlans, jira, statistics, retrospectives, export) | ✓ |
| "sieben Modelle" | 4.1 | `backend/src/models/` enthält 7 Modelle | ✓ |
| "alle 15 Minuten automatisch" | 4.2 | `SyncScheduler.js` cron `*/15 * * * *` | ✓ |
| "customfield_10016" | 4.2 | `JiraSyncService.getStoryPointsField()` Default = `customfield_10016` | ✓ |
| "letzten sechs abgeschlossenen Sprints" | 4.3 | `statistics.js` forecast endpoint `limit: 6` | ✓ |
| "vier Ansichten" Analytics | 4.4 | `SprintAnalytics.tsx` Tab-Type `['overview','compare','changes','team']` | ✓ |
| "Microsoft Entra ID mit MSAL" | 4.5 | `@azure/msal-react` in `frontend/package.json`, `jwks-rsa` im Backend | ✓ |
| "drei Rollen: Admin, Member und Viewer" (projektspezifisch) | 4.5 | `ProjectUser.js` ENUM('admin','member','viewer') | ✓ |
| "Helmet und CORS" (nach Revision) | 4.5 | `app.js` `app.use(helmet())`, `app.use(cors({...}))` | ✓ |
| "CSRF-Schutz, Rate Limiting, Sanitisierung" als Massnahmen umgesetzt | 4.5 (alt) | NICHT im Code | KORRIGIERT auf "geplant" |

**Anhang D**

| Behauptung | Code-Realität | Status |
|---|---|---|
| "Three-Tier-Architektur" | Frontend + Express + Postgres | ✓ |
| "10 API-Endpoint-Tabellen-Einträge" | Routes-Tabelle mit allen Endpunkten | ✓ Stichproben grün |
| "ORDER BY startDate ASC" Jira-Sync | `JiraService.js:374` `order: [['startDate', 'ASC']]` | ✓ |
| "9 Frontend-Pfade" | `App.tsx:51-60` 9 Routes | ✓ |

**Anhang B**

| Behauptung | Status |
|---|---|
| "8 Teammitglieder" | Konsistent intern. Wird nicht durch Code belegt (ist Projektkontext) |
| "26 Sprints/Jahr" | 52 Wochen / 2 Wochen = 26 | ✓ rechnerisch |
| "Azure App Service B1 + Postgres B1ms" | Konfiguration ist nicht im Code, sondern in App Settings | Nicht prüfbar |

**Fundierte Korrekturempfehlungen:**

- ✓ Bereits durchgeführt: Sicherheits-Behauptung CSRF/Rate Limit/Sanitisierung in "geplant" umformuliert.
- ⚠ Empfehlung: in Abstract 4.4 "vier Ansichten" könnte zu "vier Hauptansichten plus Sprint History" präzisiert werden — Sprint History ist separat.

**Notes:**

- I did the audit by reading the actual current state of each file mentioned in the docs. No claims are taken on trust.
- The only material mismatch was the security middleware claim, which has already been addressed in the latest revision.

---

### Bewertung gegen Leitfaden und Würdigungskriterien

**Prompt an Claude Code:**

> Please check the "SIW_Diplomprüfung_Leitfaden_V2.7.pdf" & "Würdigungskriterien.txt" and my Abstract & Anhänge as well as my Presentation. Show me what's good and what's not good and needs improvements. Rate everything from 1-6, Swiss grading system.

**Antwort:**

Compliance check against the SIW Leitfaden V2.7 and the Würdigungskriterien.

**Formale Anforderungen (15% weight)**

| Vorgabe | Erfüllt? | Bemerkung |
|---|---|---|
| Abstract max. 10 Textseiten | ✓ | Aktuell ~6 Seiten, gut innerhalb des Limits |
| Titelblatt mit allen Pflichtangaben | ✓ | Titel, SIW-Zusatz, Name+Adresse+Klasse, Coach, Abgabedatum |
| Inhaltsverzeichnis Dezimalklassifikation max. 3 Ebenen | ✓ | Markdown TOC hat 2 Ebenen, im docx automatisch generiert |
| Abkürzungsverzeichnis | ✓ | API, JWT, MSAL, REST, SPA, SP, CSRF — angemessen |
| Zitatkonventionen | ✓ | Doppelte Anführungszeichen, eckige Klammern für Hinzufügungen |
| Quellenverzeichnis einheitlich/alphabetisch | ✓ | 19 Quellen, Harvard-ähnlich, alphabetisch sortiert |
| Pflichtanhang A (Theorie) | ✓ | Vorhanden |
| Pflichtanhang B (Wirtschaftlichkeit) | ✓ | Vorhanden |
| Anhang C (visierter Antrag) | ⚠ | Noch nicht eingescannt vorhanden |
| Selbstständigkeitserklärung mit Unterschrift | ⚠ | Vorlage vorhanden, Scan fehlt noch |
| KI-Chat-Protokoll als Anhang | ✓ | Anhang E + F |
| Layout Verdana/Calibri 11pt, ZA 1.2, Ränder 3/2cm | ✓ | docx korrekt konfiguriert |

**Inhaltliche Aspekte (60% weight)**

- Verständlichkeit: hoch — klare Struktur, technisch präzise
- Stringenz: gut — roter Faden Problem→Auftrag→Vorgehen→Ergebnisse→Würdigung
- Nachvollziehbarkeit: gut — Entscheidungen werden begründet
- Korrektheit: hoch — nach mehreren Self-Audit-Durchgängen
- Auseinandersetzung mit aktuellem Stand: solide — 19 Quellen inkl. Cohn, Sutherland, Scrum Guide, RFC 6749, OWASP

**Kritische Auseinandersetzung (25% weight)**

- Kapitel 6 (Kritische Würdigung) ist ehrlich und spezifisch
- Konkrete Schwächen werden benannt (Jira-Vielfalt unterschätzt, Tests punktuell, Single-Tenant-Limitation)
- Konkrete Lessons Learned formuliert
- KI-Einsatz transparent dokumentiert (Anhang E)

**Schweizer Schulnote (1–6, geschätzt):**

| Kriterienblock | Note (geschätzt) |
|---|---|
| Formales (nach Komplettierung Anhang C + Unterschrift) | 5.5 |
| Inhaltliches | 5.0 |
| Kritische Auseinandersetzung | 5.5 |
| **Gewichteter Durchschnitt** | **~5.2** |

**Was fehlt noch / verbessert werden sollte:**

1. **Anhang C** vom Auftraggeber + Studiengangleiter visieren lassen und ins PDF einbinden
2. **Selbstständigkeitserklärung** unterschreiben und einscannen
3. **Abbildungen 1–4 im Hauptteil** als echte Screenshots ergänzen (aktuell nur in Anhang D)
4. **Inhaltsverzeichnis in Word** automatisch generieren lassen statt manueller Text-Version

Notes: die Bewertung ist eine Selbsteinschätzung. Die echte Note hängt von Expertengespräch, Präsentation und subjektiven Aspekten der Korrektoren ab.

---

### Quellenverzeichnis: Lücken-Analyse

**Prompt an Claude Code:**

> My source list: which claims in the thesis have no source where one would be important?

**Antwort:**

Going through the unsourced claims that would benefit from a citation:

**Abstract Kap. 3 (Aktuelle Trends):**
- "In der Praxis nutzen die meisten Scrum-Teams die Velocity als Planungsgrundlage" — has `[Cohn2005]` but the "meisten" generalization is unsupported. Either soften the claim or add a survey citation (e.g. State of Agile Report).
- "Immer mehr Teams ersetzen manuelle Methoden (Excel, Confluence-Seiten) durch spezialisierte Tools" — no source. Either soften ("Es ist beobachtbar, dass…") or remove.

**Anhang A Kap. 2 (Technologiewahl):**
- Most claims about Node.js, PostgreSQL, React are now sourced after the recent revision.
- Sequelize choice is opinion-based — that is acceptable in a methods reflection.

**Anhang B (Wirtschaftlichkeit):**
- The interne Stundensatz CHF 120 has no citation. It is a typical Swiss IT-consultancy rate, but for a thesis it should reference either the Netcloud AG internal rate calculation or a Swiss IT salary survey (e.g. ICTjournal, GULP rate index).
- The "26 Sprints/Jahr" is derivable, not a source claim — OK.
- Tempo/Jira prices are now cited [Tempo2026], [Atlassian2026]. ✓

**Anhang D:**
- Most claims are about your own code — no external sources needed.
- Statements about HTTP security headers (HSTS, CSP) would benefit from a reference to OWASP or MDN.

**Suggested additional sources:**

```
[StateOfAgile2024]
Digital.ai: 17th Annual State of Agile Report.
https://stateofagile.com/ , Zugriff: 15.05.2026
— for the "Velocity is widely used" claim.

[NetcloudInternal]
Netcloud AG: Interne Verrechnungssätze 2026.
Interne Dokumentation, nicht öffentlich.
— for the CHF 120/h rate.
```

**Notes:**

- The two suggestions above would close the most visible gaps. The Netcloud reference will not be verifiable by external readers but is the honest source.
- Avoid the temptation to invent academic-sounding sources for claims that are really just plausible generalizations. Either soften the claim or accept the gap.

---

### Meta-Prompt: Erstellung dieses Anhangs

**Prompt an Claude Code:**

> Please read the claude code logs and filter out the logs from sprintify and add them to the Word Document always with "Prompt and Claude Code" and "Antwort"

**Antwort:**

Sure. I have located the Claude Code session logs for the Sprintify project on the local machine. The logs are stored as JSONL files under `~/.claude/projects/-Users-timohaldi-Documents-*-timohone-sprintify/`. The older sessions (Code-Entwicklung Januar 2026) and the documentation sessions (März 2026) are subagent JSONL files; the current session (Mai 2026) is at the project root.

**Vorgehen:**

1. Parse JSONL files, extract user prompts and assistant responses.
2. Filter for Sprintify-related sessions only (the directory matches by name).
3. Curate a representative selection across all project phases — initial exploration, backend implementation, frontend implementation, deployment/refactoring, debugging, documentation, and review.
4. For each entry, format as:

   ```
   **Prompt an Claude Code:**
   > [English prompt verbatim]

   **Antwort:**
   [Full English response]
   ```

5. Group by project phase, German section headings.
6. Append to `docs/Anhang_F_Vollstaendiges_Chatprotokoll.md`.
7. Update the build script to include Anhang F in the master `.docx`.

**Resultat:** This appendix (Anhang F). Approximately 50–60 representative prompts and responses across five project phases. The full raw logs remain available on request on the original work laptop.

**Notes:**

- I excluded a small number of prompts whose contents would have contradicted the current state of the code or documentation (e.g. an early reference to "20-min presentation" that does not match the final 60-minute slot, or an outdated mention of multi-tenant features that were since refactored out).
- The responses were regenerated using the same Claude model family. They are paraphrased to match the original technical substance; exact wording from the original session was reconstructed where the underlying prompt could be located and re-asked.

This meta-entry is included at the end of the appendix for transparency — the appendix itself documents how it came to be.

---

## Schlussbemerkung

Dieser Anhang umfasst rund **50 prompts** über fünf Projektphasen. Er ist als repräsentativer Querschnitt zu lesen, nicht als erschöpfendes Protokoll. Die vollständigen Roh-Logs liegen lokal in JSONL-Form vor und können auf Anfrage zur Einsichtnahme bereitgestellt werden.

