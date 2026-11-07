export type Language = 'mr' | 'en';

export interface ServiceDocument {
  name: string;
  isMandatory: boolean;
  type?: string;
  notes?: string;
}

export interface ServiceItem {
  id: string | number;
  category: string;
  name: string;
  price: string;
  desc: string;
  badge: string;
  timeline?: string;
  documents?: ServiceDocument[];
  department?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  textEn?: string;
  linkText?: string;
}

export interface ContactConfig {
  centerName: string;
  vleName: string;
  email: string;
  timings: string;
  sunday: string;
  whatsappMsg: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  emailLabel?: string;
  crmUrlLabel?: string;
  crmUrl?: string;
  timingsLabel?: string;
  whatsappCta?: string;
}
