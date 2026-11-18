# Virtual Advent Calendar

A small interactive holiday calendar with an illustrated winter scene, animated details, and optional shared progress through Firebase.

## Run locally

Requires Node.js. From the project root:

```sh
npm run dev
```

Open http://localhost:4173. Run `npm test` for tests and `npm run check` for syntax checks.

## Project files

- `dist/` — the browser app and its assets.
- `tests/` — automated tests.
- `firebase.rules` — Firestore security rules.

Firebase is optional. Configure the browser app in `dist/firebase-config.js`, enable Anonymous sign-in, and publish `firebase.rules` to use shared progress. The site can be hosted as static files; there is no build step.
