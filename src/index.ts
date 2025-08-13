#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import inquirer from "inquirer";
import degit from "degit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CLI version
const pkgPath = path.join(__dirname, "../package.json");
const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

async function main() {
  console.log(`🚀 Create Node App (v${version})`);

  // Step 1: Ask for project directory
  const { targetDir } = await inquirer.prompt([
    {
      name: "targetDir",
      type: "input",
      message: "Where should we create the project?",
      default: ".",
    },
  ]);

  // Step 2: Choose framework
  const { framework } = await inquirer.prompt([
    {
      name: "framework",
      type: "list",
      message: "Choose a Node.js framework:",
      choices: ["express", "fastify", "koa"],
    },
  ]);

  // Step 3: Build repo path
  const repo = `bettaibi/node-starter-template/${framework}#v${version}`;

  console.log(`📦 Using template: ${repo}`);

  // Step 4: Clone base framework template
  const emitter = degit(repo, { cache: false, force: true, verbose: true });

  await emitter.clone(targetDir);
  console.log("✅ Base framework files copied!");

  // Step 5: Install dependencies
  console.log("📥 Installing dependencies...");
  execSync("npm install", {
    cwd: path.resolve(process.cwd(), targetDir),
    stdio: "inherit",
  });

  console.log(`🎉 Done! Your ${framework} project is ready:
  cd ${targetDir}
  npm run dev
  `);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
