import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// Function to generate a random Base64 key
const generateAppKey = (): string => {
  const key = crypto.randomBytes(32).toString("base64");
  return `base64:${key}`;
};

// Function to update the .env file
const saveKeyToEnv = (key: string): void => {
  const envPath = path.resolve(process.cwd(), ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("APP_KEY=")) {
      console.log("APP_KEY already exists in the .env file.");
      return;
    }
  }

  envContent += `\nAPP_KEY=${key}\n`;
  fs.writeFileSync(envPath, envContent, "utf-8");
  console.log(`APP_KEY has been generated and saved to .env: ${key}`);
};

// CLI setup using Commander
const program = new Command('key:generate');

program
  .name("generate-app-key")
  .description("Generate a new application key and save it to the .env file")
  .action(() => {
    const key = generateAppKey();
    saveKeyToEnv(key);
  });

program.parse(process.argv);
