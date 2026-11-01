# Communova — client

A civic almanac for Dhaka: a community events platform where residents create
service events, join their neighbours, and keep a public record of the work.

This repository is the Next.js client. The Express API lives in
[communova-server](https://github.com/farhana-ayesha/communova-server).

## Features

- **Email and password accounts** — Better Auth sessions with server-enforced
  password rules (6+ characters, at least one uppercase and one lowercase
  letter), duplicate-email handling, and a protected private area.
- **Google sign-in** — enabled automatically when real OAuth credentials are
  present; the button explains the missing configuration instead of sending
  visitors to a broken provider page.
- **Create a service event** — title, description, type, thumbnail, location, and
  a future-only date, published under the member who created it.
- **Join and leave** — event details stay public; joining requires an account and
  updates the participant count. Past events are closed to both actions.
- **A public register** — upcoming events in a responsive grid, sorted by date,
  with past dates marked and kept on their detail pages.
- **Manage your own events** — members can update or delete only the events they
  created; ownership is enforced on the API with a short-lived JWT.
- **Joined events** — a private, date-sorted list of everything the member has
  signed up for, including past dates.
- **Profile editing** — display name and photo URL are updated through Better
  Auth and appear immediately on every event the member organises.
- **Real activity counts** — created, joined, and upcoming counts plus short
  activity lists, read from the live register.
- **Newsletter sign-up** — addresses are validated and persisted by the API;
  repeat submissions are idempotent.
- **Light and dark themes** — a full token-level theme switch, remembered across
  reloads.
- **Editorial, responsive design** — a warm paper and canopy-green system, built
  to work at 390px and 1440px.

## Stack

| Layer  | Choice                                                              |
| ------ | ------------------------------------------------------------------- |
| Client | Next.js (App Router), TypeScript, Tailwind v4, shadcn/ui primitives |
| Auth   | Better Auth, MongoDB adapter, JWT + JWKS                            |
| Server | Express 5, TypeScript, MongoDB                                      |
| Fonts  | Instrument Serif, Instrument Sans, IBM Plex Mono                    |

## Local development

Start the API first, then the client.

```bash
# terminal 1 — server
cd server
cp .env.example .env
npm install
npm run dev

# terminal 2 — client
cd client
cp .env.example .env.local
npm install
npm run dev
```

The client runs on `http://localhost:3000`; the API runs on
`http://localhost:4000`.

Point `MONGODB_URI` at the same Atlas cluster (or local mongod) in both
projects, and add Google OAuth keys to enable social sign-in.

### Without MongoDB

Set `AUTH_DEV_MEMORY=1` in `client/.env.local` and `EVENTS_DEV_MEMORY=1` in
`server/.env` to run against Better Auth's in-memory adapter and the API's
process-local register. Accounts and events reset when the processes restart.
Both switches are development-only and are refused at production runtime.

### Google OAuth

Create an OAuth client in Google Cloud Console and add these redirect URIs:

- `http://localhost:3000/api/auth/callback/google`
- `https://<your-client-domain>/api/auth/callback/google`

Then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the client
environment. If the values are missing or still the `replace-me` placeholders,
the Google button stays disabled and explains why.

## Environment

| Variable                   | Required | Notes                                                                 |
| -------------------------- | -------- | --------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`       | yes      | 32+ random bytes; generate with `openssl rand -hex 32`                 |
| `BETTER_AUTH_URL`          | yes      | Public client origin, e.g. `https://communova.vercel.app`              |
| `MONGODB_URI`              | yes      | Atlas connection string or local `mongodb://` URI                     |
| `MONGODB_DB`               | no       | Defaults to `communova`                                               |
| `NEXT_PUBLIC_API_URL`      | yes      | Public API origin, e.g. `https://communova-api.onrender.com`          |
| `GOOGLE_CLIENT_ID`         | no       | Enables Google sign-in when paired with the secret                    |
| `GOOGLE_CLIENT_SECRET`     | no       | Enables Google sign-in when paired with the client ID                 |
| `AUTH_DEV_MEMORY`          | no       | `1` uses the in-memory adapter in development; refused in production   |

Never commit `.env.local` or production secrets.

## Testing

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm test            # Node test runner via tsx
npm run build       # Production build
```

The tests cover the shared auth and event validation rules plus safe post-login
redirects.

## Deployment (Vercel)

1. Import this repository into Vercel with the project root set to `client`.
2. Add the environment variables above. Leave `AUTH_DEV_MEMORY` unset.
3. Set `BETTER_AUTH_URL` to the production client URL **before** the first
   deploy, because it is embedded in the Better Auth JWT issuer.
4. Set `NEXT_PUBLIC_API_URL` to the deployed API origin.
5. Deploy the API first (or update the client variable afterwards) and add the
   client origin to the API's `CLIENT_ORIGIN`.
6. Add the production Google redirect URI if OAuth is enabled.

`BETTER_AUTH_URL` and `NEXT_PUBLIC_API_URL` are read at build time for the
client bundle; redeploy after changing them.

## Known gaps

- **Google OAuth** needs real `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
  values and the production redirect URI. Until then the button stays disabled.
- **Newsletter delivery** is not wired to an email provider. Addresses are
  validated and persisted by the API, but no outbound mail is sent yet.
- **Production persistence** needs a real MongoDB Atlas URI in both projects;
  the in-memory switches are development-only.

## Repository layout

```text
src/
  app/            routes: public site, auth, private area, Better Auth handler
  components/     layout, events, auth, profile, and UI primitives
  lib/            auth config, API clients, validation, dates, sessions
  tests/          Node test-runner suites
  types/          shared event contract
```

See `src/app/styleguide` (development only) for the design system reference.

## Scripts

| Script              | Purpose                        |
| ------------------- | ------------------------------ |
| `npm run dev`       | Next dev server                |
| `npm run build`     | Production build               |
| `npm start`         | Serve the production build     |
| `npm run lint`      | ESLint                         |
| `npm run typecheck` | TypeScript, no emit            |
| `npm test`          | Validation and redirect tests  |
| `npm run dev:db`    | Local MongoDB helper           |
