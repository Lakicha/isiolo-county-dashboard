const projects = [
  { name: "Kinna Health Centre Upgrade", contract: "ISL/HLT/001/25", dept: "Health", ward: "Kinna", fy: "2025/26", status: "Ongoing", allocation: 28000000, spent: 17100000, progress: 61, contractor: "North Frontier Builders", start: "2025-07-12", end: "2026-02-18", quarterSpend: [2100000, 4300000, 5100000, 5600000] },
  { name: "Isiolo-Merti Water Pipeline", contract: "ISL/WAT/013/25", dept: "Water", ward: "Merti", fy: "2025/26", status: "Ongoing", allocation: 41000000, spent: 24600000, progress: 60, contractor: "Blue Valley Engineering", start: "2025-08-03", end: "2026-06-30", quarterSpend: [4800000, 5100000, 7000000, 7700000] },
  { name: "Garbatulla ECDE Classrooms", contract: "ISL/EDU/023/24", dept: "Education", ward: "Garbatulla", fy: "2024/25", status: "Completed", allocation: 13500000, spent: 13250000, progress: 100, contractor: "Arid Schools Works", start: "2024-08-09", end: "2025-03-11", quarterSpend: [2300000, 3800000, 3600000, 3550000] },
  { name: "Town Roads Spot Improvement", contract: "ISL/TRA/007/25", dept: "Transport", ward: "Wabera", fy: "2025/26", status: "Not Started", allocation: 19500000, spent: 2250000, progress: 12, contractor: "County Civil Works", start: "2025-10-01", end: "2026-07-20", quarterSpend: [1300000, 950000, 0, 0] },
  { name: "Borehole Solarization Program", contract: "ISL/WAT/004/24", dept: "Water", ward: "Oldonyiro", fy: "2024/25", status: "Completed", allocation: 15800000, spent: 15700000, progress: 100, contractor: "SunHydro East Africa", start: "2024-07-02", end: "2025-01-20", quarterSpend: [2900000, 4300000, 4500000, 4000000] },
  { name: "Youth Polytechnic Equipment", contract: "ISL/EDU/012/25", dept: "Education", ward: "Burat", fy: "2025/26", status: "Ongoing", allocation: 9200000, spent: 5300000, progress: 58, contractor: "Kifaru Supplies", start: "2025-07-21", end: "2026-01-30", quarterSpend: [1200000, 1500000, 1400000, 1200000] },
  { name: "County Referral Hospital Theatre", contract: "ISL/HLT/015/24", dept: "Health", ward: "Wabera", fy: "2024/25", status: "Completed", allocation: 34200000, spent: 33900000, progress: 100, contractor: "Nafuu Medical Structures", start: "2024-06-14", end: "2025-04-08", quarterSpend: [5600000, 8600000, 9900000, 9800000] },
  { name: "Ngaremara Livestock Market", contract: "ISL/TRD/011/25", dept: "Trade", ward: "Ngaremara", fy: "2025/26", status: "Delayed", allocation: 11200000, spent: 3800000, progress: 34, contractor: "Savannah Infra Ltd", start: "2025-07-09", end: "2026-03-19", quarterSpend: [900000, 1300000, 850000, 750000] },
  { name: "Rural Electrification Link", contract: "ISL/NRG/003/25", dept: "Energy", ward: "Chari", fy: "2025/26", status: "Ongoing", allocation: 20800000, spent: 12900000, progress: 62, contractor: "Powerline Kenya", start: "2025-07-15", end: "2026-05-25", quarterSpend: [2600000, 2800000, 3500000, 4000000] },
  { name: "Bulesa Irrigation Demo Farm", contract: "ISL/AGR/008/24", dept: "Agriculture", ward: "Bulesa", fy: "2024/25", status: "Delayed", allocation: 14300000, spent: 7100000, progress: 50, contractor: "Green Arid Initiatives", start: "2024-09-11", end: "2025-08-10", quarterSpend: [1600000, 1900000, 1850000, 1750000] }
];

