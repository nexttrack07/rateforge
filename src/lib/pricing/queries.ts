import { asc, eq, ne, sql } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import {
	modelPricing,
	models,
	platformModelPricing,
	platformPlans,
	platforms,
	providers,
} from "@/db/schema";

export type ModelCategory = "image" | "video" | "text";
export type PricingSurface = "api" | "platform";

export type PricingEntry = {
	id: string;
	modelName: string;
	providerName: string;
	category: ModelCategory;
	surface: PricingSurface;
	platformName: string;
	planName: string | null;
	unitLabel: string;
	priceLabel: string;
	priceValue: number;
	resolution: string | null;
	audioIncluded: boolean;
	lastUpdatedLabel: string;
	notes: string | null;
};

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
	if (diffHours < 24) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	return `${Math.floor(diffDays / 30)} months ago`;
}

function formatPriceLabel(priceUsd: number): string {
	if (priceUsd >= 1) {
		return `$${priceUsd.toFixed(2)}`;
	}
	return `$${priceUsd.toFixed(priceUsd < 0.01 ? 4 : 2)}`;
}

function formatUnitLabel(priceType: string): string {
	switch (priceType) {
		case "per_second":
			return "per second";
		case "per_image":
			return "per image";
		case "per_1m_tokens":
			return "per 1M tokens";
		default:
			return "per unit";
	}
}

export const getPricingEntries = createServerFn({ method: "GET" }).handler(
	async () => {
		if (!db) {
			// Return empty if no DB configured (fallback for dev)
			return { entries: [] as PricingEntry[], hasData: false };
		}

		const entries: PricingEntry[] = [];

		// Fetch API pricing (direct model pricing)
		const apiRows = await db
			.select({
				id: modelPricing.id,
				modelName: models.name,
				providerName: providers.name,
				category: models.type,
				priceType: modelPricing.priceType,
				priceUsd: modelPricing.priceUsd,
				resolution: modelPricing.resolution,
				audioIncluded: modelPricing.audioIncluded,
				updatedAt: modelPricing.updatedAt,
			})
			.from(modelPricing)
			.innerJoin(models, eq(modelPricing.modelId, models.id))
			.innerJoin(providers, eq(models.providerId, providers.id))
			.orderBy(asc(modelPricing.priceUsd));

		for (const row of apiRows) {
			const priceValue = Number(row.priceUsd);
			entries.push({
				id: row.id,
				modelName: row.modelName,
				providerName: row.providerName,
				category: row.category as ModelCategory,
				surface: "api",
				platformName: `${row.providerName} API`,
				planName: null,
				unitLabel: formatUnitLabel(row.priceType),
				priceLabel: formatPriceLabel(priceValue),
				priceValue,
				resolution: row.resolution,
				audioIncluded: row.audioIncluded,
				lastUpdatedLabel: formatTimeAgo(row.updatedAt),
				notes: null,
			});
		}

		// Fetch platform pricing
		const platformRows = await db
			.select({
				id: platformModelPricing.id,
				modelName: models.name,
				providerName: providers.name,
				category: models.type,
				platformName: platforms.name,
				planName: platformPlans.name,
				planCredits: platformPlans.credits,
				planPriceMonthly: platformPlans.priceMonthly,
				creditsPerGen: platformModelPricing.creditsPerGen,
				priceUsd: platformModelPricing.priceUsd,
				resolution: platformModelPricing.resolution,
				notes: platformModelPricing.notes,
				updatedAt: platformModelPricing.updatedAt,
			})
			.from(platformModelPricing)
			.innerJoin(platforms, eq(platformModelPricing.platformId, platforms.id))
			.innerJoin(platformPlans, eq(platformModelPricing.platformPlanId, platformPlans.id))
			.innerJoin(models, eq(platformModelPricing.modelId, models.id))
			.innerJoin(providers, eq(models.providerId, providers.id))
			.orderBy(asc(platformModelPricing.priceUsd));

		for (const row of platformRows) {
			// Calculate effective price per generation
			let priceValue = row.priceUsd ? Number(row.priceUsd) : 0;

			// If no direct price, calculate from credits
			if (!priceValue && row.creditsPerGen && row.planCredits && row.planPriceMonthly) {
				const monthlyPrice = Number(row.planPriceMonthly);
				const creditsIncluded = row.planCredits;
				const creditsPerGen = Number(row.creditsPerGen);
				priceValue = (monthlyPrice / creditsIncluded) * creditsPerGen;
			}

			entries.push({
				id: row.id,
				modelName: row.modelName,
				providerName: row.providerName,
				category: row.category as ModelCategory,
				surface: "platform",
				platformName: row.platformName,
				planName: row.planName,
				unitLabel: row.category === "video" ? "per second" : "per image",
				priceLabel: formatPriceLabel(priceValue),
				priceValue,
				resolution: row.resolution,
				audioIncluded: false, // Platform pricing doesn't track this yet
				lastUpdatedLabel: formatTimeAgo(row.updatedAt),
				notes: row.notes,
			});
		}

		// Sort by price (lowest first)
		entries.sort((a, b) => a.priceValue - b.priceValue);

		return { entries, hasData: true };
	},
);

