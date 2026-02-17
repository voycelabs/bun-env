import { afterEach, beforeEach, describe, expect, it, vi } from 'bun:test';
import { z } from 'zod';
import { createEnv } from '../src/index';

const ORIGINAL_ENV = { ...process.env };

describe('createEnv', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('validates base env vars and returns typed object', () => {
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'info';
    const env = createEnv();
    expect(env.NODE_ENV).toBe('production');
    expect(env.LOG_LEVEL).toBe('info');
  });

  it('applies default for NODE_ENV if not set', () => {
    delete process.env.NODE_ENV;
    process.env.LOG_LEVEL = 'debug';
    const env = createEnv();
    expect(env.NODE_ENV).toBe('development');
    expect(env.LOG_LEVEL).toBe('debug');
  });

  it('throws and exits on invalid base env', () => {
    process.env.NODE_ENV = 'invalid';
    process.env.LOG_LEVEL = 'info';
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    expect(() => createEnv()).toThrow('exit');
    exitSpy.mockRestore();
  });

  it('validates and merges custom vars', () => {
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'warn';
    process.env.MY_PORT = '8080';
    const env = createEnv({
      MY_PORT: z.coerce.number().int().positive(),
    });
    expect(env.MY_PORT).toBe(8080);
    expect(env.NODE_ENV).toBe('production');
  });

  it('logs error and exits on invalid custom var', () => {
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'warn';
    process.env.MY_PORT = 'notanumber';
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    expect(() => createEnv({ MY_PORT: z.coerce.number().int().positive() })).toThrow('exit');
    exitSpy.mockRestore();
  });

  it('allows overriding base schema', () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'error';
    const env = createEnv({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('test'),
    }) as { NODE_ENV: 'development' | 'production' | 'test'; LOG_LEVEL: string };
    expect(env.NODE_ENV).toBe('test');
    expect(env.LOG_LEVEL).toBe('error');
  });
});
