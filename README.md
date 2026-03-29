# Team Board Workspace

This repository is prepared for a future Nx migration, but Nx has not been initialized at the workspace root yet.

## Current layout

- `apps/frontend/` - Angular application
- `apps/backend/` - NestJS application

## What is already prepared

- Root `package.json` defines package-manager workspaces for the current app locations.
- Root `tsconfig.base.json` provides a shared TypeScript baseline for app-level configs.
- Root `.gitignore` now ignores common build, cache, and coverage artifacts across the workspace.

## Current state before an actual Nx migration

- Both applications now live under `apps/`, which matches the target workspace layout.
- `apps/backend/` no longer has its own `.git` directory and is part of the main repository.
- The next migration step is still to introduce Nx config itself, not to move files again.

## Root commands

```bash
npm run start:frontend
npm run start:backend
npm run build:frontend
npm run build:backend
```
