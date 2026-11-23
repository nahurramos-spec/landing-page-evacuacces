import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const result = spawnSync(process.execPath, ["--test", "--test-reporter=tap", "tests/state.test.mjs"], { encoding: "utf8" });
mkdirSync("docs/evidencias", { recursive: true });
writeFileSync("docs/evidencias/qa-state.tap", result.stdout || "");
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exitCode = result.status ?? 1;
