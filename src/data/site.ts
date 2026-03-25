import type { SiteData } from './types.ts';

export const site: SiteData = {
  name: 'Cleaning Company Darwin',
  legalName: 'Cleaning Company Darwin',
  brandName: 'CLEANING COMPANY DARWIN',
  domain: 'cleaningcompanydarwin.com',
  siteUrl: 'https://www.cleaningcompanydarwin.com',
  tagline: 'Professional residential, commercial, and specialist cleaning across Darwin and nearby suburbs.',
  phone: '+9779748343015',
  displayPhone: '+977-9748343015',
  email: 'msm47374@gmail.com',
  address: {
    streetAddress: 'Darwin service area',
    addressLocality: 'Darwin',
    addressRegion: 'NT',
    postalCode: '0800',
    addressCountry: 'AU',
  },
  socialLinks: [
    { label: 'Facebook', href: 'https://facebook.com/cleaningcompanydarwin' },
    { label: 'Instagram', href: 'https://instagram.com/cleaningcompanydarwin' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/cleaningcompanydarwin' },
  ],
  primaryCta: {
    label: 'Get a Free Quote',
    href: '/contact',
  },
  secondaryCta: {
    label: 'View Services',
    href: '/services',
  },
  serviceAreaSummary:
    'Darwin CBD, inner harbour addresses, northern suburbs, family residential pockets, and key service corridors including Parap, Nightcliff, Casuarina, Karama, and Winnellie.',
  mapEmbedUrl: 'https://www.google.com/maps?q=Darwin%20NT%200800%20Australia&z=12&output=embed',
  featuredServiceSlugs: [
    'regular-routine-house-cleaning',
    'deep-cleaning',
    'end-of-lease-bond-cleaning',
    'office-cleaning',
    'airbnb-short-stay-property-cleaning',
    'carpet-steam-cleaning',
    'window-cleaning-interior-and-exterior',
    'emergency-response-cleaning-24-7',
  ],
  featuredLocationSlugs: [
    'darwin-city-cbd',
    'parap',
    'nightcliff',
    'casuarina',
    'karama',
    'winnellie',
  ],
  testimonials: [
    {
      quote:
        'Our short-stay property near Darwin Waterfront needed faster turnarounds and more reliable communication. The checklist was clearer, the finish was more consistent, and guest readiness stopped feeling rushed.',
      name: 'Holiday home host',
      role: 'Airbnb operator in Darwin',
    },
    {
      quote:
        'We were looking for one provider who could handle offices, washrooms, and periodic detail cleaning without making the process complicated. The scope stayed clear, the team hit our access windows, and the reporting was easy to follow.',
      name: 'Operations manager',
      role: 'Commercial client in Darwin',
    },
    {
      quote:
        'The biggest difference was the consistency. Bathrooms, glass, and shared touch points stayed under control, even through wet-season traffic and heavy tenant turnover.',
      name: 'Property manager',
      role: 'Residential and mixed-use client',
    },
  ],
};
