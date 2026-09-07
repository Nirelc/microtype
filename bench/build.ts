import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

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
  outdir: "sizedist/unminified",
});

await Bun.build({
  root: ".",
  entrypoints,
  minify: true,
  outdir: "sizedist/minified",
});

function formatBytes(bytes: number, decimals?: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const DIST_DIR = "./sizedist";
const files = await fs.readdir(path.join(DIST_DIR, "unminified/size"));
const results = [];
for (const file of files) {
  const unminifiedFile = Bun.file(
    path.join(DIST_DIR, "unminified/size", file),
  );
  const minifiedFile = Bun.file(path.join(DIST_DIR, "minified/size", file));
  const gzipSize = gzipSync(
    new Uint8Array(await minifiedFile.arrayBuffer()),
  ).byteLength;
  results.push({
    name: path.parse(file).name,
    sizes: [unminifiedFile.size, minifiedFile.size, gzipSize],
  });
}

results.sort((a, b) => a.sizes[0]! - b.sizes[0]!);

console.log("| name | unminified | minified | gzip |");
console.log("| --- | ---: | ---: | ---: |");
for (const [index, result] of results.entries()) {
  let name = result.name === "microtype" ? `**${result.name}**` : result.name;
  if (index === 0) name = `_${name}_`;
  const sizes = result.sizes
    .map((size) => formatBytes(size))
    .join(" | ");
  console.log(`| ${name} | ${sizes} |`);
}
