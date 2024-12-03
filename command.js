"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
// Function to generate a random Base64 key
var generateAppKey = function () {
    var key = crypto.randomBytes(32).toString("base64");
    return "base64:".concat(key);
};
// Function to update the .env file
var saveKeyToEnv = function (key) {
    var envPath = path.resolve(process.cwd(), ".env");
    var envContent = "";
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
        if (envContent.includes("APP_KEY=")) {
            console.log("APP_KEY already exists in the .env file.");
            return;
        }
    }
    envContent += "\nAPP_KEY=".concat(key, "\n");
    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log("APP_KEY has been generated and saved to .env: ".concat(key));
};
// CLI setup using Commander
var program = new commander_1.Command('key:generate');
program
    .name("generate-app-key")
    .description("Generate a new application key and save it to the .env file")
    .action(function () {
    var key = generateAppKey();
    saveKeyToEnv(key);
});
program.parse(process.argv);
