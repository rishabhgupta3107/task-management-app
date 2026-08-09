# HELM — Mission control for your work

HELM is a keyboard-first "task terminal" — the speed of Linear, the glanceable density of a
trading terminal, and the delight of Raycast — for operators running live, time-sensitive work.

It's built on a **Spring Boot** backend and an **Angular 17** frontend, with JWT authentication,
self-service registration, and per-user task CRUD (server-side pagination, search, filtering).
Each user only ever sees their own tasks.

### What HELM does

HELM isn't a passive list — it turns your tasks into an *operating picture* and tells you what to
do next. It bridges the gaps common to task apps:

- **Focus view** — an urgency engine scores every task from priority + due date and surfaces
  Overdue / Due today / At-risk / Upcoming, with a "do this next" hero. (Fixes "apps are just lists.")
- **Kanban board** — drag tasks across To do / In progress / Done; status persists on drop. Toggle
  to a dense sortable list view.
- **Analytics** — throughput (created vs. completed over 14 days), status mix, priority breakdown,
  completion rate and overdue KPIs, rendered with Chart.js in both themes.
- **Rich tasks** — subtasks with a progress bar, tags, and a created/updated activity timeline.
- **Full profiles** — name, email, date of birth → auto-calculated age, title, bio, timezone, and a
  generated gradient avatar (or your own image URL). Registration collects the essentials.

### Experience

- **Scroll-driven landing page** (`/welcome`) — GSAP + Lenis showpiece with an orbiting ring of task
  cards that rotates as you scroll. Tagline: *"Stop tracking tasks. Start commanding them."*
- **Dark "terminal" + light themes** with an animated toggle (persisted per user), carried
  consistently across the whole authenticated app (sidebar shell, board, focus, analytics, profile).
- **⌘K command palette** — jump to any view, create a task, toggle theme, or sign out from anywhere.
- Polished micro-interactions and route transitions; respects `prefers-reduced-motion`.

Tech: Angular 17, Angular Material (themed), Angular CDK drag-drop, GSAP + ScrollTrigger, Lenis
smooth scroll, Chart.js.

## Architecture

- **Backend** (`backend-springboot`): layered REST API — Controller → Service → Repository →
  Entity — with a dedicated DTO layer (entities are never exposed on the wire), a global
  exception handler, stateful-free JWT security, and Flyway-managed PostgreSQL schema.
- **Frontend** (`frontend`): Angular 17 (NgModule) app with a typed service layer, an HTTP
  interceptor for auth, a route guard, and reactive forms throughout.

## Run with Docker (recommended)

The fastest way to run the whole stack — Postgres, backend, and frontend — with one command.
Requires only **Docker** and **Docker Compose**.

```sh
# Optional but recommended: set a strong JWT secret (≥ 32 chars)
export JWT_SECRET="change-me-to-a-long-random-string-please-32ch"

docker compose up --build
```

Then open **http://localhost:8081** and sign in with `rishabh` / `password`.

- The frontend (nginx) is published on port **8081** and proxies `/api/*` to the backend.
- The backend and Postgres run on the internal Docker network; Postgres data persists in the
  `pgdata` volume.
- Flyway creates the schema and seeds data automatically on first start.

To stop and remove everything (including the database volume):

```sh
docker compose down -v
```

---

The sections below describe running each part **manually** without Docker.

## Prerequisites (manual setup)

- **Java 21+**
- **Node.js 18+** and npm
- **PostgreSQL 14+** (a running instance)

## 1. Database setup

Create a database and user (defaults shown — override via environment variables):

```sql
CREATE DATABASE taskmanagement;
CREATE USER taskuser WITH PASSWORD 'taskpass';
GRANT ALL PRIVILEGES ON DATABASE taskmanagement TO taskuser;
```

Flyway runs the migrations in `src/main/resources/db/migration` automatically on startup,
creating the schema and seeding one user and three example tasks.

## 2. Backend

Configuration is environment-driven (see `application.yml`). The important variables:

| Variable | Default | Notes |
|----------|---------|-------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/taskmanagement` | JDBC URL |
| `DB_USERNAME` | `taskuser` | |
| `DB_PASSWORD` | `taskpass` | |
| `JWT_SECRET` | dev-only fallback | **Set a strong value (≥ 32 chars) in any real environment** |
| `JWT_EXPIRATION_MS` | `3600000` | Access-token lifetime (1 hour) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:4200` | Comma-separated |

Run it:

```sh
cd backend-springboot
export JWT_SECRET="change-me-to-a-long-random-string-please"
./mvnw spring-boot:run
```

The API is served at `http://localhost:8080`. Actuator exposes only `/actuator/health`
(public) and `/actuator/info` (authenticated).

## 3. Frontend

```sh
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

- Dev builds call the API at `http://localhost:8080` (`src/environments/environment.ts`).
- Production builds expect the API on the same origin under `/api/...`
  (`src/environments/environment.prod.ts`) — put a reverse proxy in front, or edit `apiUrl`.

## 4. Credentials

A seed user is created by the migrations:

- **Username:** `rishabh`
- **Password:** `password`

Or register a new account from the **Create account** link on the login screen.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create an account (optional name, email, DOB, avatar) |
| `POST` | `/api/auth/login` | Obtain a JWT |
| `GET` | `/api/users/me` | Get the authenticated user's profile (age derived from DOB) |
| `PUT` | `/api/users/me` | Update profile (name, email, DOB, avatar URL, title, bio, timezone) |
| `GET` | `/api/tasks?page&size&sort` | List your tasks (paginated) |
| `GET` | `/api/tasks/{id}` | Get one of your tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `GET` | `/api/tasks/search?keyword=` | Search your tasks |
| `GET` | `/api/tasks/status/{status}` | Filter your tasks by status |

All `/api/tasks/**` endpoints require a `Bearer` token and are scoped to the authenticated user.

## Notes

- Passwords are hashed with BCrypt.
- The schema is owned by Flyway; Hibernate is set to `validate` so entities and schema can't
  silently drift.
- Frontend unit test specs (`*.spec.ts`) are scaffolding and may need module imports updated
  before `npm test` passes; they are excluded from production builds.

## Contact

**Rishabh Gupta**

- LinkedIn: https://www.linkedin.com/in/rishabhgupta3107/
- GitHub: https://github.com/rishabhgupta3107

For any questions or issues, feel free to reach out.
