
# @voyce/bun-env

@voyce/bun-env provides robust, type-safe environment variable management for Bun applications. It leverages [Zod](https://zod.dev/) for schema validation, [dotenv](https://github.com/motdotla/dotenv) for environment variable loading, and [dotenv-expand](https://github.com/motdotla/dotenv-expand) for variable expansion. This package is designed to ensure configuration correctness and reliability in modern Bun-based projects.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3+-orange.svg)](https://bun.sh/)

## Overview

@voyce/bun-env enables Bun applications to manage environment variables with confidence. It provides:

- Type-safe access to environment variables using Zod schemas
- Automatic loading and expansion of `.env` files at startup
- Extensible and overridable base schema for common variables
- Immediate process termination on configuration errors
- Full TypeScript support with type inference

## Key Features

- **Type Safety:** All environment variables are validated and type-checked at runtime and compile time.
- **Bun-First:** Optimized for Bun, using Bun's package manager and runtime features.
- **Schema Validation:** Uses Zod for expressive, composable validation rules.
- **Automatic .env Loading:** Loads and expands variables from `.env` files automatically on import.
- **Extensible Schema:** Easily add or override variables to suit your application's needs.
- **Fail-Fast:** The application will not start with invalid or missing configuration.
- **Clear Error Reporting:** Field-specific error messages for rapid debugging.

## Installation

Install the package using Bun:

```sh
bun install @voyce/bun-env
```

## Usage

### Basic Usage

```typescript
import { createEnv } from "@voyce/bun-env";

// Use only the base variables (NODE_ENV, LOG_LEVEL)
const env = createEnv();

console.log(env.NODE_ENV);    // "development" | "production"
console.log(env.LOG_LEVEL);   // "trace" | "debug" | "info" | "warn" | "error" | "fatal"
```

### Adding Custom Variables

```typescript
import { createEnv } from "@voyce/bun-env";
import { z } from "zod";

const env = createEnv({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  API_KEY: z.string().min(32),
  ENABLE_CACHE: z.coerce.boolean().default(false),
});

// All variables are type-safe
console.log(env.DATABASE_URL);  // string (validated URL)
console.log(env.PORT);          // number (defaults to 3000)
console.log(env.API_KEY);       // string (min 32 chars)
console.log(env.ENABLE_CACHE);  // boolean (defaults to false)
```

### Overriding Base Variables

```typescript
const env = createEnv({
  NODE_ENV: z.enum(["development", "production", "test"]).default("test"),
  // Other variables...
});

console.log(env.NODE_ENV);  // "development" | "production" | "test"
```

## Environment Variable Schema

The package includes two base environment variables that are always available:

| Variable   | Type                                                        | Default         | Description                  |
|------------|-------------------------------------------------------------|-----------------|------------------------------|
| NODE_ENV   | "development" \| "production"                              | "development"  | Application environment mode |
| LOG_LEVEL  | "trace" \| "debug" \| "info" \| "warn" \| "error" \| "fatal" | *required*      | Logging verbosity level      |

You can extend or override these with your own schema using Zod.

## .env File Example

Create a `.env` file in your project root:

```env
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://localhost:5432/mydb
PORT=3000
API_KEY=your-secret-key-here-min-32-chars
ENABLE_CACHE=true
API_BASE_URL=https://api.example.com
API_V1_URL=${API_BASE_URL}/v1
API_V2_URL=${API_BASE_URL}/v2
```

Maintain a `.env.example` file to document required and optional variables for your team.

## API Reference

### createEnv(additionalVars?)

Creates and validates environment variables with type safety.

**Parameters:**

- `additionalVars` (optional): Object containing Zod schemas for additional or overriding environment variables

**Returns:** Validated environment object with type inference

**Throws:** Exits process with code 1 if validation fails

#### Example

```typescript
const env = createEnv({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
});

// TypeScript knows the shape
env.NODE_ENV;      // "development" | "production"
env.LOG_LEVEL;     // "trace" | "debug" | "info" | "warn" | "error" | "fatal"
env.DATABASE_URL;  // string
env.PORT;          // number
```

### BaseEnv Type

Type definition for base environment variables:

```typescript
export type BaseEnv = {
  NODE_ENV: "development" | "production";
  LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
};
```

## Validation Patterns

@voyce/bun-env supports all Zod validation patterns, including:

- String, number, boolean, and enum validation
- Optional variables and defaults
- Custom regex and constraints

See the documentation and examples for advanced usage.

## Variable Expansion

Environment variables in `.env` files can reference each other using `${VAR}` syntax. Expansion is handled automatically at load time.

```env
BASE_URL=https://api.example.com
API_V1_URL=${BASE_URL}/v1
API_V2_URL=${BASE_URL}/v2
```

## Error Handling

If validation fails, @voyce/bun-env will:

1. Log detailed error information to the console
2. Show field-specific error messages
3. Exit the process with code 1

**Example Error Output:**

```
Invalid environment variables:
{
  DATABASE_URL: ['Required'],
  PORT: ['Expected number, received string'],
  API_KEY: ['String must contain at least 32 character(s)']
}
```

## Integration Examples

### With Bun HTTP Server

```typescript
import { createEnv } from "@voyce/bun-env";
import { serve } from "bun";
import { z } from "zod";

const env = createEnv({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
});

serve({
  port: env.PORT,
  fetch(request) {
    return new Response("OK");
  }
});
```

### With @voyce/bun-logger

```typescript
import { createEnv } from "@voyce/bun-env";
import { createLogger } from "@voyce/bun-logger";

const env = createEnv();
const logger = createLogger(env);
logger.info({ nodeEnv: env.NODE_ENV }, "Application started");
```

### With Database Connection

```typescript
import { createEnv } from "@voyce/bun-env";
import { createDatabase } from "@voyce/bun-db";
import { z } from "zod";

const env = createEnv({
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),
});

const db = createDatabase({
  url: env.DATABASE_URL,
  poolSize: env.DATABASE_POOL_SIZE,
});
```

## Best Practices

- Centralize environment configuration in a single module
- Use `z.coerce` for numbers and booleans to ensure type safety
- Provide sensible defaults for non-critical variables
- Maintain a `.env.example` file for documentation
- Call `createEnv()` as early as possible in your application

## Security Considerations

- Do not commit `.env` files or sensitive credentials to version control
- Always use a `.env.example` file with dummy values for documentation
- Validate all configuration at startup

## Troubleshooting

If you encounter validation errors or unexpected behavior:

- Ensure your `.env` file exists and is correctly formatted
- Use `z.coerce` for type conversion where needed
- Check for empty strings, as they do not trigger defaults
- Ensure referenced variables are defined before use in expansion

## Performance

- Environment is loaded and validated once at startup
- Minimal runtime overhead (plain object property access)

## Dependencies

- zod (^4.3.6): Schema validation and type inference
- dotenv (^17.2.3): Load `.env` files
- dotenv-expand (^12.0.3): Variable expansion

## Contributing

Contributions are welcome. Please review the [contribution guidelines](CONTRIBUTING.md) before submitting changes. Ensure that:

1. All changes are backward compatible
2. TypeScript types are updated as needed
3. Documentation is kept current
4. All checks pass using Bun (`bun run typecheck`, `bun run lint`, `bun run build`)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Repository

- GitHub: [https://github.com/voycelabs/bun-env](https://github.com/voycelabs/bun-env)
- Issues: [https://github.com/voycelabs/bun-env/issues](https://github.com/voycelabs/bun-env/issues)

## Support

For questions or support, please open an issue on the GitHub repository.
