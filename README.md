# dotenv-handler

`dotenv-handler` is a lightweight utility for managing environment variables in your Node.js applications. It provides an easy way to load, access, and manage environment variables with additional features like default values and required checks.

<p align="center">
  <img src="https://img.shields.io/npm/dt/dotenv-handler" alt="NPM Downloads">
  <img src="https://img.shields.io/npm/v/dotenv-handler" alt="NPM Version">
  <img src="https://img.shields.io/github/license/N1ghtHunter/dotenv-handler" alt="GITHUB License">
</p>

## Installation

```sh
npm install dotenv-handler
```

or

```sh
pnpm add dotenv-handler
```

## Usage

### Load environment variables

```js
import { loadConfig, getConfig } from 'dotenv-handler';

// Load configuration from .env file
loadConfig('.env', {
  defaults: {
    DEFAULT_KEY: 'defaultValue',
    DATABASE_URL: 'localhost:${PORT}/${DB_NAME}',
  },
  required: ['PORT', 'DB_USER', 'DB_NAME'],
  expand: true,
});

// Get configuration values
const port = getConfig('PORT');
const dbUser = getConfig('DB_USER');
const dbUrl = getConfig('DATABASE_URL');
console.log(`Server will run on port: ${port}`);
console.log(`Database user: ${dbUser}`);
console.log(`Database URL: ${dbUrl}`);
```

### Set default values for environment variables

```js
loadConfig('.env', {
  defaults: {
    DEFAULT_KEY: 'defaultValue',
  },
});
```

### Validate required environment variables

```js
loadConfig('.env', {
  required: ['PORT', 'DB_USER'],
});
```

### Save environment variables to a file

```js
import { setEnv, saveConfig } from 'dotenv-handler';

setEnv('NEW_KEY', 'newValue');
saveConfig('.env');
```

### Expanding environment variables

```js
loadConfig('.env', {
  defaults: {
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DATABASE_URL: '${DB_HOST}:${DB_PORT}/database',
  },
  expand: true,
  required: ['DATABASE_URL'],
});

const databaseUrl = getConfig('DATABASE_URL');
console.log(`Database URL: ${databaseUrl}`);
```

### Silence errors on missing required variables

```js
loadConfig('.env', {
  required: ['PORT'],
  errorOnMissing: false,
});
```

## API

### `loadConfig(path: string, options?: LoadConfigOptions): void`

Loads environment variables from the specified file.

- `path`: Path to the file containing environment variables.
- `options`: An object with the following properties:
  - `defaults`: An object with default values for environment variables.
  - `required`: An array of environment variables that are required.
  - `expand`: A boolean value indicating whether to expand environment variables.
  - `errorOnMissing`: A boolean value indicating whether to throw an error if a required environment variable is missing.

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

[MIT](https://choosealicense.com/licenses/mit/)