// Get unique filter options from the database
export const getPricingFilterOptions = createServerFn({ method: "GET" }).handler(
	async () => {
		if (!db) {
			return { categories: [], platforms: [], resolutions: [] };
		}

		const categoryRows = await db
			.selectDistinct({ type: models.type })
			.from(models)
			.orderBy(asc(models.type));

		const platformRows = await db
			.select({ name: platforms.name, slug: platforms.slug })
			.from(platforms)
			.orderBy(asc(platforms.name));

		// Get unique resolution values from both pricing tables
		const apiResolutions = await db
			.selectDistinct({ resolution: modelPricing.resolution })
			.from(modelPricing);

		const platformResolutions = await db
			.selectDistinct({ resolution: platformModelPricing.resolution })
			.from(platformModelPricing);

		// Combine and dedupe actual resolution values
		const allResolutions = new Set<string>();
		for (const r of apiResolutions) {
			if (r.resolution) allResolutions.add(r.resolution);
		}
		for (const r of platformResolutions) {
			if (r.resolution) allResolutions.add(r.resolution);
		}

		// Sort resolutions logically (numeric-aware)
		const sortedResolutions = Array.from(allResolutions).sort((a, b) => {
			// Extract numeric part for comparison
			const numA = parseInt(a.replace(/\D/g, "")) || 0;
			const numB = parseInt(b.replace(/\D/g, "")) || 0;
			return numA - numB;
		});

		return {
			categories: categoryRows.map((r) => r.type),
			platforms: platformRows,
			resolutions: sortedResolutions,
		};
	},
);

// ============================================================================
// Alternatives Page Queries
// ============================================================================

export type PlatformWithMeta = {
	id: string;
	name: string;
	slug: string;
	website: string | null;
	shortDescription: string | null;
	pros: string[];
	cons: string[];
};

export type AlternativeComparison = {
	platform: PlatformWithMeta;
	lowestPrice: number | null;
	modelCount: number;
	categories: ModelCategory[];
};

// Get a single platform by slug with metadata
export const getPlatformBySlug = createServerFn({ method: "GET" }).handler(
	async (ctx: { data: string }) => {
		const slug = ctx.data;
		if (!db) return null;

		const rows = await db
			.select({
				id: platforms.id,
				name: platforms.name,
				slug: platforms.slug,
				website: platforms.website,
				shortDescription: platforms.shortDescription,
				pros: platforms.pros,
				cons: platforms.cons,
			})
			.from(platforms)
			.where(eq(platforms.slug, slug))
			.limit(1);

		if (rows.length === 0) return null;

		const row = rows[0];
		return {
			...row,
			pros: (row.pros as string[]) || [],
			cons: (row.cons as string[]) || [],
		} as PlatformWithMeta;
	},
);

// Get all platforms (for listing)
export const getAllPlatforms = createServerFn({ method: "GET" }).handler(
	async () => {
		if (!db) return [];

		const rows = await db
			.select({
				id: platforms.id,
				name: platforms.name,
				slug: platforms.slug,
				website: platforms.website,
				shortDescription: platforms.shortDescription,
				pros: platforms.pros,
				cons: platforms.cons,
			})
			.from(platforms)
			.orderBy(asc(platforms.name));

		return rows.map((row) => ({
			...row,
			pros: (row.pros as string[]) || [],
			cons: (row.cons as string[]) || [],
		})) as PlatformWithMeta[];
	},
);

