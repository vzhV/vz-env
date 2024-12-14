import fs from "fs";
import { handleError, handleMessage } from "./utils.js";
import { CONFIG_FILES } from "../constants/config-files.js";

export function validate(envFile) {
  try {
    const configFile = findConfigFile();
    if (!configFile) {
      handleError("No configuration file found (.vz-envrc or vz-env.config.json).");
    }

    const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    const envVars = parseEnvFile(envFile);

    const errors = [];

    for (const [key, rules] of Object.entries(config)) {
      if (rules.required && !envVars[key]) {
        errors.push(`Missing required variable: ${key}`);
      }

      if (rules.type && envVars[key] && !validateType(envVars[key], rules.type)) {
        errors.push(`Invalid type for variable: ${key}. Expected ${rules.type}.`);
      }
    }

    if (errors.length > 0) {
      handleError(`Validation failed with the following errors:\n- ${errors.join("\n- ")}`);
    }

    handleMessage("Validation passed.");
  } catch (error) {
    handleError(`Failed to validate environment variables. ${error.message}`);
  }
}

function findConfigFile() {
  return CONFIG_FILES.find((file) => fs.existsSync(file));
}

function validateType(value, type) {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return !isNaN(parseFloat(value));
    case "boolean":
      return value === "true" || value === "false";
    default:
      return false;
  }
}

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").reduce((vars, line) => {
      const [key, value] = line.split("=");
      if (key) vars[key.trim()] = value?.trim() || "";
      return vars;
    }, {});
  } catch (error) {
    handleError(`Failed to parse .env file at "${filePath}". ${error.message}`);
  }
}
