import { db } from "./index.ts";
import {
	crawlLogs,
	modelPricing,
	models,
	platformModelPricing,
	platformPlans,
	platforms,
	pricingHistory,
	providers,
} from "./schema.ts";

if (!db) {
	throw new Error("DATABASE_URL is required to seed the database.");
}

const providerRows = [
	{
		slug: "openai",
		name: "OpenAI",
		website: "https://openai.com",
		logoUrl: "https://openai.com/favicon.ico",
	},
	{
		slug: "google",
		name: "Google",
		website: "https://ai.google.dev",
		logoUrl: "https://www.google.com/favicon.ico",
	},
	{
		slug: "kwaivgi",
		name: "KwaiVGI",
		website: "https://replicate.com/kwaivgi",
		logoUrl: "https://replicate.com/favicon.ico",
	},
	{
		slug: "black-forest-labs",
		name: "Black Forest Labs",
		website: "https://blackforestlabs.ai",
		logoUrl: "https://blackforestlabs.ai/favicon.ico",
	},
	{
		slug: "bytedance",
		name: "ByteDance",
		website: "https://www.bytedance.com",
		logoUrl: "https://www.bytedance.com/favicon.ico",
	},
];

const platformRows = [
	{
		slug: "replicate",
		name: "Replicate",
		website: "https://replicate.com",
		logoUrl: "https://replicate.com/favicon.ico",
		pricingUrl: "https://replicate.com/pricing",
	},
	{
		slug: "openart",
		name: "OpenArt",
		website: "https://openart.ai",
		logoUrl: "https://openart.ai/favicon.ico",
		pricingUrl: "https://openart.ai/pricing",
	},
	{
		slug: "freepik",
		name: "Freepik",
		website: "https://www.freepik.com",
		logoUrl: "https://www.freepik.com/favicon.ico",
		pricingUrl: "https://www.freepik.com/pricing",
	},
	{
		slug: "higgsfield",
		name: "Higgsfield",
		website: "https://higgsfield.ai",
		logoUrl: "https://higgsfield.ai/favicon.ico",
		pricingUrl: "https://higgsfield.ai/pricing",
	},
];

