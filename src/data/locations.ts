import { buildLocations, getRelatedSlugs } from './content-utils.ts';
import type { LocationRecord } from './types.ts';

export const locations: LocationRecord[] = buildLocations();

export const locationMap = new Map(locations.map((location) => [location.slug, location]));

export function getLocationBySlug(slug: string) {
  return locationMap.get(slug);
}

export function getLocationsByRegion(region: string) {
  return locations.filter((location) => location.region === region);
}

export function getNearbyLocations(location: LocationRecord, count = 4) {
  const regionMatches = locations
    .filter((entry) => entry.region === location.region && entry.slug !== location.slug)
    .map((entry) => entry.slug);
  const fallback = locations.map((entry) => entry.slug);
  const selected = regionMatches.length >= count ? regionMatches : fallback;

  return getRelatedSlugs(location.slug, selected, count)
    .map((slug) => getLocationBySlug(slug))
    .filter(Boolean) as LocationRecord[];
}

export function getFeaturedLocations(slugs: string[]) {
  return slugs
    .map((slug) => getLocationBySlug(slug))
    .filter(Boolean) as LocationRecord[];
}