// Get alternatives for a platform (all other platforms with comparison data)
export const getAlternatives = createServerFn({ method: "GET" }).handler(
	async (ctx: { data: string }) => {
		const platformSlug = ctx.data;
		if (!db) return [];

		// Get all platforms except the target
		const otherPlatforms = await db
			.select({
				id: platforms.id,
				name: platforms.name,
				slug: platforms.slug,
				website: platforms.website,
				shortDescription: platforms.shortDescription,
				pros: platforms.pros,
				cons: platforms.cons,
			})
			.from(platforms)
			.where(ne(platforms.slug, platformSlug))
			.orderBy(asc(platforms.name));

		// Get pricing stats for each platform
		const alternatives: AlternativeComparison[] = [];

		for (const platform of otherPlatforms) {
			// Get pricing data for this platform
			const pricingRows = await db
				.select({
					priceUsd: platformModelPricing.priceUsd,
					creditsPerGen: platformModelPricing.creditsPerGen,
					planCredits: platformPlans.credits,
					planPriceMonthly: platformPlans.priceMonthly,
					category: models.type,
				})
				.from(platformModelPricing)
				.innerJoin(platforms, eq(platformModelPricing.platformId, platforms.id))
				.innerJoin(platformPlans, eq(platformModelPricing.platformPlanId, platformPlans.id))
				.innerJoin(models, eq(platformModelPricing.modelId, models.id))
				.where(eq(platforms.id, platform.id));

			if (pricingRows.length === 0) continue;

			// Calculate effective prices and find lowest
			const prices: number[] = [];
			const categories = new Set<ModelCategory>();

			for (const row of pricingRows) {
				categories.add(row.category as ModelCategory);

				let price = row.priceUsd ? Number(row.priceUsd) : 0;
				if (!price && row.creditsPerGen && row.planCredits && row.planPriceMonthly) {
					const monthlyPrice = Number(row.planPriceMonthly);
					const creditsIncluded = row.planCredits;
					const creditsPerGen = Number(row.creditsPerGen);
					price = (monthlyPrice / creditsIncluded) * creditsPerGen;
				}
				if (price > 0) prices.push(price);
			}

			alternatives.push({
				platform: {
					...platform,
					pros: (platform.pros as string[]) || [],
					cons: (platform.cons as string[]) || [],
				},
				lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
				modelCount: pricingRows.length,
				categories: Array.from(categories),
			});
		}

		// Sort by lowest price
		alternatives.sort((a, b) => {
			if (a.lowestPrice === null) return 1;
			if (b.lowestPrice === null) return -1;
			return a.lowestPrice - b.lowestPrice;
		});

		return alternatives;
	},
);

// Get pricing entries for a specific platform
export const getPlatformPricing = createServerFn({ method: "GET" }).handler(
	async (ctx: { data: string }) => {
		const platformSlug = ctx.data;
		if (!db) return [];

		const rows = await db
			.select({
				id: platformModelPricing.id,
				modelName: models.name,
				providerName: providers.name,
				category: models.type,
				platformName: platforms.name,
				planName: platformPlans.name,
				planCredits: platformPlans.credits,
				planPriceMonthly: platformPlans.priceMonthly,
				creditsPerGen: platformModelPricing.creditsPerGen,
				priceUsd: platformModelPricing.priceUsd,
				resolution: platformModelPricing.resolution,
				notes: platformModelPricing.notes,
				updatedAt: platformModelPricing.updatedAt,
			})
			.from(platformModelPricing)
			.innerJoin(platforms, eq(platformModelPricing.platformId, platforms.id))
			.innerJoin(platformPlans, eq(platformModelPricing.platformPlanId, platformPlans.id))
			.innerJoin(models, eq(platformModelPricing.modelId, models.id))
			.innerJoin(providers, eq(models.providerId, providers.id))
			.where(eq(platforms.slug, platformSlug))
			.orderBy(asc(platformModelPricing.priceUsd));

		const entries: PricingEntry[] = [];

		for (const row of rows) {
			let priceValue = row.priceUsd ? Number(row.priceUsd) : 0;

			if (!priceValue && row.creditsPerGen && row.planCredits && row.planPriceMonthly) {
				const monthlyPrice = Number(row.planPriceMonthly);
				const creditsIncluded = row.planCredits;
				const creditsPerGen = Number(row.creditsPerGen);
				priceValue = (monthlyPrice / creditsIncluded) * creditsPerGen;
			}

			entries.push({
				id: row.id,
				modelName: row.modelName,
				providerName: row.providerName,
				category: row.category as ModelCategory,
				surface: "platform",
				platformName: row.platformName,
				planName: row.planName,
				unitLabel: row.category === "video" ? "per second" : "per image",
				priceLabel: formatPriceLabel(priceValue),
				priceValue,
				resolution: row.resolution,
				audioIncluded: false,
				lastUpdatedLabel: formatTimeAgo(row.updatedAt),
				notes: row.notes,
			});
		}

		entries.sort((a, b) => a.priceValue - b.priceValue);
		return entries;
	},
);
