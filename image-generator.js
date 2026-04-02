/**
 * Image Generator & Manager
 * Uses Unsplash API for high-quality trekking images
 * Falls back to placeholder API if needed
 */

// Unsplash API configuration
const UNSPLASH_API_KEY = 'demo'; // Replace with your Unsplash API key from https://unsplash.com/developers
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/photos/random';

// Image mapping for each trek/region with search terms
const imageMapping = {
    everest: {
        searchTerms: ['everest base camp mountain', 'himalaya trek', 'mount everest'],
        defaultSize: '1200x800',
        description: 'Everest Region'
    },
    annapurna: {
        searchTerms: ['annapurna circuit', 'annapurna mountain range', 'himalaya annapurna'],
        defaultSize: '1200x800',
        description: 'Annapurna Region'
    },
    langtang: {
        searchTerms: ['langtang valley trek', 'langtang mountains', 'himalaya forest'],
        defaultSize: '1200x800',
        description: 'Langtang Region'
    },
    manaslu: {
        searchTerms: ['manaslu circuit trek', 'manaslu mountain', 'nepal trek'],
        defaultSize: '1200x800',
        description: 'Manaslu Region'
    },
    dolpa: {
        searchTerms: ['dolpa region nepal', 'shey phoksundo lake', 'remote nepal trek'],
        defaultSize: '1200x800',
        description: 'Dolpa Region'
    },
    mustang: {
        searchTerms: ['upper mustang trek', 'mustang nepal', 'dry mountain range'],
        defaultSize: '1200x800',
        description: 'Mustang Region'
    },
    makalu: {
        searchTerms: ['makalu base camp', 'makalu mountain', 'high altitude trek'],
        defaultSize: '1200x800',
        description: 'Makalu Region'
    },
    kanchenjunga: {
        searchTerms: ['kanchenjunga trek', 'kanchenjunga base camp', 'third highest mountain'],
        defaultSize: '1200x800',
        description: 'Kanchenjunga Region'
    }
};

/**
 * Generate optimized image URL with smart sizing
 * @param {string} imageType - Type of image (region/trek/blog)
 * @param {number} width - Desired width
 * @param {string} region - Region identifier
 */
function generateImageUrl(imageType, width = 1200, region = 'everest') {
    const cleanRegion = encodeURIComponent(region.replace(/\s+/g, '+'));

    // Free no-key Unsplash Source endpoint
    const sourceUrl = `https://source.unsplash.com/featured/${width}x${Math.round(width * 0.66)}?${cleanRegion},trekking,himalaya`;

    // If we have a real key, prefer this with more stable API
    if (UNSPLASH_API_KEY && UNSPLASH_API_KEY !== 'demo') {
        const mapping = imageMapping[region] || imageMapping.everest;
        const term = mapping.searchTerms[Math.floor(Math.random() * mapping.searchTerms.length)];
        return `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(term)}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`;
    }

    // Fallback to format/optimize via weserv
    const encoded = encodeURIComponent(sourceUrl);
    return `https://images.weserv.nl/?url=${encoded}&w=${width}&fit=inside&output=webp&q=80&auto=format`;
}


/**
 * Fetch image from Unsplash API with fallback
 * @param {string} region - Region identifier
 * @param {number} width - Image width
 */
async function fetchUnsplashImage(region, width = 1200) {
    try {
        if (UNSPLASH_API_KEY === 'demo') {
            console.warn('Unsplash API key not configured. Using placeholder.');
            return generateImageUrl('trek', width, region);
        }

        const mapping = imageMapping[region] || imageMapping.everest;
        const searchTerm = mapping.searchTerms[Math.floor(Math.random() * mapping.searchTerms.length)];

        const response = await fetch(
            `${UNSPLASH_BASE_URL}?query=${encodeURIComponent(searchTerm)}&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
        );

        if (!response.ok) throw new Error('Unsplash API error');

        const data = await response.json();
        const imageUrl = data.urls.regular;

        // Optimize with weserv.nl
        const encoded = encodeURIComponent(imageUrl);
        return `https://images.weserv.nl/?url=${encoded}&w=${width}&fit=inside&output=webp&q=80&auto=format`;
    } catch (error) {
        console.warn('Failed to fetch Unsplash image, using placeholder:', error);
        return generateImageUrl('trek', width, region);
    }
}

/**
 * Generate multiple sized responsive images
 * @param {string} region - Region identifier
 * @param {object} sizes - Object with size configurations {small: 400, medium: 800, large: 1200}
 */
function generateResponsiveImages(region, sizes = { small: 400, medium: 800, large: 1200 }) {
    const images = {};
    for (const [key, width] of Object.entries(sizes)) {
        images[key] = generateImageUrl('trek', width, region);
    }
    return images;
}

/**
 * Generate srcset string for responsive images
 * @param {string} region - Region identifier
 * @param {array} widths - Array of widths e.g. [400, 800, 1200]
 */
function generateSrcset(region, widths = [400, 800, 1200]) {
    return widths
        .map(width => `${generateImageUrl('trek', width, region)} ${width}w`)
        .join(', ');
}

// Export for use in HTML/JS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateImageUrl,
        fetchUnsplashImage,
        generateResponsiveImages,
        generateSrcset,
        imageMapping
    };
}