const statusColor = { Completed: "#2b8a3e", Ongoing: "#1c7ed6", Delayed: "#f08c00", "Not Started": "#c92a2a" };
const money = n => new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const el = {
  fy: document.getElementById("fyFilter"),
  dept: document.getElementById("departmentFilter"),
  ward: document.getElementById("wardFilter"),
  status: document.getElementById("statusFilter"),
  search: document.getElementById("searchInput"),
  kpiGrid: document.getElementById("kpiGrid"),
  budgetChart: document.getElementById("budgetChart"),
  statusChart: document.getElementById("statusChart"),
  trendChart: document.getElementById("trendChart"),
  wardPerformance: document.getElementById("wardPerformance"),
  projectRows: document.getElementById("projectRows"),
  sortBtn: document.getElementById("sortByProgressBtn"),
  exportBtn: document.getElementById("exportCsvBtn"),
  resetBtn: document.getElementById("resetFiltersBtn"),
  lastUpdated: document.getElementById("lastUpdated"),
  dialog: document.getElementById("projectDialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogBody: document.getElementById("dialogBody")
};

let sortByProgress = false;

function unique(key) {
  return [...new Set(projects.map(p => p[key]))].sort();
}

function setOptions(select, values) {
  select.innerHTML = ["All", ...values].map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
}

function initFilters() {
  setOptions(el.fy, unique("fy"));
  setOptions(el.dept, unique("dept"));
  setOptions(el.ward, unique("ward"));
  setOptions(el.status, unique("status"));
  el.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString("en-KE")}`;
}

function filteredData() {
  const term = el.search.value.trim().toLowerCase();
  let result = projects.filter(p =>
    (el.fy.value === "All" || p.fy === el.fy.value) &&
    (el.dept.value === "All" || p.dept === el.dept.value) &&
    (el.ward.value === "All" || p.ward === el.ward.value) &&
    (el.status.value === "All" || p.status === el.status.value) &&
    (!term || `${p.name} ${p.contract} ${p.ward}`.toLowerCase().includes(term))
  );

  if (sortByProgress) result = [...result].sort((a, b) => b.progress - a.progress);
  return result;
}

function renderKpis(data) {
  const allocation = data.reduce((a, p) => a + p.allocation, 0);
  const spent = data.reduce((a, p) => a + p.spent, 0);
  const rate = allocation ? Math.round((spent / allocation) * 100) : 0;
  const delayed = data.filter(p => p.status === "Delayed").length;

  const cards = [
    { title: "Projects", value: data.length, meta: "Active register" },
    { title: "Budget Allocation", value: `KES ${money(allocation)}`, meta: "Approved this view" },
    { title: "Expenditure", value: `KES ${money(spent)}`, meta: `${rate}% absorption` },
    { title: "Delayed Projects", value: delayed, meta: "Needs intervention" }
  ];

  el.kpiGrid.innerHTML = cards.map(c => `<article class="kpi"><h3>${esc(c.title)}</h3><p>${esc(c.value)}</p><div class="meta">${esc(c.meta)}</div></article>`).join("");
}

function renderBudget(data) {
  const grouped = data.reduce((acc, p) => {
    acc[p.dept] = acc[p.dept] || { allocation: 0, spent: 0 };
    acc[p.dept].allocation += p.allocation;
    acc[p.dept].spent += p.spent;
    return acc;
  }, {});

  const rows = Object.entries(grouped).sort((a, b) => b[1].spent - a[1].spent);
  if (!rows.length) {
    el.budgetChart.innerHTML = '<p class="empty">No budget data for this filter selection.</p>';
    return;
  }

  el.budgetChart.innerHTML = rows.map(([dept, v]) => {
    const pct = v.allocation ? Math.round((v.spent / v.allocation) * 100) : 0;
    return `
      <div class="bar-row">
        <div class="bar-label"><span>${esc(dept)}</span><span>${pct}% (${money(v.spent)} / ${money(v.allocation)})</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(pct, 100)}%"></div></div>
      </div>`;
  }).join("");
}

function renderStatus(data) {
  const counts = data.reduce((a, p) => {
    a[p.status] = (a[p.status] || 0) + 1;
    return a;
  }, {});

  if (!data.length) {
    el.statusChart.innerHTML = '<p class="empty">No status distribution available.</p>';
    return;
  }

  const total = data.length;
  let cursor = 0;
  const slices = Object.entries(counts).map(([status, count]) => {
    const start = cursor;
    cursor += (count / total) * 100;
    return `${statusColor[status]} ${start}% ${cursor}%`;
  });

  const donut = `<div class="donut" style="background: conic-gradient(${slices.join(",")});"></div>`;
  const legend = `<div class="legend">${Object.entries(counts).map(([status, count]) => `<div class="legend-row"><span><i class="dot" style="background:${statusColor[status]}"></i>${esc(status)}</span><strong>${count}</strong></div>`).join("")}</div>`;
  el.statusChart.innerHTML = donut + legend;
}

function renderTrend(data) {
  const totals = [0, 0, 0, 0];
  data.forEach(p => p.quarterSpend.forEach((val, i) => (totals[i] += val)));

  const max = Math.max(...totals, 1);
  const x = [80, 240, 400, 560];
  const y = totals.map(v => 200 - (v / max) * 150);
  const polyline = x.map((px, i) => `${px},${y[i]}`).join(" ");

  const circles = x.map((px, i) => `<circle cx="${px}" cy="${y[i]}" r="4" fill="#0f766e"/><text x="${px}" y="${y[i] - 10}" text-anchor="middle" font-size="11" fill="#334155">${Math.round(totals[i] / 1000000)}M</text><text x="${px}" y="222" text-anchor="middle" font-size="11" fill="#64748b">Q${i + 1}</text>`).join("");
  el.trendChart.innerHTML = `<line x1="60" y1="200" x2="585" y2="200" stroke="#cbd5e1" /><line x1="80" y1="30" x2="80" y2="200" stroke="#cbd5e1" /><polyline points="${polyline}" fill="none" stroke="#0ea5e9" stroke-width="3"/>${circles}`;
}

function renderWardPerformance(data) {
  const grouped = data.reduce((acc, p) => {
    acc[p.ward] = acc[p.ward] || { progressTotal: 0, count: 0 };
    acc[p.ward].progressTotal += p.progress;
    acc[p.ward].count += 1;
    return acc;
  }, {});

  const rows = Object.entries(grouped);
  if (!rows.length) {
    el.wardPerformance.innerHTML = '<p class="empty">No ward metrics found.</p>';
    return;
  }

  el.wardPerformance.innerHTML = rows.map(([ward, v]) => {
    const avg = Math.round(v.progressTotal / v.count);
    return `<div class="bar-row"><div class="bar-label"><span>${esc(ward)}</span><span>${avg}% avg progress</span></div><div class="bar-track"><div class="bar-fill" style="width:${avg}%"></div></div></div>`;
  }).join("");
}

function openDialog(project) {
  el.dialogTitle.textContent = project.name;
  el.dialogBody.innerHTML = `
    <p><strong>Contract:</strong> ${esc(project.contract)}</p>
    <p><strong>Department:</strong> ${esc(project.dept)}</p>
    <p><strong>Ward:</strong> ${esc(project.ward)}</p>
    <p><strong>Contractor:</strong> ${esc(project.contractor)}</p>
    <p><strong>Timeline:</strong> ${esc(project.start)} to ${esc(project.end)}</p>
    <p><strong>Financial Year:</strong> ${esc(project.fy)}</p>
    <p><strong>Allocation:</strong> KES ${money(project.allocation)}</p>
    <p><strong>Spent:</strong> KES ${money(project.spent)}</p>
    <p><strong>Progress:</strong> ${project.progress}%</p>`;
  el.dialog.showModal();
}

function renderTable(data) {
  if (!data.length) {
    el.projectRows.innerHTML = '<tr><td colspan="9" class="empty-cell">No projects match the current filters.</td></tr>';
    return;
  }

  el.projectRows.innerHTML = data.map((p, idx) => `
      <tr>
        <td>${esc(p.name)}</td>
        <td>${esc(p.contract)}</td>
        <td>${esc(p.dept)}</td>
        <td>${esc(p.ward)}</td>
        <td><span class="badge" style="background:${statusColor[p.status]}">${esc(p.status)}</span></td>
        <td>${money(p.allocation)}</td>
        <td>${money(p.spent)}</td>
        <td class="progress-cell"><div>${p.progress}%</div><div class="bar-track"><div class="bar-fill" style="width:${p.progress}%"></div></div></td>
        <td><button class="secondary" data-project-index="${idx}" aria-label="View project details for ${esc(p.name)}">View</button></td>
      </tr>`).join("");

  [...el.projectRows.querySelectorAll("[data-project-index]")].forEach(btn => {
    btn.addEventListener("click", () => openDialog(data[Number(btn.dataset.projectIndex)]));
  });
}

function exportCsv(data) {
  const header = ["Project", "Contract", "Department", "Ward", "Status", "Allocation", "Spent", "Progress", "FY"];
  const rows = data.map(p => [p.name, p.contract, p.dept, p.ward, p.status, p.allocation, p.spent, p.progress, p.fy]);
  const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "isiolo-pmts-dashboard.csv";
  a.click();
  URL.revokeObjectURL(url);
}


function resetFilters() {
  [el.fy, el.dept, el.ward, el.status].forEach(node => {
    node.value = "All";
  });
  el.search.value = "";
  sortByProgress = false;
  el.sortBtn.textContent = "Sort by Progress";
  render();
}

function validateDataset() {
  return projects.every(project =>
    project.name &&
    project.contract &&
    project.dept &&
    project.ward &&
    project.fy &&
    Array.isArray(project.quarterSpend) &&
    project.quarterSpend.length === 4 &&
    Number.isFinite(project.allocation) &&
    Number.isFinite(project.spent) &&
    Number.isFinite(project.progress)
  );
}

function render() {
  const data = filteredData();
  renderKpis(data);
  renderBudget(data);
  renderStatus(data);
  renderTrend(data);
  renderWardPerformance(data);
  renderTable(data);
}

[el.fy, el.dept, el.ward, el.status, el.search].forEach(node => node.addEventListener("input", render));
el.sortBtn.addEventListener("click", () => {
  sortByProgress = !sortByProgress;
  el.sortBtn.textContent = sortByProgress ? "Sorted: Highest Progress" : "Sort by Progress";
  render();
});
el.exportBtn.addEventListener("click", () => exportCsv(filteredData()));
el.resetBtn.addEventListener("click", resetFilters);

initFilters();
if (!validateDataset()) {
  console.error("Dataset validation failed. Please check project records.");
}
render();
