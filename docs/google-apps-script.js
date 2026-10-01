/**
 * Selora Beauty — Google Sheets Order Webhook
 * ─────────────────────────────────────────────
 * HOW TO DEPLOY:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete all existing code and paste this entire file
 *  3. Save (Ctrl+S)
 *  4. Click "Deploy" → "New deployment"
 *     - Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Click "Deploy" → copy the Web App URL
 *  6. Paste that URL into backend/.env as GOOGLE_SHEETS_WEBHOOK_URL=<url>
 *
 * NOTE: Every time you edit the code redeploy with "New version".
 *
 * SHEET COLUMNS (auto-created on first order):
 *  A: date | B: order id | C: name | D: phone | E: city | F: adress |
 *  G: country | H: product | I: quantite | J: sku | K: statut |
 *  L: curancy | M: total price
 */

var SHEET_NAME = "الورقة1"; // Change if your sheet tab has a different name

function doPost(e) {
  try {
    var raw  = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(raw);
    var row  = appendOrder(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", order_id: data.order_id || "", row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Selora Beauty webhook is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendOrder(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

  // Auto-create header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "date", "order id", "name", "phone", "city", "adress",
      "country", "product", "quantite", "sku", "statut", "curancy", "total price"
    ]);
    var header = sheet.getRange(1, 1, 1, 13);
    header.setFontWeight("bold");
    header.setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.date         || "",
    data.order_id     || "",
    data.name         || "",
    data.phone        || "",
    data.city         || "",
    data.adress       || "",
    data.country      || "KSA",
    data.product      || "",
    data.quantite     || "",
    data.sku          || "",
    data.statut       || "",
    data.curancy      || "SAR",
    data.total_price  || 0
  ]);

  return sheet.getLastRow();
}
