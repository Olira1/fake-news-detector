# Database

Shared database schema and migrations for Fake News Detector.

## Contents

- Prisma schema
- Migration files
- Seed scripts

## Files

- `prisma/schema.prisma`
- `prisma/migrations/20260424_init/migration.sql`
- `prisma/migrations/migration_lock.toml`

## Commands

Run all commands from `database/`:

```bash
npm install
npm run prisma:validate
npm run prisma:format
npm run migrate:deploy
```

## Environment Requirement

Prisma reads `DATABASE_URL` from environment. For local development, load the value from `../.envDevelopment` before running Prisma commands.

PowerShell example:

```powershell
$env:DATABASE_URL="mysql://fakanewsdetector:1234t@localhost:3306/fakanewsdetector"
npm run migrate:deploy
```
