import fs from "fs";
import readline from "readline";
import { handleMessage, handleError } from "./utils.js";
import { CONFIG_FILES } from "../constants/config-files.js";

export async function config(envFile) {
  let config = {};

  let addMore = true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  if (envFile) {
    const envVars = parseEnvFile(envFile);
    config = Object.keys(envVars).reduce((acc, key) => {
      acc[key] = {
        type: inferType(envVars[key]),
        required: true,
        default: castValue(envVars[key]),
      };
      return acc;
    }, {});
    const additionalEnvs = await askQuestion("Do you need additional envs? (yes/no): ");
    addMore = additionalEnvs.toLowerCase() === "yes";
  }

  while (addMore) {
    const key = await askQuestion("Enter environment variable name: ");
    const type = await askQuestion("Enter type (string, number, boolean): ");
    const required = await askQuestion("Is it required? (yes/no): ");
    let defaultValue = await askQuestion("Enter default value (optional): ");

    while (!isValidType(defaultValue, type || "string")) {
      console.error(`Invalid default value for type "${type}". Please try again.`);
      defaultValue = await askQuestion("Enter a valid default value: ");
    }

    config[key] = {
      type: type || "string",
      required: required.toLowerCase() === "yes",
      default: castValue(defaultValue, type || "string"),
    };

    const more = await askQuestion("Add another variable? (yes/no): ");
    addMore = more.toLowerCase() === "yes";
  }

  rl.close();

  const configFile = CONFIG_FILES.find((file) => fs.existsSync(file)) || CONFIG_FILES[0];
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  handleMessage(`Configuration saved to ${configFile}`);
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split("\n").reduce((vars, line) => {
    const [key, value] = line.split("=");
    if (key) vars[key.trim()] = value?.trim() || "";
    return vars;
  }, {});
}

function inferType(value) {
  if (/^(true|false)$/i.test(value)) return "boolean";
  if (!isNaN(value)) return "number";
  return "string";
}

function castValue(value, type) {
  switch (type) {
    case "boolean":
      return value.toLowerCase() === "true";
    case "number":
      return Number(value);
    case "string":
      return value;
    default:
      return value;
  }
}

function isValidType(value, type) {
  switch (type) {
    case "boolean":
      return /^(true|false)$/i.test(value);
    case "number":
      return !isNaN(value);
    case "string":
      return typeof value === "string";
    default:
      return false;
  }
}