async function main() {
	console.log("[db:seed] clearing existing data");

	const database = db;
	if (!database) {
		throw new Error("DATABASE_URL is required to seed the database.");
	}

	await database.delete(crawlLogs);
	await database.delete(pricingHistory);
	await database.delete(platformModelPricing);
	await database.delete(modelPricing);
	await database.delete(platformPlans);
	await database.delete(models);
	await database.delete(platforms);
	await database.delete(providers);

	console.log("[db:seed] inserting providers");
	const insertedProviders = await database
		.insert(providers)
		.values(providerRows)
		.returning({ id: providers.id, slug: providers.slug });
	const providerIdBySlug = new Map(
		insertedProviders.map((row) => [row.slug, row.id] as const),
	);

	console.log("[db:seed] inserting models");
	const insertedModels = await database
		.insert(models)
		.values([
			{
				slug: "gpt-image-1",
				name: "GPT Image 1",
				type: "image",
				description: "OpenAI image generation model.",
				providerId: providerIdBySlug.get("openai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "nano-banana-pro",
				name: "Nano Banana Pro",
				type: "image",
				description: "High-quality multimodal image generation model.",
				providerId: providerIdBySlug.get("google")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "flux-2-pro",
				name: "FLUX 2 Pro",
				type: "image",
				description: "Premium Black Forest Labs image model.",
				providerId: providerIdBySlug.get("black-forest-labs")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "seedream-4",
				name: "Seedream 4",
				type: "image",
				description: "ByteDance image model.",
				providerId: providerIdBySlug.get("bytedance")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "kling-v2-5-turbo-pro",
				name: "Kling 2.5 Turbo Pro",
				type: "video",
				description: "Fast premium video generation model.",
				providerId: providerIdBySlug.get("kwaivgi")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "kling-v3-omni-video",
				name: "Kling V3 Omni Video",
				type: "video",
				description: "Higher-end multimodal video generation model.",
				providerId: providerIdBySlug.get("kwaivgi")!,
				launchedAt: "2025-01-01",
			},
		])
		.returning({ id: models.id, slug: models.slug });
	const modelIdBySlug = new Map(
		insertedModels.map((row) => [row.slug, row.id] as const),
	);

	console.log("[db:seed] inserting platforms");
	const insertedPlatforms = await database
		.insert(platforms)
		.values(platformRows)
		.returning({ id: platforms.id, slug: platforms.slug });
	const platformIdBySlug = new Map(
		insertedPlatforms.map((row) => [row.slug, row.id] as const),
	);

	console.log("[db:seed] inserting platform plans");
	const insertedPlans = await database
		.insert(platformPlans)
		.values([
			{
				platformId: platformIdBySlug.get("openart")!,
				name: "Creator",
				priceMonthly: "29.00",
				priceAnnual: "24.00",
				credits: 4000,
			},
			{
				platformId: platformIdBySlug.get("freepik")!,
				name: "Premium+",
				priceMonthly: "24.00",
				priceAnnual: "19.00",
				credits: 3000,
			},
			{
				platformId: platformIdBySlug.get("higgsfield")!,
				name: "Ultimate",
				priceMonthly: "39.00",
				priceAnnual: "32.00",
				credits: 5000,
			},
		])
		.returning({
			id: platformPlans.id,
			platformId: platformPlans.platformId,
			name: platformPlans.name,
		});
	const planIdByKey = new Map(
		insertedPlans.map((row) => [`${row.platformId}:${row.name}`, row.id] as const),
	);

	console.log("[db:seed] inserting api pricing");
	await database.insert(modelPricing).values([
		{
			modelId: modelIdBySlug.get("gpt-image-1")!,
			priceType: "per_image",
			priceUsd: "0.0400",
			sourceUrl: "https://openai.com/api/pricing",
		},
		{
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceType: "per_image",
			priceUsd: "0.0550",
			sourceUrl: "https://replicate.com/google/nano-banana-pro",
		},
		{
			modelId: modelIdBySlug.get("flux-2-pro")!,
			priceType: "per_image",
			priceUsd: "0.0500",
			sourceUrl: "https://replicate.com/black-forest-labs/flux-2-pro",
		},
		{
			modelId: modelIdBySlug.get("seedream-4")!,
			priceType: "per_image",
			priceUsd: "0.0450",
			sourceUrl: "https://replicate.com/bytedance/seedream-4",
		},
		{
			modelId: modelIdBySlug.get("kling-v2-5-turbo-pro")!,
			priceType: "per_second",
			resolution: "1080p",
			audioIncluded: false,
			priceUsd: "0.3200",
			sourceUrl: "https://replicate.com/kwaivgi/kling-v2.5-turbo-pro",
		},
		{
			modelId: modelIdBySlug.get("kling-v3-omni-video")!,
			priceType: "per_second",
			resolution: "1080p",
			audioIncluded: true,
			priceUsd: "0.4800",
			sourceUrl: "https://replicate.com/kwaivgi/kling-v3-omni-video",
		},
	]);

	console.log("[db:seed] inserting platform pricing");
	await database.insert(platformModelPricing).values([
		{
			platformId: platformIdBySlug.get("openart")!,
			platformPlanId: planIdByKey.get(
				`${platformIdBySlug.get("openart")!}:Creator`,
			)!,
			modelId: modelIdBySlug.get("flux-2-pro")!,
			creditsPerGen: 40,
			priceUsd: "0.2900",
			resolution: "standard",
			notes: "Included in Creator plan generation credits.",
		},
		{
			platformId: platformIdBySlug.get("freepik")!,
			platformPlanId: planIdByKey.get(
				`${platformIdBySlug.get("freepik")!}:Premium+`,
			)!,
			modelId: modelIdBySlug.get("seedream-4")!,
			creditsPerGen: 30,
			priceUsd: "0.2400",
			resolution: "standard",
			notes: "Image generation through monthly credit allocation.",
		},
		{
			platformId: platformIdBySlug.get("higgsfield")!,
			platformPlanId: planIdByKey.get(
				`${platformIdBySlug.get("higgsfield")!}:Ultimate`,
			)!,
			modelId: modelIdBySlug.get("kling-v2-5-turbo-pro")!,
			creditsPerGen: 180,
			priceUsd: "1.4000",
			resolution: "5 sec · 1080p",
			notes: "Audio not included.",
		},
	]);

	console.log("[db:seed] complete");
}

main().catch((error) => {
	console.error("[db:seed] failed", error);
	process.exit(1);
});
