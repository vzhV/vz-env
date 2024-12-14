import fs from "fs";
import readline from "readline";
import { handleError, handleMessage } from "./utils.js";

export async function sync(sourceFile, targetFile) {
  try {
    if (!fs.existsSync(sourceFile)) {
      handleError(`Source file "${sourceFile}" does not exist.`);
    }

    const sourceVars = parseEnvFile(sourceFile);
    const targetVars = fs.existsSync(targetFile) ? parseEnvFile(targetFile) : {};
    const newVars = {};

    for (const [key, value] of Object.entries(sourceVars)) {
      if (!targetVars[key]) {
        newVars[key] = value || "";
      }
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    for (const key of Object.keys(newVars)) {
      newVars[key] = await new Promise((resolve) =>
        rl.question(`Value for ${key} (default: "${newVars[key]}"): `, (answer) =>
          resolve(answer || newVars[key])
        )
      );
    }

    rl.close();

    const mergedVars = { ...targetVars, ...newVars };
    fs.writeFileSync(targetFile, formatEnvFile(mergedVars));
    handleMessage(`Environment file "${targetFile}" synced successfully.`);
  } catch (error) {
    handleError(`Failed to sync environment files. ${error.message}`);
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

function formatEnvFile(vars) {
  return Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}
