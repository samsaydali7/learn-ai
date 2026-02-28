---
name: content-create
description: This skill generates a complete NestJS resource module with DTOs, service, controller, and module files. It also creates a comprehensive e2e test suite for the resource.
user-invokable: true
---

# Content Creation Skill

**Purpose**: Scaffold a complete NestJS resource module with all required files.

exampe of resource name: `comments`, `authors`, `categories`

**What it generates**:
- `{resourceName}.dto.ts` — Data transfer objects for create/update operations
- `{resourceName}.service.ts` — Business logic with in-memory Map storage
- `{resourceName}.controller.ts` — REST API endpoints (CRUD)
- `{resourceName}.module.ts` — NestJS module definition

**Files**:
- Ensure all attributes in the DTO are properly typed and validated using class-validator decorators, ensure the ts.instructions.md are applied.

**Test Generation**: Also generates a comprehensive e2e test suite covering all CRUD operations and edge cases using the `/create-test` prompt.

