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
  <button class="nav-btn" onclick="showPage('profit')">حاسبة الأرباح (Profit Calculator)</button>
</nav>

<!-- ══ OVERVIEW PAGE ══════════════════════════════════════════ -->
<div id="page-overview" class="page active">

  <div class="filters" style="margin-bottom:20px;margin-top:8px">
    <label style="font-size:13px;color:#888">من</label>
    <input type="date" id="ov-start">
    <label style="font-size:13px;color:#888">إلى</label>
    <input type="date" id="ov-end">
    <button class="btn" onclick="loadMetrics()">تحديث</button>
    <button class="btn" style="background:#B3392E;color:#fff" onclick="resetData()">🗑️ تصفير البيانات</button>
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

<!-- ══ PROFIT & BREAKEVEN CALCULATOR PAGE ═══════════════════════ -->
<div id="page-profit" class="page">
  <!-- Top Banner: Lifetime Store AOV and Sync -->
  <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
    <div>
      <div style="font-size:15px;font-weight:700;color:var(--gold);display:flex;align-items:center;gap:8px">
        <span>💰 حاسبة الأرباح ونقطة التعادل لمتاجر الدفع عند الاستلام (COD Profit & Breakeven)</span>
      </div>
      <div style="font-size:12px;color:#888;margin-top:4px" id="pc-store-stat">
        جاري جلب إحصائيات المتجر الفعلية (AOV ومتوسط القطع)...
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:11px;color:#888;background:#13131e;border:1px solid var(--border);padding:4px 10px;border-radius:6px">1 USD = 3.75 SAR</span>
      <button class="btn btn-sm btn-outline" onclick="syncStoreMetrics()">🔄 مزامنة من بيانات المتجر</button>
    </div>
  </div>

  <!-- SECTION 1: BREAKEVEN CALCULATOR (نقطة التعادل) -->
  <div style="margin-bottom:28px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="width:4px;height:20px;background:var(--gold);border-radius:2px"></div>
      <h2 style="font-size:16px;font-weight:700;color:#fff">القسم الأول: حاسبة نقطة التعادل (Breakeven Calculator)</h2>
      <span style="font-size:11px;color:#aaa;background:#1a1a24;border:1px solid var(--border);padding:2px 8px;border-radius:12px">تعرف على الحد الأقصى لتكلفة الإعلان قبل أن تخسر</span>
    </div>

    <div class="kpi-grid">
      <div class="kpi kpi-green">
        <div class="kpi-label">أقصى تكلفة ليد مسموحة (Breakeven CPL)</div>
        <div class="kpi-value" id="be-cpl-usd">$0.00</div>
        <div class="kpi-sub" id="be-cpl-sar">يعادل 0 ر.س لكل ليد</div>
      </div>
      <div class="kpi kpi-blue">
        <div class="kpi-label">أدنى نسبة توصيل مطلوبة (Breakeven Delivery Rate)</div>
        <div class="kpi-value" id="be-deliv-rate">0%</div>
        <div class="kpi-sub" id="be-deliv-sub">بناءً على تكلفة الليد الحالية</div>
      </div>
      <div class="kpi kpi-purple">
        <div class="kpi-label">عائد الإعلان للتعادل (Breakeven ROAS)</div>
        <div class="kpi-value" id="be-roas">0.0x</div>
        <div class="kpi-sub">الحد الأدنى لـ ROAS في المنصات</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">أدنى متوسط سلة للتعادل (Breakeven AOV)</div>
        <div class="kpi-value" id="be-aov">$0.00</div>
        <div class="kpi-sub" id="be-aov-sar">يعادل 0 ر.س</div>
      </div>
    </div>
  </div>

  <!-- SECTION 2: PROFIT SCALING SIMULATOR (حاسبة الأرباح والتوسع) -->
  <div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="width:4px;height:20px;background:var(--green);border-radius:2px"></div>
      <h2 style="font-size:16px;font-weight:700;color:#fff">القسم الثاني: محاكي الأرباح والتوسع (Profit Scaling Simulator)</h2>
      <span style="font-size:11px;color:#aaa;background:#1a1a24;border:1px solid var(--border);padding:2px 8px;border-radius:12px">احسب صافي الربح المتوقع بدقة بعد خصم كافة عمولات COD والتوصيل</span>
    </div>

    <!-- Inputs Controls Card -->
    <div class="table-card" style="padding:22px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:#ccc;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <span>⚙️ إعدادات الحملة ومتغيرات التشغيل</span>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="font-size:11px;color:#888">نماذج سريعة لعدد الليدات:</span>
          <button class="btn btn-sm btn-outline" onclick="setLeadPreset(50)">50</button>
          <button class="btn btn-sm btn-outline" onclick="setLeadPreset(100)">100</button>
          <button class="btn btn-sm btn-outline" onclick="setLeadPreset(300)">300</button>
          <button class="btn btn-sm btn-outline" onclick="setLeadPreset(500)">500</button>
          <button class="btn btn-sm btn-outline" onclick="setLeadPreset(1000)">1000</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:16px">
        <!-- Leads Count -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">عدد الليدات المستلمة (Leads)</label>
          <input type="number" id="pc-leads" value="300" min="1" step="1" oninput="calcProfit()" style="width:100%">
        </div>
        <!-- CPL in USD -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">تكلفة الليد بالإعلان CPL ($)</label>
          <div style="display:flex;gap:6px">
            <input type="number" id="pc-cpl" value="6.0" min="0.1" step="0.1" oninput="onCplUsdChange()" style="width:100%">
            <input type="number" id="pc-cpl-sar" value="22.5" min="0.5" step="0.5" oninput="onCplSarChange()" placeholder="SAR" style="width:90px" title="المقابل بالريال">
          </div>
        </div>
        <!-- Confirmation Rate % -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">نسبة التأكيد % (Confirmation)</label>
          <div style="display:flex;align-items:center;gap:8px">
            <input type="range" id="pc-cr-range" min="30" max="100" value="80" oninput="syncRange('pc-cr-range','pc-cr')" style="flex:1">
            <input type="number" id="pc-cr" value="80" min="1" max="100" step="1" oninput="syncInput('pc-cr','pc-cr-range')" style="width:70px">%
          </div>
        </div>
        <!-- Delivery Rate % -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">نسبة التوصيل من المؤكد % (Delivery)</label>
          <div style="display:flex;align-items:center;gap:8px">
            <input type="range" id="pc-dr-range" min="30" max="100" value="75" oninput="syncRange('pc-dr-range','pc-dr')" style="flex:1">
            <input type="number" id="pc-dr" value="75" min="1" max="100" step="1" oninput="syncInput('pc-dr','pc-dr-range')" style="width:70px">%
          </div>
        </div>
        <!-- AOV (SAR / USD) -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">متوسط قيمة السلة (AOV)</label>
          <div style="display:flex;gap:6px">
            <input type="number" id="pc-aov-sar" value="249" min="10" step="1" oninput="onAovSarChange()" style="width:100%" placeholder="SAR">
            <input type="number" id="pc-aov-usd" value="66.4" min="2" step="0.1" oninput="onAovUsdChange()" style="width:90px" placeholder="USD" title="المقابل بالدولار">
          </div>
        </div>
        <!-- Product Cost per Piece -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">تكلفة تصنيع/شراء القطعة ($ COGS)</label>
          <input type="number" id="pc-piece-cost" value="4.5" min="0" step="0.1" oninput="calcProfit()" style="width:100%">
        </div>
        <!-- Avg Pieces per Order -->
        <div>
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:6px">متوسط عدد القطع في الطلب (Pieces)</label>
          <input type="number" id="pc-avg-pieces" value="1.8" min="1" step="0.1" oninput="calcProfit()" style="width:100%">
        </div>
      </div>

      <!-- Fixed COD Tariffs Reminder -->
      <div style="background:#13131e;border:1px solid #2a2a3a;border-radius:8px;padding:12px;display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#888">
        <div><strong style="color:#ddd">عمولات الدفع عند الاستلام الثابتة:</strong></div>
        <div>📞 تأكيد الطلب: <span style="color:var(--gold)">$1.70</span> / مؤكد</div>
        <div>📦 التجهيز والتغليف: <span style="color:var(--gold)">$0.80</span> / طلب خارج</div>
        <div>🚚 التوصيل الناجح: <span style="color:var(--green)">$4.00</span> / مُسلّم</div>
        <div>↩️ رسوم المرتجع: <span style="color:var(--red)">$1.30</span> / مرتجع</div>
        <div style="margin-right:auto;color:#666">💡 المرتجعات تعود للمخزون فلا يتم خصم تكلفة المنتج عليها</div>
      </div>
    </div>

    <!-- Scaled Results Highlight Cards -->
    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-bottom:20px">
      <div class="kpi" id="card-net-profit" style="border-width:2px">
        <div class="kpi-label">صافي الربح الفعلي (Net Profit)</div>
        <div class="kpi-value" id="res-profit-usd" style="font-size:32px">$0</div>
        <div class="kpi-sub" id="res-profit-sar" style="font-size:14px;font-weight:700">0 ر.س</div>
      </div>
      <div class="kpi kpi-purple">
        <div class="kpi-label">هامش الربح الصافي (Net Margin %)</div>
        <div class="kpi-value" id="res-margin">0%</div>
        <div class="kpi-sub" id="res-roas">عائد الإعلان: 0.0x ROAS</div>
      </div>
      <div class="kpi kpi-blue">
        <div class="kpi-label">ربح كل ليد مستلم (Profit / Lead)</div>
        <div class="kpi-value" id="res-profit-lead">$0.00</div>
        <div class="kpi-sub" id="res-profit-lead-sar">0.0 ر.س / ليد</div>
      </div>
      <div class="kpi kpi-green">
        <div class="kpi-label">ربح كل طلب مُسلّم (Profit / Delivered)</div>
        <div class="kpi-value" id="res-profit-order">$0.00</div>
        <div class="kpi-sub" id="res-profit-order-sar">0.0 ر.س / طلب</div>
      </div>
    </div>

    <!-- Financial Breakdown Table & Funnel Stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <!-- Funnel Flow -->
      <div class="table-card">
        <div class="table-header"><h3>📊 مسار قمع الطلبات (COD Volume Funnel)</h3></div>
        <table>
          <thead><tr><th>المرحلة</th><th>العدد</th><th>النسبة %</th><th>الحالة</th></tr></thead>
          <tbody>
            <tr><td>إجمالي الليدات المستلمة</td><td id="fn-leads" style="font-weight:700">0</td><td>100%</td><td><span class="badge badge-pending">Leads</span></td></tr>
            <tr><td>الطلبات المؤكدة</td><td id="fn-confirmed" style="font-weight:700">0</td><td id="fn-cr">0%</td><td><span class="badge badge-confirmed">Confirmed</span></td></tr>
            <tr><td>الطلبات الملغاة / لم يرد</td><td id="fn-cancelled" style="font-weight:700">0</td><td id="fn-canc-rate">0%</td><td><span class="badge badge-cancelled">Cancelled</span></td></tr>
            <tr><td>الطلبات المشحونة من المستودع</td><td id="fn-dispatched" style="font-weight:700">0</td><td>100% من المؤكد</td><td><span class="badge badge-shipped">Dispatched</span></td></tr>
            <tr><td>الطلبات المسلمة والمدفوعة</td><td id="fn-delivered" style="font-weight:700;color:var(--green)">0</td><td id="fn-dr" style="color:var(--green)">0%</td><td><span class="badge badge-delivered">Delivered</span></td></tr>
            <tr><td>الطلبات المرتجعة (RTO)</td><td id="fn-returned" style="font-weight:700;color:var(--red)">0</td><td id="fn-ret-rate" style="color:var(--red)">0%</td><td><span class="badge badge-cancelled">Returned</span></td></tr>
          </tbody>
        </table>
      </div>

      <!-- Cost & Revenue Breakdown -->
      <div class="table-card">
        <div class="table-header"><h3>💵 التدفق المالي وقائمة الدخل (P&L Breakdown)</h3></div>
        <table>
          <thead><tr><th>البند</th><th>المبلغ بالدولار ($)</th><th>المبلغ بالريال (SAR)</th></tr></thead>
          <tbody>
            <tr><td>إجمالي مبيعات الطلبات المسلمة (Gross Revenue)</td><td id="pl-rev-usd" style="font-weight:700;color:var(--gold)">$0</td><td id="pl-rev-sar" style="font-weight:700;color:var(--gold)">0 ر.س</td></tr>
            <tr><td>الصرف الإعلاني الإجمالي (Ad Spend)</td><td id="pl-ads-usd" style="color:#ef4444">-$0</td><td id="pl-ads-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr><td>تكلفة المنتجات المسلمة (Delivered COGS)</td><td id="pl-cogs-usd" style="color:#ef4444">-$0</td><td id="pl-cogs-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr><td>رسوم الكول سنتر وتأكيد الطلبات ($1.7/مؤكد)</td><td id="pl-conf-usd" style="color:#ef4444">-$0</td><td id="pl-conf-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr><td>رسوم تجهيز المستودع ($0.8/طلب)</td><td id="pl-ful-usd" style="color:#ef4444">-$0</td><td id="pl-ful-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr><td>رسوم التوصيل الناجح ($4.0/مسلم)</td><td id="pl-deliv-usd" style="color:#ef4444">-$0</td><td id="pl-deliv-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr><td>رسوم المرتجع ($1.3/مرتجع)</td><td id="pl-ret-usd" style="color:#ef4444">-$0</td><td id="pl-ret-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr style="background:#13131e;font-weight:700"><td>إجمالي كافة المصاريف والتكاليف</td><td id="pl-cost-usd" style="color:#ef4444">-$0</td><td id="pl-cost-sar" style="color:#ef4444">-0 ر.س</td></tr>
            <tr style="background:#1a1a24;font-size:15px;font-weight:800"><td style="color:var(--gold)">صافي الربح الصافي في جيبك (Net Cash)</td><td id="pl-net-usd" style="color:var(--green)">$0</td><td id="pl-net-sar" style="color:var(--green)">0 ر.س</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Scaling Scenarios Matrix -->
    <div class="table-card">
      <div class="table-header">
        <h3>🚀 مصفوفة التوسع والنمو الشهري (Monthly Scaling Matrix — 30 Days)</h3>
        <span style="font-size:12px;color:#888">توقعات الأرباح بناءً على حجم الصرف اليومي بنفس النسب الحالية</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>حجم الليدات اليومي</th>
            <th>إجمالي الليدات شهرياً</th>
            <th>الطلبات المسلمة شهرياً</th>
            <th>الصرف الإعلاني شهرياً</th>
            <th>المبيعات المحصلة شهرياً</th>
            <th>صافي الربح الشهري ($)</th>
            <th>صافي الربح الشهري (SAR)</th>
            <th>هامش الربح</th>
          </tr>
        </thead>
        <tbody id="matrix-tbody"></tbody>
      </table>
    </div>
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

