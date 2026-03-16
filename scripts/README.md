# Scripts Directory

Utility and test scripts for the ecommerce starter template.

## Directory Structure

```
scripts/
├── test/              # All testing scripts
│   ├── check-storefront.sh
│   ├── test-apis.sh
│   ├── test-medusa-e2e.sh
│   ├── test-frontend.sh
│   ├── test-everything.sh
│   └── README.md
├── bootstrap.sh       # First-time setup script
├── dev.sh            # Development environment launcher
└── README.md         # This file
```

## Utility Scripts

### `bootstrap.sh`
**First-time project setup**

Automates the initial setup of the project:
- Installs dependencies
- Starts databases
- Runs migrations
- Sets up infrastructure (regions, sales channels, API keys)
- Seeds demo data
- Starts backend and storefront

```bash
./scripts/bootstrap.sh
```

**Use when:** Setting up the project for the first time

---

### `dev.sh`
**Development environment launcher**

Starts both backend and storefront with log rotation.

```bash
./scripts/dev.sh
# or
make dev
```

**What it does:**
- Starts Medusa backend (port 9000)
- Starts Next.js storefront (port 3000)
- Logs output to `dev.log`
- Rotates old logs to `dev.log.old`

**Use when:** Daily development work

---

## Test Scripts

See [test/README.md](./test/README.md) for detailed documentation of all test scripts.

Quick reference:
```bash
make test-storefront  # Quick health check
make test-apis        # Backend API tests
make test-e2e         # Full E2E backend tests
make test-frontend    # Frontend integration tests
make test-all         # Complete test suite
```

---

## Backend Scripts

Backend-specific scripts are located in `backend/scripts/`:

- `setup-infrastructure.ts` - Creates region, sales channel, publishable key
- `seed-demo-data.ts` - Seeds categories, collections, products, promotions
- `clear-demo-data.ts` - Clears all seeded data

Run with:
```bash
cd backend
npx medusa exec ./scripts/script-name.ts
```

---

## Common Workflows

### First-Time Setup
```bash
./scripts/bootstrap.sh
```

### Daily Development
```bash
make dev
```

### After Making Changes
```bash
make test-all
```

### Before Deployment
```bash
make test-all
make build
```

---

**Last Updated:** 2026-03-16
