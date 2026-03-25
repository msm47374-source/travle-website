import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  FaqItem,
  Landmark,
  LocationRecord,
  ProcessStep,
  ServiceRecord,
} from './types.ts';

type ParsedService = {
  name: string;
  description: string;
  category: string;
  slug: string;
};

type ParsedLocation = {
  name: string;
  postcode: string;
  region: string;
  slug: string;
};

type ServiceProfile = {
  family: string;
  featurePool: string[];
  issuePool: string[];
  processTitles: string[];
  priceRange: string;
  faqFocus: string[];
  cta: string;
};

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function resolveContentDir() {
  const candidates = [
    path.resolve(process.cwd(), 'website-content'),
    path.resolve(moduleDir, '../../website-content'),
    path.resolve(moduleDir, '../../../website-content'),
    path.resolve(moduleDir, '../../../../website-content'),
    path.resolve(moduleDir, '../../../../../website-content'),
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate));

  if (!match) {
    throw new Error('Unable to locate website-content directory.');
  }

  return match;
}

const contentDir = resolveContentDir();

const serviceKeywordProfiles: Array<[RegExp, ServiceProfile]> = [
  [
    /end of lease|bond|move-out|vacate|move-in|pre-sale|pre-inspection/i,
    {
      family: 'property-transition',
      featurePool: [
        'Room-by-room condition resets aligned with property manager expectations.',
        'Clear scope planning for kitchens, bathrooms, storage areas, and overlooked edges.',
        'Flexible add-ons for carpets, ovens, windows, and pressure washing when required.',
        'Detailed handover-focused finish that supports inspections and re-entry timelines.',
        'Photo-ready presentation for agents, landlords, and property marketing teams.',
      ],
      issuePool: [
        'Wall marks, kitchen grease, and soap build-up that regular cleaning does not fully remove.',
        'Tight key return windows that leave little margin for re-cleans or missed items.',
        'Dust hiding in skirting lines, tracks, wardrobes, and utility spaces.',
        'Coordination between cleaners, tenants, agents, and final inspections.',
      ],
      processTitles: ['Inspect the property', 'Set the clean scope', 'Detail high-risk rooms', 'Finish for handover'],
      priceRange:
        'From $280 for smaller vacates, with full property quotes based on rooms, access, and add-ons.',
      faqFocus: ['handover standard', 'inspection timing', 'included add-ons', 're-clean prevention'],
      cta: 'Request a handover-ready quote',
    },
  ],
  [
    /deep|spring|one-off|regular|routine|new home|holiday home|airbnb|short-stay|apartment|unit|townhouse|studio|duplex/i,
    {
      family: 'residential',
      featurePool: [
        'Flexible scheduling for weekly, fortnightly, seasonal, and one-time visits.',
        'Attention to kitchens, bathrooms, touch points, and the humidity, dust, and coastal residue that build quickly in Darwin homes.',
        'Scope can be adjusted for families, shared homes, short-stay turnovers, or owner-occupied properties.',
        'Useful for presentation, hygiene, and reducing build-up before it becomes expensive to fix.',
        'Products and methods matched to occupied homes, pets, and different surface types.',
      ],
      issuePool: [
        'Wet-season mud, coastal grit, and entryway residue during Darwin storm weather.',
        'Dry-air dust, pet hair, and grit tracked in from driveways, patios, and mudrooms.',
        'Busy households that need consistency rather than occasional catch-up visits.',
        'Short-stay turnovers that demand linen-ready bathrooms and guest-facing presentation.',
      ],
      processTitles: ['Confirm the visit details', 'Tackle high-use zones first', 'Work room by room', 'Final presentation check'],
      priceRange:
        'From $140 for compact residential jobs, with custom quotes for larger homes and deeper scopes.',
      faqFocus: ['frequency', 'products and equipment', 'deep clean triggers', 'time on site'],
      cta: 'Book a home cleaning quote',
    },
  ],
  [
    /carpet|rug|upholstery|mattress|tile|grout|floor|vinyl|linoleum|timber|concrete|epoxy/i,
    {
      family: 'surface-care',
      featurePool: [
        'Cleaning method is matched to fibre type, floor coating, moisture tolerance, and traffic level.',
        'Built-up soils, spills, odours, and dull finishes are assessed before treatment starts.',
        'Suitable for homes, offices, strata corridors, and fit-out projects where presentation matters.',
        'Finishes are protected with the right dwell time, extraction, drying, or polishing sequence.',
        'Clear advice is given on re-entry times, maintenance frequency, and aftercare.',
      ],
      issuePool: [
        'Ground-in grit that cuts through fibres and soft finishes over time.',
        'Humidity-driven odours and slow drying if the wrong process is used.',
        'Traffic lanes, scuffs, and uneven sheen across hard floor surfaces.',
        'Stains that need targeted chemistry rather than general-purpose detergent.',
      ],
      processTitles: ['Assess the surface', 'Pre-treat problem areas', 'Clean with the right method', 'Set aftercare guidance'],
      priceRange:
        'From $110 for smaller specialist surface jobs, with pricing based on area size, stains, and finish type.',
      faqFocus: ['drying times', 'stain treatment', 'surface protection', 'maintenance cycles'],
      cta: 'Get a specialist surface cleaning quote',
    },
  ],
  [
    /window|blind|curtain|drape|oven|bbq|grill|gutter|roof|pressure|soft washing|solar|duct|vent|chimney|laundry|pool|flyscreen|louvre|skylight/i,
    {
      family: 'specialist-add-on',
      featurePool: [
        'Ideal when standard cleaning needs to be supported by one technical or high-detail service.',
        'Tools, ladders, access planning, and product choice are matched to the exact surface being cleaned.',
        'Useful for presentation upgrades, maintenance programs, and pre-event resets.',
        'Particularly valuable in Darwin where salt spray, red dirt, humidity, and hard-water spotting build quickly.',
        'Can be bundled with routine home or commercial visits for a more efficient clean.',
      ],
      issuePool: [
        'Specialty surfaces often fail when cleaned with the wrong tools or too much pressure.',
        'Exterior exposure leaves glass, metal, and roofline areas with stubborn residue.',
        'Grease, soot, and fine debris need targeted treatment to avoid streaking or damage.',
        'Access, safety, and timing all affect how efficiently add-on services can be completed.',
      ],
      processTitles: ['Check access and safety', 'Protect surrounding surfaces', 'Complete the specialist clean', 'Review finish and aftercare'],
      priceRange:
        'From $95 for add-on services, with access and equipment requirements affecting the final quote.',
      faqFocus: ['access needs', 'safety planning', 'what is included', 'pairing with other services'],
      cta: 'Add this specialist clean to your quote',
    },
  ],
  [
    /office|corporate|retail|shopping|warehouse|industrial|factory|data centre|laboratory|clean room|car park|gym|high-rise|strata property|government|airport|hotel|motel|restaurant|cafe|kitchen|pub|bar|hospitality|childcare|school|educational|university|tafe|medical|hospital|aged care|disability|pharmaceutical|church|community hall/i,
    {
      family: 'commercial',
      featurePool: [
        'Service plans are built around access windows, compliance requirements, and site traffic patterns.',
        'Suitable for offices, public-facing venues, care environments, and operational facilities.',
        'Scopes can include touch-point disinfection, washroom servicing, periodic deep cleans, and consumables.',
        'Designed to protect presentation, staff experience, and hygiene standards without interrupting operations.',
        'Clear reporting and repeatable checklists support managers, tenants, and procurement teams.',
      ],
      issuePool: [
        'High-traffic sites build up grime quickly in entries, amenities, and shared touch points.',
        'Different rooms often need different products, PPE, and timing windows.',
        'Compliance-sensitive spaces cannot rely on the same routine used in a standard office.',
        'Cleaning has to fit around staff, customers, visitors, and security protocols.',
      ],
      processTitles: ['Review the site requirements', 'Set the site schedule', 'Deliver the cleaning scope', 'Report and refine the program'],
      priceRange: 'Custom commercial pricing based on frequency, compliance needs, access hours, and site size.',
      faqFocus: ['after-hours access', 'compliance and documentation', 'consumables and add-ons', 'frequency planning'],
      cta: 'Discuss a commercial cleaning program',
    },
  ],
  [
    /washroom|sanitary|sanitiser|hygiene|nappy|soap|consumable|disinfection|atp|terminal cleaning/i,
    {
      family: 'hygiene',
      featurePool: [
        'Built for high-contact spaces where hygiene documentation and consistency matter.',
        'Service can combine cleaning, consumable replenishment, and scheduled unit servicing.',
        'Useful for offices, public amenities, health settings, schools, and hospitality venues.',
        'Programs are designed around service intervals, foot traffic, and infection-risk priorities.',
        'Consumables, servicing logs, and touch-point treatment can be coordinated in one visit.',
      ],
      issuePool: [
        'Inconsistent consumable restocking creates complaints even when the room looks clean.',
        'Touch points and disposal units need predictable servicing to stay compliant and hygienic.',
        'Washrooms break trust quickly when odours, residue, or empty dispensers are ignored.',
        'High-risk environments often need verification, escalation pathways, and tighter frequency control.',
      ],
      processTitles: ['Audit hygiene points', 'Restock and service units', 'Disinfect the contact zones', 'Log outcomes and next cycle'],
      priceRange: 'Programs are quoted by room count, service interval, and consumables required.',
      faqFocus: ['service frequency', 'consumable supply', 'disinfection scope', 'reporting'],
      cta: 'Set up a hygiene servicing plan',
    },
  ],
];

