# Travel Blog Backend (Prompt 1)

Express backend for the Travel Blog project.

## What is included

- `server.js` - app entrypoint
- `routes/` - API routes for `articles` and `comments`
- `middleware/` - auth, validation, error handling
- `config/firebaseAdmin.js` - Firebase Admin initialization
- `package.json` - separate backend dependencies/scripts

## Setup

1. Copy `.env.example` to `.env`
2. Put Firebase Admin key into `serviceAccountKey.json` (local only)
3. Install dependencies:

```bash
npm install
```

4. Run dev server:

```bash
npm run dev
```

## API

- `GET /api/health`
- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/articles/my` (auth)
- `POST /api/articles` (auth)
- `PATCH /api/articles/:id` (auth + owner)
- `DELETE /api/articles/:id` (auth + owner)
- `PATCH /api/articles/:id/like` (auth)
- `GET /api/comments?articleId=<id>`
- `POST /api/comments` (auth)

## Auth

Protected routes require Firebase ID token in header:

`Authorization: Bearer <idToken>`

