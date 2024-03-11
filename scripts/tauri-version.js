import fs from "fs";
import path from "path";
import process from "process";

// if (!process.env.CI) {
// 	console.log("Not running in CI, skipping. Please do not run this script manually!");
// 	process.exit(0);
// }

const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID || "0";
const GITHUB_RUN_ATTEMPT = process.env.GITHUB_RUN_ATTEMPT || "0";
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;

const pkgJsonPath = path.resolve("./package.json");
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
const pkgVersion = pkgJson.version;

// const tauriJsonPath = path.resolve("./src-tauri/tauri.conf.json");
const tauriJsonPath = path.resolve("./src-tauri/version.json");
const tauriJson = {
	version: `${pkgVersion}+${GITHUB_RUN_ID}${GITHUB_RUN_ATTEMPT}`,
};
fs.writeFileSync(tauriJsonPath, JSON.stringify(tauriJson, null, 4));
