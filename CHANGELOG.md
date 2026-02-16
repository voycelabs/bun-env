# Changelog

All notable changes to `@voyce/bun-env` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### First Release

This is the initial public release of `@voyce/bun-env` under the MIT License.

### Added

- Initial release of `@voyce/bun-env`
- `createEnv()` function for type-safe environment variable management
- Zod-based schema validation for environment variables
- Automatic `.env` file loading using dotenv
- Variable expansion support via dotenv-expand
- Base schema with `NODE_ENV` and `LOG_LEVEL` variables
- Ability to extend base schema with additional variables
- Ability to override base schema variables
- TypeScript support with full type inference
- Automatic validation error reporting with field-specific messages
- Process exit on validation failure for fail-fast behavior

### Features

- **Type-safe**: Full TypeScript support with Zod type inference
- **Extensible**: Add custom environment variables to base schema
- **Overridable**: Override default values and constraints for base variables
- **Validated**: Automatic validation on environment creation
- **Developer-friendly**: Clear error messages for missing or invalid variables
- **Zero-config**: Works with standard `.env` files out of the box
- **Variable expansion**: Supports `${VAR}` syntax in `.env` files

### Base Environment Variables

- `NODE_ENV`: Environment mode (development|production) - defaults to "development"
- `LOG_LEVEL`: Logging level (trace|debug|info|warn|error|fatal) - required

### Dependencies

- zod: ^4.3.6 - Schema validation library
- dotenv: ^17.2.3 - Environment variable loading from .env files
- dotenv-expand: ^12.0.3 - Variable expansion in .env files

### Technical Details

- **Validation**: Uses Zod for runtime type checking and validation
- **Loading**: Automatically loads and expands `.env` files on import
- **Error handling**: Exits process with code 1 on validation failure
- **Type inference**: Merges base and additional types for full type safety
- **Schema composition**: Combines base schema with additional variables
