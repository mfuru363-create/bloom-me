import fs from "node:fs";
import path from "node:path";
import {
  buildGithubLink,
  buildLocalLink,
  findLineNumber,
  loadManifest,
  parseCsv,
  rowsToCsv,
  type StringEntry,
} from "./i18n-utils";

const repoRoot = process.cwd();
const manifest = loadManifest(repoRoot);

function exportRow(entry: StringEntry, existing?: Record<string, string>) {
  const filePath = path.join(repoRoot, entry.file);
  const content = fs.readFileSync(filePath, "utf8");
  const line = findLineNumber(content, entry.search, entry.line);

  return {
    id: entry.id,
    category: entry.category,
    file: entry.file,
    line: String(line),
    link_local: buildLocalLink(repoRoot, entry.file, line),
    link_github: buildGithubLink(manifest.githubBase, entry.file, line),
    context: entry.context,
    matchType: entry.matchType,
    text_current: entry.text_current,
    text_revised: existing?.text_revised ?? "",
    status: existing?.status ?? "draft",
    notes: existing?.notes ?? "",
  };
}

function main() {
  const csvPath = path.join(repoRoot, "docs/i18n/ui-strings.csv");
  const existingMap = fs.existsSync(csvPath)
    ? new Map(parseCsv(fs.readFileSync(csvPath, "utf8")).map((row) => [row.id, row]))
    : new Map<string, Record<string, string>>();

  const rows = manifest.strings.map((entry) => exportRow(entry, existingMap.get(entry.id)));
  const csv = rowsToCsv(rows);

  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, csv, "utf8");

  if (manifest.obsidianCopy) {
    fs.mkdirSync(path.dirname(manifest.obsidianCopy), { recursive: true });
    fs.writeFileSync(manifest.obsidianCopy, csv, "utf8");
  }

  console.log(`Exported ${rows.length} strings -> ${csvPath}`);
  if (manifest.obsidianCopy) {
    console.log(`Copied -> ${manifest.obsidianCopy}`);
  }
}

main();
