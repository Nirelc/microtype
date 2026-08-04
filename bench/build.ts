import fs from "node:fs/promises";
import path from "node:path";

const entrypoints = [
  "microtype.ts",
  "valibot.ts",
  "arktype.ts",
  "typebox.ts",
  "zod.ts",
].map((entry) => `size/${entry}`);

await Bun.build({
  root: ".",
  entrypoints,
  outdir: "sizedist",
});

function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const DIST_DIR = "./sizedist/size";
const files = await fs.readdir(DIST_DIR);
console.log("Bundle sizes:");
for (const file of files) {
  const fileStat = Bun.file(path.join(DIST_DIR, file));
  console.log(`${file} - ${formatBytes(fileStat.size)}`);
}