const regionProfiles = {
  'Darwin CBD and Inner Harbour': {
    county: 'City of Darwin',
    soilType:
      'Coastal humidity, lift-lobby dust, sea-salt film, and tourist foot traffic that move quickly through apartments, hotels, and mixed-use buildings.',
    waterRestrictions:
      'Exterior washing is planned around wet-season downpours, shared-access staging, harbour drainage, and slip-risk control near hard surfaces.',
    commonYardSize:
      'Mostly apartments, waterfront units, hotels, and compact townhomes with limited staging space.',
    landmarkPool: [
      ['Darwin Waterfront Precinct', 'waterfront district'],
      ['Smith Street Mall', 'retail strip'],
      ['Darwin Convention Centre', 'events venue'],
      ['Stokes Hill Wharf', 'harbour landmark'],
      ['Crocosaurus Cove', 'tourism venue'],
      ['Bicentennial Park', 'park'],
      ['Cullen Bay Marina', 'marina'],
      ['Parliament House', 'civic landmark'],
      ['Deckchair Cinema', 'outdoor venue'],
    ],
    localAngles: [
      'concierge timing and basement parking rules',
      'short-stay turnover pressure near the waterfront',
      'tourism-driven foot traffic through entries and lifts',
      'storm-season access changes around inner-city buildings',
    ],
    lat: -12.4634,
    lng: 130.8456,
  },
  'Bayside and Inner Darwin': {
    county: 'City of Darwin',
    soilType:
      'Sea-breeze salt film, leaf litter, tropical moisture, and garden debris that settle quickly on glass, patios, and shaded entries.',
    waterRestrictions:
      'Exterior work is timed around afternoon storms, foreshore winds, and runoff control near older residential streets and bayside lots.',
    commonYardSize:
      'Mostly established homes, foreshore residences, small apartment blocks, and mixed-use inner suburbs with gardens or carports.',
    landmarkPool: [
      ['Parap Village Markets', 'market precinct'],
      ['Fannie Bay Foreshore', 'foreshore landmark'],
      ['East Point Reserve', 'coastal reserve'],
      ['Darwin Sailing Club', 'hospitality venue'],
      ['Mindil Beach', 'beach precinct'],
      ['Fannie Bay Racecourse', 'events venue'],
      ['George Brown Darwin Botanic Gardens', 'botanic gardens'],
      ['The Narrows bridge corridor', 'commuter corridor'],
      ['Parap Pool', 'community facility'],
    ],
    localAngles: [
      'salt spray on outdoor glass and balustrades',
      'shaded patios and mould-prone corners',
      'market-day parking and event traffic',
      'older louvre windows and timber finishes',
    ],
    lat: -12.4379,
    lng: 130.843,
  },
  'Northern Suburbs and Coastal Corridor': {
    county: 'City of Darwin',
    soilType:
      'Coastal dust, sea-salt mist, leaf litter, and family-home traffic moving through tiled entries, verandahs, and living zones.',
    waterRestrictions:
      'Exterior jobs are staged around dry-season wind, wet-season bursts, and coastal overspray on patios, louvers, and windows.',
    commonYardSize:
      'Mostly family homes, duplexes, units, and suburban lots with carports, verandahs, and backyard entertaining areas.',
    landmarkPool: [
      ['Casuarina Square', 'shopping centre'],
      ['Charles Darwin University', 'campus'],
      ['Nightcliff Foreshore', 'foreshore precinct'],
      ['Rapid Creek Markets', 'market precinct'],
      ['Royal Darwin Hospital', 'medical campus'],
      ['Lee Point foreshore', 'coastal landmark'],
      ['Tiwi sporting precinct', 'sports venue'],
      ['Casuarina Coastal Reserve', 'nature reserve'],
      ['Nightcliff Jetty', 'coastal landmark'],
    ],
    localAngles: [
      'coastal salt spray on glass and metalwork',
      'ceiling-fan dust and open-window grit',
      'school-run traffic and family-use wear',
      'wet-season humidity in shaded rooms and patios',
    ],
    lat: -12.3766,
    lng: 130.8738,
  },
  'Family Suburbs and Airport Corridor': {
    county: 'City of Darwin and northern residential corridor',
    soilType:
      'Road dust, storm-season leaf litter, airport-corridor residue, and everyday family traffic moving through garages, patios, and living areas.',
    waterRestrictions:
      'Exterior cleaning is coordinated around sports-field activity, suburban runoff, airport traffic, and practical driveway access.',
    commonYardSize:
      'Mostly larger family homes, duplexes, and residential blocks with driveways, garages, and outdoor entertaining space.',
    landmarkPool: [
      ['Darwin International Airport', 'transport hub'],
      ['Marrara Sporting Complex', 'sports precinct'],
      ['Leanyer Recreation Park', 'community venue'],
      ['Northlakes Shopping Centre', 'shopping centre'],
      ['Marrara Indoor Stadium', 'sports venue'],
      ['Anula shops', 'local centre'],
      ['Karama Shopping Plaza', 'retail centre'],
      ['Wulagi Oval', 'community sports ground'],
      ['Leanyer school corridor', 'school precinct'],
    ],
    localAngles: [
      'school and sports schedules shaping access windows',
      'airport-adjacent timing and traffic flow',
      'larger family-home reset work',
      'storm debris around driveways and carports',
    ],
    lat: -12.3998,
    lng: 130.8962,
  },
  'Industrial and Service Corridors': {
    county: 'Darwin industrial corridor',
    soilType:
      'Industrial dust, freight-corridor grime, red dirt transfer, and warehouse residue that settle fast on entries and hard surfaces.',
    waterRestrictions:
      'Exterior work is planned around freight movement, loading zones, drainage pits, and safety controls in service yards.',
    commonYardSize:
      'Mostly commercial lots, warehouses, workshops, service depots, and mixed-use sites with broad parking and access lanes.',
    landmarkPool: [
      ['Winnellie industrial precinct', 'industrial hub'],
      ['Berrimah Road corridor', 'freight corridor'],
      ['Hidden Valley Raceway', 'events venue'],
      ['Darwin Showgrounds', 'events precinct'],
      ['Tiger Brennan Drive', 'transport corridor'],
      ['Berrimah Business Park', 'commercial precinct'],
      ['Winnellie trade supply corridor', 'service district'],
      ['Hidden Valley industrial yards', 'industrial area'],
      ['Darwin logistics corridor', 'logistics hub'],
    ],
    localAngles: [
      'loading dock schedules and freight access',
      'after-hours cleaning windows for active sites',
      'high-dust service yards and workshops',
      'compliance-driven commercial presentation',
    ],
    lat: -12.4288,
    lng: 130.8919,
  },
} as const;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function clampText(input: string, max = 155) {
  if (input.length <= max) {
    return input;
  }

  return `${input.slice(0, max - 1).trimEnd()}…`;
}

