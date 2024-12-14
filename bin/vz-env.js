#!/usr/bin/env node
import { sync } from "../src/sync.js";
import { validate } from "../src/validate.js";
import { encrypt, decrypt } from "../src/encrypt.js";
import { generateDocs } from "../src/docs.js";

import { Command } from "commander";
import { config } from "../src/config.js";
const program = new Command();

program
  .name("vz-env")
  .description("CLI to manage and validate environment variables")
  .version("1.0.4");

program
  .command("sync")
  .description("Sync .env files")
  .option("--source <file>", "Source .env file", ".env.example")
  .option("--target <file>", "Target .env file", ".env.local")
  .action((options) => sync(options.source, options.target));

program
  .command("create-config")
  .description("Create or update a configuration file")
  .option("--env-file <file>", "Parse variables from an env file")
  .action((options) => config(options.envFile));

program
  .command("validate")
  .description("Validate .env file against configuration")
  .option("--env <file>", "Environment file to validate", ".env.local")
  .action((options) => validate(options.env));

program
  .command("encrypt")
  .description("Encrypt .env file")
  .requiredOption("--file <file>", "File to encrypt")
  .requiredOption("--password <password>", "Encryption password")
  .action((options) => encrypt(options.file, options.password));

program
  .command("decrypt")
  .description("Decrypt .env file")
  .requiredOption("--file <file>", "File to decrypt")
  .requiredOption("--password <password>", "Decryption password")
  .action((options) => decrypt(options.file, options.password));

program
  .command("docs")
  .description("Generate environment variable documentation")
  .option("--output <file>", "Output file", "ENV_VARIABLES.md")
  .action((options) => generateDocs(options.output));

program.parse();
