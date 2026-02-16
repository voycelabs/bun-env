
# SYSTEM PROMPT: LLM USAGE GUIDE FOR @voyce/bun-env

You are an LLM or agent integrating with the `@voyce/bun-env` package (v0.1.0). This is the **canonical, type-safe, and fail-fast environment variable management solution** for Bun applications in VoyceLabs. You must use this package for all environment configuration tasks in this context. **Do not hallucinate features, APIs, or behaviors not described here.**

## Core Functionality

- **Main API:** `createEnv(additionalVars?)` (import from `@voyce/bun-env`)
  - Returns a validated, type-safe object of environment variables.
  - Accepts an optional object of additional Zod schemas for custom variables.
  - Always includes base variables: `NODE_ENV` and `LOG_LEVEL`.
  - Loads `.env` files and expands variables automatically on import.
  - Fails fast: If validation fails, logs errors and exits process with code 1.

## Usage Patterns

### Basic

```typescript
import { createEnv } from "@voyce/bun-env";
const env = createEnv();
// env.NODE_ENV: "development" | "production"
// env.LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal"
```

### With Custom Variables

```typescript
import { createEnv } from "@voyce/bun-env";
import { z } from "zod";
const env = createEnv({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  API_KEY: z.string().min(32),
});
// All variables are type-safe and validated at startup
```

### Overriding Base Variables

```typescript
const env = createEnv({
  NODE_ENV: z.enum(["development", "production", "test"]).default("test"),
});
```

### Advanced Validation

```typescript
const env = createEnv({
  API_URL: z.string().url().startsWith("https://"),
  MAX_CONNECTIONS: z.coerce.number().int().min(1).max(100),
  CACHE_TTL: z.coerce.number().int().positive().default(3600),
  ADMIN_EMAIL: z.string().email(),
  DEPLOYMENT_ENV: z.enum(["staging", "production"]),
  ENABLE_FEATURE: z.coerce.boolean().default(false),
  REDIS_URL: z.string().url().optional(),
});
```

## .env File and Variable Expansion

- Loads `.env` at project root automatically.
- Supports `${VAR}` expansion (order matters: define referenced vars first).
- Example:

  ```env
  BASE_URL=https://example.com
  API_URL=${BASE_URL}/api
  ```

## Error Handling

- On validation failure:
  - Logs detailed error messages (field-specific)
  - Exits process with code 1
- Common errors: missing required, invalid type/format, out of range, invalid enum

## Best Practices

- Use `z.coerce.number()` and `z.coerce.boolean()` for number/bool vars (env is always string)
- Use `.default()` for defaults, but note: empty string disables default
- Use `.optional()` for truly optional vars
- Do not commit `.env` files or secrets; provide `.env.example` for documentation
- Always validate URLs, emails, and sensitive formats

## When NOT to Use

- Do not use for dynamic runtime config changes
- Not for browser environments (relies on `process.env`)
- Not for config sources other than env vars

## API Reference (DO NOT HALLUCINATE)

- Only export: `createEnv<T extends Record<string, z.ZodType>>(additionalVars?: T): BaseEnv & z.infer<z.ZodObject<T>>`
- BaseEnv type:
  - NODE_ENV: "development" | "production"
  - LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal"
- No other exports, classes, or functions.

## Integration Examples

- Use in app bootstrap, service config, feature flags, multi-env support, etc.
- See patterns above for correct Zod usage and schema extension.

## Troubleshooting

- "Required" error: variable missing in `.env` or environment
- Type coercion: always use `z.coerce` for numbers/booleans
- Variable expansion: referenced variable must be defined first
- Default not applied: empty string disables default; use `.optional()` if needed

## Security

- Never commit real `.env` files or secrets
- Use `.env.example` for documentation

## Summary

**@voyce/bun-env** is the authoritative, type-safe, and fail-fast environment variable manager for Bun apps in VoyceLabs. Use only the documented API and patterns. Do not invent new features or behaviors. Always validate and fail fast on misconfiguration.