function readMarkdown(fileName: string) {
  return fs.readFileSync(path.join(contentDir, fileName), 'utf8');
}

function hashIndex(seed: string, max: number) {
  const total = [...seed].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return total % max;
}

const generatedImageSize = {
  width: 1792,
  height: 1024,
} as const;

const serviceImagePools = {
  'property-transition': [
    '/images/services/service-end-of-lease-clean-01.jpg',
    '/images/services/service-airbnb-turnover-01.jpg',
  ],
  residential: [
    '/images/services/service-residential-routine-clean-01.jpg',
    '/images/services/service-residential-deep-clean-01.jpg',
    '/images/services/service-airbnb-turnover-01.jpg',
  ],
  'surface-care': [
    '/images/services/service-carpet-cleaning-01.jpg',
    '/images/services/service-residential-deep-clean-01.jpg',
  ],
  'specialist-add-on': [
    '/images/services/service-window-cleaning-01.jpg',
    '/images/services/service-pressure-washing-01.jpg',
    '/images/services/service-oven-cleaning-01.jpg',
  ],
  commercial: [
    '/images/services/service-office-cleaning-01.jpg',
    '/images/services/service-retail-cleaning-01.jpg',
    '/images/services/service-medical-cleaning-01.jpg',
    '/images/services/service-strata-common-area-01.jpg',
  ],
  hygiene: [
    '/images/services/service-medical-cleaning-01.jpg',
    '/images/services/service-office-cleaning-01.jpg',
  ],
  external: [
    '/images/services/service-pressure-washing-01.jpg',
    '/images/services/service-window-cleaning-01.jpg',
  ],
  biohazard: [
    '/images/services/service-mould-remediation-01.jpg',
    '/images/services/service-biohazard-response-01.jpg',
  ],
  restoration: [
    '/images/services/service-emergency-restoration-01.jpg',
    '/images/services/service-mould-remediation-01.jpg',
  ],
  'general-cleaning': [
    '/images/services/service-residential-routine-clean-01.jpg',
    '/images/services/service-office-cleaning-01.jpg',
    '/images/services/service-window-cleaning-01.jpg',
  ],
} as const;

