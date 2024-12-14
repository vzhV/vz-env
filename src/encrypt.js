import crypto from "crypto";
import fs from "fs";
import { handleError, handleMessage } from "./utils.js";
import { ALGORITHM, IV_LENGTH } from "../constants/encrypt-details.js";

export function encrypt(file, password) {
  try {
    const content = fs.readFileSync(file, "utf-8");
    const key = crypto.createHash("sha256").update(password).digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(content, "utf-8"), cipher.final()]);
    const encryptedData = Buffer.concat([iv, encrypted]);

    fs.writeFileSync(`${file}.enc`, encryptedData);
    handleMessage(`File encrypted to "${file}.enc".`);
  } catch (error) {
    handleError(`Failed to encrypt file. File is corrupted or missing.`);
  }
}

export function decrypt(file, password) {
  try {
    const encryptedData = fs.readFileSync(file);
    const key = crypto.createHash("sha256").update(password).digest();
    const iv = encryptedData.slice(0, IV_LENGTH);
    const encryptedContent = encryptedData.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
    const outputFile = file.replace(".enc", "");
    fs.writeFileSync(outputFile, decrypted.toString("utf-8"));
    handleMessage(`File decrypted to "${outputFile}".`);
  } catch (error) {
    if (error.code === "ERR_OSSL_BAD_DECRYPT") {
      handleError("Decryption failed: Incorrect password or corrupted file.");
    } else {
      handleError(`An unexpected error occurred during decryption. Most likely the file is missing.`);
    }
  }
}