async function resetData() {
  if (!confirm('⚠️ سيحذف كل الطلبات وكل بيانات التتبع نهائياً. متأكد؟')) return;
  if (!confirm('تأكيد أخير — هذا الإجراء لا يمكن التراجع عنه.')) return;
  const r = await api('/admin/reset-data', { method: 'POST' });
  if (r.ok) { alert('✅ تم تصفير البيانات — المقاييس صارت صفر'); loadMetrics(); }
}

// ── NAVIGATION ─────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  event.target.classList.add('active');
  if (name === 'overview') loadMetrics();
  if (name === 'orders')   loadOrders(1);
  if (name === 'profit')   initProfitCalc();
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
  window.STORE_METRICS = d;

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

// ── PROFIT & BREAKEVEN CALCULATOR ────────────────────────────
const FX_USD_SAR = 3.75;
const FEE_CONFIRM = 1.70;  // $1.70 per confirmed lead
const FEE_FULFILL = 0.80;  // $0.80 per order dispatched from warehouse
const FEE_DELIVERY = 4.00; // $4.00 per delivered order
const FEE_RETURN = 1.30;   // $1.30 per return order

function fmtUSD(n) {
  if (isNaN(n) || !isFinite(n)) return '$0.00';
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function fmtSAR(n) {
  if (isNaN(n) || !isFinite(n)) return '0 ر.س';
  const sign = n < 0 ? '-' : '';
  return sign + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:1, maximumFractionDigits:1}) + ' ر.س';
}

