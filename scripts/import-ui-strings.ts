import fs from "node:fs";
import path from "node:path";
import {
  computeReplacement,
  loadManifest,
  parseCsv,
  rowsToCsv,
  type StringEntry,
} from "./i18n-utils";

const repoRoot = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const inputArg = process.argv.find((arg) => arg.startsWith("--input="));
const inputPath = inputArg
  ? path.resolve(repoRoot, inputArg.replace("--input=", ""))
  : path.join(repoRoot, "docs/i18n/ui-strings.csv");

type PendingChange = {
  entry: StringEntry;
  filePath: string;
  search: string;
  replacement: string;
  textRevised: string;
};

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`CSV not found: ${inputPath}`);
    process.exit(1);
  }

  const manifest = loadManifest(repoRoot);
  const entryMap = new Map(manifest.strings.map((entry) => [entry.id, entry]));
  const rows = parseCsv(fs.readFileSync(inputPath, "utf8"));

  const approved = rows.filter(
    (row) =>
      row.status === "approved" &&
      row.text_revised.trim().length > 0 &&
      row.text_revised !== row.text_current,
  );

  if (approved.length === 0) {
    console.log("No approved revisions to apply.");
    return;
  }

  const fileChanges = new Map<string, PendingChange[]>();

  for (const row of approved) {
    const entry = entryMap.get(row.id);
    if (!entry) {
      console.warn(`Unknown id: ${row.id}`);
      continue;
    }

    const filePath = path.join(repoRoot, entry.file);
    const content = fs.readFileSync(filePath, "utf8");
    const search = entry.search;
    const replacement = computeReplacement(entry, row.text_revised);

    if (!content.includes(search)) {
      console.error(`Search text not found for ${entry.id} in ${entry.file}`);
      console.error(`  search: ${search}`);
      process.exit(1);
    }

    if (entry.matchType === "template") {
      const variableTokens = search.match(/\$\{[^}]+\}|\{[A-Z_]+\}/g) ?? [];
      for (const token of variableTokens) {
        if (!row.text_revised.includes(token)) {
          console.error(`Template ${entry.id} must keep variable token: ${token}`);
          process.exit(1);
        }
      }
    }

    const list = fileChanges.get(filePath) ?? [];
    list.push({ entry, filePath, search, replacement, textRevised: row.text_revised });
    fileChanges.set(filePath, list);
  }

  for (const [filePath, changes] of fileChanges) {
    let content = fs.readFileSync(filePath, "utf8");
    console.log(`\n${path.relative(repoRoot, filePath)}`);

    for (const change of changes) {
      const count = content.split(change.search).length - 1;
      if (count !== 1) {
        console.error(`Expected exactly 1 match for ${change.entry.id}, found ${count}`);
        process.exit(1);
      }

      console.log(`  [${change.entry.id}]`);
      console.log(`    - ${change.search}`);
      console.log(`    + ${change.replacement}`);

      if (!dryRun) {
        content = content.replace(change.search, change.replacement);
      }
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, content, "utf8");
    }
  }

  if (!dryRun) {
    const updatedRows = rows.map((row) => {
      const applied = approved.some((item) => item.id === row.id);
      return applied ? { ...row, status: "applied" } : row;
    });
    fs.writeFileSync(inputPath, rowsToCsv(updatedRows), "utf8");

    const manifestCopy = manifest.obsidianCopy;
    if (manifestCopy && inputPath.endsWith("ui-strings.csv")) {
      fs.writeFileSync(manifestCopy, rowsToCsv(updatedRows), "utf8");
    }
  }

  console.log(
    dryRun
      ? `\nDry run complete (${approved.length} change(s) previewed).`
      : `\nApplied ${approved.length} change(s).`,
  );
}

main();