const locationImagePool = [
  '/images/areas/team-on-site-darwin-01.jpg',
  '/images/areas/team-on-site-darwin-02.jpg',
  '/images/areas/team-on-site-darwin-03.jpg',
] as const;

function pickServiceImage(service: ParsedService, family: ServiceProfile['family']) {
  const { name, slug } = service;

  if (/carpet|rug/i.test(name)) {
    return '/images/services/service-carpet-cleaning-01.jpg';
  }

  if (/window|skylight|solar panel/i.test(name)) {
    return '/images/services/service-window-cleaning-01.jpg';
  }

  if (/pressure|soft washing|driveway|pavement|decking|patio|facade|water blasting|concrete cleaning/i.test(name)) {
    return '/images/services/service-pressure-washing-01.jpg';
  }

  if (/oven|bbq|grill/i.test(name)) {
    return '/images/services/service-oven-cleaning-01.jpg';
  }

  if (/office|corporate|warehouse|industrial|factory|data centre|government facility|airport|church|community hall/i.test(name)) {
    return '/images/services/service-office-cleaning-01.jpg';
  }

  if (/retail|shopping centre|restaurant|cafe|pub|bar|hotel|motel|hospitality/i.test(name)) {
    return '/images/services/service-retail-cleaning-01.jpg';
  }

  if (/medical|hospital|aged care|disability care|pharmaceutical|childcare|school|educational|university|tafe|laboratory|clean room/i.test(name)) {
    return '/images/services/service-medical-cleaning-01.jpg';
  }

  if (/strata|apartment|unit|townhouse|studio|duplex|high-rise|common area/i.test(name)) {
    return '/images/services/service-strata-common-area-01.jpg';
  }

  if (/end of lease|bond|move-out|vacate|move-in|pre-sale|pre-inspection/i.test(name)) {
    return '/images/services/service-end-of-lease-clean-01.jpg';
  }

  if (/airbnb|short-stay|holiday home/i.test(name)) {
    return '/images/services/service-airbnb-turnover-01.jpg';
  }

  if (/mould/i.test(name)) {
    return '/images/services/service-mould-remediation-01.jpg';
  }

  if (/crime|trauma|forensic|biohazard|blood|bodily|death|decomposition|suicide|homicide|hoarding|gross filth|meth lab|sewage|fingerprint dust|sharps|urine|faeces|vomit|deceased estate|squatter|animal infestation|dropping|decontamination|drug residue/i.test(name)) {
    return '/images/services/service-biohazard-response-01.jpg';
  }

  if (/flood|fire|smoke|water damage|emergency|disaster|restoration|post-renovation|pre-handover/i.test(name)) {
    return '/images/services/service-emergency-restoration-01.jpg';
  }

  const pool = serviceImagePools[family in serviceImagePools ? family as keyof typeof serviceImagePools : 'general-cleaning'];
  return pool[hashIndex(slug, pool.length)];
}

