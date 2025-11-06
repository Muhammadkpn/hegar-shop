# Repository Guidelines

## Project Structure & Module Organization
- The workspace splits into `backend` (Express REST API) and `frontend` (Next.js client).
- Backend logic lives under `controllers/`, validations in `helpers/`, and HTTP routing in `routers/` aggregated by `routers/index.js`. Database access uses `database/index.js` with MySQL credentials from environment variables, and static assets live in `backend/public/`.
- Frontend pages reside in `pages/`, reusable UI in `components/`, Redux state in `store/`, global styling in `styles/`, and static assets under `public/`.

## Build, Test, and Development Commands
- Install dependencies separately: `npm install` inside both `backend` and `frontend`.
- Run the API with live reload via `npm run start` in `backend` (nodemon) and lint it with `npm run lint`.
- Start the web client with `npm run dev` in `frontend`; production builds use `npm run build` followed by `npm run start`.
- Run backend and frontend in parallel terminals and load `.env` files before hitting API routes.

## Coding Style & Naming Conventions
- Backend ESLint extends Airbnb base with 4-space indentation (`backend/.eslintrc.json`). Console logging is allowed; keep Windows-style line endings to avoid lint noise.
- Use camelCase for variables/functions, PascalCase for React components, and hyphenated filenames for assets. Align Redux slices and API modules with their directory names for quick discovery.

## Testing Guidelines
- Automated tests are not yet configured. When adding coverage, place backend tests under `backend/tests/` and frontend tests under `frontend/__tests__/`, naming files `*.test.js` or `*.spec.js`.
- Validate endpoints with integration scripts or Postman during review, and document scenarios in the PR description until Jest or another framework is introduced.

## Commit & Pull Request Guidelines
- This snapshot lacks recorded Git history, so default to Conventional Commits (e.g., `feat: add cart coupon handler`) and keep subject lines under 72 characters.
- Every PR should include: a clear summary, linked issue IDs when available, steps to reproduce/fix, and screenshots or cURL examples for UI/API changes. Confirm frontend builds (`npm run build`) and backend lint (`npm run lint`) before requesting review.

## Environment & Configuration Tips
- Define `NODE_ENV`, `CLIENT_URL`, and MySQL credentials (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`) in a local `.env` within `backend/`. Avoid committing credentials.
- Point the frontend to the API base URL via `NEXT_PUBLIC_*` variables added to `frontend/.env.local`. Restart `next dev` after changing env vars.
