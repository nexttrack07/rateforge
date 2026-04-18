import { asc, eq } from "drizzle-orm";
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