function pickLocationImage(slug: string) {
  return locationImagePool[hashIndex(slug, locationImagePool.length)];
}

function pickRotating<T>(seed: string, values: readonly T[], count: number): T[] {
  const start = hashIndex(seed, values.length);
  const picked: T[] = [];

  for (let index = 0; index < values.length && picked.length < count; index += 1) {
    picked.push(values[(start + index) % values.length]);
  }

  return picked;
}

const extendedProfiles: Array<[RegExp, ServiceProfile]> = [
  [
    /facade|graffiti|driveway|pavement|decking|patio|sandblasting|water blasting|bin cleaning|waste|rubbish|junk|pest|bird|pigeon|litter|street furniture|outdoor seating|umbrella/i,
    {
      family: 'external',
      featurePool: [
        'Focused on the outdoor grime, staining, residue, and waste that affect first impressions.',
        'Useful for homes, strata sites, retail fronts, loading zones, and public-facing properties.',
        'Methods are selected to clean effectively without damaging coatings, joints, paint, or landscaping.',
        'Darwin humidity, wet-season runoff, dry-season dust, and hard-water spotting are factored into the recommended schedule.',
        'Works well as a reset before inspections, leasing campaigns, winter prep, or spring maintenance.',
      ],
      issuePool: [
        'Outdoor surfaces trap algae, dirt, leaf tannins, and tyre marks faster than indoor finishes.',
        'Runoff control, noise timing, and shared-area access all matter during exterior cleaning.',
        'Storm runoff, red dirt, and irrigation minerals accelerate staining around metal, concrete, and glass.',
        'Waste and pest-related residues require more than a cosmetic rinse.',
      ],
      processTitles: ['Inspect the external surfaces', 'Protect nearby areas and drains', 'Clean with the correct pressure or treatment', 'Review finish and runoff control'],
      priceRange: 'Exterior jobs start from $175, with quotes shaped by access, drainage, and surface area.',
      faqFocus: ['surface safety', 'weather timing', 'runoff management', 'maintenance frequency'],
      cta: 'Plan an exterior cleaning visit',
    },
  ],
  [
    /crime|trauma|forensic|biohazard|blood|bodily|death|decomposition|suicide|homicide|hoarding|gross filth|meth lab|mould|sewage|fingerprint dust|odour|sharps|urine|faeces|vomit|deceased estate|squatter|animal infestation|dropping|decontamination|drug residue|ndis/i,
    {
      family: 'biohazard',
      featurePool: [
        'Sensitive workscope planning with PPE, controlled cleaning methods, and careful communication.',
        'Appropriate for trauma, contamination, hoarding, sewage, mould, and other high-risk environments.',
        'Focus stays on safety, containment, documentation, and respectful site recovery.',
        'Jobs are assessed individually because scope, access, waste handling, and remediation differ widely.',
        'Where needed, the service supports families, landlords, facility teams, and insurers under pressure.',
      ],
      issuePool: [
        'These environments cannot be treated like a standard deep clean or restoration visit.',
        'Cross-contamination, odour control, and waste handling need a strict sequence.',
        'Clients often need discretion, compassionate communication, and a clear explanation of next steps.',
        'Time-sensitive access can overlap with investigations, insurance, or occupancy concerns.',
      ],
      processTitles: ['Secure and assess the site', 'Set containment and PPE controls', 'Remediate and decontaminate', 'Clear waste and document completion'],
      priceRange: 'High-risk cleaning is quoted after assessment because containment, PPE, and disposal needs vary widely.',
      faqFocus: ['response time', 'site safety', 'waste disposal', 'privacy and discretion'],
      cta: 'Speak with us about a sensitive cleaning response',
    },
  ],
  [
    /flood|fire|smoke|water damage|emergency|disaster|vehicle|fleet|car interior|boat|marine|eco-friendly|chemical-free|linen|washroom requisite|flue|post-renovation|pre-handover/i,
    {
      family: 'restoration',
      featurePool: [
        'Combines urgent response thinking with practical recovery cleaning and staging support.',
        'Useful after water ingress, smoke residue, renovation works, or high-pressure operational resets.',
        'Scope can include deodorisation, residue removal, salvage-focused cleaning, and presentation recovery.',
        'Jobs are planned around drying, ventilation, access, and the condition of the affected materials.',
        'Eco-focused options are available where the job can be completed safely with lower-impact products.',
      ],
      issuePool: [
        'Secondary damage increases when residue, soot, moisture, or debris sits too long.',
        'Restoration work often needs staged visits rather than one pass.',
        'Clients need fast advice on what can be cleaned, what needs drying time, and what should be escalated.',
        'Large resets have to coordinate access, trades, and return-to-use deadlines.',
      ],
      processTitles: ['Assess the damage or recovery scope', 'Stabilise the affected areas', 'Clean and restore priority zones', 'Review next steps and re-entry timing'],
      priceRange: 'Restoration and emergency work is priced after scope review, urgency, and equipment needs are confirmed.',
      faqFocus: ['emergency timing', 'staged visits', 'odour or residue removal', 'eco-safe options'],
      cta: 'Request a restoration cleaning response',
    },
  ],
];

