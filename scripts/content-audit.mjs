import { combinations } from '../src/data/combinations.ts';
import { getCombinationPageAuditText, getServicePageAuditText, wordCount } from '../src/data/page-content.ts';
import { getLocationBySlug } from '../src/data/locations.ts';
import { getServiceBySlug, services } from '../src/data/services.ts';

function normalizeSentence(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(normalizeSentence)
    .filter(Boolean);
}

function sentenceUniqueness(a, b) {
  const aSet = new Set(splitSentences(a));
  const bSet = new Set(splitSentences(b));
  let shared = 0;

  for (const sentence of aSet) {
    if (bSet.has(sentence)) {
      shared += 1;
    }
  }

  return 1 - shared / Math.max(aSet.size || 1, bSet.size || 1);
}

const serviceWordCounts = services.map((service) => ({
  slug: service.slug,
  name: service.name,
  words: wordCount(getServicePageAuditText(service)),
}));

const serviceFailures = serviceWordCounts.filter((entry) => entry.words < 800);

const uniquenessFailures = [];

for (const service of services) {
  const cluster = combinations
    .filter((entry) => entry.serviceSlug === service.slug)
    .map((entry) => {
      const location = getLocationBySlug(entry.locationSlug);
      const serviceRecord = getServiceBySlug(entry.serviceSlug);

      if (!location || !serviceRecord) {
        throw new Error(`Missing data for ${entry.slug}`);
      }

      return {
        slug: entry.slug,
        location: location.name,
        text: getCombinationPageAuditText(serviceRecord, location, entry),
      };
    });

  for (let index = 0; index < cluster.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < cluster.length; compareIndex += 1) {
      const left = cluster[index];
      const right = cluster[compareIndex];
      const uniqueness = sentenceUniqueness(left.text, right.text);

      if (uniqueness < 0.4) {
        uniquenessFailures.push({
          service: service.name,
          left: left.location,
          right: right.location,
          uniqueness: Number(uniqueness.toFixed(3)),
        });
      }
    }
  }
}

const minWordCount = Math.min(...serviceWordCounts.map((entry) => entry.words));
const lowestWordCount = serviceWordCounts.find((entry) => entry.words === minWordCount);

console.log(JSON.stringify({
  servicePagesChecked: serviceWordCounts.length,
  combinationPagesChecked: combinations.length,
  minServiceWordCount: minWordCount,
  lowestWordCountPage: lowestWordCount,
  serviceWordCountFailures: serviceFailures.slice(0, 20),
  serviceWordCountFailureCount: serviceFailures.length,
  uniquenessFailureCount: uniquenessFailures.length,
  uniquenessFailureSamples: uniquenessFailures.slice(0, 20),
}, null, 2));

if (serviceFailures.length || uniquenessFailures.length) {
  process.exitCode = 1;
}
