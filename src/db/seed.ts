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
		slug: "kuaishou",
		name: "Kuaishou",
		website: "https://www.kuaishou.com",
		logoUrl: "https://www.kuaishou.com/favicon.ico",
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
	{
		slug: "alibaba",
		name: "Alibaba",
		website: "https://www.alibabacloud.com",
		logoUrl: "https://www.alibabacloud.com/favicon.ico",
	},
	{
		slug: "xai",
		name: "xAI",
		website: "https://x.ai",
		logoUrl: "https://x.ai/favicon.ico",
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
		slug: "higgsfield",
		name: "Higgsfield",
		website: "https://higgsfield.ai",
		logoUrl: "https://higgsfield.ai/favicon.ico",
		pricingUrl: "https://higgsfield.ai/pricing",
	},
	{
		slug: "openart",
		name: "OpenArt",
		website: "https://openart.ai",
		logoUrl: "https://openart.ai/favicon.ico",
		pricingUrl: "https://openart.ai/pricing",
	},
	{
		slug: "fal",
		name: "fal.ai",
		website: "https://fal.ai",
		logoUrl: "https://fal.ai/favicon.ico",
		pricingUrl: "https://fal.ai/pricing",
	},
	{
		slug: "atlascloud",
		name: "AtlasCloud",
		website: "https://www.atlascloud.ai",
		logoUrl: "https://www.atlascloud.ai/favicon.ico",
		pricingUrl: "https://www.atlascloud.ai/pricing/models",
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
			// Image models
			{
				slug: "nano-banana",
				name: "Nano Banana",
				type: "image",
				description: "Google multimodal image generation model.",
				providerId: providerIdBySlug.get("google")!,
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
				slug: "nano-banana-2",
				name: "Nano Banana 2",
				type: "image",
				description: "Latest Nano Banana image generation model.",
				providerId: providerIdBySlug.get("google")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "seedream-4-5",
				name: "Seedream 4.5",
				type: "image",
				description: "ByteDance image generation model.",
				providerId: providerIdBySlug.get("bytedance")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "seedream-5-lite",
				name: "Seedream 5.0 lite",
				type: "image",
				description: "ByteDance lightweight image generation model.",
				providerId: providerIdBySlug.get("bytedance")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "grok-imagine-image",
				name: "Grok Imagine",
				type: "image",
				description: "xAI image generation model.",
				providerId: providerIdBySlug.get("xai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "flux-2-pro",
				name: "FLUX.2 [pro]",
				type: "image",
				description: "Premium Black Forest Labs image model.",
				providerId: providerIdBySlug.get("black-forest-labs")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "flux-2-max",
				name: "FLUX.2 [max]",
				type: "image",
				description: "Maximum quality Black Forest Labs image model.",
				providerId: providerIdBySlug.get("black-forest-labs")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "qwen-image",
				name: "Qwen Image",
				type: "image",
				description: "Alibaba image generation model.",
				providerId: providerIdBySlug.get("alibaba")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "gpt-image-1-5",
				name: "GPT Image 1.5",
				type: "image",
				description: "OpenAI image generation model.",
				providerId: providerIdBySlug.get("openai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "wan-2-7-image",
				name: "Wan 2.7",
				type: "image",
				description: "High-quality image generation model.",
				providerId: providerIdBySlug.get("alibaba")!,
				launchedAt: "2025-01-01",
			},
			// Video models
			{
				slug: "kling-3-0",
				name: "Kling 3.0",
				type: "video",
				description: "Kuaishou video generation model.",
				providerId: providerIdBySlug.get("kuaishou")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "kling-3-0-omni",
				name: "Kling 3.0 Omni",
				type: "video",
				description: "Kuaishou multimodal video generation model.",
				providerId: providerIdBySlug.get("kuaishou")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "seedance-2-0",
				name: "Seedance 2.0",
				type: "video",
				description: "ByteDance video generation model.",
				providerId: providerIdBySlug.get("bytedance")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "seedance-2-0-fast",
				name: "Seedance 2.0 Fast",
				type: "video",
				description: "ByteDance fast video generation model.",
				providerId: providerIdBySlug.get("bytedance")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "google-veo-3-1",
				name: "Google Veo 3.1",
				type: "video",
				description: "Google video generation model.",
				providerId: providerIdBySlug.get("google")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "google-veo-3-1-fast",
				name: "Google Veo 3.1 Fast",
				type: "video",
				description: "Google fast video generation model.",
				providerId: providerIdBySlug.get("google")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "sora-2",
				name: "Sora 2",
				type: "video",
				description: "OpenAI video generation model.",
				providerId: providerIdBySlug.get("openai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "sora-2-pro",
				name: "Sora 2 Pro",
				type: "video",
				description: "OpenAI premium video generation model.",
				providerId: providerIdBySlug.get("openai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "grok-imagine-video",
				name: "Grok Imagine Video",
				type: "video",
				description: "xAI video generation model.",
				providerId: providerIdBySlug.get("xai")!,
				launchedAt: "2025-01-01",
			},
			{
				slug: "wan-2-7-video",
				name: "Wan 2.7 Video",
				type: "video",
				description: "High-quality video generation model.",
				providerId: providerIdBySlug.get("alibaba")!,
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
			// Higgsfield plans (from https://higgsfield.ai/pricing)
			{
				platformId: platformIdBySlug.get("higgsfield")!,
				name: "Starter",
				priceMonthly: "15.00",
				credits: 200,
			},
			{
				platformId: platformIdBySlug.get("higgsfield")!,
				name: "Plus",
				priceMonthly: "39.00",
				credits: 1000,
			},
			{
				platformId: platformIdBySlug.get("higgsfield")!,
				name: "Ultra",
				priceMonthly: "99.00",
				credits: 3000,
			},
			// OpenArt plans (from https://openart.ai/pricing)
			{
				platformId: platformIdBySlug.get("openart")!,
				name: "Essential",
				priceMonthly: "14.00",
				credits: 4000,
			},
			{
				platformId: platformIdBySlug.get("openart")!,
				name: "Advanced",
				priceMonthly: "29.00",
				credits: 12000,
			},
			{
				platformId: platformIdBySlug.get("openart")!,
				name: "Infinite",
				priceMonthly: "56.00",
				credits: 24000,
			},
			{
				platformId: platformIdBySlug.get("openart")!,
				name: "Wonder",
				priceMonthly: "240.00",
				credits: 106000,
			},
			// Replicate - Pay-as-you-go API pricing
			{
				platformId: platformIdBySlug.get("replicate")!,
				name: "Pay-as-you-go",
				priceMonthly: "0.00",
				credits: 0,
			},
			// fal.ai - Pay-as-you-go API pricing
			{
				platformId: platformIdBySlug.get("fal")!,
				name: "Pay-as-you-go",
				priceMonthly: "0.00",
				credits: 0,
			},
			// AtlasCloud - Pay-as-you-go API pricing
			{
				platformId: platformIdBySlug.get("atlascloud")!,
				name: "Pay-as-you-go",
				priceMonthly: "0.00",
				credits: 0,
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

	// Helper to calculate effective price: (plan_price / credits) * credits_per_gen
	// Using Plus plan: $39/1000 credits = $0.039/credit
	const plusCreditPrice = 0.039;

	console.log("[db:seed] inserting Higgsfield platform pricing");
	const higgsFieldId = platformIdBySlug.get("higgsfield")!;
	const plusPlanId = planIdByKey.get(`${higgsFieldId}:Plus`)!;

	await database.insert(platformModelPricing).values([
		// IMAGE MODELS on Higgsfield (Plus plan)
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("nano-banana")!,
			creditsPerGen: 1,
			priceUsd: (1 * plusCreditPrice).toFixed(4),
			resolution: "780p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			creditsPerGen: 2,
			priceUsd: (2 * plusCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			creditsPerGen: 1.5,
			priceUsd: (1.5 * plusCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedream-4-5")!,
			creditsPerGen: 1,
			priceUsd: (1 * plusCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedream-5-lite")!,
			creditsPerGen: 1,
			priceUsd: (1 * plusCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("grok-imagine-image")!,
			creditsPerGen: 1,
			priceUsd: (1 * plusCreditPrice).toFixed(4),
			resolution: "1K",
		},
		// VIDEO MODELS on Higgsfield (Plus plan) - priced per second
		// Kling 3.0 - multiple resolutions
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("kling-3-0")!,
			creditsPerGen: 6.25 / 5, // per second
			priceUsd: ((6.25 / 5) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("kling-3-0")!,
			creditsPerGen: 7.5 / 5, // per second
			priceUsd: ((7.5 / 5) * plusCreditPrice).toFixed(4),
			resolution: "1080p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("kling-3-0-omni")!,
			creditsPerGen: 8 / 5, // per second
			priceUsd: ((8 / 5) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		// Seedance 2.0 - multiple resolutions
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			creditsPerGen: 20 / 8, // per second
			priceUsd: ((20 / 8) * plusCreditPrice).toFixed(4),
			resolution: "480p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			creditsPerGen: 32 / 8, // per second
			priceUsd: ((32 / 8) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			creditsPerGen: 80 / 8, // per second
			priceUsd: ((80 / 8) * plusCreditPrice).toFixed(4),
			resolution: "1080p",
		},
		// Seedance 2.0 Fast - multiple resolutions
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedance-2-0-fast")!,
			creditsPerGen: 12 / 8, // per second
			priceUsd: ((12 / 8) * plusCreditPrice).toFixed(4),
			resolution: "480p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("seedance-2-0-fast")!,
			creditsPerGen: 28 / 8, // per second
			priceUsd: ((28 / 8) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("google-veo-3-1")!,
			creditsPerGen: 58 / 8, // per second
			priceUsd: ((58 / 8) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("google-veo-3-1-fast")!,
			creditsPerGen: 22 / 8, // per second
			priceUsd: ((22 / 8) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("sora-2")!,
			creditsPerGen: 29 / 12, // per second
			priceUsd: ((29 / 12) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("sora-2-pro")!,
			creditsPerGen: 89 / 12, // per second
			priceUsd: ((89 / 12) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: higgsFieldId,
			platformPlanId: plusPlanId,
			modelId: modelIdBySlug.get("grok-imagine-video")!,
			creditsPerGen: 23 / 15, // per second
			priceUsd: ((23 / 15) * plusCreditPrice).toFixed(4),
			resolution: "720p",
		},
	]);

	// OpenArt pricing using Advanced plan: $29/12000 credits = $0.00241667/credit
	const openArtCreditPrice = 29 / 12000;
	const openArtId = platformIdBySlug.get("openart")!;
	const advancedPlanId = planIdByKey.get(`${openArtId}:Advanced`)!;

	console.log("[db:seed] inserting OpenArt platform pricing");
	await database.insert(platformModelPricing).values([
		// IMAGE MODELS on OpenArt (Advanced plan)
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana")!,
			creditsPerGen: 15,
			priceUsd: (15 * openArtCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			creditsPerGen: 40,
			priceUsd: (40 * openArtCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			creditsPerGen: 40,
			priceUsd: (40 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			creditsPerGen: 80,
			priceUsd: (80 * openArtCreditPrice).toFixed(4),
			resolution: "4K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			creditsPerGen: 20,
			priceUsd: (20 * openArtCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			creditsPerGen: 30,
			priceUsd: (30 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			creditsPerGen: 50,
			priceUsd: (50 * openArtCreditPrice).toFixed(4),
			resolution: "4K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("wan-2-7-image")!,
			creditsPerGen: 15,
			priceUsd: (15 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("wan-2-7-image")!,
			creditsPerGen: 15,
			priceUsd: (15 * openArtCreditPrice).toFixed(4),
			resolution: "4K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("grok-imagine-image")!,
			creditsPerGen: 10,
			priceUsd: (10 * openArtCreditPrice).toFixed(4),
			resolution: "1K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("grok-imagine-image")!,
			creditsPerGen: 10,
			priceUsd: (10 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("seedream-5-lite")!,
			creditsPerGen: 15,
			priceUsd: (15 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("seedream-5-lite")!,
			creditsPerGen: 16,
			priceUsd: (16 * openArtCreditPrice).toFixed(4),
			resolution: "3K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("seedream-4-5")!,
			creditsPerGen: 16,
			priceUsd: (16 * openArtCreditPrice).toFixed(4),
			resolution: "2K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("seedream-4-5")!,
			creditsPerGen: 16,
			priceUsd: (16 * openArtCreditPrice).toFixed(4),
			resolution: "4K",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			creditsPerGen: 25,
			priceUsd: (25 * openArtCreditPrice).toFixed(4),
			resolution: "1K",
		},
		// VIDEO MODELS on OpenArt (Advanced plan) - priced per second
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("kling-3-0")!,
			creditsPerGen: 175 / 5, // per second
			priceUsd: ((175 / 5) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("kling-3-0-omni")!,
			creditsPerGen: 175 / 5, // per second
			priceUsd: ((175 / 5) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			creditsPerGen: 400 / 5, // per second
			priceUsd: ((400 / 5) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("wan-2-7-video")!,
			creditsPerGen: 125 / 5, // per second
			priceUsd: ((125 / 5) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("google-veo-3-1")!,
			creditsPerGen: 120 / 4, // per second
			priceUsd: ((120 / 4) * openArtCreditPrice).toFixed(4),
			resolution: "1080p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("grok-imagine-video")!,
			creditsPerGen: 150 / 5, // per second
			priceUsd: ((150 / 5) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
		{
			platformId: openArtId,
			platformPlanId: advancedPlanId,
			modelId: modelIdBySlug.get("sora-2")!,
			creditsPerGen: 600 / 4, // per second
			priceUsd: ((600 / 4) * openArtCreditPrice).toFixed(4),
			resolution: "720p",
		},
	]);

	// Replicate API pricing (pay per use)
	console.log("[db:seed] inserting Replicate API pricing");
	const replicateId = platformIdBySlug.get("replicate")!;
	const replicatePlanId = planIdByKey.get(`${replicateId}:Pay-as-you-go`)!;

	await database.insert(platformModelPricing).values([
		// Seedream 4.5: $0.04/image
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("seedream-4-5")!,
			priceUsd: "0.04",
			resolution: "2K",
		},
		// GPT Image 1.5: size-based pricing
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.013",
			resolution: "1024x1024",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.05",
			resolution: "1024x1536",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.136",
			resolution: "1536x1024",
		},
		// Grok Imagine: $0.02/image
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("grok-imagine-image")!,
			priceUsd: "0.02",
			resolution: "1024x1024",
		},
		// Seedream 5.0 Lite: $0.035/image
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("seedream-5-lite")!,
			priceUsd: "0.035",
			resolution: "2K",
		},
		// Nano Banana Pro: resolution-based pricing
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceUsd: "0.15",
			resolution: "1K",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceUsd: "0.15",
			resolution: "2K",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceUsd: "0.30",
			resolution: "4K",
		},
		// Nano Banana 2: resolution-based pricing
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.067",
			resolution: "1K",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.101",
			resolution: "2K",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.151",
			resolution: "4K",
		},
		// FLUX 2 Pro: $0.015/run + $0.015/megapixel output
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("flux-2-pro")!,
			priceUsd: "0.03",
			resolution: "1K",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("flux-2-pro")!,
			priceUsd: "0.075",
			resolution: "2K",
		},
	]);

	// fal.ai API pricing (pay per use)
	console.log("[db:seed] inserting fal.ai API pricing");
	const falId = platformIdBySlug.get("fal")!;
	const falPlanId = planIdByKey.get(`${falId}:Pay-as-you-go`)!;

	await database.insert(platformModelPricing).values([
		// Nano Banana: $0.039/image (fixed 1K output)
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana")!,
			priceUsd: "0.039",
			resolution: "1K",
		},
		// Nano Banana 2: resolution-based pricing
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.06",
			resolution: "0.5K",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.08",
			resolution: "1K",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.12",
			resolution: "2K",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-2")!,
			priceUsd: "0.16",
			resolution: "4K",
		},
		// Nano Banana Pro: resolution-based pricing (1K, 2K, 4K options)
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceUsd: "0.15",
			resolution: "1K",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("nano-banana-pro")!,
			priceUsd: "0.30",
			resolution: "4K",
		},
		// GPT Image 1.5: quality and size-based pricing
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.009",
			resolution: "1024x1024",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.013",
			resolution: "1536x1024",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.034",
			resolution: "1024x1536",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("gpt-image-1-5")!,
			priceUsd: "0.133",
			resolution: "1536x1536",
		},
		// FLUX 2 Pro: megapixel-based pricing
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("flux-2-pro")!,
			priceUsd: "0.03",
			resolution: "1K (1MP)",
		},
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("flux-2-pro")!,
			priceUsd: "0.045",
			resolution: "1080p (2MP)",
		},
		// Qwen Image: $0.02/megapixel
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("qwen-image")!,
			priceUsd: "0.02",
			resolution: "per MP",
		},
		// Seedream 4.5: $0.04/image
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("seedream-4-5")!,
			priceUsd: "0.04",
			resolution: "2K",
		},
		// Seedream 5 Lite: $0.035/image
		{
			platformId: falId,
			platformPlanId: falPlanId,
			modelId: modelIdBySlug.get("seedream-5-lite")!,
			priceUsd: "0.035",
			resolution: "2K",
		},
	]);

	// Add Replicate video model pricing
	console.log("[db:seed] inserting Replicate video pricing");
	await database.insert(platformModelPricing).values([
		// Seedance 2.0: $0.08-0.10/s depending on variant
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			priceUsd: "0.08",
			resolution: "480p",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			priceUsd: "0.10",
			resolution: "720p",
		},
		// Seedance 2.0 Fast
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("seedance-2-0-fast")!,
			priceUsd: "0.05",
			resolution: "480p",
		},
		// Google Veo 3.1: $0.20-0.40/s
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("google-veo-3-1")!,
			priceUsd: "0.20",
			resolution: "without audio",
		},
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("google-veo-3-1")!,
			priceUsd: "0.40",
			resolution: "with audio",
		},
		// Google Veo 3.1 Fast
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("google-veo-3-1-fast")!,
			priceUsd: "0.10",
			resolution: "1080p",
		},
		// Kling 3.0: $0.168/s
		{
			platformId: replicateId,
			platformPlanId: replicatePlanId,
			modelId: modelIdBySlug.get("kling-3-0")!,
			priceUsd: "0.168",
			resolution: "with audio",
		},
	]);

	// AtlasCloud API pricing (pay per use)
	console.log("[db:seed] inserting AtlasCloud API pricing");
	const atlascloudId = platformIdBySlug.get("atlascloud")!;
	const atlascloudPlanId = planIdByKey.get(`${atlascloudId}:Pay-as-you-go`)!;

	await database.insert(platformModelPricing).values([
		// VIDEO MODELS - per second pricing
		// Seedance 2.0: $0.127/s
		{
			platformId: atlascloudId,
			platformPlanId: atlascloudPlanId,
			modelId: modelIdBySlug.get("seedance-2-0")!,
			priceUsd: "0.127",
			resolution: "720p",
		},
		// Seedance 2.0 Fast: $0.101/s
		{
			platformId: atlascloudId,
			platformPlanId: atlascloudPlanId,
			modelId: modelIdBySlug.get("seedance-2-0-fast")!,
			priceUsd: "0.101",
			resolution: "720p",
		},
		// Google Veo 3.1: $0.2/s
		{
			platformId: atlascloudId,
			platformPlanId: atlascloudPlanId,
			modelId: modelIdBySlug.get("google-veo-3-1")!,
			priceUsd: "0.20",
			resolution: "1080p",
		},
		// Google Veo 3.1 Fast: $0.1/s
		{
			platformId: atlascloudId,
			platformPlanId: atlascloudPlanId,
			modelId: modelIdBySlug.get("google-veo-3-1-fast")!,
			priceUsd: "0.10",
			resolution: "1080p",
		},
		// Wan 2.7 Video: $0.1/s
		{
			platformId: atlascloudId,
			platformPlanId: atlascloudPlanId,
			modelId: modelIdBySlug.get("wan-2-7-video")!,
			priceUsd: "0.10",
			resolution: "720p",
		},
	]);

	console.log("[db:seed] complete");
}

main().catch((error) => {
	console.error("[db:seed] failed", error);
	process.exit(1);
});