function onCplUsdChange() {
  const usd = parseFloat(document.getElementById('pc-cpl').value) || 0;
  document.getElementById('pc-cpl-sar').value = (usd * FX_USD_SAR).toFixed(1);
  calcProfit();
}

function onCplSarChange() {
  const sar = parseFloat(document.getElementById('pc-cpl-sar').value) || 0;
  document.getElementById('pc-cpl').value = (sar / FX_USD_SAR).toFixed(2);
  calcProfit();
}

function onAovSarChange() {
  const sar = parseFloat(document.getElementById('pc-aov-sar').value) || 0;
  document.getElementById('pc-aov-usd').value = (sar / FX_USD_SAR).toFixed(2);
  calcProfit();
}

function onAovUsdChange() {
  const usd = parseFloat(document.getElementById('pc-aov-usd').value) || 0;
  document.getElementById('pc-aov-sar').value = (usd * FX_USD_SAR).toFixed(1);
  calcProfit();
}

function syncRange(rangeId, inputId) {
  document.getElementById(inputId).value = document.getElementById(rangeId).value;
  calcProfit();
}

function syncInput(inputId, rangeId) {
  document.getElementById(rangeId).value = document.getElementById(inputId).value;
  calcProfit();
}

function setLeadPreset(n) {
  document.getElementById('pc-leads').value = n;
  calcProfit();
}

