/**
 * BLOOM Me UI 文言管理 — Google Apps Script
 *
 * 使い方:
 * 1. docs/i18n/ui-strings.csv を Google スプレッドシートにインポート
 * 2. 拡張機能 > Apps Script を開き、この Code.gs を貼り付け
 * 3. 保存後、スプレッドシートを再読み込み → メニュー「BLOOM Me 文言」が表示
 */

const SHEET_NAME = "ui-strings";
const HEADERS = [
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
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("BLOOM Me 文言")
    .addItem("リンク列を更新", "refreshHyperlinks")
    .addItem("未修正のみ表示", "showDraftOnly")
    .addItem("全件表示", "showAllRows")
    .addItem("承認済み CSV を出力", "exportApprovedCsv")
    .addToUi();
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(`シート "${SHEET_NAME}" が見つかりません。CSV インポート時のシート名を合わせてください。`);
  }
  return sheet;
}

function refreshHyperlinks() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  for (let row = 2; row <= lastRow; row++) {
    const localLink = sheet.getRange(row, 5).getValue();
    const githubLink = sheet.getRange(row, 6).getValue();
    const file = sheet.getRange(row, 3).getValue();
    const line = sheet.getRange(row, 4).getValue();

    if (localLink) {
      sheet.getRange(row, 5).setFormula(`=HYPERLINK("${localLink}", "${file}:${line}")`);
    }
    if (githubLink) {
      sheet.getRange(row, 6).setFormula(`=HYPERLINK("${githubLink}", "GitHub L${line}")`);
    }
  }

  SpreadsheetApp.getUi().alert("link_local / link_github 列を HYPERLINK に更新しました。");
}

function showDraftOnly() {
  const sheet = getSheet_();
  const filter = sheet.getFilter();
  if (!filter) {
    sheet.getRange(1, 1, sheet.getLastRow(), HEADERS.length).createFilter();
  }
  const newFilter = sheet.getFilter();
  const statusColumn = HEADERS.indexOf("status") + 1;
  newFilter.removeColumnFilterCriteria(statusColumn);
  newFilter.setColumnFilterCriteria(statusColumn, SpreadsheetApp.newFilterCriteria().whenTextEqualTo("draft").build());
}

function showAllRows() {
  const sheet = getSheet_();
  const filter = sheet.getFilter();
  if (filter) {
    filter.remove();
  }
}

function exportApprovedCsv() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    SpreadsheetApp.getUi().alert("データがありません。");
    return;
  }

  const headers = values[0];
  const statusIndex = headers.indexOf("status");
  const revisedIndex = headers.indexOf("text_revised");
  const currentIndex = headers.indexOf("text_current");

  const approvedRows = [headers];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const status = String(row[statusIndex] ?? "");
    const revised = String(row[revisedIndex] ?? "").trim();
    const current = String(row[currentIndex] ?? "");
    if (status === "approved" && revised.length > 0 && revised !== current) {
      approvedRows.push(row);
    }
  }

  if (approvedRows.length < 2) {
    SpreadsheetApp.getUi().alert("承認済みの修正行がありません。\ntext_revised を記入し status を approved にしてください。");
    return;
  }

  const csv = approvedRows.map((row) => row.map(escapeCsv_).join(",")).join("\n");
  const fileName = `ui-strings-approved-${Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyyMMdd-HHmm")}.csv`;
  const file = DriveApp.createFile(fileName, csv, MimeType.CSV);

  SpreadsheetApp.getUi().alert(
    `承認済み ${approvedRows.length - 1} 件を CSV 出力しました。\n\n` +
      `ファイル名: ${fileName}\n` +
      `Drive URL: ${file.getUrl()}\n\n` +
      `ローカルで:\n` +
      `npm run i18n:import -- --input=docs/i18n/ui-strings-approved.csv`,
  );
}

function escapeCsv_(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
