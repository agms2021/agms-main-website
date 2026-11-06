import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  FolderLock,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import type { Language } from '../data/translations';
import {
  logoutCitizen,
  fetchCitizenApplications,
  type CitizenUser,
  type CitizenApplication,
} from '../services/supabase';

interface CitizenDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CitizenUser | null;
  lang: Language;
  brandName: string;
  whatsappNumber: string;
  onLogout: () => void;
}

export const CitizenDashboardModal: React.FC<CitizenDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  lang,
  brandName,
  whatsappNumber,
  onLogout,
}) => {
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoadingApps(true);
      fetchCitizenApplications(user.phone || user.email || '')
        .then((data) => setApplications(data))
        .finally(() => setLoadingApps(false));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    await logoutCitizen();
    onLogout();
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('complete') || s.includes('approve') || s.includes('मंजूर')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {lang === 'mr' ? 'पूर्ण / मंजूर' : 'Approved / Ready'}
        </span>
      );
    }
    if (s.includes('process') || s.includes('progress') || s.includes('चालू')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          {lang === 'mr' ? 'प्रक्रिया सुरू' : 'In Progress'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        {lang === 'mr' ? 'पेंडिंग / कागदपत्रे आवश्यक' : 'Pending Review'}
      </span>
    );
  };

  const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';
  const waHelpUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `नमस्कार, मी ${user.fullName} (${user.phone}). मला माझ्या अर्जाच्या स्थितीबाबत माहिती हवी आहे.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-xl text-emerald-300">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-400 text-slate-950">
                  {lang === 'mr' ? 'नोंदणीकृत नागरिक' : 'Verified Citizen'}
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-medium">
                {brandName || 'AG Multi Services'} — नागरी सुविधा पोर्टल
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              title={lang === 'mr' ? 'लॉगआउट करा' : 'Sign out'}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Quick Info Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            {user.phone && (
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {user.phone}
              </span>
            )}
            {user.email && (
              <span className="flex items-center gap-1 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
            Source: Website Direct
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section: Track Applications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'mr' ? 'माझे शासकीय अर्ज आणि स्थिती' : 'My Applications & Status'}</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {applications.length} {lang === 'mr' ? 'नोंदणीकृत अर्ज' : 'Applications'}
              </span>
            </div>

            {loadingApps ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                {lang === 'mr' ? 'अर्जांची स्थिती तपासत आहे...' : 'Loading applications...'}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-2.5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">
                        {app.service_name || 'नागरी सेवा अर्ज'}
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>
                          {lang === 'mr' ? 'अर्ज दिनांक:' : 'Date:'}{' '}
                          {new Date(app.created_at).toLocaleDateString('mr-IN')}
                        </span>
                        {app.tracking_id && (
                          <span className="font-mono font-bold text-emerald-700">
                            ID: {app.tracking_id}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FolderLock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  {lang === 'mr'
                    ? 'सध्या कोणताही सक्रिय अर्ज आढळला नाही.'
                    : 'No active application found under your number.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {lang === 'mr'
                    ? 'केंद्रावर अर्ज भरताना तुमचा हाच मोबाईल नंबर द्या, म्हणजे अर्जाची स्थिती येथे आपोआप दिसेल.'
                    : 'Use this phone number when applying at the center to track status automatically.'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Help / Document Upload Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h5 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'mr' ? 'कागदपत्रे पाठवा किंवा मदत हवी आहे?' : 'Send Documents or Need Help?'}</span>
              </h5>
              <p className="text-xs text-emerald-800/80 mt-1">
                {lang === 'mr'
                  ? 'आपले आधार, उत्पन्न दाखला किंवा इतर कागदपत्रे थेट अधिकृत WhatsApp वर पाठवा.'
                  : 'Send Aadhaar, Income certificate, or photos directly to our verified WhatsApp.'}
              </p>
            </div>
            <a
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 transition active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'mr' ? 'WhatsApp वर संपर्क' : 'Contact on WhatsApp'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
