import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const result = spawnSync(process.execPath, ["--test", "--test-reporter=tap", "tests/state.test.mjs"], { encoding: "utf8" });
const directory = process.env.EVIDENCE_DIR || "docs/evidencias";
mkdirSync(directory, { recursive: true });
writeFileSync(`${directory}/qa-state.tap`, result.stdout || "");
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
process.exitCode = result.status ?? 1;
