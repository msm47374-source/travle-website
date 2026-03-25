import { site } from '@/data/site';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path = '/') {
  return new URL(path, site.siteUrl).toString();
}

export function metaTitle(input: string) {
  if (input.length <= 60) {
    return input;
  }

  return `${input.slice(0, 57).trimEnd()}...`;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.legalName,
    url: site.siteUrl,
    telephone: site.displayPhone,
    email: site.email,
    image: absoluteUrl('/images/branding/hero-home-darwin-cleaning-02.jpg'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
    areaServed: {
      '@type': 'City',
      name: site.address.addressLocality,
    },
    sameAs: site.socialLinks.map((item) => item.href),
  };
}
