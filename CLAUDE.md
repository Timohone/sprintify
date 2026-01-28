# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sprintify is a multi-tenant SaaS capacity planning tool with Jira integration, built as a Node.js/Express backend with a React frontend. It features role-based access control (superadmin, admin, manager, developer, member) and deploys to Azure App Service.

## Commands

All commands run from `backend/`:

```bash
npm run dev              # Dev server with nodemon (port 3001)
npm start                # Production server
npm test                 # Jest tests
npm run test:watch       # Jest watch mode
npm run lint             # ESLint
npm run format           # Prettier
npm run db:migrate       # Run Sequelize migrations
npm run db:seed          # Seed database
npm run db:reset         # Drop, create, migrate, seed
```

The frontend is pre-built static files served from `frontend/` — there is no frontend build step in this repo.

## Architecture

**Backend (Express.js + Sequelize + PostgreSQL)**

- `backend/src/app.js` — Express app setup, middleware registration, route mounting
- `backend/src/server.js` — Server startup, DB sync, lifecycle management
- `backend/src/models/index.js` — All Sequelize model associations defined here
- `backend/src/routes/` — Route files mounted at `/api/*`
- `backend/src/controllers/` — Auth, Company, PasswordReset, UserInvitation
- `backend/src/services/` — Business logic: AuthService, EmailService, JiraService, JiraSyncService
- `backend/src/middleware/` — Security stack: auth (JWT), CSRF, rate limiting, sanitization
- `backend/services/SyncScheduler.js` — Cron-based Jira sync (every 15 min default)

**Database models:** Company, User, Project, ProjectUser (many-to-many with roles), Sprint, UserStory, CapacityPlan, Retrospective

**Key patterns:**
- Routes contain most business logic directly; controllers exist only for auth, company, password reset, and invitations
- Jira configuration is per-project (each project has its own Jira credentials and board mapping)
- Multi-tenancy via Company model — users belong to companies, projects belong to companies
- JWT auth via cookies; CSRF protection via `@dr.pogodin/csurf`

**Frontend** — Pre-built React 18 SPA in `frontend/`. Has its own `server.js` for static serving and `inject-config.js` for runtime env var injection on Azure.

## Environment

Requires Node.js >=20, npm >=10. PostgreSQL database configured via `DATABASE_URL`. Key env vars: `JWT_SECRET`, `CORS_ORIGIN`, `EMAIL_SERVICE` (smtp/sendgrid/resend).

## Database

Sequelize with migrations in `backend/database/migrations/`. Config in `backend/config/config.json`. DB auto-syncs missing tables on startup (safe mode). Connection pooling: max 10, min 2.