async function syncStoreMetrics() {
  const statEl = document.getElementById('pc-store-stat');
  statEl.innerHTML = '<span class="spinner" style="width:14px;height:14px;vertical-align:middle;margin-left:6px"></span> جاري المزامنة مع بيانات المتجر...';
  try {
    const s = document.getElementById('ov-start').value || daysAgo(29);
    const e = document.getElementById('ov-end').value || today();
    const d = window.STORE_METRICS || await api(`/admin/metrics?start=${s}&end=${e}`);
    window.STORE_METRICS = d;

    const lifetime = d.lifetime || {};
    const aov_sar = lifetime.aov_sar || d.aov || 279;
    const avg_pieces = lifetime.avg_pieces || 1.8;
    const orders_count = lifetime.orders !== undefined ? lifetime.orders : d.confirmed_orders;

    document.getElementById('pc-aov-sar').value = aov_sar;
    document.getElementById('pc-aov-usd').value = (aov_sar / FX_USD_SAR).toFixed(2);
    document.getElementById('pc-avg-pieces').value = avg_pieces;

    statEl.innerHTML = `✅ تم التحديث: متوسط السلة الفعلي للمتجر: <strong>${aov_sar} ر.س ($${(aov_sar/FX_USD_SAR).toFixed(2)})</strong> · متوسط القطع في الطلب: <strong>${avg_pieces} قطعة</strong> (${orders_count} طلب مسجل)`;
    calcProfit();
  } catch (err) {
    statEl.textContent = '⚠️ تعذر المزامنة، تم الإبقاء على القيم الحالية.';
  }
}

