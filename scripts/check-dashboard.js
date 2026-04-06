const fs = require("fs");
const path = require("path");

const appPath = path.join(__dirname, "..", "app.js");
const text = fs.readFileSync(appPath, "utf8");

const requiredTokens = [
  "function filteredData()",
  "function renderKpis(data)",
  "function renderBudget(data)",
  "function renderStatus(data)",
  "function renderTrend(data)",
  "function renderWardPerformance(data)",
  "function renderTable(data)",
  "function exportCsv(data)",
  "function validateDataset()"
];

const missing = requiredTokens.filter(token => !text.includes(token));
if (missing.length) {
  console.error("Missing required dashboard functions:", missing.join(", "));
  process.exit(1);
}

console.log("Dashboard smoke check passed.");
