import { validateConfig, handleMissingKeys, expandVariable } from '../src/validators';

describe('validateConfig', () => {
  it('should return an array of missing keys', () => {
    const config = {
      key1: 'value1',
      key2: '',
      key3: 'value3',
    };
    const required = ['key1', 'key2', 'key3'];
    const missingKeys = validateConfig(config, required);
    expect(missingKeys).toEqual(['key2']);
  });

  it('should return an empty array if all required keys are present', () => {
    const config = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const required = ['key1', 'key2', 'key3'];
    const missingKeys = validateConfig(config, required);
    expect(missingKeys).toEqual([]);
  });
});

describe('handleMissingKeys', () => {
  it('should throw an error if errorOnMissing is true and there are missing keys', () => {
    const missingKeys = ['key1', 'key2'];
    const options = {
      errorOnMissing: true,
    };
    expect(() => {
      handleMissingKeys(missingKeys, options);
    }).toThrow('Missing required environment variables: key1, key2');
  });

  it('should log a warning message if errorOnMissing is false and there are missing keys', () => {
    const missingKeys = ['key1', 'key2'];
    const options = {
      errorOnMissing: false,
    };
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    handleMissingKeys(missingKeys, options);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Missing required environment variables: key1, key2');
    consoleWarnSpy.mockRestore();
  });

  it('should not throw an error or log a warning message if there are no missing keys', () => {
    const missingKeys = [] as string[];
    const options = {
      errorOnMissing: true,
    };
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    handleMissingKeys(missingKeys, options);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});

describe('expandVariable', () => {
  it('should replace variables in the value with their corresponding values from the config', () => {
    const value = 'Hello, ${name}! Your age is ${age}.';
    const config = {
      name: 'John',
      age: '30',
    };
    const expandedValue = expandVariable(value, config);
    expect(expandedValue).toBe('Hello, John! Your age is 30.');
  });

  it('should return an empty string if the variable is not present in the config', () => {
    const value = 'Hello, ${name}!';
    const config = {};
    const expandedValue = expandVariable(value, config);
    expect(expandedValue).toBe('Hello, !');
  });
});
