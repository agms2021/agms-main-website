import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { Language } from '../data/translations';
import {
  loginCitizen,
  registerCitizen,
  resetCitizenPassword,
  type CitizenUser,
} from '../services/supabase';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  accountId: string;
  brandName: string;
  onSuccess: (user: CitizenUser) => void;
}

type AuthTab = 'login' | 'register' | 'forgot';

export const CitizenAuthModal: React.FC<CitizenAuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  accountId,
  brandName,
  onSuccess,
}) => {
  const [tab, setTab] = useState<AuthTab>('login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleTabChange = (newTab: AuthTab) => {
    resetForm();
    setTab(newTab);
  };

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg(
        lang === 'mr'
          ? 'कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.'
          : 'Please enter both email and password.'
      );
      return;
    }

    setLoading(true);
    const { user, error } = await loginCitizen({ email, password });
    setLoading(false);

    if (error) {
      setErrorMsg(
        lang === 'mr'
          ? 'लॉगिन अयशस्वी: ईमेल किंवा पासवर्ड चुकीचा आहे.'
          : `Login failed: ${error}`
      );
      return;
    }

    if (user) {
      setSuccessMsg(
        lang === 'mr'
          ? 'लॉगिन यशस्वी झाले! आपले स्वागत आहे.'
          : 'Login successful! Welcome.'
      );
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 700);
    }
  };

  // Submit Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg(
        lang === 'mr' ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा.' : 'Please enter your full name.'
      );
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(
        lang === 'mr'
          ? 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg(
        lang === 'mr' ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.' : 'Please enter a valid email address.'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMsg(
        lang === 'mr'
          ? 'पासवर्ड किमान ६ अक्षरांचा असावा.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        lang === 'mr' ? 'पासवर्ड आणि खात्री पासवर्ड जुळत नाहीत.' : 'Passwords do not match.'
      );
      return;
    }

    setLoading(true);
    const { user, error } = await registerCitizen({
      fullName,
      email,
      phone: cleanPhone,
      password,
      accountId: accountId || '47b99dd3-d6c5-4594-a159-1ca55e7848b0',
    });
    setLoading(false);

    if (error) {
      setErrorMsg(
        lang === 'mr'
          ? `नोंदणी अयशस्वी: ${error}`
          : `Registration failed: ${error}`
      );
      return;
    }

    if (user) {
      setSuccessMsg(
        lang === 'mr'
          ? 'नोंदणी यशस्वी झाली! आपले नागरिक खाते तयार झाले आहे.'
          : 'Registration successful! Your citizen account has been created.'
      );
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 900);
    }
  };

  // Submit Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg(
        lang === 'mr' ? 'कृपया आपला नोंदणीकृत ईमेल पत्ता प्रविष्ट करा.' : 'Please enter your registered email.'
      );
      return;
    }

    setLoading(true);
    const { success, error } = await resetCitizenPassword(email);
    setLoading(false);

    if (error || !success) {
      setErrorMsg(
        lang === 'mr'
          ? 'पासवर्ड रिसेट लिंक पाठवता आली नाही. कृपया ईमेल तपासा.'
          : `Failed to send reset link: ${error}`
      );
      return;
    }

    setSuccessMsg(
      lang === 'mr'
        ? 'पासवर्ड रिसेट लिंक आपल्या ईमेलवर पाठवली आहे. कृपया ईमेल इनबॉक्स तपासा.'
        : 'Password reset link sent to your email. Please check your inbox.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Banner with Brand */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight leading-snug">
                  {lang === 'mr' ? 'नागरिक पोर्टल' : 'Citizen Portal'}
                </h3>
                <p className="text-xs text-emerald-300/90 font-medium">
                  {brandName || 'AG Multi Services'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {lang === 'mr'
                ? 'शासकीय अर्ज ट्रॅकिंग आणि डिजिटल कागदपत्रे व्यवस्थापन'
                : 'Government Application Tracking & Document Vault'}
            </span>
          </div>
        </div>

        {/* Tab Buttons (Login vs Register) */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'mr' ? 'लॉगिन करा' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'mr' ? 'नवीन नोंदणी' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2 animate-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'mr' ? 'ईमेल आयडी' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === 'mr' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    {lang === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'mr' ? 'लॉगिन होत आहे...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'mr' ? 'लॉगिन करा' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. राहुल रमेश पाटील' : 'e.g. Rahul Ramesh Patil'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'मोबाईल नंबर (WhatsApp)' : 'Mobile Number (WhatsApp)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'mr' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'mr' ? 'पुन्हा पासवर्ड' : 'Confirm'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                🔒 {lang === 'mr' ? 'आपली नोंदणी थेट आमच्या अधिकृत CRM डेटाबेसशी जोडली जाईल.' : 'Your registration connects securely to our official CRM database.'}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'mr' ? 'नोंदणी होत आहे...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'mr' ? 'खाते तयार करा (Register)' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {lang === 'mr'
                    ? 'आपला नोंदणीकृत ईमेल पत्ता खाली प्रविष्ट करा. आम्ही पासवर्ड रिसेट करण्याची सुरक्षित लिंक पाठवू.'
                    : 'Enter your registered email address below. We will send a secure password reset link.'}
                </p>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'mr' ? 'ईमेल आयडी' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{lang === 'mr' ? 'रिसेट लिंक पाठवा' : 'Send Reset Link'}</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  {lang === 'mr' ? '← परत लॉगिनकडे जा' : '← Back to Login'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

