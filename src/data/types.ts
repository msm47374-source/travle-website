export type FaqItem = {
  question: string;
  answer: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type Landmark = {
  name: string;
  type: string;
  description: string;
};

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type ServiceRecord = {
  slug: string;
  name: string;
  category: string;
  description: string;
  metaDescription: string;
  heroHeading: string;
  intro: string;
  features: string[];
  process: ProcessStep[];
  faqs: FaqItem[];
  priceRange: string;
  commonIssues: string[];
  cta: string;
  image: ImageAsset;
};

export type LocationRecord = {
  slug: string;
  name: string;
  county: string;
  region: string;
  zip: string[];
  neighborhoods: string[];
  landmarks: Landmark[];
  geo: GeoPoint;
  soilType: string;
  waterRestrictions: string;
  localInsight: string;
  commonYardSize: string;
  hoaNotes: string;
  intro: string;
  faqs: FaqItem[];
  testimonial: Testimonial;
  image: ImageAsset;
};

export type CombinationRecord = {
  key: string;
  slug: string;
  serviceSlug: string;
  locationSlug: string;
  uniqueIntro: string;
  localProblems: string[];
  uniqueFaqs: FaqItem[];
  pricingNote: string;
  localTip: string;
};

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  heroHeading: string;
  publishedAt: string;
  readTime: string;
  sections: BlogSection[];
  faqs: FaqItem[];
  relatedServices: string[];
  relatedLocations: string[];
  image: ImageAsset;
};

export type SiteData = {
  name: string;
  legalName: string;
  brandName: string;
  domain: string;
  siteUrl: string;
  tagline: string;
  phone: string;
  displayPhone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  socialLinks: { label: string; href: string }[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  serviceAreaSummary: string;
  mapEmbedUrl: string;
  featuredServiceSlugs: string[];
  featuredLocationSlugs: string[];
  testimonials: Testimonial[];
};