serviceKeywordProfiles.push(...extendedProfiles);

const defaultServiceProfile: ServiceProfile = {
  family: 'general-cleaning',
  featurePool: [
    'A practical cleaning scope built around hygiene, presentation, and reliable follow-through.',
    'Useful for homes, workplaces, and shared spaces that need more than a surface-level tidy.',
    'Products and methods are selected to suit the surfaces involved and the result required.',
    'Work can be booked as a standalone visit or folded into a broader service program.',
  ],
  issuePool: [
    'Build-up usually appears first in edges, touch points, and the areas people stop noticing every day.',
    'The right scope depends on traffic, moisture, access, and how quickly the space needs to be reused.',
    'Clients often need a clearer plan than a one-size-fits-all cleaning checklist can provide.',
  ],
  processTitles: ['Review the scope', 'Prepare the site', 'Carry out the clean', 'Check the result'],
  priceRange: 'Quotes are tailored to service scope, timing, access, and surface mix.',
  faqFocus: ['service scope', 'timing', 'products', 'how to book'],
  cta: 'Request a tailored cleaning quote',
};

function getServiceProfile(serviceName: string) {
  for (const [matcher, profile] of serviceKeywordProfiles) {
    if (matcher.test(serviceName)) {
      return profile;
    }
  }

  return defaultServiceProfile;
}

function getServiceAngle(serviceName: string) {
  if (/carpet|rug|upholstery|mattress/i.test(serviceName)) {
    return 'fibres that hold fine grit, humidity, allergens, and lingering odours';
  }
  if (/window|glass|skylight|solar/i.test(serviceName)) {
    return 'salt spray, hard-water spotting, and strong Darwin sun glare on glass and panels';
  }
  if (/office|commercial|retail|medical|school|hotel|restaurant/i.test(serviceName)) {
    return 'site presentation, hygiene confidence, and predictable service windows';
  }
  if (/flood|fire|smoke|water damage|restoration/i.test(serviceName)) {
    return 'fast stabilisation before secondary damage takes hold';
  }
  if (/crime|trauma|biohazard|mould|sewage/i.test(serviceName)) {
    return 'risk control, discretion, and a clear remediation sequence';
  }
  if (/end of lease|bond|move|vacate/i.test(serviceName)) {
    return 'inspection-ready detail and fewer handover surprises';
  }
  if (/pressure|soft washing|roof|gutter|facade|driveway|patio/i.test(serviceName)) {
    return 'exterior buildup from tropical storms, coastal salt, red dirt, and dry-season dust';
  }

  return 'Darwin homes and workplaces that need more than a surface-level clean';
}

function buildServiceIntro(service: ParsedService) {
  const openerOptions = [
    `${service.name} in Darwin usually starts with one problem: ${getServiceAngle(service.name)}.`,
    `Clients book ${service.name.toLowerCase()} when everyday cleaning no longer matches the condition of the space.`,
    `${service.name} works best when the scope is planned around the exact surfaces, access conditions, and downtime available.`,
    `In Darwin, ${service.name.toLowerCase()} needs to account for humidity, tropical residue, and the way dust or moisture settles into high-use areas.`,
  ];
  const opener = openerOptions[hashIndex(service.slug, openerOptions.length)];

  return `${opener} ${service.description} This service is delivered with a practical sequence, clear communication, and Darwin-specific maintenance advice so the result lasts beyond the first day.`;
}

function buildServiceProcess(service: ParsedService, profile: ServiceProfile): ProcessStep[] {
  return profile.processTitles.map((title, index) => ({
    title,
    description: [
      `We start by aligning the ${service.name.toLowerCase()} scope with the condition of the property and any access or timing limits.`,
      `Attention goes first to the areas where ${service.name.toLowerCase()} will have the biggest impact on hygiene, appearance, or compliance.`,
      `The service is completed with tools and products matched to the surfaces involved, not a one-product-fits-all approach.`,
      `Before finishing, we review the cleaned areas, note any follow-up items, and explain how to keep the result stable between visits.`,
    ][index],
  }));
}

