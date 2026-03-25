import { buildServices, getRelatedSlugs } from './content-utils.ts';
import type { ServiceRecord } from './types.ts';

export const services: ServiceRecord[] = buildServices();

export const serviceMap = new Map(services.map((service) => [service.slug, service]));

export const serviceCategories = Array.from(new Set(services.map((service) => service.category)));

export function getServiceBySlug(slug: string) {
  return serviceMap.get(slug);
}

export function getServicesByCategory(category: string) {
  return services.filter((service) => service.category === category);
}

export function getRelatedServices(service: ServiceRecord, count = 4) {
  const categoryMatches = services
    .filter((entry) => entry.category === service.category && entry.slug !== service.slug)
    .map((entry) => entry.slug);
  const fallback = services.map((entry) => entry.slug);
  const chosen = categoryMatches.length >= count ? categoryMatches : fallback;

  return getRelatedSlugs(service.slug, chosen, count)
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean) as ServiceRecord[];
}

export function getFeaturedServices(slugs: string[]) {
  return slugs
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean) as ServiceRecord[];
}
