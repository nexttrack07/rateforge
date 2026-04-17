import { asc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import {
	modelPricing,
	models,
	platformModelPricing,
	platformPlans,
	platforms,
	pricingHistory,
	providers,
} from "@/db/schema";

function requireDb() {
	if (!db) {
		throw new Error("DATABASE_URL is not configured.");
	}

	return db;
}

export const getAdminProviders = createServerFn({ method: "GET" }).handler(
	async () => {
		const database = requireDb();

		const rows = await database
			.select({
				id: providers.id,
				name: providers.name,
				slug: providers.slug,
				website: providers.website,
				logoUrl: providers.logoUrl,
				createdAt: providers.createdAt,
			})
			.from(providers)
			.orderBy(asc(providers.name));

		return rows;
	},
);

export const getAdminModels = createServerFn({ method: "GET" }).handler(
	async () => {
		const database = requireDb();

		const rows = await database
			.select({
				id: models.id,
				name: models.name,
				slug: models.slug,
				type: models.type,
				description: models.description,
				isActive: models.isActive,
				launchedAt: models.launchedAt,
				providerName: providers.name,
				providerSlug: providers.slug,
			})
			.from(models)
			.innerJoin(providers, eq(models.providerId, providers.id))
			.orderBy(asc(models.type), asc(models.name));

		const providerOptions = await database
			.select({
				id: providers.id,
				name: providers.name,
				slug: providers.slug,
			})
			.from(providers)
			.orderBy(asc(providers.name));

		return {
			models: rows,
			providers: providerOptions,
		};
	},
);

export const getAdminPlatforms = createServerFn({ method: "GET" }).handler(
	async () => {
		const database = requireDb();

		const platformRows = await database
			.select({
				id: platforms.id,
				name: platforms.name,
				slug: platforms.slug,
				website: platforms.website,
				pricingUrl: platforms.pricingUrl,
				affiliateUrl: platforms.affiliateUrl,
				affiliateCommission: platforms.affiliateCommission,
			})
			.from(platforms)
			.orderBy(asc(platforms.name));

		const planRows = await database
			.select({
				id: platformPlans.id,
				name: platformPlans.name,
				platformId: platformPlans.platformId,
				platformName: platforms.name,
				priceMonthly: platformPlans.priceMonthly,
				priceAnnual: platformPlans.priceAnnual,
				credits: platformPlans.credits,
				currency: platformPlans.currency,
			})
			.from(platformPlans)
			.innerJoin(platforms, eq(platformPlans.platformId, platforms.id))
			.orderBy(asc(platforms.name), asc(platformPlans.name));

		return {
			platforms: platformRows,
			plans: planRows,
		};
	},
);

export const getAdminPricing = createServerFn({ method: "GET" }).handler(
	async () => {
		const database = requireDb();

		const apiPricingRows = await database
			.select({
				id: modelPricing.id,
				modelName: models.name,
				modelSlug: models.slug,
				priceType: modelPricing.priceType,
				resolution: modelPricing.resolution,
				audioIncluded: modelPricing.audioIncluded,
				priceUsd: modelPricing.priceUsd,
				sourceUrl: modelPricing.sourceUrl,
				updatedAt: modelPricing.updatedAt,
			})
			.from(modelPricing)
			.innerJoin(models, eq(modelPricing.modelId, models.id))
			.orderBy(asc(models.name), asc(modelPricing.priceType));

		const platformPricingRows = await database
			.select({
				id: platformModelPricing.id,
				platformId: platformModelPricing.platformId,
				platformPlanId: platformModelPricing.platformPlanId,
				platformName: platforms.name,
				planName: platformPlans.name,
				modelName: models.name,
				creditsPerGen: platformModelPricing.creditsPerGen,
				priceUsd: platformModelPricing.priceUsd,
				resolution: platformModelPricing.resolution,
				notes: platformModelPricing.notes,
				updatedAt: platformModelPricing.updatedAt,
			})
			.from(platformModelPricing)
			.innerJoin(platforms, eq(platformModelPricing.platformId, platforms.id))
			.innerJoin(
				platformPlans,
				eq(platformModelPricing.platformPlanId, platformPlans.id),
			)
			.innerJoin(models, eq(platformModelPricing.modelId, models.id))
			.orderBy(asc(platforms.name), asc(platformPlans.name), asc(models.name));

		const historyRows = await database
			.select({
				id: pricingHistory.id,
				tableName: pricingHistory.tableName,
				fieldName: pricingHistory.fieldName,
				oldValue: pricingHistory.oldValue,
				newValue: pricingHistory.newValue,
				changedAt: pricingHistory.changedAt,
			})
			.from(pricingHistory)
			.orderBy(asc(pricingHistory.tableName), asc(pricingHistory.fieldName));

		return {
			apiPricing: apiPricingRows,
			platformPricing: platformPricingRows,
			pricingHistory: historyRows,
			modelOptions: await database
				.select({
					id: models.id,
					name: models.name,
					type: models.type,
				})
				.from(models)
				.orderBy(asc(models.name)),
			platformOptions: await database
				.select({
					id: platforms.id,
					name: platforms.name,
				})
				.from(platforms)
				.orderBy(asc(platforms.name)),
			planOptions: await database
				.select({
					id: platformPlans.id,
					name: platformPlans.name,
					platformId: platformPlans.platformId,
					platformName: platforms.name,
				})
				.from(platformPlans)
				.innerJoin(platforms, eq(platformPlans.platformId, platforms.id))
				.orderBy(asc(platforms.name), asc(platformPlans.name)),
		};
	},
);

export const createAdminProvider = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			name: string;
			slug: string;
			website?: string;
			logoUrl?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();
		const name = data.name.trim();
		const slug = data.slug.trim();

		if (!name || !slug) {
			throw new Error("Provider name and slug are required.");
		}

		await database.insert(providers).values({
			name,
			slug,
			website: data.website?.trim() || null,
			logoUrl: data.logoUrl?.trim() || null,
		});
	});