function buildServiceFaqs(service: ParsedService): FaqItem[] {
  const serviceLower = service.name.toLowerCase();

  return [
    {
      question: `What is usually included in ${serviceLower}?`,
      answer: `${service.name} always starts with the visible problem areas, but the final scope depends on the property, access, and surface types involved. We typically include the main working zones, edges, touch points, and the detail work that clients usually expect from this service category. If the job needs add-ons such as windows, upholstery, pressure washing, or consumables, we flag that clearly before the visit starts.`,
    },
    {
      question: `How long does ${serviceLower} usually take in Darwin?`,
      answer: `Timing depends on the size of the area, the condition of the site, and whether the service is a maintenance visit or a corrective clean. Darwin jobs also vary with humidity, storm-season access, parking conditions, and access windows in apartments, offices, and managed buildings. We give a practical time estimate during quoting so clients know whether the visit suits same-day turnover, after-hours access, or a staged program.`,
    },
    {
      question: `Do you bring the equipment and products needed for ${serviceLower}?`,
      answer: `Yes. Our team arrives with the equipment and products required for the agreed scope, including specialist tools when the service calls for extraction, polishing, disinfection, or exterior treatment. The main reason we ask questions before booking is so the method matches the surface and does not create avoidable damage, slow drying, or an unfinished result.`,
    },
    {
      question: `When should I book ${serviceLower} instead of a lighter clean?`,
      answer: `This service makes sense when visible build-up, odour, staining, inspection pressure, or compliance expectations are already affecting the property. It is also the better option when a normal tidy-up would leave too many hidden issues behind, especially during wet-season humidity, build-up dust, or high-traffic turnover periods. If a lighter clean is enough, we would rather say that early and keep the scope sensible.`,
    },
  ];
}

function buildLandmarks(region: ParsedLocation['region'], seed: string) {
  const regionProfile = regionProfiles[region as keyof typeof regionProfiles];
  const pool = regionProfile.landmarkPool as ReadonlyArray<readonly [string, string]>;

  return pickRotating(seed, pool, 3).map(([name, type], index) => ({
    name,
    type,
    description: [
      `Common reference point for clients booking cleaning around ${name} and nearby surrounding blocks.`,
      `${name} influences access, presentation expectations, and job timing in this part of Darwin.`,
      `Useful local marker when describing nearby homes, offices, or managed properties in quoting calls.`,
    ][index],
  }));
}

function buildGeo(region: ParsedLocation['region'], index: number) {
  const profile = regionProfiles[region as keyof typeof regionProfiles];
  const offsetLat = ((index % 5) - 2) * 0.0065;
  const offsetLng = ((index % 4) - 1.5) * 0.008;

  return {
    lat: Number((profile.lat + offsetLat).toFixed(6)),
    lng: Number((profile.lng + offsetLng).toFixed(6)),
  };
}

function buildLocationFaqs(location: ParsedLocation, neighborhoods: string[], landmarks: Landmark[]): FaqItem[] {
  const primaryLandmark = landmarks[0]?.name ?? `${location.name} local facilities`;
  const neighborhoodsText = neighborhoods.join(', ');

  return [
    {
      question: `Which parts of ${location.name} do you cover?`,
      answer: `We cover all of ${location.name} and nearby pockets such as ${neighborhoodsText}. That includes homes, apartments, offices, short-stay properties, and managed sites that fall under the ${location.postcode} ZIP cluster. If access is shared or time-sensitive, we can schedule around building rules, concierge windows, and after-hours requirements.`,
    },
    {
      question: `What cleaning conditions are most common in ${location.name}?`,
      answer: `${location.name} jobs often involve a mix of humidity, tracked-in grit, and the presentation standards that come with tropical Darwin living. Depending on the exact location, that can mean storm residue at entries, salt film on trim, hard-water spotting on glass, or heavy use around shared lobbies. We adapt the service plan so it suits the actual property style instead of assuming every Darwin suburb behaves the same way.`,
    },
    {
      question: `Do you clean around landmarks like ${primaryLandmark}?`,
      answer: `Yes. Work near ${primaryLandmark} often comes with tighter parking, guest movement, strata rules, or trading-hour restrictions, and we plan around those details before the visit starts. That matters because a technically simple clean can become inefficient if lift bookings, loading zones, or key collection are not handled properly.`,
    },
    {
      question: `Can ${location.name} bookings be combined with nearby locations?`,
      answer: `They can. Many clients in ${location.name} ask us to coordinate work across nearby addresses, particularly when they manage multiple short-stay units, offices, or rental properties in the same part of Darwin. Combining nearby jobs can reduce downtime, simplify access planning, and make recurring service more practical.`,
    },
  ];
}

export function parseServicesMarkdown() {
  const source = readMarkdown('services-list.md');
  const lines = source.split(/\r?\n/);
  const services: ParsedService[] = [];
  let currentCategory = 'General Cleaning';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      continue;
    }

    const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
    if (!match) {
      continue;
    }

    const [, name, description] = match;
    services.push({
      name: name.trim(),
      description: description.trim(),
      category: currentCategory,
      slug: slugify(name.trim()),
    });
  }

  return services;
}

export function parseLocationsMarkdown() {
  const source = readMarkdown('service-areas.md');
  const lines = source.split(/\r?\n/);
  const locations: ParsedLocation[] = [];
  let currentRegion = 'Darwin Service Area';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentRegion = line.replace('## ', '').trim();
      continue;
    }

    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*(\d{4,5})\s*\|\s*([^|]+?)\s*\|$/);
    if (!match || match[1].trim() === 'Suburb / Locality') {
      continue;
    }

    const [, name, postcode] = match;
    locations.push({
      name: name.trim(),
      postcode: postcode.trim(),
      region: currentRegion,
      slug: slugify(name.trim()),
    });
  }

  return locations;
}

