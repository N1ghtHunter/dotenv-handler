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
  // Set default values for environment variables
  defaults: {
    DEFAULT_KEY: 'defaultValue',
    // Expand must be set to true to use environment variables in default values
    DATABASE_URL: 'localhost:${PORT}/${DB_NAME}',
  },
  // Validate required environment variables
  required: ['PORT', 'DB_USER', 'DB_NAME'],
  // This will allow environment variables to be expanded
  expand: true,
  // Apply transformations to environment variables
  transformations: {
    PORT: value => parseInt(value, 10).toString(),
    DEFAULT_KEY: value => value.toUpperCase(),
  },
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
  // This will allow environment variables to be expanded
  expand: true,
  required: ['DATABASE_URL'],
});

const databaseUrl = getConfig('DATABASE_URL');
console.log(`Database URL: ${databaseUrl}`);
```

### Apply custom validation logic

```js
import { loadConfig, getConfig } from 'dotenv-handler';
import Joi from 'joi';

const schema = Joi.object({
  PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

loadConfig('.env', {
  required: ['PORT', 'DB_USER', 'DB_NAME'],
  validate: config => {
    const { error, value } = schema.validate(config);
    if (error) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
    return value;
  },
});

const port = getConfig('PORT');
const dbUser = getConfig('DB_USER');
const dbName = getConfig('DB_NAME');
console.log(`Server will run on port: ${port}`);
console.log(`Database user: ${dbUser}`);
console.log(`Database name: ${dbName}`);
```

### Apply transformations to environment variables

```js
loadConfig('.env', {
  // Apply transformations to environment variables
  transformations: {
    PORT: value => parseInt(value, 10).toString(),
    DB_USER: value => value.toUpperCase(),
  },
});

const port = getConfig('PORT');
const dbUser = getConfig('DB_USER');
console.log(`Server will run on port: ${port}`);
console.log(`Database user: ${dbUser}`);
```

### Silence errors on missing required variables

```js
loadConfig('.env', {
  required: ['PORT'],
  errorOnMissing: false,
});
```

### Basic usage with CommonJS

```js
const { loadConfig, getConfig } = require('dotenv-handler');

loadConfig('.env');

const port = getConfig('PORT');
console.log(`Server will run on port: ${port}`);
```

### Use dotenv config object

```js
import { loadConfig } from 'dotenv-handler';

loadConfig({ path: '.env.test' }, { required: ['PORT', 'DB_USER'] });

const port = getConfig('PORT');
const dbUser = getConfig('DB_USER');
console.log(`Server will run on port: ${port}`);
console.log(`Database user: ${dbUser}`);
```

## API

### `loadConfig(envFilePathOrOptions: string | DotenvConfigOptions, options?: LoadConfigOptions): void`

Loads environment variables from the specified file.

- `envFilePathOrOptions`: Path to the file where environment variables are stored or a dotEnv config object.
- `options`: An object with the following properties:
  - `defaults`: An object with default values for environment variables.
  - `required`: An array of environment variables that are required.
  - `expand`: A boolean value indicating whether to expand environment variables.
  - `errorOnMissing`: A boolean value indicating whether to throw an error if a
    required environment variable is missing.
  - `transformations`: An object with transformation functions for environment variables.
  - `validate`: A function that applies custom validation logic to the loaded configuration.

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
