# Team Board - NX Monorepo

Full-stack task management application built with **Angular 21**, **NestJS**, and **NX**. Features automatic API client generation from OpenAPI/Swagger specification.

## 🏗️ Architecture

```
team-board/
├── apps/
│   ├── frontend/          # Angular 21 + NgRx + PrimeNG
│   └── backend/           # NestJS + Swagger
├── libs/
│   ├── shared-models/     # Shared TypeScript models
│   └── api-client/        # Auto-generated API client (OpenAPI)
└── nx.json                # NX workspace configuration
```

## 🚀 Quick Start

### Install dependencies
```bash
npm install
```

### Start both applications
```bash
npm run start
```

Or start them separately:
```bash
# Terminal 1 - Backend (http://localhost:3000)
npm run start:backend

# Terminal 2 - Frontend (http://localhost:4200)
npm run start:frontend
```

### Access points
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api

## 📦 NX Commands

### Build
```bash
npm run build              # Build all projects
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Build only what changed
npm run affected:build
```

### Test
```bash
npm run test               # Test all projects
npm run test:frontend      # Test frontend (377 tests)
npm run test:backend       # Test backend

# Test only what changed
npm run affected:test
```

### Lint
```bash
npm run lint               # Lint all projects
npm run affected:lint      # Lint only what changed
```

### Dependency graph
```bash
npm run graph              # Visualize project dependencies
```

## 🤖 API Automation (OpenAPI + Swagger)

### How it works

```
Backend change (add field/endpoint)
         │
         ▼
  npm run generate:api
         │
         ▼
Frontend gets updated automatically:
  ✓ TypeScript models
  ✓ HTTP services
  ✓ Full type safety
```

### Generate API client

```bash
# 1. Generate OpenAPI spec from backend
npm run generate:openapi

# 2. Generate TypeScript client for frontend
npm run generate:api-client

# 3. Or do both at once
npm run generate:api
```

The generated client is in `libs/api-client/` and automatically used by frontend services.

## 📚 Libraries

### `@team-board/shared-models`
Shared TypeScript interfaces between frontend and backend:
- `Task`, `TaskStatus`, `TaskPriority`
- `User`, `UserDictionary`
- `LoginRequest`, `RegisterRequest`, `AuthResponse`

**Usage:**
```typescript
import { Task, User } from '@team-board/shared-models';
```

### `@team-board/api-client`
Auto-generated API client from OpenAPI specification:
- `AuthService` - login, register, profile
- `TasksService` - CRUD operations
- `UsersService` - user dictionary

**Usage:**
```typescript
import { AuthService } from '@team-board/api-client';
```

## 🎯 NX Benefits

| Feature | Benefit |
|---------|---------|
| **Cache** | Second build is instant if nothing changed |
| **Affected** | Build/test only changed projects in CI/CD |
| **Dependency graph** | Visual understanding of project structure |
| **Shared libraries** | Single source of truth for models |

### Example: Change in shared-models

```bash
# Edit libs/shared-models/src/task.model.ts
# Add new field to Task interface

npx nx affected -t build
# → NX detects change and rebuilds ONLY:
#   - shared-models
#   - frontend (depends on shared-models)
#   - backend (depends on shared-models)
```

## 🛠️ Tech Stack

### Frontend
- **Angular 21** (standalone components)
- **NgRx** for state management
- **PrimeNG** UI components
- **Tailwind CSS** for styling
- **Jest** for unit testing
- **Playwright** for e2e testing

### Backend
- **NestJS** framework
- **Swagger** for API documentation
- **JWT** authentication
- **TypeScript**

### Tooling
- **NX** monorepo management
- **OpenAPI Generator** for API client
- **npm workspaces**

## 📖 Documentation

- Frontend README: `apps/frontend/README.md`
- Frontend CLAUDE guide: `apps/frontend/CLAUDE.md`
- Backend README: `apps/backend/README.md`

## 🔧 Development Workflow

1. **Make changes** in backend (add endpoint, modify model)
2. **Generate API:** `npm run generate:api`
3. **Frontend gets updates** automatically
4. **Build affected:** `npm run affected:build`
5. **Test affected:** `npm run affected:test`

## 📊 Project Status

- ✅ NX workspace configured
- ✅ Shared models library
- ✅ Auto-generated API client
- ✅ Swagger documentation
- ✅ Full type safety frontend ↔ backend
- ✅ CI/CD ready (affected commands)
