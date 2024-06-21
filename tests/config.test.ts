import { loadConfig, getConfig, saveConfig } from '../src/config';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { setEnv } from '../src/utils';

const mockEnvContent = `
PORT=5000
DB_USER=testuser
DB_PASSWORD=testpassword
`;

const mockEnvPath = resolve(process.cwd(), '.env.test');

beforeAll(() => {
  writeFileSync(mockEnvPath, mockEnvContent);
});

afterAll(() => {
  unlinkSync(mockEnvPath);
});

describe('Config', () => {
  it('loads configuration from .env file', () => {
    loadConfig('.env.test');

    expect(getConfig('PORT')).toBe('5000');
    expect(getConfig('DB_USER')).toBe('testuser');
    expect(getConfig('DB_PASSWORD')).toBe('testpassword');
  });

  it('returns undefined for non-existing keys', () => {
    loadConfig('.env.test');

    expect(getConfig('NON_EXISTING_KEY')).toBeUndefined();
  });

  it('throws an error if the .env file does not exist', () => {
    expect(() => loadConfig('.env.nonexistent')).toThrowError();
  });

  it('sets default values if not present in .env', () => {
    loadConfig('.env.test', { defaults: { DEFAULT_KEY: 'defaultValue' } });

    expect(getConfig('DEFAULT_KEY')).toBe('defaultValue');
  });

  it('validates required configuration keys', () => {
    expect(() => loadConfig('.env.test', { required: ['MISSING_KEY'] })).toThrow(
      'Missing required environment variables: MISSING_KEY',
    );
  });

  it('saves configuration to .env file', () => {
    loadConfig('.env.test');
    setEnv('NEW_KEY', 'newValue');
    saveConfig('.env.test');

    loadConfig('.env.test');
    expect(getConfig('NEW_KEY')).toBe('newValue');
  });

  it('expands environment variables', () => {
    loadConfig('.env.test', { expand: true });

    setEnv('EXPAND_KEY', 'expanded');
    setEnv('EXPANDED_KEY', '${EXPAND_KEY}/key');

    saveConfig('.env.test');

    loadConfig('.env.test', {
      required: ['EXPANDED_NEW_KEY'],
      expand: true,
      defaults: { EXPANDED_NEW_KEY: '${EXPANDED_KEY}:DEFAULT' },
    });

    expect(getConfig('EXPAND_KEY')).toBe('expanded');
    expect(getConfig('EXPANDED_KEY')).toBe('expanded/key');
    expect(getConfig('EXPANDED_NEW_KEY')).toBe('expanded/key:DEFAULT');
  });
});
