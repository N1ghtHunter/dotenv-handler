import { loadEnv, getEnv, setEnv, saveEnv } from '../src/utils';
import * as fs from 'fs';

jest.mock('fs');

describe('dotenv-handler', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it('should throw an error if the .env file does not exist', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    mockExistsSync.mockReturnValue(false);

    expect(() => loadEnv('.env')).toThrow('The file .env does not exist');
  });

  it('should load environment variables from a file', () => {
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockReadFileSync = fs.readFileSync as jest.Mock;
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('TEST_VAR=123\nANOTHER_VAR=456');

    loadEnv('.env');

    expect(getEnv('TEST_VAR')).toBe('123');
    expect(getEnv('ANOTHER_VAR')).toBe('456');
  });

  it('should set and get environment variables', () => {
    setEnv('TEST_VAR', '123');
    expect(getEnv('TEST_VAR')).toBe('123');
  });

  it('should save environment variables to a file', () => {
    setEnv('TEST_VAR', '123');
    setEnv('ANOTHER_VAR', '456');

    const mockWriteFileSync = fs.writeFileSync as jest.Mock;
    saveEnv('.env');

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('TEST_VAR=123\nANOTHER_VAR=456'),
    );
  });
});
