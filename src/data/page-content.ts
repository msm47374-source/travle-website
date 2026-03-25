import { getNearbyLocations, locations } from './locations.ts';
import { getRelatedServices } from './services.ts';
import type { CombinationRecord, FaqItem, LocationRecord, ProcessStep, ServiceRecord } from './types.ts';

type ServiceFamily =
  | 'property-transition'
  | 'residential'
  | 'surface-care'
  | 'specialist-add-on'
  | 'commercial'
  | 'hygiene'
  | 'external'
  | 'biohazard'
  | 'restoration'
  | 'general-cleaning';

type FamilyConfig = {
  pressure: string;
  access: string;
  result: string;
  pairings: string;
  localNote: string;
  preferredLocations: string[];
  seasonalFocus: {
    winter: string;
    spring: string;
    summer: string;
    fall: string;
  };
  problems: [string, string, string, string];
};

export type RichSection = {
  title: string;
  paragraphs: string[];
};

export type SeasonalCard = {
  title: string;
  body: string;
};

export type ProblemCard = {
  title: string;
  body: string;
};

export type LinkItem = {
  href: string;
  label: string;
  description: string;
};

export type PageCta = {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type ServicePageContent = {
  introParagraphs: string[];
  methodology: RichSection[];
  localKnowledge: string[];
  seasonalCards: SeasonalCard[];
  problemCards: ProblemCard[];
  process: ProcessStep[];
  faqs: FaqItem[];
  locationLinks: LinkItem[];
  areaLinks: LinkItem[];
  relatedServicesIntro: string;
  weAlsoServeIntro: string;
  midCta: PageCta;
  bottomCta: PageCta;
};

export type CombinationPageContent = {
  heroBody: string;
  overviewParagraphs: string[];
  methodology: RichSection[];
  seasonalCards: SeasonalCard[];
  problemCards: ProblemCard[];
  process: ProcessStep[];
  faqs: FaqItem[];
  relatedServices: LinkItem[];
  nearbyAreaLinks: LinkItem[];
  relatedServicesIntro: string;
  weAlsoServeIntro: string;
  midCta: PageCta;
  bottomCta: PageCta;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function hashIndex(seed: string, max: number) {
  const total = [...seed].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return total % max;
}

function pickRotating<T>(seed: string, values: readonly T[], count: number): T[] {
  const start = hashIndex(seed, values.length);
  const picked: T[] = [];

  for (let index = 0; index < values.length && picked.length < count; index += 1) {
    picked.push(values[(start + index) % values.length]);
  }

  return picked;
}

function linkToService(service: ServiceRecord) {
  return `<a href="/services/${service.slug}" class="font-semibold text-blue-700 underline-offset-4 hover:underline">${escapeHtml(service.name)}</a>`;
}

function linkToArea(location: LocationRecord) {
  return `<a href="/areas/${location.slug}" class="font-semibold text-blue-700 underline-offset-4 hover:underline">${escapeHtml(location.name)}</a>`;
}

function linkToCombination(location: LocationRecord, service: ServiceRecord) {
  return `<a href="/areas/${location.slug}/${service.slug}" class="font-semibold text-blue-700 underline-offset-4 hover:underline">${escapeHtml(service.name)} in ${escapeHtml(location.name)}</a>`;
}

function classifyService(serviceName: string): ServiceFamily {
  if (/end of lease|bond|move-out|vacate|move-in|pre-sale|pre-inspection/i.test(serviceName)) return 'property-transition';
  if (/deep|spring|one-off|regular|routine|new home|holiday home|airbnb|short-stay|apartment|unit|townhouse|studio|duplex/i.test(serviceName)) return 'residential';
  if (/carpet|rug|upholstery|mattress|tile|grout|floor|vinyl|linoleum|timber|concrete|epoxy/i.test(serviceName)) return 'surface-care';
  if (/window|blind|curtain|drape|oven|bbq|grill|gutter|roof|pressure|soft washing|solar|duct|vent|chimney|laundry|pool|flyscreen|louvre|skylight/i.test(serviceName)) return 'specialist-add-on';
  if (/washroom|sanitary|sanitiser|hygiene|nappy|soap|consumable|disinfection|atp|terminal cleaning/i.test(serviceName)) return 'hygiene';
  if (/facade|graffiti|driveway|pavement|decking|patio|sandblasting|water blasting|bin cleaning|waste|rubbish|junk|pest|bird|pigeon|litter|street furniture|outdoor seating|umbrella/i.test(serviceName)) return 'external';
  if (/crime|trauma|forensic|biohazard|blood|bodily|death|decomposition|suicide|homicide|hoarding|gross filth|meth lab|mould|sewage|fingerprint dust|odour|sharps|urine|faeces|vomit|deceased estate|squatter|animal infestation|dropping|decontamination|drug residue|ndis/i.test(serviceName)) return 'biohazard';
  if (/flood|fire|smoke|water damage|emergency|disaster|vehicle|fleet|car interior|boat|marine|eco-friendly|chemical-free|linen|washroom requisite|flue|post-renovation|pre-handover/i.test(serviceName)) return 'restoration';
  if (/office|corporate|retail|shopping|warehouse|industrial|factory|data centre|laboratory|clean room|car park|gym|high-rise|strata property|government|airport|hotel|motel|restaurant|cafe|kitchen|pub|bar|hospitality|childcare|school|educational|university|tafe|medical|hospital|aged care|disability|pharmaceutical|church|community hall/i.test(serviceName)) return 'commercial';
  return 'general-cleaning';
}

const familyConfig: Record<ServiceFamily, FamilyConfig> = {
  'property-transition': {
    pressure: 'move deadlines, handover standards, and the hidden detail work landlords and agents notice first',
    access: 'loading docks, elevator bookings, key handoffs, utility areas, and short inspection windows',
    result: 'a handover-ready property that looks complete, not rushed',
    pairings: 'carpet, oven, window, and pressure-washing add-ons',
    localNote: 'Darwin move-outs can compress quickly around lease deadlines, humidity, and short handover windows',
    preferredLocations: ['darwin-city-cbd', 'parap', 'nightcliff', 'winnellie'],
    seasonalFocus: {
      winter: 'dry-season dust, open-home prep, and easier handover access',
      spring: 'build-up humidity, listing pressure, and tight turnaround windows',
      summer: 'wet-season storms, moisture, and compressed moving traffic',
      fall: 'post-storm cleanup and inspection prep',
    },
    problems: ['Missed inspection details', 'Compressed handover windows', 'Late add-on decisions', 'Dust returning after a move'],
  },
  residential: {
    pressure: 'kitchen buildup, pet hair, dusty trim, and high-traffic floors that rebound fast',
    access: 'occupied homes, pets, work-from-home rooms, and garage-to-mudroom traffic',
    result: 'a home that feels calmer, healthier, and easier to maintain between visits',
    pairings: 'carpet, window, and upholstery cleaning',
    localNote: 'Darwin homes pick up humidity, ceiling-fan dust, and tracked-in grit very quickly',
    preferredLocations: ['fannie-bay', 'parap', 'nightcliff', 'casuarina'],
    seasonalFocus: {
      winter: 'dry-season dust, open windows, and extra entertaining traffic',
      spring: 'build-up humidity, stale rooms, and early mould pressure',
      summer: 'wet-season mud, moisture, and fast bathroom buildup',
      fall: 'storm-transition resets before humidity spikes again',
    },
    problems: ['Entries that never stay clean', 'Bathrooms that lose their shine quickly', 'Dust settling again within days', 'Cleaning plans that do not fit real life'],
  },
  'surface-care': {
    pressure: 'traffic lanes, stains, odours, and finish wear that general cleaning cannot correct',
    access: 'drying time, fibre type, furniture movement, and floor-finish protection',
    result: 'surfaces that recover their appearance and wear more evenly',
    pairings: 'deep cleaning, upholstery work, and periodic detail resets',
    localNote: 'Humidity, sand, and red dirt shorten the life of flooring and fabrics when ignored',
    preferredLocations: ['parap', 'cullen-bay', 'nightcliff', 'muirhead'],
    seasonalFocus: {
      winter: 'dry-season grit and dust settling into fibres and grout',
      spring: 'build-up humidity that makes odour and haze more obvious',
      summer: 'wet-season moisture management and slower drying if the method is wrong',
      fall: 'preventive maintenance before another humidity swing',
    },
    problems: ['Traffic lanes that look permanent', 'Odours trapped below the surface', 'Hard-water or mineral film', 'Slow drying from the wrong process'],
  },
  'specialist-add-on': {
    pressure: 'detail-heavy surfaces that need better tools and a more exact method',
    access: 'ladder setup, fragile finishes, protected surfaces, and appliance or exterior access',
    result: 'specialist detail work that makes the rest of the property look finished',
    pairings: 'whole-home or turnover cleaning programs',
    localNote: 'salt spray, storm residue, and hard-water spotting make Darwin detail surfaces look tired faster',
    preferredLocations: ['fannie-bay', 'nightcliff', 'cullen-bay', 'lee-point'],
    seasonalFocus: {
      winter: 'dry-season light exposing glass haze and fan dust',
      spring: 'build-up grime on screens, louvers, gutters, and glass',
      summer: 'wet-season spotting, streaking, and storm residue',
      fall: 'preventive detailing before the next heavy weather cycle',
    },
    problems: ['Streaks and haze on glass', 'Grease or carbon that keeps coming back', 'Delicate surfaces cleaned with the wrong method', 'Access problems wasting site time'],
  },
  commercial: {
    pressure: 'tenant expectations, shared touch points, and busy sites that must stay clean without disruption',
    access: 'after-hours entry, alarms, loading zones, room-by-room standards, and compliance-sensitive areas',
    result: 'a workplace or public-facing site that stays presentable and easier to manage',
    pairings: 'periodic floor care, windows, washrooms, and scheduled detail work',
    localNote: 'Darwin commercial sites feel wet-season entry grime and dry-season dust pressure very quickly',
    preferredLocations: ['darwin-city-cbd', 'winnellie', 'parap', 'berrimah'],
    seasonalFocus: {
      winter: 'dry-season dust through lobbies, amenities, and shared entries',
      spring: 'build-up humidity affecting washrooms, kitchens, and HVAC dust',
      summer: 'wet-season mud and moisture around public-facing areas',
      fall: 'presentation pressure before event season and weather shifts',
    },
    problems: ['Shared entries that feel dirty fast', 'Inconsistent standards across rooms', 'Access windows that are too tight', 'Periodic tasks that keep getting postponed'],
  },
  hygiene: {
    pressure: 'high-contact washrooms and service points where hygiene confidence matters every day',
    access: 'service logs, replenishment schedules, unit counts, and timing around active occupants',
    result: 'cleaner, better-stocked hygiene spaces that trigger fewer complaints',
    pairings: 'restocking, disinfection, and periodic deep-clean support',
    localNote: 'busy Darwin offices, schools, clinics, and public venues cannot rely on a visual wipe-down alone',
    preferredLocations: ['darwin-city-cbd', 'casuarina', 'winnellie', 'marrara'],
    seasonalFocus: {
      winter: 'dry-season occupancy and illness-season expectations',
      spring: 'build-up heat, visitor volume, and tighter service intervals',
      summer: 'wet-season traffic and faster washroom deterioration',
      fall: 'return-to-routine occupancy patterns after storm disruptions',
    },
    problems: ['Rooms that look clean but feel neglected', 'Empty dispensers between visits', 'Touch points missed in a hurry', 'No clear record of service'],
  },
  external: {
    pressure: 'curb-appeal issues, outdoor residue, and hard-surface staining that make a property look older',
    access: 'drainage, weather windows, landscaping, and pressure settings that fit the surface',
    result: 'cleaner exteriors that improve first impressions and help surfaces age better',
    pairings: 'windows, gutters, and broader property resets',
    localNote: 'Darwin exteriors absorb wet-season runoff, humidity staining, and dry-season dust in distinct layers',
    preferredLocations: ['fannie-bay', 'nightcliff', 'lee-point', 'winnellie'],
    seasonalFocus: {
      winter: 'dry-season dust and salt haze on outdoor surfaces',
      spring: 'build-up grime, leaf litter, and moisture around drains',
      summer: 'wet-season runoff, algae pressure, and surface staining',
      fall: 'gutter, patio, and facade prep after heavy weather',
    },
    problems: ['Driveways and entries that stay dingy', 'Overflowing gutters and dirty rooflines', 'Outdoor areas that feel neglected', 'Wrong pressure for the surface'],
  },
  biohazard: {
    pressure: 'health risk, discretion, and controlled remediation in environments that cannot be treated like standard cleaning',
    access: 'containment, PPE, waste handling, insurer communication, and safe re-entry planning',
    result: 'a safer, more controlled recovery path with clearer next steps',
    pairings: 'waste handling, odour control, and staged remediation',
    localNote: 'sensitive-response jobs need calm sequencing whether the site is residential, commercial, or vacant',
    preferredLocations: ['winnellie', 'berrimah', 'karama', 'darwin-city-cbd'],
    seasonalFocus: {
      winter: 'safe access and transfer during dry-season site work',
      spring: 'build-up heat affecting odour and site stability',
      summer: 'wet-season exposure, contamination spread, and access issues',
      fall: 'stabilising a site after storms or vacancy changes',
    },
    problems: ['Treating the job like a deep clean', 'Unclear next steps for families or managers', 'Odour and contamination overlapping', 'Pressure to reuse the site too quickly'],
  },
  restoration: {
    pressure: 'urgent residue, water, smoke, or post-project debris that can worsen if left alone',
    access: 'drying equipment, staged room access, ventilation, and insurer or trade coordination',
    result: 'faster stabilisation and a cleaner path back to usable rooms',
    pairings: 'deodorisation, staged revisits, and supporting detail work',
    localNote: 'storm damage, water ingress, humidity, and renovation cycles all create restoration demand around Darwin',
    preferredLocations: ['winnellie', 'marrara', 'nightcliff', 'berrimah'],
    seasonalFocus: {
      winter: 'dry-season recovery work and lingering dust after trade activity',
      spring: 'build-up leaks, humidity, and early storm preparation',
      summer: 'wet-season water ingress, mould pressure, and urgent cleanup',
      fall: 'post-storm recovery under deadline pressure',
    },
    problems: ['Secondary damage from waiting', 'One-pass expectations on staged jobs', 'Dust remaining after trades leave', 'Uncertainty about what can be salvaged now'],
  },
  'general-cleaning': {
    pressure: 'visible buildup, high-use rooms, and property presentation issues that need a deliberate plan',
    access: 'room priorities, occupancy, scheduling limits, and the real way the property is used',
    result: 'a cleaner, sharper space that is easier to keep under control',
    pairings: 'specialist add-ons or deep-detail work identified early',
    localNote: 'Darwin properties move through wet-season moisture, build-up humidity, and dry-season dust, so a generic checklist is rarely enough for long',
    preferredLocations: ['darwin-city-cbd', 'parap', 'nightcliff', 'casuarina'],
    seasonalFocus: {
      winter: 'dry-season dust in the first few feet of every entrance',
      spring: 'the fuller reset clients want during the build-up',
      summer: 'wet-season grime, moisture, and active room usage',
      fall: 'maintenance after storm runoff and before the next humidity spike',
    },
    problems: ['Too much buildup in the wrong rooms', 'No sequencing around access', 'The result does not last', 'One-size-fits-all scopes'],
  },
};

function uniqueLocations(seed: string, slugs: string[], count: number) {
  const pool = slugs
    .map((slug) => locations.find((location) => location.slug === slug))
    .filter(Boolean) as LocationRecord[];
  const fallback = pickRotating(seed, locations, count + 2);
  const merged = [...pool, ...fallback];

  return merged.filter((item, index) => merged.findIndex((entry) => entry.slug === item.slug) === index).slice(0, count);
}

function buildSeasonalCards(service: ServiceRecord, config: FamilyConfig, location?: LocationRecord) {
  const area = location ? ` in ${location.name}` : ' in Darwin';
  const localTag = location ? location.localInsight.toLowerCase() : config.localNote;

  return [
    ['Dry Season', config.seasonalFocus.winter],
    ['Build-Up', config.seasonalFocus.spring],
    ['Wet Season', config.seasonalFocus.summer],
    ['Storm Transition', config.seasonalFocus.fall],
  ].map(([season, focus]) => ({
    title: `${season} ${service.name}${area}`,
    body: `${service.name} is affected by ${focus}. ${localTag.charAt(0).toUpperCase()}${localTag.slice(1)}, so seasonal timing has a direct impact on scope, labour, and how long the result will hold up after the visit.`,
  }));
}

function buildProblemCards(service: ServiceRecord, config: FamilyConfig, location?: LocationRecord) {
  const localLine = location
    ? `${location.commonYardSize} and ${location.hoaNotes.toLowerCase()} are part of how we plan the solution.`
    : `${config.localNote.charAt(0).toUpperCase()}${config.localNote.slice(1)}.`;

  return config.problems.map((title) => ({
    title: location ? `${title} in ${location.name}` : title,
    body: `${title} is a common trigger for booking ${service.name.toLowerCase()} because it makes the property feel less cared for even when the issue seems small at first. We solve it by matching the sequence, products, and level of detail to the surfaces involved instead of relying on a generic wipe-down. ${localLine}`,
  }));
}

function buildServiceProcess(service: ServiceRecord, config: FamilyConfig, featuredLocations: LocationRecord[]) {
  return service.process.map((step, index) => ({
    title: step.title,
    description: [
      `${step.description} We confirm the property condition and whether the visit needs to work around ${config.access}.`,
      `${step.description} The first work phase targets the rooms and surfaces carrying the most visible pressure from ${config.pressure}.`,
      `${step.description} The method is adjusted to fit the property style common in ${featuredLocations.map((item) => item.name).slice(0, 2).join(' and ')} rather than assuming every Darwin job behaves the same way.`,
      `${step.description} We finish by outlining practical next steps so the result stays stable through Darwin's next seasonal shift.`,
    ][index] ?? step.description,
  }));
}

function buildServiceFaqs(service: ServiceRecord, config: FamilyConfig, featuredLocations: LocationRecord[], relatedServices: ServiceRecord[]): FaqItem[] {
  const serviceLower = service.name.toLowerCase();
  const locationNames = featuredLocations.map((item) => item.name).slice(0, 3).join(', ');
  const relatedNames = relatedServices.map((item) => item.name).slice(0, 3).join(', ');

  return [
    { question: `How often should I schedule ${serviceLower} in Darwin?`, answer: `That depends on how quickly your property picks up grime from weather, traffic, and daily use. In Darwin, the answer changes across the dry season, the build-up, wet-season storms, and post-storm recovery periods, so we recommend a schedule based on condition and lifestyle rather than a generic frequency.` },
    { question: `What is normally included in professional ${serviceLower}?`, answer: `${service.name} starts with the areas that control the overall impression of the property. We confirm what is included before the visit begins, especially when the job may also need ${config.pairings} to deliver a complete result.` },
    { question: `How do Darwin seasons affect ${serviceLower}?`, answer: `${config.localNote.charAt(0).toUpperCase()}${config.localNote.slice(1)}. That is why scope and timing can change across Darwin's dry season, build-up, wet season, and storm-transition periods even when the property itself has not changed.` },
    { question: `Do you provide ${serviceLower} in neighborhoods like ${locationNames}?`, answer: `Yes. We schedule this service across dense urban neighborhoods, family-home districts, and nearby metro communities. Access details such as parking, elevators, HOA rules, pets, or after-hours entry are part of the planning conversation.` },
    { question: `Which services pair well with ${serviceLower}?`, answer: `The most common pairings are ${relatedNames}. Bundling the related work early often protects the final result and prevents one leftover issue from making the property still feel unfinished.` },
    { question: `How do you price ${serviceLower} in Darwin?`, answer: `Pricing depends on property size, condition, access complexity, and the amount of detail work required. If the job involves a tight handover, a managed building, or a specialist add-on, we explain that clearly before the appointment is locked in.` },
  ];
}

function buildCombinationFaqs(service: ServiceRecord, location: LocationRecord, nearbyLocations: LocationRecord[], relatedServices: ServiceRecord[]): FaqItem[] {
  const serviceLower = service.name.toLowerCase();
  const nearbyText = nearbyLocations.map((item) => item.name).slice(0, 3).join(', ');
  const relatedText = relatedServices.map((item) => item.name).slice(0, 3).join(', ');

  return [
    { question: `How is ${serviceLower} different in ${location.name}?`, answer: `${location.name} properties have their own access pattern, residue profile, and presentation expectations. We plan the scope around parking, property type, building rules, and the local seasonal pressure that shows up most in this part of Darwin.` },
    { question: `What local conditions affect ${serviceLower} in ${location.name}?`, answer: `${location.localInsight} We also account for ${location.soilType.toLowerCase()} That influences which surfaces need extra labour and how quickly grime is likely to return after the visit.` },
    { question: `Can you coordinate access logistics in ${location.name}?`, answer: `Yes. Jobs here often involve parking limits, HOA or building-management expectations, quiet-hour rules, or timing around residents, staff, and guests. Handling those details early protects both speed and quality on site.` },
    { question: `Do clients in ${location.name} also book nearby areas like ${nearbyText}?`, answer: `They do. Many clients manage multiple addresses in nearby neighborhoods, so we often coordinate the same service across surrounding areas when timing and access line up well.` },
    { question: `What services are often paired with ${serviceLower} in ${location.name}?`, answer: `The most common related options here are ${relatedText}. Those pairings help solve the visual or hygiene problem more completely instead of fixing only one part of it.` },
    { question: `When is the best time to schedule ${serviceLower} in ${location.name}?`, answer: `The best timing depends on whether dry-season dust, build-up humidity, wet-season runoff, or post-storm reset work is driving the problem. In most cases, booking before the highest-traffic part of the week or before an inspection, turnover, or event delivers the strongest payoff.` },
  ];
}

export function getServicePageContent(service: ServiceRecord): ServicePageContent {
  const family = classifyService(service.name);
  const config = familyConfig[family];
  const featuredLocations = uniqueLocations(service.slug, config.preferredLocations, 4);
  const relatedServices = getRelatedServices(service, 4);
  const [firstLocation, secondLocation, thirdLocation, fourthLocation] = featuredLocations;

  return {
    introParagraphs: [
      `${service.description} In Darwin, that usually means solving ${config.pressure} in a way that also respects ${config.access}. Clients often start by reading the city-wide ${linkToService(service)} overview and then move into location routes such as ${linkToCombination(firstLocation, service)} or ${linkToCombination(secondLocation, service)} once they realise local conditions change the work.`,
      `A property near ${linkToArea(firstLocation)} does not behave the same way as one in ${linkToArea(thirdLocation)} or ${linkToArea(fourthLocation)}. Different layouts, traffic patterns, and building rules change how quickly surfaces pick up grime again after a visit, which is why this page goes deeper than a short service description.`,
      `The goal is ${config.result}. If the property also needs ${config.pairings}, we flag that early so the finished result feels complete instead of leaving an obvious problem untouched.`,
    ],
    methodology: [
      {
        title: 'Scope And Site Review',
        paragraphs: [
          `We start by understanding the property, the surface mix, and the exact problem the client wants solved. That sounds basic, but it is where most generic cleaning plans fail. A Darwin apartment with shared access, a family home with heavy driveway traffic, and a commercial site with limited downtime all require a different sequence even when the service name is identical.`,
          `This stage is also where we decide whether the job should stay narrowly focused or whether a broader scope would protect the result better. If the issue is actually being driven by surrounding detail work, it is more honest to explain that early than to deliver a technically finished job that still leaves the property looking underwhelming.`,
        ],
      },
      {
        title: 'Method Matched To Darwin Conditions',
        paragraphs: [
          `Once the scope is confirmed, the visit is built around the real pressures affecting the property. ${config.localNote.charAt(0).toUpperCase()}${config.localNote.slice(1)}. That is why we choose the order of work, the level of detail, and the supporting tasks with seasonality in mind instead of pretending every month in Darwin is the same.`,
          `This also helps the result last longer. When the main issue is addressed in the right order, the property is less likely to look tired again immediately after the visit. That matters for homeowners trying to stay ahead of buildup and for property managers who do not want callbacks caused by the same recurring trouble spots.`,
        ],
      },
      {
        title: 'Final Presentation And Maintenance Planning',
        paragraphs: [
          `Before wrapping up, we review the areas that clients judge first and the details they only notice when they are missed. That last pass is where a professional service separates itself from a quick tidy. The outcome should not just be cleaner surfaces. It should be a space that feels more organised, healthier, and easier to live or work in.`,
          `We also explain what happens next. If a recurring schedule is sensible, we say so. If a lighter maintenance cycle will hold the result just fine, we say that too. Good advice matters because cleaning budgets work best when they are aligned with actual conditions rather than guesswork.`,
        ],
      },
    ],
    localKnowledge: [
      `Darwin-specific advice matters on service pages because the same cleaning problem behaves differently across the city. CBD and waterfront addresses tend to introduce more shared-entry traffic, lift staging, and short-stay pressure. Bayside suburbs add salt spray and outdoor-living residue. Northern suburbs often bring more family-use wear, ceiling-fan dust, and tiled-floor traffic, while industrial corridors can be driven by after-hours access and practical loading conditions.`,
      `That is why we naturally connect this page to local routes like ${linkToCombination(firstLocation, service)}, ${linkToCombination(secondLocation, service)}, and ${linkToCombination(thirdLocation, service)}. Those pages are meant to help clients compare the same service across real neighborhoods instead of bouncing between thin doorway pages with the city name swapped out.`,
      `If you are comparing options, it is also worth reviewing ${linkToService(relatedServices[0] ?? service)} and ${linkToService(relatedServices[1] ?? relatedServices[0] ?? service)}. Darwin properties often need a slightly broader plan than the first symptom suggests, and seeing those related pages side by side usually makes the right scope clearer.`,
    ],
    seasonalCards: buildSeasonalCards(service, config),
    problemCards: buildProblemCards(service, config),
    process: buildServiceProcess(service, config, featuredLocations),
    faqs: buildServiceFaqs(service, config, featuredLocations, relatedServices),
    locationLinks: featuredLocations.map((location) => ({
      href: `/areas/${location.slug}/${service.slug}`,
      label: `${service.name} in ${location.name}`,
      description: `Read the location-specific ${service.name.toLowerCase()} page for ${location.name}, including local access notes, seasonal timing advice, and neighborhood FAQs.`,
    })),
    areaLinks: featuredLocations.map((location) => ({
      href: `/areas/${location.slug}`,
      label: `Cleaning services in ${location.name}`,
      description: `Open the ${location.name} area hub to review local service availability, access context, and nearby neighborhood coverage.`,
    })),
    relatedServicesIntro: `These related services are the ones Darwin clients most often compare with ${service.name.toLowerCase()} when they want the finished result to hold up longer or solve a larger property problem in one visit.`,
    weAlsoServeIntro: `Use these neighborhood pages to jump straight into area-specific guidance for ${service.name.toLowerCase()} instead of starting from a generic city-level page.`,
    midCta: {
      title: `Need a quote for ${service.name.toLowerCase()} in Darwin?`,
      body: `Send the property type, neighborhood, and the main issue you want solved. We will recommend the right scope, explain any related services worth considering, and point you to the best local page if a neighborhood-specific route fits better.`,
      primaryLabel: 'Request a Quote',
      primaryHref: '/contact',
      secondaryLabel: `View ${firstLocation.name} Page`,
      secondaryHref: `/areas/${firstLocation.slug}/${service.slug}`,
    },
    bottomCta: {
      title: `Ready to book ${service.name.toLowerCase()} in Darwin?`,
      body: `Share your timing window, access details, and any problem surfaces you want prioritised. We will map out the most practical plan for the property and confirm whether this general service page or a location-specific route is the better fit.`,
      primaryLabel: service.cta,
      primaryHref: '/contact',
      secondaryLabel: 'Browse Darwin Areas',
      secondaryHref: '/areas',
    },
  };
}

export function getCombinationPageContent(service: ServiceRecord, location: LocationRecord, _combination: CombinationRecord): CombinationPageContent {
  const family = classifyService(service.name);
  const config = familyConfig[family];
  const nearbyLocations = getNearbyLocations(location, 4);
  const relatedServices = getRelatedServices(service, 4);
  const [firstNearby, secondNearby] = nearbyLocations;
  const landmarks = location.landmarks.map((item) => item.name).slice(0, 2).join(' and ');

  return {
    heroBody: `${service.name} in ${location.name} is planned around local access, seasonal residue, and the type of property stock common in this part of Darwin. We tailor the scope to ${location.region.toLowerCase()}, reference points like ${landmarks}, and the way presentation issues usually build up in ${location.name} so the page delivers real local value instead of doorway copy.`,
    overviewParagraphs: [
      `${linkToCombination(location, service)} is for clients who already know neighborhood details matter. The broader ${linkToService(service)} page explains the service itself, while ${linkToArea(location)} explains the area. This page brings those two ideas together so the scope makes sense for ${location.name} specifically.`,
      `${location.localInsight} That affects how quickly cleaned surfaces pick up grime again and how the visit needs to be sequenced around ${location.hoaNotes.toLowerCase()}. The goal is not just to clean the property once. It is to make the result fit the way the property actually operates in ${location.name}.`,
      `Many owners compare this route with nearby variants like ${linkToCombination(firstNearby ?? location, service)} and ${linkToCombination(secondNearby ?? firstNearby ?? location, service)} because each local pocket has a slightly different mix of property styles, parking, and traffic. Those differences are exactly why each combination page needs real content depth.`,
    ],
    methodology: [
      {
        title: `How ${service.name} Is Scoped In ${location.name}`,
        paragraphs: [
          `We begin by confirming what success should look like for this address. In ${location.name}, that might mean presentation for a family home, reliability for a recurring service, speed for a turnover, or controlled detail work for a site with stricter access. ${location.soilType} That is part of what shapes labour, product choice, and the order of work.`,
          `The property layout also matters. ${location.commonYardSize} When people move through shared halls, garages, patios, or service corridors in a certain way, the cleaning sequence has to reflect that flow or the cleanest areas will start losing ground too soon.`,
        ],
      },
      {
        title: 'Methodology For Darwin Climate And Local Access',
        paragraphs: [
          `${config.localNote.charAt(0).toUpperCase()}${config.localNote.slice(1)}. In ${location.name}, those seasonal pressures intersect with parking, building rules, traffic, and the kinds of surfaces most common in the area. That is why the work is planned locally rather than copied from a general Darwin paragraph.`,
          `The method also has to fit the actual problem. Some sites need more attention on entries, glass, bath areas, or flooring. Others are shaped by guest turnover, shared facilities, or the visual standards that come with a more public-facing address. We build the scope around what is creating the problem, not around a one-size-fits-all checklist.`,
        ],
      },
      {
        title: 'Final Review And Follow-Up',
        paragraphs: [
          `Before the visit ends, we review the zones that are most likely to influence how the property is judged. That includes the obvious surfaces and the subtle details that make a space feel half-finished when they are overlooked. If a related service would noticeably improve the outcome, we call it out directly.`,
          `For many properties in ${location.name}, the next best comparison is a related local page such as ${linkToCombination(location, relatedServices[0] ?? service)} or ${linkToCombination(location, relatedServices[1] ?? relatedServices[0] ?? service)}. Keeping those comparisons local helps clients make a better decision than bouncing back to a broad city-wide overview.`,
        ],
      },
    ],
    seasonalCards: buildSeasonalCards(service, config, location),
    problemCards: buildProblemCards(service, config, location),
    process: service.process.map((step, index) => ({
      title: step.title,
      description: [
        `${step.description} We confirm parking, entry instructions, and local trouble spots before work starts in ${location.name}.`,
        `${step.description} The first work phase targets the surfaces most affected by ${location.localInsight.toLowerCase()}`,
        `${step.description} Product choice and sequencing are adjusted to the property style common in ${location.name}, not copied from a city-wide template.`,
        `${step.description} We finish by explaining how to protect the result through the next Darwin seasonal shift in ${location.name}.`,
      ][index] ?? step.description,
    })),
    faqs: buildCombinationFaqs(service, location, nearbyLocations, relatedServices),
    relatedServices: relatedServices.map((item) => ({
      href: `/areas/${location.slug}/${item.slug}`,
      label: `${item.name} in ${location.name}`,
      description: `Compare ${item.name.toLowerCase()} with ${service.name.toLowerCase()} for ${location.name} properties that need more than one cleaning solution.`,
    })),
    nearbyAreaLinks: nearbyLocations.map((item) => ({
      href: `/areas/${item.slug}`,
      label: `Cleaning services in ${item.name}`,
      description: `Open the ${item.name} area page to review local coverage, neighborhood context, and service options around ${item.name}.`,
    })),
    relatedServicesIntro: `Property owners in ${location.name} often review these related services when the visible issue overlaps with a second cleaning need. These links stay local by pointing to the same neighborhood whenever possible.`,
    weAlsoServeIntro: `If you manage nearby properties too, these surrounding area pages show how ${service.name.toLowerCase()} is adapted across the surrounding Darwin service area instead of repeating the same text everywhere.`,
    midCta: {
      title: `Need ${service.name.toLowerCase()} in ${location.name}?`,
      body: `Send the property type, main problem areas, and any access instructions for ${location.name}. We will confirm the right local scope and tell you whether a related service should be bundled into the same visit.`,
      primaryLabel: 'Get a Local Quote',
      primaryHref: '/contact',
      secondaryLabel: `About ${location.name}`,
      secondaryHref: `/areas/${location.slug}`,
    },
    bottomCta: {
      title: `Book ${service.name.toLowerCase()} for ${location.name}`,
      body: `Share your timing window, building details, and anything that could affect access. We will map out the most practical local plan for ${location.name} and the surrounding Darwin area.`,
      primaryLabel: service.cta,
      primaryHref: '/contact',
      secondaryLabel: `View ${service.name}`,
      secondaryHref: `/services/${service.slug}`,
    },
  };
}

export function getServicePageAuditText(service: ServiceRecord) {
  const content = getServicePageContent(service);

  return [
    service.heroHeading,
    service.intro,
    service.description,
    ...content.introParagraphs.map(stripHtml),
    ...service.features,
    ...service.commonIssues,
    ...content.methodology.flatMap((section) => [section.title, ...section.paragraphs.map(stripHtml)]),
    ...content.localKnowledge.map(stripHtml),
    ...content.seasonalCards.flatMap((card) => [card.title, card.body]),
    ...content.problemCards.flatMap((card) => [card.title, card.body]),
    ...content.process.flatMap((step) => [step.title, step.description]),
    ...content.faqs.flatMap((item) => [item.question, item.answer]),
    ...content.locationLinks.flatMap((item) => [item.label, item.description]),
    ...content.areaLinks.flatMap((item) => [item.label, item.description]),
    content.relatedServicesIntro,
    content.weAlsoServeIntro,
    content.midCta.title,
    content.midCta.body,
    content.bottomCta.title,
    content.bottomCta.body,
  ].join(' ');
}

export function getCombinationPageAuditText(service: ServiceRecord, location: LocationRecord, combination: CombinationRecord) {
  const content = getCombinationPageContent(service, location, combination);

  return [
    content.heroBody,
    combination.uniqueIntro,
    ...content.overviewParagraphs.map(stripHtml),
    ...combination.localProblems,
    combination.pricingNote,
    combination.localTip,
    ...content.methodology.flatMap((section) => [section.title, ...section.paragraphs.map(stripHtml)]),
    ...content.seasonalCards.flatMap((card) => [card.title, card.body]),
    ...content.problemCards.flatMap((card) => [card.title, card.body]),
    ...content.process.flatMap((step) => [step.title, step.description]),
    ...content.faqs.flatMap((item) => [item.question, item.answer]),
    ...content.relatedServices.flatMap((item) => [item.label, item.description]),
    ...content.nearbyAreaLinks.flatMap((item) => [item.label, item.description]),
    content.relatedServicesIntro,
    content.weAlsoServeIntro,
    content.midCta.title,
    content.midCta.body,
    content.bottomCta.title,
    content.bottomCta.body,
  ].join(' ');
}

export function wordCount(input: string) {
  return input.trim().split(/\s+/).filter(Boolean).length;
}
