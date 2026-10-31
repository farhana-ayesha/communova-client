# Communova

A civic almanac for Dhaka: a community events platform where residents create
service events, join their neighbours, and keep a public record of the work.

Live site: **https://communova.vercel.app** _(placeholder — replace after deploy)_

## Features

- **Create a service event** — title, description, type, thumbnail, location, and
  a future-only date, published under the member who created it.
- **Join in one click** — event details stay public; joining requires an account
  and adds the event to the member's joined list.
- **A public register** — upcoming events in a responsive grid, sorted by date,
  with past dates removed automatically.
- **Manage your own events** — members can update or delete only the events they
  created; ownership is enforced on the API with a JWT.
- **Joined events** — a private, date-sorted list of everything the member has
  signed up for, including past dates.
- **Profile and photo** — Better Auth identity with a display name and photo URL
  that appear on every published event.
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

```bash
cp .env.example .env.local
npm install
npm run dev
```

The client runs on `http://localhost:3000`. The API lives in a separate repo: [communova-server](https://github.com/farhana-ayesha/communova-server) (runs on `http://localhost:4000`).

Point `MONGODB_URI` at an Atlas cluster (or a local mongod) in `.env.local` and add Google OAuth keys to enable social sign-in.

### Without MongoDB

Set `AUTH_DEV_MEMORY=1` in `client/.env.local` to run the auth flow against
Better Auth's in-memory adapter. Accounts reset when the dev server restarts;
every other feature still targets MongoDB.

## Repository layout

## Repository layout

This repo is the Next.js client. The Express API is in [communova-server](https://github.com/farhana-ayesha/communova-server).

See `client/src/app/styleguide` (development only) for the design system
reference.

## Scripts

| Client              | Purpose             |
| ------------------- | ------------------- |
| `npm run dev`       | Next dev server     |
| `npm run build`     | Production build    |
| `npm run lint`      | ESLint              |
| `npm run typecheck` | TypeScript, no emit |

| Server              | Purpose              |
| ------------------- | -------------------- |
| `npm run dev`       | Watch mode via `tsx` |
| `npm run build`     | Compile to `dist/`   |
| `npm start`         | Run the compiled API |
| `npm run typecheck` | TypeScript, no emit  |
