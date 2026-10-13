/**
 * Selora Beauty — Google Sheets Order Webhook
 * ─────────────────────────────────────────────
 * HOW TO DEPLOY:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete all existing code and paste this entire file
 *  3. Save (Ctrl+S)
 *  4. Click "Deploy" → "Manage deployments" (or "New deployment")
 *     - Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Click "Deploy"
 *
 * SHEET COLUMNS (14 columns matching your sheet):
 *  A: date       | B: order id | C: name     | D: phone     | E: city       | F: adress
 *  G: country    | H: product  | I: quantite | J: test      | K: sku        | L: url
 *  M: curancy    | N: total price
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

function _formatPhone(raw) {
  if (!raw) return "";
  var phone = String(raw).replace(/\s+/g, "").replace(/-/g, "");
  if (phone.indexOf("966") === 0) return phone;
  if (phone.indexOf("0") === 0) return "966" + phone.substring(1);
  return "966" + phone;
}

function appendOrder(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

  // Auto-create header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "date", "order id", "name", "phone", "city", "adress",
      "country", "product", "quantite", "test", "sku", "url", "curancy", "total price"
    ]);
    var header = sheet.getRange(1, 1, 1, 14);
    header.setFontWeight("bold");
    header.setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  }

  // Handle items array if provided
  var productStr = data.product || "";
  var skuStr     = data.sku || "";
  var qtyStr     = data.quantite || data.quantity || "1";

  if (data.items && Array.isArray(data.items) && data.items.length > 0) {
    productStr = data.items.map(function(i) { return i.name || ""; }).join("/");
    skuStr     = data.items.map(function(i) { return i.sku || i.id || ""; }).join("/");
    qtyStr     = data.items.map(function(i) { return String(i.quantity || 1); }).join("/");
  }

  // Capture original landing URL with all query parameters (UTM, click IDs, etc.)
  var landingUrl = data.url || data.landing_url || data.page_url || "";

  var orderDate = data.date || Utilities.formatDate(new Date(), "Asia/Riyadh", "dd/MM/yyyy");
  var phoneFormatted = _formatPhone(data.phone);
  var totalPrice = (data.total_price !== undefined) ? data.total_price : (data.total || 0);

  sheet.appendRow([
    orderDate,                               // A: date
    data.order_id || "",                     // B: order id
    data.name || "",                         // C: name
    phoneFormatted,                          // D: phone
    data.city || "",                         // E: city
    (data.adress || data.address || "").trim(), // F: adress
    data.country || "KSA",                   // G: country
    productStr,                              // H: product
    qtyStr,                                  // I: quantite
    data.test || "",                         // J: test
    skuStr,                                  // K: sku
    landingUrl,                              // L: url (first landing URL with parameters)
    data.curancy || data.currency || "SAR",  // M: curancy
    totalPrice                               // N: total price
  ]);

  return sheet.getLastRow();
}
