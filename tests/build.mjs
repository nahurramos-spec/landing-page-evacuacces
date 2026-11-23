import { cp, copyFile, lstat, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
if (path.dirname(output) !== root || path.basename(output) !== "dist")
  throw new Error("Destino de compilación fuera del proyecto");
const existing = await lstat(output).catch(error => {
  if (error.code !== "ENOENT") throw error;
  return null;
});
if (existing?.isSymbolicLink()) throw new Error("dist/ no puede ser un enlace simbólico");
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const name of ["css", "js", "assets", "docs"])
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
for (const name of ["index.html", "README.md", ".nojekyll"])
  await copyFile(path.join(root, name), path.join(output, name));
console.log("Sitio estático preparado en dist/");
