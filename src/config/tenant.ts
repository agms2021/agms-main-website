export interface TenantConfig {
  accountId: string;
  brandName: string;
  brandTagline: string;
  brandTaglineEn?: string;
  brandInitials: string;
  vleName: string;
  vleNameEn?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  addressEn?: string;
  crmUrl: string;
  timings: string;
  timingsEn?: string;
  sunday: string;
  sundayEn?: string;
}

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  accountId: '47b99dd3-d6c5-4594-a159-1ca55e7848b0',
  brandName: 'AG Multi Services',
  brandTagline: 'शासकीय व नागरी सेवा केंद्र',
  brandTaglineEn: 'Citizen & Government Services Center',
  brandInitials: 'AG',
  vleName: 'अधिकृत VLE संचालक: AG Multi Services',
  vleNameEn: 'Authorized VLE Director: AG Multi Services',
  phone: '7498060610',
  whatsappNumber: '917498060610',
  email: 'agmultis2021@gmail.com',
  address: 'महा-ई-सेवा व नागरी सुविधा केंद्र',
  addressEn: 'Authorized Citizen Service Facility Center',
  crmUrl: 'https://crm.agmultiservices.online',
  timings: 'सकाळी १०:०० ते सायंकाळी ५:३० (सोमवार ते शनिवार)',
  timingsEn: '10:00 AM to 5:30 PM (Monday to Saturday)',
  sunday: 'रविवार: बंद',
  sundayEn: 'Sunday: Closed',
};

/**
 * Resolves the tenant configuration with priority:
 * 1. URL Query Parameters (?account=...&brand=...&phone=...)
 * 2. LocalStorage override (configured via in-browser White-label modal)
 * 3. Base default configuration (from tenant.config.json or defaults)
 */
export function getInitialTenantConfig(): TenantConfig {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlAccountId = params.get('account') || params.get('accountId');
    const urlBrand = params.get('brand') || params.get('center');
    const urlPhone = params.get('phone') || params.get('wa');
    const urlEmail = params.get('email');
    const urlCrm = params.get('crm');

    // Check LocalStorage
    const saved = localStorage.getItem('agms_tenant_config');
    let base = { ...DEFAULT_TENANT_CONFIG };
    if (saved) {
      try {
        base = { ...base, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }

    // Apply URL overrides if present
    if (urlAccountId) base.accountId = urlAccountId;
    if (urlBrand) {
      base.brandName = urlBrand;
      base.brandInitials = urlBrand
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (urlPhone) {
      base.phone = urlPhone;
      base.whatsappNumber = urlPhone.startsWith('91') ? urlPhone : `91${urlPhone}`;
    }
    if (urlEmail) base.email = urlEmail;
    if (urlCrm) base.crmUrl = urlCrm;

    return base;
  } catch {
    return DEFAULT_TENANT_CONFIG;
  }
}

