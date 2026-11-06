import type { Language, ServiceItem, ServiceDocument } from '../types/site';
import {
  translateServiceName,
  translateDocName,
  translateCategoryName,
  translateTimeline,
  translateDescription,
} from './translator';

const SUPABASE_URL = 'https://kpvjenicwrzuzrxvucmf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4981M7nv9Kqd5DASiR4ikg_xOpbIiBL';

interface RawCrmService {
  id: string;
  account_id?: string | null;
  name: string;
  name_mr?: string | null;
  name_en?: string | null;
  category?: string | null;
  total_charge?: number | null;
  govt_fee?: number | null;
  service_charge?: number | null;
  other_charges?: number | null;
  expected_timeline?: string | null;
  short_description?: string | null;
  detailed_description?: string | null;
  government_department?: string | null;
  status: string;
  created_at?: string;
}

interface RawCrmDocument {
  id: string;
  service_id: string;
  account_id?: string | null;
  doc_name: string;
  doc_name_mr?: string | null;
  doc_name_en?: string | null;
  is_mandatory: boolean;
  submission_type?: string | null;
  notes?: string | null;
  display_order?: number;
}

// Map Marathi/English categories to internal filter tabs
export function mapCategoryToTab(crmCategory: string | null | undefined): string {
  if (!crmCategory) return 'identity';
  const c = crmCategory.toLowerCase();
  if (c.includes('महसूल') || c.includes('जमीन') || c.includes('7/12') || c.includes('शेतकरी') || c.includes('farmer') || c.includes('land')) {
    return 'farmer';
  }
  if (c.includes('योजना') || c.includes('शिष्यवृत्ती') || c.includes('welfare') || c.includes('scholarship') || c.includes('shram')) {
    return 'welfare';
  }
  if (c.includes('व्यवसाय') || c.includes('उद्योग') || c.includes('rto') || c.includes('वाहन') || c.includes('business') || c.includes('licence')) {
    return 'business';
  }
  return 'identity';
}

/**
 * Fetches active services and their required documents directly from the AGMS CRM database.
 * Supports multi-tenant scoping via accountId for white-label reseller deployments!
 */
export async function fetchLiveCrmServices(lang: Language, accountId?: string): Promise<ServiceItem[]> {
  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };

    // 1. Build Query with Multi-Tenant Account ID scoping
    let servicesUrl = `${SUPABASE_URL}/rest/v1/services?status=eq.active&select=*&order=created_at.desc`;
    if (accountId && accountId.trim() !== '') {
      servicesUrl = `${SUPABASE_URL}/rest/v1/services?status=eq.active&or=(account_id.eq.${accountId},account_id.is.null)&select=*&order=created_at.desc`;
    }

    const servicesRes = await fetch(servicesUrl, { headers });

    if (!servicesRes.ok) {
      throw new Error(`Services fetch failed with status: ${servicesRes.status}`);
    }

    const servicesData: RawCrmService[] = await servicesRes.json();

    // 2. Fetch service documents (scoped to tenant or global)
    let docsMap: Record<string, ServiceDocument[]> = {};
    try {
      let docsUrl = `${SUPABASE_URL}/rest/v1/service_documents?select=*&order=display_order.asc`;
      if (accountId && accountId.trim() !== '') {
        docsUrl = `${SUPABASE_URL}/rest/v1/service_documents?or=(account_id.eq.${accountId},account_id.is.null)&select=*&order=display_order.asc`;
      }

      const docsRes = await fetch(docsUrl, { headers });
      if (docsRes.ok) {
        const docsData: RawCrmDocument[] = await docsRes.json();
        docsData.forEach((d) => {
          if (!docsMap[d.service_id]) {
            docsMap[d.service_id] = [];
          }
          const rawDocName =
            lang === 'mr'
              ? d.doc_name_mr || d.doc_name
              : d.doc_name_en || d.doc_name;
          const docName = translateDocName(rawDocName, lang);

          docsMap[d.service_id].push({
            name: docName,
            isMandatory: d.is_mandatory !== false,
            type: d.submission_type || 'Xerox',
            notes: d.notes || undefined,
          });
        });
      }
    } catch (e) {
      console.warn('Documents fetch skipped:', e);
    }

    // 3. Transform to unified ServiceItem model
    const mappedServices: ServiceItem[] = servicesData.map((s) => {
      // Determine service price
      const totalCharge =
        s.total_charge ??
        ((s.govt_fee || 0) + (s.service_charge || 0) + (s.other_charges || 0));
      const formattedPrice =
        totalCharge && totalCharge > 0
          ? `₹${totalCharge}`
          : (lang === 'mr' ? 'मोफत / शासकीय दर' : 'Free / Govt Rate');

      // Determine display title with 100% dictionary/translation mapping
      const rawTitle =
        lang === 'mr'
          ? s.name_mr || s.name
          : s.name_en || s.name;
      const title = translateServiceName(rawTitle, lang);

      // Determine timeline with translation
      const timeline = translateTimeline(s.expected_timeline, lang);

      // Documents
      const docs = docsMap[s.id] || [];

      // Description with translation
      const rawDesc = s.short_description || s.detailed_description;
      const desc = translateDescription(rawDesc, lang);

      // Category badge with translation
      const badge = translateCategoryName(s.category, lang);

      return {
        id: s.id,
        category: mapCategoryToTab(s.category),
        name: title,
        price: formattedPrice,
        timeline,
        documents: docs,
        department: s.government_department || undefined,
        desc,
        badge,
      };
    });

    return mappedServices;
  } catch (error) {
    console.error('fetchLiveCrmServices error:', error);
    throw error;
  }
}
