import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const base = process.env.BASE_URL;
assert.ok(base, "Definir BASE_URL con la URL publicada que se desea verificar");
const directory = process.env.EVIDENCE_DIR || "docs/evidencias/publicado";
async function files(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(`${folder}/${entry.name}`)
    : `${folder}/${entry.name}`))).flat();
}
const paths = ["index.html", ...await files("css"), ...await files("js"), ...await files("assets")];
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const results = await Promise.all(paths.map(async file => {
  try {
    const response = await fetch(new URL(file, base), { signal: AbortSignal.timeout(20000) });
    const actual = Buffer.from(await response.arrayBuffer());
    const expected = await fs.readFile(file);
    const text = /\.(html|css|js|svg|txt)$/.test(file);
    const normalize = value => text ? Buffer.from(value.toString("utf8").replaceAll("\r\n", "\n")) : value;
    const matches = digest(normalize(actual)) === digest(normalize(expected));
    return { file, url: response.url, httpStatus: response.status, contentType: response.headers.get("content-type"), bytes: actual.length, matchesSource: matches, status: response.ok && matches ? "APROBADA" : "FALLÓ" };
  } catch (error) {
    return { file, status: "FALLÓ", detail: error.message };
  }
}));
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(`${directory}/recursos-http.json`, JSON.stringify({ date: new Date().toISOString(), baseURL: base, comparison: "SHA-256 binario; CRLF/LF normalizado en texto por los atributos de Git", results }, null, 2));
console.log(JSON.stringify({ resources: results.length, passed: results.filter(result => result.status === "APROBADA").length, failed: results.filter(result => result.status !== "APROBADA") }, null, 2));
if (results.some(result => result.status !== "APROBADA")) process.exitCode = 1;
