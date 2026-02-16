/**
 * Environment Configuration Package
 * This package handles loading, validating, and providing access to environment variables.
 * It uses Zod for schema validation to ensure all required environment variables are present
 * and have the correct types. The package loads variables from .env files using dotenv.
 *
 * The package provides a base set of environment variables and allows extending with additional
 * variables or overriding existing ones.
 */
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import type { ZodError } from 'zod';
import z from 'zod';

// Load and expand environment variables from .env files
expand(config());

/**
 * Base Zod schema defining the structure and validation rules for core environment variables.
 * Each property specifies the expected type and any default values or constraints.
 * These are the "certain ones" that are kept unless overridden.
 */
const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']),
});

/**
 * Type inference from the base schema.
 */
export type BaseEnv = z.infer<typeof baseSchema>;

/**
 * Creates and validates environment variables.
 * Allows adding additional environment variables and overriding base ones.
 *
 * @param additionalVars - Optional object of additional or overriding Zod schemas for env vars.
 * @returns Validated environment variables object including base and additional vars.
 */
export function createEnv<T extends Record<string, z.ZodType> = Record<string, never>>(
  additionalVars?: T,
): BaseEnv & z.infer<z.ZodObject<T>> {
  const schema = z.object({
    ...baseSchema.shape,
    ...(additionalVars || {}),
  });

  try {
    // Parse and validate the process.env using the combined schema
    // eslint-disable-next-line node/no-process-env
    return schema.parse(process.env) as BaseEnv & z.infer<z.ZodObject<T>>;
  } catch (error) {
    // Handle validation errors by logging them and exiting the process
    const envError = error as ZodError;
    console.error('❌ Invalid environment variables: ');
    // Flatten the error to show field-specific validation errors
    console.error(envError.flatten().fieldErrors);
    // Exit with error code 1 to indicate failure
    process.exit(1);
  }
}
