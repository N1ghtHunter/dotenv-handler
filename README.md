# dotenv-helper

`dotenv-helper` is a lightweight utility for managing environment variables in your Node.js applications. It provides an easy way to load, access, and manage environment variables with additional features like default values and required checks.

## Installation

```sh
npm install dotenv-helper
```

or

```sh
pnpm add dotenv-helper
```

## Usage

### Load environment variables

```js
import { loadConfig, getConfig } from 'dotenv-helper';

// Load configuration from .env file
loadConfig('.env', {
  defaults: {
    DEFAULT_KEY: 'defaultValue'
  },
  required: ['PORT', 'DB_USER']
});

// Get configuration values
const port = getConfig('PORT');
const dbUser = getConfig('DB_USER');
console.log(`Server will run on port: ${port}`);
console.log(`Database user: ${dbUser}`);
```

### Set default values for environment variables

```js
loadConfig('.env', {
  defaults: {
    DEFAULT_KEY: 'defaultValue'
  }
});
```

### Validate required environment variables

```js
loadConfig('.env', {
  required: ['PORT', 'DB_USER']
});
```

### Save environment variables to a file

```js
import { setEnv, saveConfig } from 'dotenv-helper';

setEnv('NEW_KEY', 'newValue');
saveConfig('.env');
```

## API

### `loadConfig(path: string, options?: LoadConfigOptions): void`

Loads environment variables from the specified file.

- `path`: Path to the file containing environment variables.
- `options`: An object with the following properties:
  - `defaults`: An object with default values for environment variables.
  - `required`: An array of environment variables that are required.

### `getConfig(key: string): string | undefined`

Returns the value of the specified environment variable.

- `key`: The name of the environment variable.

### `setEnv(key: string, value: string): void`

Sets the value of the specified environment variable.

- `key`: The
- `value`: The value to set.

### `saveConfig(path: string): void`

Saves the current environment variables to the specified file.

- `path`: Path to the file where environment variables should be saved.

## License

MIT