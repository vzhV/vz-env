import fs from "fs";
import { handleError, handleMessage } from "./utils.js";
import { CONFIG_FILES } from "../constants/config-files.js";

export function generateDocs(outputFile) {
  try {
    const configFile = findConfigFile();
    if (!configFile) {
      handleError("No configuration file found (.vz-envrc or vz-env.config.json).");
    }

    const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));

    const docsContent = createMarkdownDocs(config);

    fs.writeFileSync(outputFile, docsContent);
    handleMessage(`Documentation successfully generated at "${outputFile}".`);
  } catch (error) {
    handleError(`Failed to generate documentation. ${error.message}`);
  }
}

function findConfigFile() {
  return CONFIG_FILES.find((file) => fs.existsSync(file));
}

function createMarkdownDocs(config) {
    const header = `# Environment Variables Documentation\n\n`;
    const description = `This document lists all environment variables, their types, and default values as defined in the configuration file.\n\n`;
  
    const rows = Object.entries(config).map(([key, { type, required, default: defaultValue }]) => ({
      Name: key,
      Type: type,
      Required: required ? "Yes" : "No",
      "Default Value": defaultValue !== undefined ? defaultValue : "",
    }));
  
    const columns = ["Name", "Type", "Required", "Default Value"];
    const columnWidths = columns.map((col) =>
      Math.max(
        col.length,
        ...rows.map((row) => String(row[col]).length)
      )
    );
  
    const padCell = (content, width) => content + " ".repeat(width - content.length);
  
    const tableHeader = `| ${columns.map((col, i) => padCell(col, columnWidths[i])).join(" | ")} |`;
    const tableDivider = `|-${columnWidths.map((w) => "-".repeat(w)).join("-|-")}-|`;
  
    const tableRows = rows
      .map((row) =>
        `| ${columns.map((col, i) => padCell(String(row[col]), columnWidths[i])).join(" | ")} |`
      )
      .join("\n");
  
    return header + description + tableHeader + "\n" + tableDivider + "\n" + tableRows;
  }