export const createAdminModel = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			name: string;
			slug: string;
			type: "image" | "video" | "text";
			providerId: string;
			description?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();
		const name = data.name.trim();
		const slug = data.slug.trim();

		if (!name || !slug || !data.providerId) {
			throw new Error("Model name, slug, provider, and type are required.");
		}

		await database.insert(models).values({
			name,
			slug,
			type: data.type,
			providerId: data.providerId,
			description: data.description?.trim() || null,
		});
	});

export const createAdminPlatform = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			name: string;
			slug: string;
			website?: string;
			pricingUrl?: string;
			affiliateUrl?: string;
			affiliateCommission?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();
		const name = data.name.trim();
		const slug = data.slug.trim();

		if (!name || !slug) {
			throw new Error("Platform name and slug are required.");
		}

		await database.insert(platforms).values({
			name,
			slug,
			website: data.website?.trim() || null,
			pricingUrl: data.pricingUrl?.trim() || null,
			affiliateUrl: data.affiliateUrl?.trim() || null,
			affiliateCommission: data.affiliateCommission?.trim() || null,
		});
	});

export const createAdminPlatformPlan = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			platformId: string;
			name: string;
			priceMonthly?: string;
			priceAnnual?: string;
			credits?: string;
			currency?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();
		const name = data.name.trim();

		if (!data.platformId || !name) {
			throw new Error("Platform and plan name are required.");
		}

		await database.insert(platformPlans).values({
			platformId: data.platformId,
			name,
			priceMonthly: data.priceMonthly?.trim() || null,
			priceAnnual: data.priceAnnual?.trim() || null,
			credits: data.credits?.trim() ? Number(data.credits) : null,
			currency: data.currency?.trim() || "USD",
		});
	});

export const createAdminApiPricing = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			modelId: string;
			priceType: "per_second" | "per_image" | "per_1m_tokens";
			resolution?: string;
			priceUsd: string;
			sourceUrl?: string;
			audioIncluded?: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();

		if (!data.modelId || !data.priceType || !data.priceUsd.trim()) {
			throw new Error("Model, price type, and price are required.");
		}

		await database.insert(modelPricing).values({
			modelId: data.modelId,
			priceType: data.priceType,
			resolution: data.resolution?.trim() || null,
			priceUsd: data.priceUsd.trim(),
			sourceUrl: data.sourceUrl?.trim() || null,
			audioIncluded: Boolean(data.audioIncluded),
		});
	});

export const createAdminPlatformPricing = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			platformId: string;
			platformPlanId: string;
			modelId: string;
			creditsPerGen?: string;
			priceUsd?: string;
			resolution?: string;
			notes?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const database = requireDb();

		if (!data.platformId || !data.platformPlanId || !data.modelId) {
			throw new Error("Platform, plan, and model are required.");
		}

		await database.insert(platformModelPricing).values({
			platformId: data.platformId,
			platformPlanId: data.platformPlanId,
			modelId: data.modelId,
			creditsPerGen: data.creditsPerGen?.trim()
				? Number(data.creditsPerGen)
				: null,
			priceUsd: data.priceUsd?.trim() || null,
			resolution: data.resolution?.trim() || null,
			notes: data.notes?.trim() || null,
		});
	});
