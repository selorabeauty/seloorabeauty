"""Admin dashboard — single HTML page served at /admin"""
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

_HTML = r"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Selora Beauty — لوحة التحكم</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f0f13;color:#e8e8f0;min-height:100vh}
:root{--gold:#c9a84c;--gold2:#f0d080;--bg:#0f0f13;--card:#1a1a24;--border:#2a2a3a;--green:#22c55e;--red:#ef4444;--blue:#3b82f6;--purple:#a855f7}

/* ── NAV ── */
nav{background:#13131e;border-bottom:1px solid var(--border);padding:0 24px;display:flex;align-items:center;gap:24px;height:56px;position:sticky;top:0;z-index:100}
.logo{font-size:18px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-right:auto}
.nav-btn{background:none;border:none;color:#aaa;cursor:pointer;padding:8px 14px;border-radius:6px;font-size:14px;transition:.2s}
.nav-btn:hover,.nav-btn.active{background:#252535;color:#fff}

/* ── LAYOUT ── */
.page{display:none;padding:24px;max-width:1400px;margin:0 auto}
.page.active{display:block}

/* ── CARDS ── */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gold)}
.kpi-label{font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.kpi-value{font-size:28px;font-weight:700;color:#fff}
.kpi-sub{font-size:12px;color:#666;margin-top:4px}
.kpi-green::before{background:var(--green)}
.kpi-blue::before{background:var(--blue)}
.kpi-purple::before{background:var(--purple)}
.kpi-red::before{background:var(--red)}

/* ── CHART ── */
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:24px}
.chart-title{font-size:14px;font-weight:600;color:#ccc;margin-bottom:16px}
.chart-wrap{height:220px;position:relative;overflow:hidden}
canvas{width:100%!important}

/* ── TABLE ── */
.table-card{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:24px}
.table-header{padding:16px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--border)}
.table-header h3{font-size:15px;font-weight:600;margin-right:auto}
table{width:100%;border-collapse:collapse}
th{background:#13131e;padding:10px 16px;text-align:right;font-size:12px;color:#888;font-weight:600;letter-spacing:.5px;white-space:nowrap}
td{padding:12px 16px;border-bottom:1px solid #1e1e2e;font-size:13px;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#1e1e2e}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.badge-pending{background:#1a1a00;color:#facc15;border:1px solid #3a3a00}
.badge-confirmed{background:#0a1f0a;color:#22c55e;border:1px solid #1a3a1a}
.badge-shipped{background:#0a0f2a;color:#60a5fa;border:1px solid #1a2a4a}
.badge-delivered{background:#1a0a1a;color:#c084fc;border:1px solid #3a1a3a}
.badge-cancelled{background:#1f0a0a;color:#f87171;border:1px solid #3a1a1a}

/* ── INPUTS ── */
input,select{background:#13131e;border:1px solid var(--border);color:#e8e8f0;padding:7px 12px;border-radius:7px;font-size:13px;outline:none}
input:focus,select:focus{border-color:var(--gold)}
.btn{background:var(--gold);color:#000;border:none;padding:8px 16px;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;transition:.2s}
.btn:hover{background:var(--gold2)}
.btn-sm{padding:4px 10px;font-size:12px}
.btn-outline{background:none;border:1px solid var(--border);color:#ccc}
.btn-outline:hover{border-color:var(--gold);color:var(--gold)}

/* ── ORDER MODAL ── */
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;align-items:center;justify-content:center}
.modal-bg.open{display:flex}
.modal{background:var(--card);border:1px solid var(--border);border-radius:16px;width:min(620px,95vw);max-height:85vh;overflow-y:auto;padding:28px;position:relative}
.modal h2{font-size:18px;font-weight:700;color:var(--gold);margin-bottom:20px}
.modal-close{position:absolute;top:16px;left:16px;background:none;border:none;color:#666;cursor:pointer;font-size:20px}
.order-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px;margin-bottom:20px}
.order-field label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px}
.order-field p{font-size:14px;color:#eee;margin-top:2px}
.item-row{background:#13131e;border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
.item-name{font-size:13px;color:#ddd}
.item-qty{font-size:12px;color:#888}
.item-price{font-size:14px;font-weight:600;color:var(--gold)}
.total-row{display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid var(--border);font-size:15px;font-weight:700}

/* ── STATUS SELECT ── */
.status-form{margin-top:16px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:10px;align-items:center}

/* ── FILTERS ── */
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;align-items:center}

/* ── PAGINATION ── */
.pager{display:flex;gap:8px;align-items:center;justify-content:center;margin-top:16px}
.pager button{background:#13131e;border:1px solid var(--border);color:#ccc;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px}
.pager button:disabled{opacity:.4;cursor:default}
.pager span{font-size:13px;color:#666}

/* ── EMPTY / LOADING ── */
.empty{text-align:center;padding:40px;color:#555}
.spinner{display:inline-block;width:20px;height:20px;border:2px solid #333;border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>

<nav>
  <span class="logo">✦ Selora Beauty</span>
  <button class="nav-btn active" onclick="showPage('overview')">نظرة عامة</button>
  <button class="nav-btn" onclick="showPage('orders')">الطلبات</button>
</nav>

<!-- ══ OVERVIEW PAGE ══════════════════════════════════════════ -->
<div id="page-overview" class="page active">

  <div class="filters" style="margin-bottom:20px;margin-top:8px">
    <label style="font-size:13px;color:#888">من</label>
    <input type="date" id="ov-start">
    <label style="font-size:13px;color:#888">إلى</label>
    <input type="date" id="ov-end">
    <button class="btn" onclick="loadMetrics()">تحديث</button>
  </div>

  <div class="kpi-grid">
    <div class="kpi kpi-green"><div class="kpi-label">الإيرادات (ر.س)</div><div class="kpi-value" id="k-revenue">0</div></div>
    <div class="kpi"><div class="kpi-label">الطلبات المؤكدة</div><div class="kpi-value" id="k-orders">0</div><div class="kpi-sub" id="k-orders-total"></div></div>
    <div class="kpi kpi-purple"><div class="kpi-label">نسبة التحويل %</div><div class="kpi-value" id="k-cvr">0%</div></div>
    <div class="kpi kpi-blue"><div class="kpi-label">تحويل الدفع %</div><div class="kpi-value" id="k-co-cvr">0%</div><div class="kpi-sub" id="k-co-count"></div></div>
    <div class="kpi"><div class="kpi-label">مشاهدات الصفحة</div><div class="kpi-value" id="k-views">0</div></div>
    <div class="kpi"><div class="kpi-label">النقرات</div><div class="kpi-value" id="k-clicks">0</div></div>
    <div class="kpi kpi-blue"><div class="kpi-label">متوسط الطلب (ر.س)</div><div class="kpi-value" id="k-aov">0</div></div>
    <div class="kpi kpi-green"><div class="kpi-label">نسبة الـ Upsell %</div><div class="kpi-value" id="k-upsell">0%</div><div class="kpi-sub" id="k-upsell-rev"></div></div>
  </div>

  <div class="chart-card">
    <div class="chart-title">الاتجاه اليومي — مشاهدات وطلبات</div>
    <div class="chart-wrap"><canvas id="main-chart"></canvas></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="table-card">
      <div class="table-header"><h3>أفضل المنتجات</h3></div>
      <table>
        <thead><tr><th>المنتج</th><th>الكمية</th><th>الإيراد</th></tr></thead>
        <tbody id="products-tbody"></tbody>
      </table>
    </div>
    <div class="table-card">
      <div class="table-header"><h3>أفضل المدن</h3></div>
      <table>
        <thead><tr><th>المدينة</th><th>الطلبات</th></tr></thead>
        <tbody id="cities-tbody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- ══ ORDERS PAGE ════════════════════════════════════════════ -->
<div id="page-orders" class="page">

  <div class="filters">
    <input type="date" id="ord-start">
    <input type="date" id="ord-end">
    <select id="ord-status">
      <option value="">كل الحالات</option>
      <option value="pending">قيد الانتظار</option>
      <option value="confirmed">مؤكد</option>
      <option value="shipped">شُحن</option>
      <option value="delivered">تم التسليم</option>
      <option value="cancelled">ملغى</option>
    </select>
    <input type="text" id="ord-search" placeholder="بحث بالاسم / الهاتف / رقم الطلب" style="width:240px">
    <button class="btn" onclick="loadOrders(1)">بحث</button>
    <span id="ord-count" style="font-size:13px;color:#666;margin-right:auto"></span>
  </div>

  <div class="table-card">
    <table>
      <thead><tr>
        <th>رقم الطلب</th><th>الاسم</th><th>الهاتف</th><th>المدينة</th>
        <th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th><th></th>
      </tr></thead>
      <tbody id="orders-tbody"><tr><td colspan="9" class="empty"><span class="spinner"></span></td></tr></tbody>
    </table>
  </div>
  <div class="pager">
    <button id="prev-btn" disabled onclick="loadOrders(currentPage-1)">→ السابق</button>
    <span id="page-info"></span>
    <button id="next-btn" disabled onclick="loadOrders(currentPage+1)">التالي ←</button>
  </div>
</div>

<!-- ══ ORDER MODAL ════════════════════════════════════════════ -->
<div class="modal-bg" id="modal-bg" onclick="closeModal(event)">
  <div class="modal">
    <button class="modal-close" onclick="closeModal()">✕</button>
    <h2 id="m-order-id"></h2>
    <div class="order-grid" id="m-fields"></div>
    <div style="margin-bottom:8px;font-size:13px;font-weight:600;color:#888">المنتجات</div>
    <div id="m-items"></div>
    <div class="total-row"><span>الإجمالي</span><span id="m-total" style="color:var(--gold)"></span></div>
    <div class="status-form">
      <label style="font-size:13px;color:#888;white-space:nowrap">تحديث الحالة:</label>
      <select id="m-status-sel">
        <option value="pending">قيد الانتظار</option>
        <option value="confirmed">مؤكد</option>
        <option value="shipped">شُحن</option>
        <option value="delivered">تم التسليم</option>
        <option value="cancelled">ملغى</option>
      </select>
      <button class="btn btn-sm" onclick="saveStatus()">حفظ</button>
    </div>
  </div>
</div>

<script>
// ── AUTH ───────────────────────────────────────────────────────
let AUTH = localStorage.getItem('slr_auth') || '';
if (!AUTH) {
  const u = prompt('اسم المستخدم:');
  const p = prompt('كلمة المرور:');
  AUTH = 'Basic ' + btoa(u + ':' + p);
  localStorage.setItem('slr_auth', AUTH);
}

async function api(path, opts={}) {
  const r = await fetch(path, { headers: { Authorization: AUTH, 'Content-Type': 'application/json' }, ...opts });
  if (r.status === 401) { localStorage.removeItem('slr_auth'); location.reload(); }
  return r.json();
}

// ── NAVIGATION ─────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  event.target.classList.add('active');
  if (name === 'overview') loadMetrics();
  if (name === 'orders')   loadOrders(1);
}

// ── DATE HELPERS ───────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0,10); }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ar-SA', {timeZone:'Asia/Riyadh', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
}

// ── INIT DATES ─────────────────────────────────────────────────
document.getElementById('ov-start').value = daysAgo(29);
document.getElementById('ov-end').value   = today();
document.getElementById('ord-start').value = daysAgo(29);
document.getElementById('ord-end').value   = today();

// ── BADGE ──────────────────────────────────────────────────────
const STATUS_MAP = { pending:'قيد الانتظار', confirmed:'مؤكد', shipped:'شُحن', delivered:'تم التسليم', cancelled:'ملغى' };
function badge(s) { return `<span class="badge badge-${s||'pending'}">${STATUS_MAP[s]||s}</span>`; }

// ── CHARTS ─────────────────────────────────────────────────────
let mainChart, revChart;

function drawChart(canvas, labels, datasets) {
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
  const W = canvas.width, H = canvas.height;
  const pad = {top:20, right:20, bottom:36, left:50};
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1a1a24'; ctx.fillRect(0, 0, W, H);

  // grid
  ctx.strokeStyle = '#2a2a3a'; ctx.lineWidth = 1;
  for (let i=0;i<=4;i++) {
    const y = pad.top + cH * i/4;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W-pad.right, y); ctx.stroke();
  }

  const allVals = datasets.flatMap(d=>d.data);
  const maxVal  = Math.max(...allVals, 1);
  const n       = labels.length;

  datasets.forEach(ds => {
    ctx.beginPath();
    ctx.strokeStyle = ds.color; ctx.lineWidth = 2;
    ds.data.forEach((v, i) => {
      const x = pad.left + (i/(n-1||1))*cW;
      const y = pad.top  + cH * (1 - v/maxVal);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();

    // fill
    ctx.beginPath();
    ds.data.forEach((v, i) => {
      const x = pad.left + (i/(n-1||1))*cW;
      const y = pad.top  + cH * (1 - v/maxVal);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.lineTo(pad.left + cW, pad.top+cH);
    ctx.lineTo(pad.left,      pad.top+cH);
    ctx.closePath();
    ctx.fillStyle = ds.color + '22'; ctx.fill();
  });

  // x labels (every ~5)
  ctx.fillStyle = '#555'; ctx.font = '10px Arial'; ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    if (i % Math.ceil(n/8) !== 0 && i !== n-1) return;
    const x = pad.left + (i/(n-1||1))*cW;
    ctx.fillText(l.slice(5), x, H - 8);
  });

  // y labels
  ctx.textAlign = 'right';
  for (let i=0;i<=4;i++) {
    const v = maxVal * (1 - i/4);
    const y = pad.top + cH * i/4;
    ctx.fillText(Math.round(v), pad.left-6, y+4);
  }

  // legend
  if (datasets.length > 1) {
    let lx = pad.left;
    datasets.forEach(ds => {
      ctx.fillStyle = ds.color; ctx.fillRect(lx, 4, 12, 6);
      ctx.fillStyle = '#aaa'; ctx.font='10px Arial'; ctx.textAlign='right';
      ctx.fillText(ds.label, lx+14+ctx.measureText(ds.label).width, 11);
      lx += 80;
    });
  }
}

// ── METRICS ────────────────────────────────────────────────────
async function loadMetrics() {
  const s = document.getElementById('ov-start').value;
  const e = document.getElementById('ov-end').value;
  const d = await api(`/admin/metrics?start=${s}&end=${e}`);

  document.getElementById('k-revenue').textContent      = d.revenue.toLocaleString('ar');
  document.getElementById('k-orders').textContent       = d.confirmed_orders.toLocaleString('ar');
  document.getElementById('k-orders-total').textContent = 'إجمالي: ' + d.total_orders.toLocaleString('ar');
  document.getElementById('k-cvr').textContent          = d.conversion_rate + '%';
  document.getElementById('k-co-cvr').textContent       = d.checkout_cvr + '%';
  document.getElementById('k-co-count').textContent     = 'بدء الدفع: ' + d.checkout_starts.toLocaleString('ar');
  document.getElementById('k-views').textContent        = d.page_views.toLocaleString('ar');
  document.getElementById('k-clicks').textContent       = d.clicks.toLocaleString('ar');
  document.getElementById('k-aov').textContent          = d.aov.toLocaleString('ar');
  document.getElementById('k-upsell').textContent       = d.upsell_take_rate + '%';
  document.getElementById('k-upsell-rev').textContent   = '+' + d.upsell_revenue.toLocaleString('ar') + ' ر.س';

  // daily trend chart
  const labels = d.chart.map(r=>r.date);
  const views  = d.chart.map(r=>r.views);
  const orders = d.chart.map(r=>r.orders);

  setTimeout(()=>{
    drawChart(document.getElementById('main-chart'), labels, [
      {label:'مشاهدات', data:views,  color:'#3b82f6'},
      {label:'طلبات',   data:orders, color:'#22c55e'},
    ]);
  }, 50);

  // top products table
  const ptbody = document.getElementById('products-tbody');
  ptbody.innerHTML = d.top_products.length ? d.top_products.map(p=>
    `<tr><td>${p.name}</td><td>${p.qty}</td><td style="color:var(--gold);font-weight:600">${p.revenue.toLocaleString('ar')} ر.س</td></tr>`
  ).join('') : '<tr><td colspan="3" class="empty">لا بيانات بعد</td></tr>';

  // cities table
  const tbody = document.getElementById('cities-tbody');
  tbody.innerHTML = d.cities.length ? d.cities.map(c=>
    `<tr><td>${c.city||'غير محدد'}</td><td style="color:var(--gold);font-weight:600">${c.orders}</td></tr>`
  ).join('') : '<tr><td colspan="2" class="empty">لا بيانات</td></tr>';
}

// ── ORDERS ─────────────────────────────────────────────────────
let currentPage = 1;
let totalOrders = 0;

async function loadOrders(page) {
  currentPage = page;
  const s = document.getElementById('ord-start').value;
  const e = document.getElementById('ord-end').value;
  const st= document.getElementById('ord-status').value;
  const q = document.getElementById('ord-search').value;
  const url = `/admin/orders?start=${s}&end=${e}&page=${page}&limit=50`
    + (st ? '&status='+st : '') + (q ? '&search='+encodeURIComponent(q) : '');

  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '<tr><td colspan="9" class="empty"><span class="spinner"></span></td></tr>';

  const d = await api(url);
  totalOrders = d.total;
  document.getElementById('ord-count').textContent = 'إجمالي: ' + d.total.toLocaleString('ar') + ' طلب';
  document.getElementById('page-info').textContent = 'صفحة ' + page + ' من ' + Math.ceil(d.total/50);
  document.getElementById('prev-btn').disabled = page <= 1;
  document.getElementById('next-btn').disabled = page >= Math.ceil(d.total/50);

  if (!d.orders.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty">لا توجد طلبات</td></tr>'; return; }

  tbody.innerHTML = d.orders.map(o => {
    const items = (o.items||[]).map(i=>i.name).join(' / ') || '—';
    const upsell = o.upsell ? ` <span style="font-size:10px;color:var(--purple)">+Upsell</span>` : '';
    return `<tr>
      <td><b style="color:var(--gold)">${o.order_id}</b></td>
      <td>${o.name}</td>
      <td style="direction:ltr;text-align:right">${o.phone}</td>
      <td>${o.city||'—'}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${items}</td>
      <td><b>${o.total} ر.س</b>${upsell}</td>
      <td>${badge(o.status)}</td>
      <td style="font-size:12px;color:#666">${fmtDate(o.created_at)}</td>
      <td><button class="btn btn-sm btn-outline" onclick="openOrder(${JSON.stringify(JSON.stringify(o))})">عرض</button></td>
    </tr>`;
  }).join('');
}

// ── ORDER MODAL ────────────────────────────────────────────────
let currentOrder = null;

function openOrder(json) {
  currentOrder = JSON.parse(json);
  const o = currentOrder;
  document.getElementById('m-order-id').textContent = o.order_id;
  document.getElementById('m-fields').innerHTML = [
    {label:'الاسم',      val: o.name},
    {label:'الهاتف',     val: o.phone},
    {label:'المدينة',    val: o.city||'—'},
    {label:'العنوان',    val: o.address||'—'},
    {label:'طريقة الدفع',val: o.payment||'COD'},
    {label:'التاريخ',    val: fmtDate(o.created_at)},
  ].map(f=>`<div class="order-field"><label>${f.label}</label><p>${f.val}</p></div>`).join('');

  document.getElementById('m-items').innerHTML = (o.items||[]).map(it=>`
    <div class="item-row">
      <div><div class="item-name">${it.name||it.sku}</div><div class="item-qty">SKU: ${it.sku} · الكمية: ${it.quantity}</div></div>
      <div class="item-price">${(it.price*it.quantity).toLocaleString('ar')} ر.س</div>
    </div>`).join('') || '<div class="empty" style="padding:16px">—</div>';

  let totalDisplay = `${o.total} ر.س`;
  if (o.upsell) totalDisplay += ` <span style="font-size:12px;color:var(--purple)">(شامل Upsell ${o.upsell_total} ر.س)</span>`;
  document.getElementById('m-total').innerHTML = totalDisplay;
  document.getElementById('m-status-sel').value = o.status || 'pending';
  document.getElementById('modal-bg').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target.id==='modal-bg') document.getElementById('modal-bg').classList.remove('open');
}

async function saveStatus() {
  if (!currentOrder) return;
  const status = document.getElementById('m-status-sel').value;
  await api(`/admin/orders/${currentOrder.order_id}`, {method:'PATCH', body: JSON.stringify({status})});
  currentOrder.status = status;
  closeModal();
  loadOrders(currentPage);
}

// ── INIT ───────────────────────────────────────────────────────
loadMetrics();
</script>
</body>
</html>"""

@router.get("/admin", response_class=HTMLResponse)
async def dashboard():
    return _HTML