export function buildServices(): ServiceRecord[] {
  return parseServicesMarkdown().map((service) => {
    const profile = getServiceProfile(service.name);

    return {
      slug: service.slug,
      name: service.name,
      category: service.category,
      description: service.description,
      metaDescription: clampText(
        `${service.name} in Darwin with practical scope, reliable standards, and clear quoting for homes, facilities, and commercial sites.`,
      ),
    heroHeading: `${service.name} in Darwin, Australia`,
      intro: buildServiceIntro(service),
      features: pickRotating(service.slug, profile.featurePool, 4),
      process: buildServiceProcess(service, profile),
      faqs: buildServiceFaqs(service),
      priceRange: profile.priceRange,
      commonIssues: pickRotating(`${service.slug}-issues`, profile.issuePool, 4),
      cta: profile.cta,
      image: {
        src: pickServiceImage(service, profile.family),
        alt: `${service.name} team member completing a professional clean in Darwin`,
        width: generatedImageSize.width,
        height: generatedImageSize.height,
      },
    };
  });
}

export function buildLocations(): LocationRecord[] {
  const parsed = parseLocationsMarkdown();

  return parsed.map((location, index, all) => {
    const regionProfile = regionProfiles[location.region as keyof typeof regionProfiles];
    const sameRegion = all.filter((item) => item.region === location.region);
    const localIndex = sameRegion.findIndex((item) => item.slug === location.slug);
    const previous = sameRegion[(localIndex - 1 + sameRegion.length) % sameRegion.length];
    const next = sameRegion[(localIndex + 1) % sameRegion.length];
    const neighborhoods = [location.name, previous.name, next.name].filter(
      (name, currentIndex, values) => values.indexOf(name) === currentIndex,
    );
    const landmarks = buildLandmarks(location.region, location.slug);
    const angle = regionProfile.localAngles[hashIndex(location.slug, regionProfile.localAngles.length)];

    return {
      slug: location.slug,
      name: location.name,
      county: regionProfile.county,
      region: location.region,
      zip: [location.postcode],
      neighborhoods,
      landmarks,
      geo: buildGeo(location.region, index),
      soilType: regionProfile.soilType,
      waterRestrictions: regionProfile.waterRestrictions,
      localInsight: `${location.name} work is often shaped by ${angle}, which is why visits are planned around property type, traffic flow, and how quickly surfaces pick up residue again after cleaning.`,
      commonYardSize: regionProfile.commonYardSize,
      hoaNotes:
        'Many local properties operate with HOA, condo association, or building-management expectations around access, quiet hours, parking, bins, and common-area presentation, so these details are confirmed before the visit.',
      intro: `${location.name} sits inside the ${location.postcode} service cluster and tends to need cleaning plans that respect ${angle}. We support homes, apartments, businesses, and shared properties here with practical scopes that suit local access patterns, building styles, and Darwin wet-season humidity plus dry-season dust.`,
      faqs: buildLocationFaqs(location, neighborhoods, landmarks),
      testimonial: {
        quote: `We needed a cleaner who understood the pace of ${location.name} properties and the team delivered exactly that. Communication was easy, the finish was consistent, and the presentation around ${landmarks[0]?.name} was handled really well.`,
        name: `${location.name} client`,
        role: `Property contact in ${location.name}`,
      },
      image: {
        src: pickLocationImage(location.slug),
        alt: `${location.name} service area in Darwin with bright, clean exterior detail`,
        width: generatedImageSize.width,
        height: generatedImageSize.height,
      },
    };
  });
}

export function getRelatedSlugs(currentSlug: string, slugs: string[], count = 4) {
  const available = slugs.filter((slug) => slug !== currentSlug);
  return pickRotating(currentSlug, available, Math.min(count, available.length));
}

export function buildLocationAwareFaqs(
  service: ServiceRecord,
  location: LocationRecord,
  pricingNote: string,
): FaqItem[] {
  const serviceLower = service.name.toLowerCase();
  const areaName = location.name;
  const landmarkName = location.landmarks[0]?.name ?? areaName;

  return [
    {
      question: `How does ${serviceLower} usually work in ${areaName}?`,
      answer: `In ${areaName}, ${serviceLower} is planned around the property type first and the access conditions second. That means we consider whether the job sits near ${landmarkName}, inside a managed building, or on a site with tight turnover times before the tools even come out. The result is a cleaner scope that feels realistic for the location rather than a generic booking template.`,
    },
    {
      question: `What local factors affect ${serviceLower} in ${areaName}?`,
      answer: `${location.localInsight} For this service, that usually influences how much detail is required, whether a follow-up cycle is sensible, and how the schedule should sit around Darwin wet-season humidity, build-up heat, and dry-season dust. We explain those factors upfront so the quote and the final finish stay aligned.`,
    },
    {
      question: `Can you coordinate ${serviceLower} with access rules in ${areaName}?`,
      answer: `Yes. ${areaName} jobs often involve parking limits, lift bookings, HOA expectations, or business-hour restrictions, and those details are part of the booking conversation. Handling that early matters because it keeps the visit efficient and avoids losing time on site to avoidable access issues.`,
    },
    {
      question: `What should I budget for ${serviceLower} in ${areaName}?`,
      answer: `${pricingNote} We keep quotes transparent about what is driving the price, whether that is surface condition, access, urgency, equipment, or add-on work nearby. That makes it easier to compare options without being surprised by vague allowances after the job has started.`,
    },
  ];
}
