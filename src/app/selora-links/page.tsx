'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RedirectLinkItem {
  id: string;
  slug: string;
  destination: string;
  title: string | null;
  is_active: boolean;
  clicks: number;
  created_at: string | null;
  updated_at: string | null;
}

const PRESET_DESTINATIONS = [
  { label: 'الرئيسية', path: '/ar' },
  { label: 'سيروم التشققات', path: '/ar/products/stretch-mark-serum' },
  { label: 'كريم التشققات', path: '/ar/products/stretch-mark-cream' },
  { label: 'صفحة التدفئة المخففة (/lp)', path: '/lp' },
  { label: 'السلة والشراء السريع', path: '/ar/cart' },
];

export default function SeloraLinksAdmin() {
  const [password, setPassword] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [links, setLinks] = useState<RedirectLinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSlug, setFormSlug] = useState('');
  const [formDestination, setFormDestination] = useState('/ar');
  const [formTitle, setFormTitle] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // UTM Generator State
  const [utmSlug, setUtmSlug] = useState('');
  const [utmSource, setUtmSource] = useState('tiktok');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmCopied, setUtmCopied] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.seloorabeauty.shop';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seloorabeauty.shop';

  const checkAuth = useCallback(async (token: string) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${apiUrl}/api/links/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Links-Password': token,
        },
      });
      if (res.ok) {
        setPassword(token);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('slr_links_pass', token);
        }
        return true;
      } else {
        setAuthError('كلمة المرور غير صحيحة، تأكد من إدخال الرمز الصحيح');
        return false;
      }
    } catch {
      setAuthError('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [apiUrl]);

  const fetchLinks = useCallback(async (token = password) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/links`, {
        headers: {
          'X-Links-Password': token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data || []);
        if (data && data.length > 0 && !utmSlug) {
          setUtmSlug(data[0].slug);
        }
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        setPassword('');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('slr_links_pass');
        }
      } else {
        setError('تعذر تحميل الروابط');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [apiUrl, password, utmSlug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('slr_links_pass');
      if (saved) {
        checkAuth(saved).then((ok) => {
          if (ok) fetchLinks(saved);
        });
      }
    }
  }, [checkAuth, fetchLinks]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPass.trim()) return;
    const ok = await checkAuth(inputPass.trim());
    if (ok) {
      fetchLinks(inputPass.trim());
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setInputPass('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('slr_links_pass');
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormSlug('');
    setFormDestination('/ar');
    setFormTitle('');
    setFormActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: RedirectLinkItem) => {
    setEditingId(item.id);
    setFormSlug(item.slug);
    setFormDestination(item.destination);
    setFormTitle(item.title || '');
    setFormActive(item.is_active);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSlug.trim()) {
      setFormError('الرمز (slug) مطلوب');
      return;
    }
    if (!formDestination.trim()) {
      setFormError('الرابط المستهدف مطلوب');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const url = editingId ? `${apiUrl}/api/links/${editingId}` : `${apiUrl}/api/links`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Links-Password': password,
        },
        body: JSON.stringify({
          slug: formSlug.trim().toLowerCase(),
          destination: formDestination.trim(),
          title: formTitle.trim() || undefined,
          is_active: formActive,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'تعذر حفظ الرابط');
      }

      setModalOpen(false);
      fetchLinks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setFormError(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string, slug: string) => {
    if (!confirm(`هل أنت متأكدة من حذف الرابط "${slug}"؟`)) return;
    try {
      const res = await fetch(`${apiUrl}/api/links/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Links-Password': password,
        },
      });
      if (res.ok) {
        fetchLinks();
      } else {
        alert('تعذر حذف الرابط');
      }
    } catch {
      alert('خطأ أثناء الحذف');
    }
  };

  const handleToggleActive = async (item: RedirectLinkItem) => {
    try {
      const res = await fetch(`${apiUrl}/api/links/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Links-Password': password,
        },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generatedUtmUrl = utmSlug
    ? `${siteUrl}/ads/${utmSlug}?utm_source=${utmSource}&utm_medium=${utmMedium}${
        utmCampaign.trim() ? `&utm_campaign=${encodeURIComponent(utmCampaign.trim())}` : ''
      }`
    : '';

  const copyUtm = () => {
    if (!generatedUtmUrl) return;
    navigator.clipboard.writeText(generatedUtmUrl);
    setUtmCopied(true);
    setTimeout(() => setUtmCopied(false), 2000);
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const activeCount = links.filter((l) => l.is_active).length;

  // ── 1. LOGIN SCREEN ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center p-4 font-sans"
        style={{ backgroundColor: '#140C06' }}
      >
        <div
          className="w-full max-w-md p-8 rounded-3xl border shadow-2xl relative"
          style={{
            backgroundColor: '#1E130B',
            borderColor: 'rgba(196,148,62,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[#C4943E] to-[#8A611E] shadow-lg">
            <Lock size={28} className="text-[#FDFAF6]" />
          </div>

          <h1 className="text-2xl font-bold text-center text-[#FDFAF6] mb-2">
            لوحة روابط الإعلانات
          </h1>
          <p className="text-sm text-center text-[#B0998A] mb-8">
            أدخل كلمة مرور لوحة الروابط (Redirects Dashboard)
          </p>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
              <ShieldAlert size={18} className="flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#EFE4D4] mb-2">
                كلمة مرور الروابط (LINKS_ADMIN_PASSWORD)
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="أدخل كلمة المرور..."
                  dir="ltr"
                  className="w-full px-4 py-3.5 rounded-xl border text-sm text-white focus:outline-none transition-colors"
                  style={{
                    backgroundColor: '#140C06',
                    borderColor: 'rgba(196,148,62,0.3)',
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B6E] hover:text-[#C4943E]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || !inputPass.trim()}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #C4943E, #8A611E)',
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <span>دخول لوحة الروابط</span>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-[#8C7B6E] mt-6">
            مستقلة بالكامل عن لوحة الطلبات وتدعم جميع معايير UTM وتيك توك وسناب شات
          </p>
        </div>
      </div>
    );
  }

  // ── 2. MAIN DASHBOARD ──────────────────────────────────────────────────────
  return (
    <div
      dir="rtl"
      className="min-h-screen font-sans"
      style={{ backgroundColor: '#140C06', color: '#FDFAF6' }}
    >
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(26,15,8,0.85)',
          borderColor: 'rgba(196,148,62,0.18)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#C4943E] to-[#8A611E] shadow-md">
            <LinkIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              سيلورا بيوتي — إدارة روابط الإعلانات
            </h1>
            <span className="text-xs text-[#C4943E] font-medium tracking-wide">
              Selora Links & Redirects Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLinks()}
            disabled={loading}
            className="p-2.5 rounded-xl border transition-colors hover:border-[#C4943E] text-[#B0998A] hover:text-white"
            style={{ backgroundColor: '#1E130B', borderColor: 'rgba(196,148,62,0.2)' }}
            title="تحديث"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
          >
            <Plus size={18} />
            <span>إنشاء رابط جديد</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs px-3 py-2 rounded-lg border text-[#B0998A] hover:text-red-400 hover:border-red-500/40 transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="p-5 rounded-2xl border"
            style={{ backgroundColor: '#1E130B', borderColor: 'rgba(196,148,62,0.18)' }}
          >
            <div className="flex items-center justify-between text-[#8C7B6E] mb-2 text-xs font-bold">
              <span>إجمالي الروابط</span>
              <LinkIcon size={16} className="text-[#C4943E]" />
            </div>
            <div className="text-3xl font-black text-white">{links.length}</div>
            <div className="text-[11px] text-[#B0998A] mt-1">روابط إعلانية مجهزة للتحويل</div>
          </div>

          <div
            className="p-5 rounded-2xl border"
            style={{ backgroundColor: '#1E130B', borderColor: 'rgba(196,148,62,0.18)' }}
          >
            <div className="flex items-center justify-between text-[#8C7B6E] mb-2 text-xs font-bold">
              <span>الروابط النشطة</span>
              <Unlock size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{activeCount}</div>
            <div className="text-[11px] text-[#B0998A] mt-1">تحوّل الزوار فوراً وبأمان</div>
          </div>

          <div
            className="p-5 rounded-2xl border"
            style={{ backgroundColor: '#1E130B', borderColor: 'rgba(196,148,62,0.18)' }}
          >
            <div className="flex items-center justify-between text-[#8C7B6E] mb-2 text-xs font-bold">
              <span>إجمالي النقرات المسجلة</span>
              <BarChart3 size={16} className="text-[#C4943E]" />
            </div>
            <div className="text-3xl font-black text-[#C4943E]">{totalClicks}</div>
            <div className="text-[11px] text-[#B0998A] mt-1">نقرة عبر روابط الإعلانات</div>
          </div>
        </div>

        {/* UTM Link Builder Tool */}
        <div
          className="p-6 rounded-3xl border relative overflow-hidden"
          style={{
            backgroundColor: '#1E130B',
            borderColor: 'rgba(196,148,62,0.25)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-[#C4943E]" />
            <h2 className="text-base font-bold text-white">
              منشئ روابط الإعلانات مع الـ UTM والمعاملات
            </h2>
          </div>
          <p className="text-xs text-[#B0998A] mb-6">
            اختر الرابط ثم حددي المنصة الإعلانية ليتم توليد الرابط الكامل لنشره في تيك توك وسناب شات مع حفظ كافة المعاملات ونقلها للشيت.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">الرابط الإعلاني (Slug)</label>
              <select
                value={utmSlug}
                onChange={(e) => setUtmSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white focus:outline-none"
                style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.3)' }}
              >
                {links.map((l) => (
                  <option key={l.id} value={l.slug}>
                    /ads/{l.slug} ({l.title || l.destination})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">المنصة الإعلانية (Source)</label>
              <select
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white focus:outline-none"
                style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.3)' }}
              >
                <option value="tiktok">TikTok Ads (تيك توك)</option>
                <option value="snapchat">Snapchat Ads (سناب شات)</option>
                <option value="instagram">Instagram / Meta</option>
                <option value="influencer">مشهور / مؤثر (Influencer)</option>
                <option value="google">Google Ads</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">اسم الحملة (Campaign Name)</label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="مثال: serum_cold_v1"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white focus:outline-none"
                style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.3)' }}
              />
            </div>
          </div>

          {generatedUtmUrl && (
            <div
              className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.2)' }}
            >
              <div className="w-full overflow-x-auto text-xs font-mono text-[#C4943E] py-1 text-left" dir="ltr">
                {generatedUtmUrl}
              </div>
              <button
                onClick={copyUtm}
                className="px-4 py-2 rounded-lg font-bold text-xs text-white flex items-center gap-1.5 flex-shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
              >
                {utmCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{utmCopied ? 'تم النسخ!' : 'نسخ الرابط للإعلان'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Links Table / List */}
        <div
          className="rounded-3xl border overflow-hidden"
          style={{ backgroundColor: '#1E130B', borderColor: 'rgba(196,148,62,0.2)' }}
        >
          <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(196,148,62,0.15)' }}>
            <div>
              <h3 className="font-bold text-base text-white">قائمة روابط التحويل النشطة</h3>
              <p className="text-xs text-[#8C7B6E]">
                كل رابط يحافظ تلقائياً على معايير UTM ومعرفات النقرة (ttclid, ScCid) عند التحويل
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="text-xs px-3 py-1.5 rounded-lg border text-[#C4943E] hover:bg-[#C4943E]/10 transition-colors"
              style={{ borderColor: 'rgba(196,148,62,0.3)' }}
            >
              + رابط جديد
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border-b border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {links.length === 0 && !loading ? (
            <div className="p-12 text-center text-[#8C7B6E]">
              <LinkIcon size={36} className="mx-auto mb-3 opacity-40 text-[#C4943E]" />
              <p className="text-sm font-medium">لا توجد روابط تحويل منشأة حتى الآن</p>
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
              >
                أنشئ أول رابط إعلاني
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(196,148,62,0.1)]">
              {links.map((item) => {
                const fullAdUrl = `${siteUrl}/ads/${item.slug}`;
                return (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">
                          {item.title || item.slug}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.is_active
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {item.is_active ? 'نشط' : 'معطّل'}
                        </span>
                        <span className="text-[11px] text-[#B0998A] bg-black/40 px-2 py-0.5 rounded-md font-mono border border-white/5">
                          {item.clicks} نقرة
                        </span>
                      </div>

                      {/* Ad URL */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#C4943E]" dir="ltr">
                        <span className="truncate max-w-md">{fullAdUrl}</span>
                        <button
                          onClick={() => copyToClipboard(fullAdUrl, item.id)}
                          className="p-1 hover:text-white transition-colors"
                          title="نسخ الرابط"
                        >
                          {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>

                      {/* Destination */}
                      <div className="flex items-center gap-1.5 text-xs text-[#8C7B6E]">
                        <span>يتحول إلى:</span>
                        <code className="text-white/80 font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/30">
                          {item.destination}
                        </code>
                        <a
                          href={fullAdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C4943E] hover:underline flex items-center gap-0.5 text-[11px]"
                        >
                          <span>تجربة التحويل</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          item.is_active
                            ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40'
                            : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                        }`}
                        title="تغيير الحالة"
                      >
                        {item.is_active ? 'تعطيل' : 'تفعيل'}
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg border text-[#B0998A] hover:text-white hover:border-[#C4943E] transition-colors"
                        style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.2)' }}
                        title="تعديل"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleDeleteLink(item.id, item.slug)}
                        className="p-2 rounded-lg border text-red-400 hover:bg-red-950/40 hover:border-red-500/40 transition-colors"
                        style={{ backgroundColor: '#140C06', borderColor: 'rgba(255,255,255,0.08)' }}
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── 3. CREATE / EDIT MODAL ────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative animate-in fade-in zoom-in-95"
            style={{
              backgroundColor: '#1E130B',
              borderColor: 'rgba(196,148,62,0.3)',
              boxShadow: '0 25px 70px rgba(0,0,0,0.8)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-1">
              {editingId ? 'تعديل رابط التحويل' : 'إنشاء رابط تحويل إعلاني جديد'}
            </h3>
            <p className="text-xs text-[#B0998A] mb-6">
              حددي الرمز المختصر والوجهة المستهدفة. سيتم تمرير كافة معاملات الرابط تلقائياً.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveLink} className="space-y-4">
              {/* Title / Description */}
              <div>
                <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">
                  اسم الحملة / وصف الرابط (اختياري)
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: تيك توك — هوك الوجع (فيديو ١)"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white focus:outline-none"
                  style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.25)' }}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">
                  الرمز المختصر للرابط (Slug) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="مثال: promo1 أو tt-serum"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-[#C4943E] focus:outline-none text-left"
                    style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.25)' }}
                    required
                  />
                </div>
                <p className="text-[11px] text-[#8C7B6E] mt-1 font-mono" dir="ltr">
                  Preview: {siteUrl}/ads/{formSlug.trim() || '[slug]'}
                </p>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-[#EFE4D4] mb-1.5">
                  الرابط المستهدف (Destination) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="مثال: /ar أو /lp أو https://..."
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-white focus:outline-none text-left mb-2"
                  style={{ backgroundColor: '#140C06', borderColor: 'rgba(196,148,62,0.25)' }}
                  required
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_DESTINATIONS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setFormDestination(preset.path)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        formDestination === preset.path
                          ? 'border-[#C4943E] bg-[#C4943E]/20 text-white font-bold'
                          : 'border-white/10 text-[#8C7B6E] hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">تفعيل الرابط</div>
                  <div className="text-[11px] text-[#8C7B6E]">
                    عند التعطيل لن يتم تحويل الزوار
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    formActive ? 'bg-[#C4943E]' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formActive ? 'translate-x-[-24px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold text-[#B0998A] hover:text-white transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #C4943E, #8A611E)' }}
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'حفظ التعديلات' : 'إنشاء الرابط'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
