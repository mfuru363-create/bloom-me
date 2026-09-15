import fs from "node:fs";
import path from "node:path";

export type MatchType = "literal" | "template";

export type StringEntry = {
  id: string;
  category: string;
  file: string;
  line: number;
  context: string;
  text_current: string;
  matchType: MatchType;
  search: string;
};

export type StringsManifest = {
  repoRoot: string;
  githubBase: string;
  obsidianCopy?: string;
  strings: StringEntry[];
};

export const CSV_HEADERS = [
  "id",
  "category",
  "file",
  "line",
  "link_local",
  "link_github",
  "context",
  "matchType",
  "text_current",
  "text_revised",
  "status",
  "notes",
] as const;

export function loadManifest(repoRoot: string): StringsManifest {
  const manifestPath = path.join(repoRoot, "docs/i18n/strings-manifest.json");
  const raw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(raw) as StringsManifest;
}

export function findLineNumber(content: string, search: string, hintLine: number): number {
  const lines = content.split("\n");
  const start = Math.max(0, hintLine - 5);
  const end = Math.min(lines.length, hintLine + 5);

  for (let i = start; i < end; i++) {
    if (lines[i]?.includes(search)) return i + 1;
  }

  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.includes(search)) return i + 1;
  }

  return hintLine;
}

export function buildLocalLink(repoRoot: string, file: string, line: number): string {
  const absolute = path.join(repoRoot, file);
  return `vscode://file${absolute}:${line}`;
}

export function buildGithubLink(githubBase: string, file: string, line: number): string {
  return `${githubBase}/${file}#L${line}`;
}

export function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function parseCsv(content: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n").filter((line) => line.length > 0);
  if (lines.length === 0) return rows;

  const headers = parseCsvLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

export function rowsToCsv(rows: Record<string, string>[]): string {
  const headerLine = CSV_HEADERS.join(",");
  const body = rows
    .map((row) => CSV_HEADERS.map((header) => escapeCsv(row[header] ?? "")).join(","))
    .join("\n");
  return `${headerLine}\n${body}\n`;
}

export function computeReplacement(entry: StringEntry, textRevised: string): string {
  if (entry.search.includes(entry.text_current)) {
    return entry.search.replace(entry.text_current, textRevised);
  }
  return textRevised;
}
