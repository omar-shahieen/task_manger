# Backend - Task Manager

## Setup

1. Copy `.env.example` to `.env` and edit the `DATABASE_URL`, `JWT_SECRET` and other settings.

2. Install dependencies:

```bash
npm install
```

3. Run migrations:

```bash
npm run migrate
```

4. Start server:

```bash
npm run dev
```

## Notes & Troubleshooting

- The server listens on `process.env.PORT` (default `4000`).
- Use `DATABASE_URL` format: `postgresql://user:password@host:port/dbname`.

Common issues:

- Connection errors: ensure PostgreSQL is running and the `DATABASE_URL` is correct.
- Migration errors: if the `task_status` type already exists, the migration is idempotent, but inspect the SQL if errors occur.
- JWT errors: ensure `JWT_SECRET` is set in `.env` for token signing and verification.

If you need help, paste server logs and the `.env` (without secrets) and I can help debug.
