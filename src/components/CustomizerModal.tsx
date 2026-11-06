import { useState } from 'react';
import type { Language, ServiceItem, FaqItem, AnnouncementConfig, ContactConfig } from '../types/site';
import type { TenantConfig } from '../config/tenant';
import {
  X,
  Plus,
  Trash2,
  Save,
  Download,
  RotateCcw,
  Check,
  Megaphone,
  Phone,
  HelpCircle,
  Layers,
  Settings,
  Tag,
  Building,
  Smartphone
} from 'lucide-react';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  tenantConfig: TenantConfig;
  onUpdateTenantConfig: (tenant: TenantConfig) => void;
  services: ServiceItem[];
  onUpdateServices: (services: ServiceItem[]) => void;
  announcement: AnnouncementConfig;
  onUpdateAnnouncement: (announcement: AnnouncementConfig) => void;
  contact: ContactConfig;
  onUpdateContact: (contact: ContactConfig) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
  onResetDefaults: () => void;
}

export default function CustomizerModal({
  isOpen,
  onClose,
  lang,
  tenantConfig,
  onUpdateTenantConfig,
  services,
  onUpdateServices,
  announcement,
  onUpdateAnnouncement,
  contact,
  onUpdateContact,
  faqs,
  onUpdateFaqs,
  onResetDefaults,
}: CustomizerProps) {
  const [activeTab, setActiveTab] = useState<'whitelabel' | 'services' | 'announcement' | 'contact' | 'faq' | 'backup'>('whitelabel');

  // Local editing states
  const [localTenant, setLocalTenant] = useState<TenantConfig>(tenantConfig);
  const [localServices, setLocalServices] = useState<ServiceItem[]>(services);
  const [localAnnouncement, setLocalAnnouncement] = useState(announcement);
  const [localContact, setLocalContact] = useState(contact);
  const [localFaqs, setLocalFaqs] = useState<FaqItem[]>(faqs);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('₹१००');
  const [newServiceCategory, setNewServiceCategory] = useState<'identity' | 'farmer' | 'welfare' | 'business'>('identity');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceBadge, setNewServiceBadge] = useState('नवीन सेवा');

  // New FAQ Form State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  if (!isOpen) return null;

  const handleSaveAll = () => {
    onUpdateTenantConfig(localTenant);
    onUpdateServices(localServices);
    onUpdateAnnouncement(localAnnouncement);
    onUpdateContact(localContact);
    onUpdateFaqs(localFaqs);

    // Save to localStorage
    localStorage.setItem('agms_tenant_config', JSON.stringify(localTenant));
    const payload = {
      services: localServices,
      announcement: localAnnouncement,
      contact: localContact,
      faqs: localFaqs,
    };
    localStorage.setItem(`agms_custom_data_${lang}`, JSON.stringify(payload));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newItem: ServiceItem = {
      id: Date.now(),
      name: newServiceName.trim(),
      price: newServicePrice.trim(),
      category: newServiceCategory,
      desc: newServiceDesc.trim() || 'अधिक माहितीसाठी केंद्रावर संपर्क साधा.',
      badge: newServiceBadge.trim() || 'नवीन',
    };

    setLocalServices([newItem, ...localServices]);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('₹१००');
  };

  const handleDeleteService = (id: string | number) => {
    setLocalServices(localServices.filter((s) => s.id !== id));
  };

  const handleServicePriceChange = (id: string | number, newPrice: string) => {
    setLocalServices(
      localServices.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;

    const newFaq: FaqItem = {
      id: Date.now(),
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
    };

    setLocalFaqs([...localFaqs, newFaq]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleDeleteFaq = (id: number) => {
    setLocalFaqs(localFaqs.filter((f) => f.id !== id));
  };

  // Export Tenant JSON configuration (for shipping to new reseller clients!)
  const handleExportTenantJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(localTenant, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'tenant.config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {lang === 'mr' ? 'रीसेलर & व्हाईट-लेबल ॲडमिन पॅनल' : 'Reseller & White-Label Admin Panel'}
              </h3>
              <p className="text-xs text-emerald-200">
                {lang === 'mr'
                  ? 'कोणत्याही ग्राहकासाठी ब्रँड, CRM Account ID व सेवा कॉन्फिगर करा'
                  : 'Configure branding, CRM Account ID & services for any client'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('whitelabel')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'whitelabel'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'mr' ? '🏷️ रीसेलर ब्रँडिंग (Tenant)' : '🏷️ White-Label'}</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'services'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'mr' ? 'सेवा व्यवस्थापक (Services)' : 'Services'}</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'announcement'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{lang === 'mr' ? 'सूचना पट्टी (Notice)' : 'Notice Banner'}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'contact'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'mr' ? 'संपर्क माहिती (Contact)' : 'Contact Info'}</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'faq'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'mr' ? 'प्रश्न उत्तरे (FAQ)' : 'FAQ'}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'backup'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'mr' ? 'बॅकअप & रीसेट' : 'Backup & Reset'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 0: WHITE-LABEL RESELLER CONFIG */}
          {activeTab === 'whitelabel' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lang === 'mr'
                      ? 'रीसेलर / नवीन ग्राहकासाठी ब्रँडिंग सेटअप (White-Label SaaS)'
                      : 'Client White-Label & Reseller Setup'}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {lang === 'mr'
                    ? 'जेव्हा आपण हे ॲप दुसऱ्या केंद्राला विकता, तेव्हा खाली त्यांचा CRM Account ID, त्यांचे नाव आणि WhatsApp नंबर टाका. संपूर्ण वेबसाइट त्यांच्या ब्रँडनुसार दिसेल आणि सर्व ग्राहक चौकशी त्यांच्या WhatsApp वर जाईल!'
                    : 'When reselling this app to a new center, enter their CRM Account ID, business name, and WhatsApp number. The website will adapt to their brand and all citizen inquiries will go to their WhatsApp!'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? '🔑 CRM Account ID (टेनंट आयडी):' : '🔑 CRM Tenant Account ID:'}
                  </label>
                  <input
                    type="text"
                    value={localTenant.accountId}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, accountId: e.target.value })
                    }
                    placeholder="उदा. 47b99dd3-d6c5-4594-a159-1ca55e7848b0"
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500 font-semibold text-emerald-800"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {lang === 'mr'
                      ? 'हा ID टाकल्यास त्या केंद्राच्या CRM मधील सेवा, दर आणि कागदपत्रेच वेबसाइटवर दिसतील.'
                      : 'Filters the live service catalog to this specific client account.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? 'केंद्राचे नाव (Business Brand Name):' : 'Business Brand Name:'}
                  </label>
                  <input
                    type="text"
                    value={localTenant.brandName}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, brandName: e.target.value })
                    }
                    placeholder="उदा. पाटील महा-ई-सेवा केंद्र"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? 'लोगो अक्षरे (Brand Logo Initials):' : 'Logo Initials (2 letters):'}
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={localTenant.brandInitials}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, brandInitials: e.target.value.toUpperCase() })
                    }
                    placeholder="उदा. AG, PM, SK"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'mr' ? 'ग्राहक WhatsApp नंबर:' : 'Client WhatsApp Number:'}</span>
                  </label>
                  <input
                    type="text"
                    value={localTenant.whatsappNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setLocalTenant({
                        ...localTenant,
                        whatsappNumber: val,
                        phone: val.slice(-10),
                      });
                    }}
                    placeholder="919172236821"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500 font-semibold text-emerald-700"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    (नागरिकांनी क्लिक केल्यावर या नंबरवर मेसेज जाईल)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? 'अधिकृत संचालक (VLE Name):' : 'Operator / VLE Name:'}
                  </label>
                  <input
                    type="text"
                    value={localTenant.vleName}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, vleName: e.target.value })
                    }
                    placeholder="अधिकृत VLE संचालक: राहुल पाटील"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? 'ईमेल पत्ता:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    value={localTenant.email}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'mr' ? 'CRM पोर्टल लॉगिन लिंक:' : 'CRM Portal Login Link:'}
                  </label>
                  <input
                    type="url"
                    value={localTenant.crmUrl}
                    onChange={(e) =>
                      setLocalTenant({ ...localTenant, crmUrl: e.target.value })
                    }
                    placeholder="https://crm.agmultiservices.online"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Download Tenant JSON Package Button */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  {lang === 'mr'
                    ? 'या ग्राहकासाठी सेटअप फाईल एक्सपोर्ट करून ठेवा:'
                    : 'Export ready-to-deploy setup package for this client:'}
                </p>
                <button
                  type="button"
                  onClick={handleExportTenantJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'mr' ? 'tenant.config.json डाऊनलोड करा' : 'Download tenant.config.json'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Add New Service Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'mr' ? 'नवीन सेवा जोडा (Add New Service)' : 'Add New Service'}</span>
                </h4>
                <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'mr' ? 'सेवेचे नाव:' : 'Service Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. नवीन रेशन कार्ड अर्ज' : 'e.g. New Passport Application'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'mr' ? 'शुल्क / किंमत:' : 'Price / Fee:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="₹१००"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'mr' ? 'प्रवर्ग (Category):' : 'Category:'}
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    >
                      <option value="identity">{lang === 'mr' ? 'ओळखपत्रे व दाखले' : 'Identity & Certificates'}</option>
                      <option value="farmer">{lang === 'mr' ? 'शेतकरी व जमीन' : 'Farmer & Land'}</option>
                      <option value="welfare">{lang === 'mr' ? 'शासकीय योजना' : 'Welfare'}</option>
                      <option value="business">{lang === 'mr' ? 'उद्योग व व्यवसाय' : 'Business'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'mr' ? 'बॅज / टॅग:' : 'Badge:'}
                    </label>
                    <input
                      type="text"
                      value={newServiceBadge}
                      onChange={(e) => setNewServiceBadge(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. फास्ट ट्रॅक / नवीन' : 'e.g. Fast Track'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'mr' ? 'थोडक्यात माहिती (Description):' : 'Description:'}
                    </label>
                    <input
                      type="text"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder={lang === 'mr' ? 'कागदपत्रे व आवश्यक प्रक्रिया...' : 'Brief details...'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'mr' ? 'सेवा ॲड करा' : 'Add Service'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Services List with Instant Price Editing */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">
                  {lang === 'mr' ? 'सध्याच्या सेवांची यादी (दर बदला किंवा डिलीट करा):' : 'Current Services (Edit price or delete):'}
                </h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {localServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{service.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{service.desc}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => handleServicePriceChange(service.id, e.target.value)}
                          className="w-20 px-2 py-1 text-xs text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg outline-none"
                          title="Click to edit price"
                        />
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENT BANNER */}
          {activeTab === 'announcement' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {lang === 'mr' ? 'सूचना पट्टी चालू/बंद करा' : 'Announcement Banner Toggle'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'mr'
                      ? 'वेबसाइटच्या सर्वात वर स्क्रोलिंग/अॅलर्ट पट्टी दाखवायची की नाही?'
                      : 'Show or hide the alert bar at the very top of the website.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localAnnouncement.enabled}
                  onChange={(e) =>
                    setLocalAnnouncement({ ...localAnnouncement, enabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'सूचना मजकूर (Announcement Message):' : 'Announcement Message:'}
                </label>
                <textarea
                  rows={3}
                  value={localAnnouncement.text}
                  onChange={(e) =>
                    setLocalAnnouncement({ ...localAnnouncement, text: e.target.value })
                  }
                  placeholder="📢 नवीन: लाडकी बहीण योजना अर्ज सुरू आहेत..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & HOURS */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'केंद्राचे नाव:' : 'Center Name:'}
                </label>
                <input
                  type="text"
                  value={localContact.centerName}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, centerName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'अधिकृत संचालक (VLE Name):' : 'Operator / VLE Name:'}
                </label>
                <input
                  type="text"
                  value={localContact.vleName}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, vleName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'ईमेल पत्ता:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  value={localContact.email}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'कामाची वेळ (सोम-शनि):' : 'Working Hours (Mon-Sat):'}
                </label>
                <input
                  type="text"
                  value={localContact.timings}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, timings: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'रविवारची वेळ:' : 'Sunday Hours:'}
                </label>
                <input
                  type="text"
                  value={localContact.sunday}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, sunday: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'डिफॉल्ट WhatsApp मेसेज:' : 'Default WhatsApp Message:'}
                </label>
                <input
                  type="text"
                  value={localContact.whatsappMsg}
                  onChange={(e) =>
                    setLocalContact({ ...localContact, whatsappMsg: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: FAQ MANAGEMENT */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Add New FAQ Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'mr' ? 'नवीन प्रश्न व उत्तर जोडा:' : 'Add New FAQ:'}
                </h4>
                <form onSubmit={handleAddFaq} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder={lang === 'mr' ? 'प्रश्न: उदा. दाखल्यासाठी अर्ज कसा करावा?' : 'Question...'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  />
                  <textarea
                    rows={2}
                    required
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    placeholder={lang === 'mr' ? 'उत्तर: आवश्यक माहिती लिहा...' : 'Answer...'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  ></textarea>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    {lang === 'mr' ? 'प्रश्न ॲड करा' : 'Add FAQ'}
                  </button>
                </form>
              </div>

              {/* Existing FAQs */}
              <div className="space-y-2">
                {localFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{faq.question}</h5>
                      <p className="text-[11px] text-slate-600 mt-1">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {lang === 'mr' ? 'कॉन्फिग फाईल डाऊनलोड करा (Export JSON)' : 'Export JSON Config'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {lang === 'mr'
                      ? 'आपले सर्व बदल JSON फाईलमध्ये सेव्ह करून ठेवा.'
                      : 'Save all your custom updates to a JSON file.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const dataStr =
                      'data:text/json;charset=utf-8,' +
                      encodeURIComponent(
                        JSON.stringify(
                          {
                            lang,
                            tenant: localTenant,
                            announcement: localAnnouncement,
                            contact: localContact,
                            services: localServices,
                            faqs: localFaqs,
                          },
                          null,
                          2
                        )
                      );
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute('href', dataStr);
                    downloadAnchor.setAttribute('download', `agms-full-backup-${lang}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'डाऊनलोड JSON' : 'Download JSON'}</span>
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-950">
                    {lang === 'mr' ? 'डिफॉल्ट पूर्ववत करा (Reset to Defaults)' : 'Reset to Default Settings'}
                  </h4>
                  <p className="text-xs text-red-800 mt-0.5">
                    {lang === 'mr'
                      ? 'सर्व बदल हटवून मूळ ओरिजिनल डेटा परत आणा.'
                      : 'Restore the original default configuration.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(lang === 'mr' ? 'खरोखर मूळ डेटा पूर्ववत करायचा आहे का?' : 'Reset to original defaults?')) {
                      localStorage.removeItem(`agms_custom_data_${lang}`);
                      localStorage.removeItem('agms_tenant_config');
                      onResetDefaults();
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'रीसेट करा' : 'Reset'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'बदल यशस्वीरित्या सेव्ह झाले!' : 'Saved successfully!'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              {lang === 'mr' ? 'बंद करा' : 'Close'}
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'mr' ? 'बदल सेव्ह करा (Save)' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
