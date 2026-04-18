/**
 * SEO utilities for Rateforge
 * Generates meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */

export const SITE_NAME = "Rateforge";
export const SITE_URL = "https://rateforge.ai";
export const SITE_DESCRIPTION =
	"Compare AI model pricing across platforms. Find the cheapest way to run image, video, and text generation models.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOConfig {
	title: string;
	description: string;
	canonical?: string;
	ogImage?: string;
	ogType?: "website" | "article" | "product";
	noindex?: boolean;
	keywords?: string[];
}

/**
 * Generate meta tags for a page
 */
export function createSEOMeta(config: SEOConfig) {
	const fullTitle =
		config.title === SITE_NAME
			? config.title
			: `${config.title} | ${SITE_NAME}`;
	const canonical = config.canonical || SITE_URL;
	const ogImage = config.ogImage || DEFAULT_OG_IMAGE;

	const meta: Array<Record<string, string>> = [
		// Basic meta
		{ title: fullTitle },
		{ name: "description", content: config.description },

		// Open Graph
		{ property: "og:title", content: fullTitle },
		{ property: "og:description", content: config.description },
		{ property: "og:type", content: config.ogType || "website" },
		{ property: "og:url", content: canonical },
		{ property: "og:image", content: ogImage },
		{ property: "og:site_name", content: SITE_NAME },

		// Twitter Card
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: fullTitle },
		{ name: "twitter:description", content: config.description },
		{ name: "twitter:image", content: ogImage },
	];

	// Add keywords if provided
	if (config.keywords?.length) {
		meta.push({ name: "keywords", content: config.keywords.join(", ") });
	}

	// Add noindex if specified
	if (config.noindex) {
		meta.push({ name: "robots", content: "noindex, nofollow" });
	}

	return meta;
}

/**
 * Generate JSON-LD Organization schema
 */
export function createOrganizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE_NAME,
		url: SITE_URL,
		logo: `${SITE_URL}/logo.png`,
		description: SITE_DESCRIPTION,
		sameAs: [],
	};
}

/**
 * Generate JSON-LD WebSite schema with search action
 */
export function createWebsiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${SITE_URL}/compare?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Generate JSON-LD BreadcrumbList schema
 */
export function createBreadcrumbSchema(
	items: Array<{ name: string; url: string }>,
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

/**
 * Generate JSON-LD FAQPage schema
 */
export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * Generate JSON-LD Product schema for a platform/model
 */
export function createProductSchema(config: {
	name: string;
	description: string;
	url: string;
	image?: string;
	brand?: string;
	offers?: Array<{
		name: string;
		price: string;
		priceCurrency?: string;
	}>;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: config.name,
		description: config.description,
		url: config.url,
		image: config.image,
		brand: config.brand
			? {
					"@type": "Brand",
					name: config.brand,
				}
			: undefined,
		offers: config.offers?.map((offer) => ({
			"@type": "Offer",
			name: offer.name,
			price: offer.price,
			priceCurrency: offer.priceCurrency || "USD",
		})),
	};
}

/**
 * Generate JSON-LD SoftwareApplication schema for AI models
 */
export function createSoftwareSchema(config: {
	name: string;
	description: string;
	url: string;
	provider: string;
	category: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: config.name,
		description: config.description,
		url: config.url,
		applicationCategory: config.category,
		author: {
			"@type": "Organization",
			name: config.provider,
		},
	};
}

/**
 * Serialize JSON-LD to script tag content
 */
export function serializeJsonLd(schema: object | object[]): string {
	return JSON.stringify(schema);
}
