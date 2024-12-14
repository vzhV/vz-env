# vz-env

`vz-env` is a CLI tool for managing and validating environment variables. It provides features to sync `.env` files, create and update configuration files, validate environment variables, encrypt/decrypt sensitive files, and generate documentation for environment variables.

## Installation

To use `vz-env`, install it globally via npm:

```bash
npm install -g vz-env
```

## Commands

### 1. `sync`

Synchronize `.env` files by copying missing variables from a source file to a target file.

#### Usage:
```bash
vz-env sync --source <file> --target <file>
```

#### Options:
- `--source <file>`: The source `.env` file to sync from (default: `.env.example`).
- `--target <file>`: The target `.env` file to sync to (default: `.env.local`).

#### Example:
```bash
vz-env sync --source .env.example --target .env.local
```

---

### 2. `create-config`

Create or update a configuration file for environment variables. It can parse an existing `.env` file to generate a base configuration or allow manual input of variable details.

#### Usage:
```bash
vz-env create-config --env-file <file>
```

#### Options:
- `--env-file <file>`: Parse variables from an existing `.env` file.

#### Example:
```bash
vz-env create-config --env-file .env.example
```

If no `--env-file` is provided, the CLI will prompt for manual input of variables.

---

### 3. `validate`

Validate an environment file against the configuration defined in `.vz-envrc` or `vz-env.config.json`.

#### Usage:
```bash
vz-env validate --env <file>
```

#### Options:
- `--env <file>`: The `.env` file to validate (default: `.env.local`).

#### Example:
```bash
vz-env validate --env .env.local
```

This command checks if all required variables are present and if their values match the expected types.

---

### 4. `encrypt`

Encrypt an `.env` file to secure sensitive information.

#### Usage:
```bash
vz-env encrypt --file <file> --password <password>
```

#### Required Options:
- `--file <file>`: The `.env` file to encrypt.
- `--password <password>`: The password to use for encryption.

#### Example:
```bash
vz-env encrypt --file .env.local --password mysecretpassword
```

The encrypted file will be saved as `<file>.enc`.

---

### 5. `decrypt`

Decrypt an encrypted `.env` file.

#### Usage:
```bash
vz-env decrypt --file <file> --password <password>
```

#### Required Options:
- `--file <file>`: The encrypted file to decrypt (e.g., `.env.local.enc`).
- `--password <password>`: The password used during encryption.

#### Example:
```bash
vz-env decrypt --file .env.local.enc --password mysecretpassword
```

The decrypted file will be saved with its original name (e.g., `.env.local`).

---

### 6. `docs`

Generate Markdown documentation for environment variables based on the configuration.

#### Usage:
```bash
vz-env docs --output <file>
```

#### Options:
- `--output <file>`: The output file for the generated documentation (default: `ENV_VARIABLES.md`).

#### Example:
```bash
vz-env docs --output ENV_VARIABLES.md
```

The generated documentation includes a table of environment variables, their types, and default values.

---

## Configuration Files

- `.vz-envrc` (primary): Stores configuration for environment variables.
- `vz-env.config.json` (fallback): Alternative configuration file if `.vz-envrc` is not present.

---

## Examples

### Sync Environment Files
```bash
vz-env sync --source .env.example --target .env.local
```

### Create Configuration
```bash
vz-env create-config --env-file .env.example
```

### Validate Environment Variables
```bash
vz-env validate --env .env.local
```

### Encrypt Environment File
```bash
vz-env encrypt --file .env.local --password mypassword
```

### Decrypt Environment File
```bash
vz-env decrypt --file .env.local.enc --password mypassword
```

### Generate Documentation
```bash
vz-env docs --output ENV_VARIABLES.md
```

---

## License

This project is licensed under the MIT License.