let profitCalcInitialized = false;
async function initProfitCalc() {
  if (!profitCalcInitialized) {
    profitCalcInitialized = true;
    await syncStoreMetrics();
  }
  calcProfit();
}

function calcProfit() {
  const leads = Math.max(0, parseFloat(document.getElementById('pc-leads').value) || 0);
  const cpl_usd = Math.max(0, parseFloat(document.getElementById('pc-cpl').value) || 0);
  const cr_pct = Math.min(100, Math.max(0, parseFloat(document.getElementById('pc-cr').value) || 0));
  const dr_pct = Math.min(100, Math.max(0, parseFloat(document.getElementById('pc-dr').value) || 0));
  const cr = cr_pct / 100;
  const dr = dr_pct / 100;

  const aov_sar = Math.max(0, parseFloat(document.getElementById('pc-aov-sar').value) || 0);
  const aov_usd = aov_sar / FX_USD_SAR;

  const piece_cost_usd = Math.max(0, parseFloat(document.getElementById('pc-piece-cost').value) || 0);
  const avg_pieces = Math.max(1, parseFloat(document.getElementById('pc-avg-pieces').value) || 1.5);
  const cogs_per_order_usd = piece_cost_usd * avg_pieces;

  // 1. Volumes
  const confirmed = leads * cr;
  const cancelled = leads - confirmed;
  const dispatched = confirmed;
  const delivered = confirmed * dr;
  const returned = confirmed * (1 - dr);

  // 2. Costs Breakdown
  const ad_spend_usd = leads * cpl_usd;
  const ad_spend_sar = ad_spend_usd * FX_USD_SAR;

  const call_center_usd = confirmed * FEE_CONFIRM; // $1.7 per confirmed lead
  const fulfillment_usd = dispatched * FEE_FULFILL; // $0.8 per order out of warehouse
  const delivery_courier_usd = delivered * FEE_DELIVERY; // $4.0 per delivered order
  const return_rto_usd = returned * FEE_RETURN; // $1.3 per return order

  const total_logistics_usd = call_center_usd + fulfillment_usd + delivery_courier_usd + return_rto_usd;
  const total_cogs_usd = delivered * cogs_per_order_usd; // COGS for delivered orders (returns restocked)

  const total_expenses_usd = ad_spend_usd + total_logistics_usd + total_cogs_usd;
  const total_expenses_sar = total_expenses_usd * FX_USD_SAR;

  // 3. Revenue & Profit
  const gross_revenue_usd = delivered * aov_usd;
  const gross_revenue_sar = delivered * aov_sar;

  const net_profit_usd = gross_revenue_usd - total_expenses_usd;
  const net_profit_sar = gross_revenue_sar - total_expenses_sar;

  const net_margin = gross_revenue_usd > 0 ? (net_profit_usd / gross_revenue_usd) * 100 : 0;
  const roas = ad_spend_usd > 0 ? gross_revenue_usd / ad_spend_usd : 0;
  const profit_per_lead_usd = leads > 0 ? net_profit_usd / leads : 0;
  const profit_per_delivered_usd = delivered > 0 ? net_profit_usd / delivered : 0;

  // 4. Update Funnel DOM Table
  document.getElementById('fn-leads').textContent = Math.round(leads).toLocaleString();
  document.getElementById('fn-confirmed').textContent = Math.round(confirmed).toLocaleString();
  document.getElementById('fn-cr').textContent = cr_pct.toFixed(0) + '%';
  document.getElementById('fn-cancelled').textContent = Math.round(cancelled).toLocaleString();
  document.getElementById('fn-canc-rate').textContent = (100 - cr_pct).toFixed(0) + '%';
  document.getElementById('fn-dispatched').textContent = Math.round(dispatched).toLocaleString();
  document.getElementById('fn-delivered').textContent = Math.round(delivered).toLocaleString();
  document.getElementById('fn-dr').textContent = dr_pct.toFixed(0) + '%';
  document.getElementById('fn-returned').textContent = Math.round(returned).toLocaleString();
  document.getElementById('fn-ret-rate').textContent = (100 - dr_pct).toFixed(0) + '%';

  // 5. Update P&L Breakdown DOM Table
  document.getElementById('pl-rev-usd').textContent = fmtUSD(gross_revenue_usd);
  document.getElementById('pl-rev-sar').textContent = fmtSAR(gross_revenue_sar);

  document.getElementById('pl-ads-usd').textContent = '-' + fmtUSD(ad_spend_usd);
  document.getElementById('pl-ads-sar').textContent = '-' + fmtSAR(ad_spend_sar);

  document.getElementById('pl-cogs-usd').textContent = '-' + fmtUSD(total_cogs_usd);
  document.getElementById('pl-cogs-sar').textContent = '-' + fmtSAR(total_cogs_usd * FX_USD_SAR);

  document.getElementById('pl-conf-usd').textContent = '-' + fmtUSD(call_center_usd);
  document.getElementById('pl-conf-sar').textContent = '-' + fmtSAR(call_center_usd * FX_USD_SAR);

  document.getElementById('pl-ful-usd').textContent = '-' + fmtUSD(fulfillment_usd);
  document.getElementById('pl-ful-sar').textContent = '-' + fmtSAR(fulfillment_usd * FX_USD_SAR);

  document.getElementById('pl-deliv-usd').textContent = '-' + fmtUSD(delivery_courier_usd);
  document.getElementById('pl-deliv-sar').textContent = '-' + fmtSAR(delivery_courier_usd * FX_USD_SAR);

  document.getElementById('pl-ret-usd').textContent = '-' + fmtUSD(return_rto_usd);
  document.getElementById('pl-ret-sar').textContent = '-' + fmtSAR(return_rto_usd * FX_USD_SAR);

  document.getElementById('pl-cost-usd').textContent = '-' + fmtUSD(total_expenses_usd);
  document.getElementById('pl-cost-sar').textContent = '-' + fmtSAR(total_expenses_sar);

  const netUsdEl = document.getElementById('pl-net-usd');
  const netSarEl = document.getElementById('pl-net-sar');
  netUsdEl.textContent = (net_profit_usd >= 0 ? '+' : '') + fmtUSD(net_profit_usd);
  netSarEl.textContent = (net_profit_sar >= 0 ? '+' : '') + fmtSAR(net_profit_sar);
  netUsdEl.style.color = net_profit_usd >= 0 ? 'var(--green)' : 'var(--red)';
  netSarEl.style.color = net_profit_sar >= 0 ? 'var(--green)' : 'var(--red)';

  // 6. Highlight KPI Cards
  const cardProfitEl = document.getElementById('card-net-profit');
  const resProfitUsdEl = document.getElementById('res-profit-usd');
  const resProfitSarEl = document.getElementById('res-profit-sar');
  resProfitUsdEl.textContent = (net_profit_usd >= 0 ? '+' : '') + fmtUSD(net_profit_usd);
  resProfitSarEl.textContent = (net_profit_sar >= 0 ? '+' : '') + fmtSAR(net_profit_sar);

  if (net_profit_usd >= 0) {
    cardProfitEl.style.borderColor = 'var(--green)';
    resProfitUsdEl.style.color = 'var(--green)';
    resProfitSarEl.style.color = 'var(--green)';
  } else {
    cardProfitEl.style.borderColor = 'var(--red)';
    resProfitUsdEl.style.color = 'var(--red)';
    resProfitSarEl.style.color = 'var(--red)';
  }

  const resMarginEl = document.getElementById('res-margin');
  resMarginEl.textContent = net_margin.toFixed(1) + '%';
  resMarginEl.style.color = net_margin >= 20 ? 'var(--green)' : (net_margin >= 0 ? 'var(--gold)' : 'var(--red)');
  document.getElementById('res-roas').textContent = 'عائد الإعلان: ' + roas.toFixed(2) + 'x ROAS';

  document.getElementById('res-profit-lead').textContent = (profit_per_lead_usd >= 0 ? '+' : '') + fmtUSD(profit_per_lead_usd);
  document.getElementById('res-profit-lead-sar').textContent = (profit_per_lead_usd >= 0 ? '+' : '') + fmtSAR(profit_per_lead_usd * FX_USD_SAR) + ' / ليد';

  document.getElementById('res-profit-order').textContent = (profit_per_delivered_usd >= 0 ? '+' : '') + fmtUSD(profit_per_delivered_usd);
  document.getElementById('res-profit-order-sar').textContent = (profit_per_delivered_usd >= 0 ? '+' : '') + fmtSAR(profit_per_delivered_usd * FX_USD_SAR) + ' / طلب';

  // 7. SECTION 1: BREAKEVEN CALCULATIONS
  // Revenue per lead = cr * dr * aov_usd
  // Non-ad costs per lead = (cr * FEE_CONFIRM) + (cr * FEE_FULFILL) + (cr * dr * (FEE_DELIVERY + cogs_per_order_usd)) + (cr * (1 - dr) * FEE_RETURN)
  const rev_per_lead = cr * dr * aov_usd;
  const non_ad_costs_per_lead = (cr * FEE_CONFIRM) + (cr * FEE_FULFILL) + (cr * dr * (FEE_DELIVERY + cogs_per_order_usd)) + (cr * (1 - dr) * FEE_RETURN);
  const be_cpl_usd = Math.max(0, rev_per_lead - non_ad_costs_per_lead);
  const be_cpl_sar = be_cpl_usd * FX_USD_SAR;

  document.getElementById('be-cpl-usd').textContent = fmtUSD(be_cpl_usd);
  document.getElementById('be-cpl-sar').textContent = 'يعادل ' + fmtSAR(be_cpl_sar) + ' لكل ليد كحد أقصى';

  // Breakeven Delivery Rate
  const unit_contrib = (aov_usd - FEE_DELIVERY - cogs_per_order_usd + FEE_RETURN);
  let be_dr = 0;
  if (confirmed > 0 && unit_contrib > 0) {
    const fixed_hurdle = (leads * cpl_usd) + confirmed * (FEE_CONFIRM + FEE_FULFILL + FEE_RETURN);
    be_dr = (fixed_hurdle / (confirmed * unit_contrib)) * 100;
  }
  const beDelivEl = document.getElementById('be-deliv-rate');
  const beDelivSub = document.getElementById('be-deliv-sub');
  if (be_dr > 100) {
    beDelivEl.textContent = '> 100%';
    beDelivEl.style.color = 'var(--red)';
    beDelivSub.textContent = '⚠️ تكلفة الليد الحالية ($' + cpl_usd.toFixed(1) + ') تتطلب نسبة تسليم تفوق 100% لتفادي الخسارة';
  } else if (be_dr <= 0) {
    beDelivEl.textContent = '0%';
    beDelivEl.style.color = 'var(--green)';
    beDelivSub.textContent = 'أرباحك ممتازة حتى مع أدنى نسبة توصيل';
  } else {
    beDelivEl.textContent = be_dr.toFixed(1) + '%';
    beDelivEl.style.color = be_dr <= dr_pct ? 'var(--green)' : 'var(--red)';
    beDelivSub.textContent = (be_dr <= dr_pct ? '✅ نسبتك الحالية (' + dr_pct.toFixed(0) + '%) أعلى من نسبة التعادل المطلوبة' : '⚠️ نسبتك الحالية أقل من التعادل المطلوب');
  }

  // Breakeven ROAS
  let be_roas = 1.0;
  if (gross_revenue_usd > 0) {
    const non_ad_total = total_logistics_usd + total_cogs_usd;
    if (gross_revenue_usd > non_ad_total) {
      be_roas = gross_revenue_usd / (gross_revenue_usd - non_ad_total);
    } else {
      be_roas = 99;
    }
  }
  document.getElementById('be-roas').textContent = be_roas > 10 ? '> 10x' : be_roas.toFixed(2) + 'x';

  // Breakeven AOV
  const be_aov_usd = delivered > 0 ? (total_expenses_usd / delivered) : (cogs_per_order_usd + FEE_DELIVERY + 10);
  const be_aov_sar = be_aov_usd * FX_USD_SAR;
  document.getElementById('be-aov').textContent = fmtUSD(be_aov_usd);
  document.getElementById('be-aov-sar').textContent = 'يعادل ' + fmtSAR(be_aov_sar);

  // 8. Monthly Scaling Matrix (30 Days)
  const tiers = [25, 50, 100, 200, 300, 500];
  const matrixTbody = document.getElementById('matrix-tbody');
  matrixTbody.innerHTML = tiers.map(dailyLeads => {
    const mLeads = dailyLeads * 30;
    const mConf = mLeads * cr;
    const mDeliv = mConf * dr;
    const mRet = mConf * (1 - dr);

    const mAdsUsd = mLeads * cpl_usd;
    const mLogisticsUsd = (mConf * FEE_CONFIRM) + (mConf * FEE_FULFILL) + (mDeliv * FEE_DELIVERY) + (mRet * FEE_RETURN);
    const mCogsUsd = mDeliv * cogs_per_order_usd;
    const mExpUsd = mAdsUsd + mLogisticsUsd + mCogsUsd;
    const mRevUsd = mDeliv * aov_usd;
    const mProfitUsd = mRevUsd - mExpUsd;
    const mProfitSar = mProfitUsd * FX_USD_SAR;
    const mMargin = mRevUsd > 0 ? (mProfitUsd / mRevUsd) * 100 : 0;
    const pColor = mProfitUsd >= 0 ? 'var(--green)' : 'var(--red)';

    return `<tr>
      <td><strong>${dailyLeads} ليد/يوم</strong></td>
      <td>${mLeads.toLocaleString()}</td>
      <td style="color:var(--gold);font-weight:600">${Math.round(mDeliv).toLocaleString()} طلب</td>
      <td>${fmtUSD(mAdsUsd)}</td>
      <td>${fmtUSD(mRevUsd)}</td>
      <td style="font-weight:700;color:${pColor}">${(mProfitUsd >= 0 ? '+' : '') + fmtUSD(mProfitUsd)}</td>
      <td style="font-weight:700;color:${pColor}">${(mProfitSar >= 0 ? '+' : '') + fmtSAR(mProfitSar)}</td>
      <td><span class="badge ${mMargin >= 20 ? 'badge-confirmed' : (mMargin >= 0 ? 'badge-pending' : 'badge-cancelled')}">${mMargin.toFixed(1)}%</span></td>
    </tr>`;
  }).join('');
}

// ── INIT ───────────────────────────────────────────────────────
loadMetrics();
setTimeout(initProfitCalc, 300);
</script>
</body>
</html>"""

@router.get("/admin", response_class=HTMLResponse)
async def dashboard():
    return _HTML
