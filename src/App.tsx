import { useState, useEffect } from 'react';
import { content, type Language } from './data/translations';
import type { ServiceItem, FaqItem, AnnouncementConfig, ContactConfig } from './types/site';
import { fetchLiveCrmServices } from './services/crmService';
import { getInitialTenantConfig, type TenantConfig } from './config/tenant';
import {
  ExternalLink,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  Receipt,
  Users,
  Clock,
  ArrowRight,
  Landmark,
  Building2,
  Sparkles,
  Search,
  Menu,
  X,
  Lock,
  ChevronRight,
  Mail,
  MapPin,
  Laptop,
  Check,
  Send,
  Mic,
  MicOff,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FolderCheck,
  User,
  LogIn
} from 'lucide-react';
import { CitizenAuthModal } from './components/CitizenAuthModal';
import { CitizenDashboardModal } from './components/CitizenDashboardModal';
import { supabase, type CitizenUser } from './services/supabase';

export default function App() {
  const [lang, setLang] = useState<Language>('mr');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Citizen Authentication & Dashboard States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [currentCitizen, setCurrentCitizen] = useState<CitizenUser | null>(null);

  // Listen to Supabase Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setCurrentCitizen({
          id: session.user.id,
          email: session.user.email,
          phone: meta.phone || '',
          fullName: meta.full_name || session.user.email?.split('@')[0] || 'नागरिक',
          role: 'citizen',
          source: meta.source || 'website',
          accountId: meta.account_id || '',
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setCurrentCitizen({
          id: session.user.id,
          email: session.user.email,
          phone: meta.phone || '',
          fullName: meta.full_name || session.user.email?.split('@')[0] || 'नागरिक',
          role: 'citizen',
          source: meta.source || 'website',
          accountId: meta.account_id || '',
        });
      } else {
        setCurrentCitizen(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Multi-Tenant / Reseller White-Label Configuration
  const [tenantConfig, setTenantConfig] = useState<TenantConfig>(getInitialTenantConfig());

  // CRM Sync States (internal background sync only)
  const [liveServiceCount, setLiveServiceCount] = useState<number>(0);

  const t = content[lang];

  // Dynamic content states
  const [services, setServices] = useState<ServiceItem[]>(t.services.items as unknown as ServiceItem[]);
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(t.announcement);
  const [contactInfo, setContactInfo] = useState<ContactConfig>(t.contact);
  const [faqs, setFaqs] = useState<FaqItem[]>(t.faq.items);

  // Fetch Live Services from CRM Database (Tenant Scoped & Automatic)
  const loadCrmServices = async (targetLang: Language, accountId?: string) => {
    const targetAccountId = accountId !== undefined ? accountId : tenantConfig.accountId;
    try {
      const liveServices = await fetchLiveCrmServices(targetLang, targetAccountId);
      if (liveServices && liveServices.length > 0) {
        setServices(liveServices);
        setLiveServiceCount(liveServices.length);
      } else {
        setServices(content[targetLang].services.items as unknown as ServiceItem[]);
      }
    } catch (e) {
      console.warn('CRM services background load failed, using catalog fallback', e);
      setServices(content[targetLang].services.items as unknown as ServiceItem[]);
    }
  };

  // Sync on initial mount & load published tenant config (Live CRM + Cloud Storage + local fallback)
  useEffect(() => {
    const crmApiUrl = `https://crm.agmultiservices.online/api/portal/config?accountId=${tenantConfig.accountId}`;
    const storageApiUrl = `https://kpvjenicwrzuzrxvucmf.supabase.co/storage/v1/object/public/portal-config/tenant-config.json?t=${Date.now()}`;

    fetch(crmApiUrl)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('CRM config API unavailable');
      })
      .catch(() => {
        return fetch(storageApiUrl).then((res) => {
          if (res.ok) return res.json();
          throw new Error('Storage config unavailable');
        });
      })
      .catch(() => {
        return fetch('/tenant.config.json?t=' + Date.now()).then((res) => {
          if (res.ok) return res.json();
          return null;
        });
      })
      .then((data) => {
        if (data && data.brandName) {
          const officialTagline = 'तुमचा विश्वासू डिजिटल पार्टनर';
          const officialTaglineEn = 'Your Trusted Digital Partner';
          const officialBadge = 'आपले सरकार सेवा केंद्र';

          setTenantConfig((prev) => {
            const updated = {
              ...prev,
              ...data,
              brandTagline: (!data.brandTagline || data.brandTagline === 'शासकीय व नागरी सेवा केंद्र') ? officialTagline : data.brandTagline,
              brandTaglineEn: (!data.brandTaglineEn || data.brandTaglineEn === 'Citizen & Government Services Center') ? officialTaglineEn : data.brandTaglineEn,
              centerBadge: data.centerBadge || officialBadge,
              timings: (data.timings && (data.timings.includes('रात्री ५') || data.timings.includes('रात्री ८')))
                ? 'सकाळी १०:०० ते सायंकाळी ५:३० (सोमवार ते शनिवार)'
                : (data.timings || prev.timings),
            };
            try {
              localStorage.setItem('agms_tenant_config', JSON.stringify(updated));
            } catch {
              // Ignore localstorage errors
            }
            return updated;
          });
          if (data.announcement) {
            setAnnouncement(data.announcement);
          }
        }
      })
      .catch((err) => console.log('Using tenant defaults', err));
  }, [tenantConfig.accountId]);

  // Sync on initial mount & language change
  useEffect(() => {
    // Preserve dynamic live announcement if loaded, only fallback if empty
    setAnnouncement((prev) => {
      if (prev?.text) return prev;
      return content[lang].announcement;
    });
    setContactInfo(content[lang].contact);
    setFaqs(content[lang].faq.items);

    // Load live services from CRM for this tenant
    loadCrmServices(lang, tenantConfig.accountId);
  }, [lang, tenantConfig.accountId]);

  // Speech Recognition (Bhashini Voice Integration)
  const handleVoiceSearch = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        lang === 'mr'
          ? 'आपल्या ब्राउझरमध्ये व्हॉईस रिकग्निशन उपलब्ध नाही. कृपया Google Chrome वापरा.'
          : 'Voice recognition is not supported in this browser. Please use Google Chrome.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: { results: { [x: string]: { [x: string]: { transcript: string } } } }) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Filter services by category and search query
  const filteredServices = services.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.price.toLowerCase().includes(q) ||
      (item.timeline && item.timeline.toLowerCase().includes(q)) ||
      (item.documents &&
        item.documents.some((d) => d.name.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identity':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'farmer':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      case 'welfare':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'business':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getCrmFeatureIcon = (index: number) => {
    switch (index) {
      case 0:
        return <MessageSquare className="w-6 h-6 text-emerald-400" />;
      case 1:
        return <FileText className="w-6 h-6 text-teal-400" />;
      case 2:
        return <Lock className="w-6 h-6 text-cyan-400" />;
      case 3:
        return <Receipt className="w-6 h-6 text-amber-400" />;
      case 4:
        return <Smartphone className="w-6 h-6 text-indigo-400" />;
      case 5:
        return <Sparkles className="w-6 h-6 text-orange-400" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
    }
  };

  // Clean WhatsApp Number formatted for direct wa.me URL
  const waTargetNumber = tenantConfig.whatsappNumber ? tenantConfig.whatsappNumber.replace(/\D/g, '') : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800 relative">
      {/* 📢 UNIFIED SLEEK TOP BAR (Single Clean Header Top) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white text-xs py-2 px-4 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Important Notice */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wide">
              {lang === 'mr' ? 'महत्त्वाची सूचना' : 'Notice'}
            </span>
            <p className="font-semibold truncate text-emerald-100 text-xs sm:text-sm">
              {(lang === 'en' && announcement.textEn)
                ? announcement.textEn
                : (announcement.text || (lang === 'mr' ? 'महा आयडी कार्ड नवीन अर्ज केंद्रामध्ये सुरू आहेत.' : 'Maha ID Card new applications are active at our center.'))}
            </p>
            <a
              href="#services"
              className="shrink-0 text-amber-300 font-bold underline hover:text-white transition text-xs hidden sm:inline"
            >
              {announcement.linkText || (lang === 'mr' ? 'तपासा' : 'Check')}
            </a>
          </div>

          {/* Right: Quick Timings & Direct WhatsApp Contact */}
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lang === 'mr'
                  ? (tenantConfig.timings || 'वेळ: स. १०:०० ते सायं. ५:३० (सोम-शनि)')
                  : (tenantConfig.timingsEn || 'Hours: 10:00 AM - 5:30 PM (Mon-Sat)')}
              </span>
            </div>
            <a
              href={`https://wa.me/${waTargetNumber}?text=${encodeURIComponent(contactInfo.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs border border-emerald-400/40"
              title="थेट WhatsApp संपर्क"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
              <span>WhatsApp: {tenantConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[76px] sm:h-20 py-2 sm:py-0 flex items-center justify-between gap-4">
          {/* Logo & Brand (Aaple Sarkar Seva Kendra + Official 3D AG Logo) */}
          <a href="#" className="flex items-center gap-3 sm:gap-3.5 group shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-1.5 shadow-md shadow-emerald-950/10 border border-slate-200 group-hover:border-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-500/15 group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
              <img
                src="/logo.png?v=2"
                alt={tenantConfig.brandName}
                className="w-full h-full object-contain rounded-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white shadow-xs" title="अधिकृत केंद्र">
                ✓
              </span>
            </div>
            <div className="flex flex-col">
              {/* Row 1: Brand Title + Official Center Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  {tenantConfig.brandName || t.nav.brand}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 text-amber-950 border border-amber-400/80 shadow-2xs">
                  <Landmark className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>{tenantConfig.centerBadge || (lang === 'mr' ? 'आपले सरकार सेवा केंद्र' : 'Aaple Sarkar Seva Kendra')}</span>
                </span>
              </div>
              {/* Row 2: Tagline with Verified Shield */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-800 font-extrabold tracking-wide">
                  {lang === 'mr'
                    ? (tenantConfig.brandTagline || t.nav.tagline)
                    : (tenantConfig.brandTaglineEn || tenantConfig.brandTagline || t.nav.tagline)}
                </p>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (Floating Glass Pill Group) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-xs">
            <a
              href="#home"
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-800 hover:text-emerald-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              {t.nav.home}
            </a>
            <a
              href="#services"
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              {t.nav.services}
            </a>
            <a
              href="#how-it-works"
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              {lang === 'mr' ? 'कार्यपद्धती' : t.howItWorks.title}
            </a>
            <a
              href="#faq"
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Actions: Segmented Language Toggle, Citizen Portal, & CRM CTA */}
          <div className="hidden sm:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Segmented Marathi | English Switcher */}
            <div className="inline-flex items-center rounded-xl border border-slate-200/90 bg-slate-100/90 p-1 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setLang('mr')}
                type="button"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
                  lang === 'mr'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
                title="मराठी भाषा निवडा"
              >
                <span>मराठी</span>
                {lang === 'mr' && <Check className="w-3 h-3 text-white" />}
              </button>
              <button
                onClick={() => setLang('en')}
                type="button"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
                title="Switch to English"
              >
                <span>English</span>
                {lang === 'en' && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>

            {/* Citizen Portal Login / Profile Button */}
            {currentCitizen ? (
              <button
                onClick={() => setDashboardModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
                title="नागरिक प्रोफाइल व अर्ज ट्रॅकिंग"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <User className="w-4 h-4 text-emerald-700" />
                <span className="truncate max-w-[110px]">{currentCitizen.fullName}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-300 hover:border-emerald-500 text-slate-800 hover:text-emerald-900 font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer group"
                title="नागरिक लॉगिन किंवा नवीन नोंदणी"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100/70 group-hover:bg-emerald-200/80 flex items-center justify-center transition-colors">
                  <LogIn className="w-3.5 h-3.5 text-emerald-800" />
                </div>
                <span>{lang === 'mr' ? 'नागरिक लॉगिन' : 'Citizen Login'}</span>
              </button>
            )}

            {/* Direct CRM External Link (Tenant Specific) */}
            <a
              href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/25 hover:shadow-lg hover:shadow-emerald-700/35 transition-all active:scale-95 border border-emerald-400/40 group"
              title="VLE ऑपरेटर व केंद्र CRM पोर्टल"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{t.nav.openCrm}</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 p-0.5 text-[11px] font-bold">
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded-md transition ${lang === 'mr' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md transition ${lang === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700'}`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Subtle Signature Government & Digital Portal Accent Stripe */}
        <div className="h-[2px] bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 opacity-80"></div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t.nav.home}
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t.nav.services}
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {lang === 'mr' ? 'कार्यपद्धती' : t.howItWorks.title}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {t.nav.contact}
            </a>
            <div className="pt-2 flex flex-col gap-2">
              {currentCitizen ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDashboardModalOpen(true);
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-sm shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{currentCitizen.fullName} ({lang === 'mr' ? 'माझे खाते' : 'My Account'})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold text-sm shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-700" />
                  <span>{lang === 'mr' ? 'नागरिक लॉगिन / नोंदणी' : 'Citizen Login / Register'}</span>
                </button>
              )}
              <a
                href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-md"
              >
                <span>{t.nav.openCrm}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HERO SECTION (Google Pomelli Aesthetic) */}
        <section
          id="home"
          className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-radial-[at_top_right] from-emerald-100/70 via-slate-50 to-teal-50/50"
        >
          {/* Subtle decorative background blur shapes */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline, Subtitle, Actions */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                {/* Trust Badge with Bhashini & Active services count */}
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{t.hero.badge}</span>
                  </div>

                  {liveServiceCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 border border-teal-300 text-teal-900 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {lang === 'mr'
                          ? `${liveServiceCount}+ ऑनलाइन सेवा उपलब्ध`
                          : `${liveServiceCount}+ Services Available`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
                  <span>{t.hero.titleStart} </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-700 mt-1">
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                  {t.hero.subtitle}
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition active:scale-95"
                  >
                    <Search className="w-5 h-5" />
                    <span>{t.hero.exploreServices}</span>
                  </a>

                  <a
                    href="#crm"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition active:scale-95"
                  >
                    <Laptop className="w-5 h-5 text-emerald-600" />
                    <span>{t.hero.exploreCrm}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                </div>

                {/* Trust Points Mini Grid */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.hero.stats.citizens}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.hero.stats.successRate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.hero.stats.tracking}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{t.hero.stats.support}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pomelli Interactive Citizen Portal Mockup */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative glowing card halo */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-3xl blur-lg opacity-30"></div>

                  {/* Portal Preview Card */}
                  <div className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100">
                    {/* Header of Mockup Card */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <span className="ml-2 text-xs font-bold text-slate-500 tracking-wide uppercase truncate max-w-[150px]">
                          {tenantConfig.brandName} Portal
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-orange-600" />
                        <span>भाषिणी AI Live</span>
                      </span>
                    </div>

                    {/* Mock Application Card */}
                    <div className="mt-5 space-y-4">
                      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-inner">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                              URN: #APP-2026-9821
                            </span>
                            <h4 className="text-lg font-bold text-white mt-1">
                              {lang === 'mr' ? '७/१२ डिजिटल फेरफार व नकाशा' : '7/12 Digital Land Extract'}
                            </h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {lang === 'mr' ? 'नागरिक: रमेश आनंदा पाटील' : 'Citizen: Ramesh Ananda Patil'}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {lang === 'mr' ? 'मंजूर (Approved)' : 'Approved'}
                          </span>
                        </div>

                        {/* Progress Tracker */}
                        <div className="mt-4 pt-3 border-t border-slate-700/60">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                            <span>{lang === 'mr' ? 'अर्ज स्थिती' : 'Processing Stage'}</span>
                            <span className="text-emerald-400">१००% पूर्ण</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full w-full rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Instant WhatsApp Notification Simulation */}
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-950">
                              {lang === 'mr' ? 'WhatsApp डिजिटल पावती' : 'WhatsApp Digital Receipt'}
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              {lang === 'mr'
                                ? 'पावती व डाऊनलोड लिंक पाठवली ✅'
                                : 'Receipt & PDF sent directly ✅'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/70 px-2 py-1 rounded-lg">
                          ₹५० UPI
                        </span>
                      </div>

                      {/* Direct Link to CRM in hero card */}
                      <div className="pt-2">
                        <a
                          href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition border border-slate-200 group"
                        >
                          <div className="flex items-center gap-2">
                            <Laptop className="w-4 h-4 text-emerald-600" />
                            <span>
                              {lang === 'mr'
                                ? `${tenantConfig.brandName} CRM वर डेटा व्यवस्थापित आहे`
                                : `Managed on ${tenantConfig.brandName} CRM`}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-700 transition" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS COUNTER BAR */}
        <section className="bg-white border-y border-slate-200 py-10 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {t.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition duration-300"
                >
                  <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{metric.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{metric.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CITIZEN & GOVERNMENT SERVICES CATALOG (Dynamic & Filterable from CRM) */}
        <section id="services" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>{t.services.sectionBadge}</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.services.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">{t.services.subtitle}</p>

            {/* Bhashini Voice & Text Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm text-slate-800 shadow-sm outline-none transition"
                />

                {/* Microphone Button (Bhashini Speech-to-Text) */}
                <button
                  onClick={handleVoiceSearch}
                  type="button"
                  className={`absolute right-2 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                  title={t.hero.voiceSearchLabel}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>{lang === 'mr' ? 'ऐकतोय...' : 'Listening...'}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'mr' ? 'बोलून शोधा' : 'Voice'}</span>
                    </>
                  )}
                </button>
              </div>

              {searchQuery && (
                <div className="flex justify-between items-center mt-2 px-2 text-xs text-slate-500">
                  <span>
                    {lang === 'mr' ? 'शोध परिणाम:' : 'Search results:'} {filteredServices.length}{' '}
                    {lang === 'mr' ? 'सेवा सापडल्या' : 'services found'}
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-emerald-700 hover:underline font-bold cursor-pointer"
                  >
                    {lang === 'mr' ? 'फिल्टर काढा' : 'Clear'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { key: 'all', label: t.services.categories.all },
              { key: 'identity', label: t.services.categories.identity },
              { key: 'farmer', label: t.services.categories.farmer },
              { key: 'welfare', label: t.services.categories.welfare },
              { key: 'business', label: t.services.categories.business },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Cards Grid with Price, Timeline and Required Documents */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 space-y-3">
                <Search className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-base font-semibold">
                  {lang === 'mr' ? 'कोणतीही सेवा सापडली नाही.' : 'No services found.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  {lang === 'mr' ? 'सर्व सेवा पहा' : 'View all services'}
                </button>
              </div>
            ) : (
              filteredServices.map((service) => {
                // Formulate WhatsApp text with documents & timeline
                const docText =
                  service.documents && service.documents.length > 0
                    ? ` [कागदपत्रे: ${service.documents.map((d) => d.name).join(', ')}]`
                    : '';
                const timeText = service.timeline ? ` [वेळ: ${service.timeline}]` : '';
                const waLink = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(
                  `${contactInfo.whatsappMsg} [सेवा: ${service.name}] [दर: ${service.price}]${timeText}${docText}`
                )}`;

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges & Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getCategoryIcon(service.category)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[130px]">
                            {service.badge}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                            {service.price}
                          </span>
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {service.name}
                      </h3>

                      {/* ⏱️ Expected Timeline (लागणारा वेळ) */}
                      {service.timeline && (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{service.timeline}</span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                        {service.desc}
                      </p>

                      {/* 📋 Required Documents List (आवश्यक कागदपत्रे) */}
                      {service.documents && service.documents.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                            <FolderCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              {lang === 'mr' ? 'आवश्यक कागदपत्रे:' : 'Required Documents:'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {service.documents.map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-medium"
                              >
                                {doc.name}{' '}
                                {doc.isMandatory && (
                                  <span className="text-red-500 font-bold" title="अनिवार्य">*</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'mr' ? 'WhatsApp वर अर्ज करा' : 'Apply via WhatsApp'}</span>
                      </a>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* DEDICATED SMART CRM SECTION */}
        <section
          id="crm"
          className="py-20 sm:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden"
        >
          {/* Background ambient lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* CRM Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Laptop className="w-4 h-4" />
                <span>{tenantConfig.brandName} CRM</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {t.crmSection.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {t.crmSection.subtitle}
              </p>
            </div>

            {/* Live CRM Callout Box (Direct Portal Navigation) */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Portal: {tenantConfig.crmUrl.replace(/^https?:\/\//, '')}</span>
                    <span className="text-orange-300 font-semibold border-l border-emerald-700/60 pl-2">
                      🇮🇳 भाषिणी AI Enabled
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {lang === 'mr'
                      ? 'नागरी अर्ज व ऑपरेशन्ससाठी थेट CRM पोर्टल'
                      : 'Live Operations & Citizen CRM Portal'}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {t.crmSection.desc} {tenantConfig.crmUrl}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <a
                    href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition active:scale-95 group text-center"
                  >
                    <span>{t.crmSection.openButton}</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <span className="text-center text-xs text-slate-400">
                    {lang === 'mr'
                      ? 'अधिकृत ऑपरेटर व कर्मचारी लॉगिन उपलब्ध'
                      : 'Authorized Operator & Staff Login'}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 Real CRM Functionalities Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.crmSection.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 hover:border-emerald-400/40 rounded-3xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        {getCrmFeatureIcon(idx)}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        idx === 5
                          ? 'bg-orange-500/20 text-orange-300 border-orange-400/40'
                          : 'bg-white/10 text-emerald-300 border-white/10'
                      }`}>
                        {feat.tag}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs text-emerald-400 font-semibold gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>
                      {lang === 'mr' ? 'सिस्टीममध्ये सक्रिय' : `Active in ${tenantConfig.brandName} CRM`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (कार्यपद्धती) */}
        <section id="how-it-works" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.howItWorks.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="text-4xl font-black text-emerald-600/30 font-mono mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ❓ FREQUENTLY ASKED QUESTIONS (FAQ) SECTION (Expandable & Editable) */}
        <section id="faq" className="py-20 sm:py-28 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.faq.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {t.faq.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                {t.faq.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {faq.question}
                      </span>
                      <span className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT & CENTER LOCATION (White-Label Dynamic) */}
        <section
          id="contact"
          className="py-20 sm:py-28 bg-emerald-900 text-white relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Center details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.contact.badge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {t.contact.title}
                </h2>
                <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">
                  {t.contact.subtitle}
                </p>

                <div className="space-y-4 pt-4 border-t border-emerald-800">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {tenantConfig.brandName} ({tenantConfig.address})
                      </p>
                      <p className="text-xs text-emerald-200">{tenantConfig.vleName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-300 shrink-0" />
                    <div>
                      <span className="text-xs text-emerald-200 mr-2">{t.contact.emailLabel}</span>
                      <a
                        href={`mailto:${tenantConfig.email}`}
                        className="text-sm font-bold text-white hover:underline"
                      >
                        {tenantConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-emerald-300 shrink-0" />
                    <div>
                      <span className="text-xs text-emerald-200 mr-2">{t.contact.crmUrlLabel}</span>
                      <a
                        href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-emerald-300 hover:text-white underline inline-flex items-center gap-1"
                      >
                        <span>{tenantConfig.crmUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-100 space-y-0.5">
                      <p className="font-semibold text-white">
                        {lang === 'mr'
                          ? tenantConfig.timings
                          : (tenantConfig.timingsEn || tenantConfig.timings)}
                      </p>
                      <p>
                        {lang === 'mr'
                          ? tenantConfig.sunday
                          : (tenantConfig.sundayEn || tenantConfig.sunday)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant WhatsApp Quick-Connect Box */}
              <div className="lg:col-span-5">
                <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <MessageSquare className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {lang === 'mr' ? 'थेट WhatsApp चौकशी' : 'Instant WhatsApp Inquiry'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {lang === 'mr'
                        ? 'कागदपत्रे पाठवण्यासाठी किंवा नवीन सेवेची माहिती मिळवण्यासाठी थेट मेसेज करा.'
                        : 'Send documents or ask questions directly via our official WhatsApp.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/${waTargetNumber}?text=${encodeURIComponent(contactInfo.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition active:scale-95"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{t.contact.whatsappCta} ({tenantConfig.phone})</span>
                    </a>

                    <a
                      href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
                    >
                      <Laptop className="w-4 h-4 text-emerald-700" />
                      <span>{t.nav.openCrm} ({tenantConfig.crmUrl.replace(/^https?:\/\//, '')})</span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (White-Label Dynamic) */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src="/logo.png?v=2"
                  alt={tenantConfig.brandName}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-white font-bold text-base block">{tenantConfig.brandName}</span>
                <span className="text-amber-400 text-xs font-semibold block">{tenantConfig.centerBadge || (lang === 'mr' ? 'आपले सरकार सेवा केंद्र' : 'Aaple Sarkar Seva Kendra')}</span>
                <span className="text-slate-400 text-xs">
                  {lang === 'mr'
                    ? (tenantConfig.brandTagline || t.nav.tagline)
                    : (tenantConfig.brandTaglineEn || tenantConfig.brandTagline || t.nav.tagline)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
              <a href="#home" className="hover:text-white transition">
                {t.nav.home}
              </a>
              <a href="#services" className="hover:text-white transition">
                {t.nav.services}
              </a>
              <a href="#crm" className="hover:text-white transition">
                {t.nav.crmTab}
              </a>
              <a
                href={tenantConfig.crmUrl || 'https://crm.agmultiservices.online'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition inline-flex items-center gap-1"
              >
                <span>{tenantConfig.crmUrl.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#faq" className="hover:text-white transition">
                FAQ
              </a>
              <a href="#contact" className="hover:text-white transition">
                {t.nav.contact}
              </a>
            </div>

            <div className="text-center md:text-right text-xs text-slate-400">
              <p>© {new Date().getFullYear()} {tenantConfig.brandName}. {t.footer.rights}</p>
              <p className="mt-0.5 text-slate-400">
                🇮🇳 {t.hero.bhashiniBadge} | {t.footer.madeWith}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT BUTTON (Direct to Tenant WhatsApp) */}
      <a
        href={`https://wa.me/${waTargetNumber}?text=${encodeURIComponent(contactInfo.whatsappMsg)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="WhatsApp Contact"
        title={`WhatsApp वर थेट संपर्क करा (${tenantConfig.phone})`}
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
      </a>

      {/* Citizen Authentication Modal */}
      <CitizenAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        accountId={tenantConfig.accountId}
        brandName={tenantConfig.brandName}
        onSuccess={(user) => {
          setCurrentCitizen(user);
          setDashboardModalOpen(true);
        }}
      />

      {/* Citizen Dashboard & Applications Tracking Modal */}
      <CitizenDashboardModal
        isOpen={dashboardModalOpen}
        onClose={() => setDashboardModalOpen(false)}
        user={currentCitizen}
        lang={lang}
        brandName={tenantConfig.brandName}
        whatsappNumber={tenantConfig.whatsappNumber}
        onLogout={() => setCurrentCitizen(null)}
      />
    </div>
  );
}
