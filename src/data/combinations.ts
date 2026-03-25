import { buildLocationAwareFaqs } from './content-utils.ts';
import { getLocationBySlug, locations } from './locations.ts';
import { getServiceBySlug, services } from './services.ts';
import type { CombinationRecord } from './types.ts';

function buildCombination(serviceSlug: string, locationSlug: string): CombinationRecord {
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);

  if (!service || !location) {
    throw new Error(`Missing service/location for combination: ${serviceSlug} / ${locationSlug}`);
  }

  const pricingNote = `${service.priceRange} In ${location.name}, price can move further based on access windows, parking, site condition, and whether the visit needs to line up with short-stay, strata, or commercial scheduling.`;

  return {
    key: `${locationSlug}--${serviceSlug}`,
    slug: `${locationSlug}/${serviceSlug}`,
    serviceSlug,
    locationSlug,
    uniqueIntro: `${service.name} in ${location.name} is not just the standard Darwin service with the location name swapped in. The work is tailored around ${location.region.toLowerCase()}, local access expectations, and the types of residue or presentation issues that show up repeatedly in ${location.name}. ${service.intro}`,
    localProblems: [
      `${location.localInsight} That affects how quickly cleaned surfaces pick up grit, residue, or weather-related mess again after the visit.`,
      `${service.name} in ${location.name} often needs extra planning for ${location.commonYardSize.toLowerCase()} and the way people move through shared entries, balconies, loading areas, or service corridors.`,
      `${location.hoaNotes} That matters because the right cleaning result also depends on timing, access, and how the site is managed on the day.`,
    ],
    uniqueFaqs: buildLocationAwareFaqs(service, location, pricingNote),
    pricingNote,
    localTip: `Local tip for ${location.name}: schedule ${service.name.toLowerCase()} before the highest-traffic part of the week and mention nearby reference points like ${location.landmarks
      .map((landmark) => landmark.name)
      .slice(0, 2)
      .join(' and ')} so access instructions are clearer from the start.`,
  };
}

export const combinations: CombinationRecord[] = locations.flatMap((location) =>
  services.map((service) => buildCombination(service.slug, location.slug)),
);

const combinationMap = new Map(combinations.map((combination) => [combination.key, combination]));

export function getCombinationBySlugs(locationSlug: string, serviceSlug: string) {
  return combinationMap.get(`${locationSlug}--${serviceSlug}`);
}

export function getCombinationsForService(serviceSlug: string) {
  return combinations.filter((combination) => combination.serviceSlug === serviceSlug);
}

export function getCombinationsForLocation(locationSlug: string) {
  return combinations.filter((combination) => combination.locationSlug === locationSlug);
}
