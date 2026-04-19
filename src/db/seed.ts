import { db } from "./index.ts";
import {
	categories,
	tags,
	useCases,
	providers,
	models,
	tools,
	toolTags,
	toolUseCases,
	pricingTiers,
	toolModelPricing,
} from "./schema.ts";

if (!db) {
	throw new Error("DATABASE_URL is required to seed the database.");
}

const database = db;

// ============================================================================
// CATEGORIES
// ============================================================================
const categoryRows = [
	{
		slug: "api-platforms",
		name: "API Platforms",
		description: "Developer-focused platforms that provide API access to AI models for integration into applications.",
		icon: "code",
		sortOrder: 1,
	},
	{
		slug: "creator-tools",
		name: "Creator Tools",
		description: "UI-based platforms for content creators to generate images and videos without coding.",
		icon: "palette",
		sortOrder: 2,
	},
	{
		slug: "ad-platforms",
		name: "Ad Platforms",
		description: "AI-powered platforms for creating advertising content and marketing materials.",
		icon: "megaphone",
		sortOrder: 3,
	},
	{
		slug: "avatar-video",
		name: "Avatar & Video",
		description: "Platforms for creating AI avatars, talking head videos, and video production.",
		icon: "user-circle",
		sortOrder: 4,
	},
	{
		slug: "audio-voice",
		name: "Audio & Voice",
		description: "Text-to-speech, voice cloning, and audio generation platforms.",
		icon: "microphone",
		sortOrder: 5,
	},
];

// ============================================================================
// TAGS
// ============================================================================
const tagRows = [
	{ slug: "has-api", name: "Has API", type: "feature" },
	{ slug: "free-tier", name: "Free Tier", type: "pricing" },
	{ slug: "pay-per-use", name: "Pay Per Use", type: "pricing" },
	{ slug: "subscription", name: "Subscription", type: "pricing" },
	{ slug: "enterprise", name: "Enterprise", type: "audience" },
	{ slug: "beginner-friendly", name: "Beginner Friendly", type: "audience" },
	{ slug: "real-time", name: "Real-time", type: "feature" },
	{ slug: "batch-processing", name: "Batch Processing", type: "feature" },
];

// ============================================================================
// USE CASES
// ============================================================================
const useCaseRows = [
	{
		slug: "image-generation",
		name: "Image Generation",
		description: "Generate images from text prompts or other inputs.",
		icon: "image",
	},
	{
		slug: "video-generation",
		name: "Video Generation",
		description: "Generate videos from text, images, or other inputs.",
		icon: "video",
	},
	{
		slug: "image-editing",
		name: "Image Editing",
		description: "Edit, enhance, or modify existing images.",
		icon: "edit",
	},
	{
		slug: "video-editing",
		name: "Video Editing",
		description: "Edit, enhance, or modify existing videos.",
		icon: "film",
	},
	{
		slug: "avatar-creation",
		name: "Avatar Creation",
		description: "Create AI avatars and talking head videos.",
		icon: "user",
	},
	{
		slug: "voice-synthesis",
		name: "Voice Synthesis",
		description: "Generate speech from text or clone voices.",
		icon: "mic",
	},
	{
		slug: "ad-creative",
		name: "Ad Creative",
		description: "Generate advertising content and marketing materials.",
		icon: "ad",
	},
];

// ============================================================================
// PROVIDERS
// ============================================================================
const providerRows = [
	{ slug: "openai", name: "OpenAI", website: "https://openai.com" },
	{ slug: "google", name: "Google", website: "https://ai.google.dev" },
	{ slug: "bytedance", name: "ByteDance", website: "https://www.bytedance.com" },
	{ slug: "kuaishou", name: "Kuaishou", website: "https://www.kuaishou.com" },
	{ slug: "black-forest-labs", name: "Black Forest Labs", website: "https://blackforestlabs.ai" },
	{ slug: "stability-ai", name: "Stability AI", website: "https://stability.ai" },
	{ slug: "xai", name: "xAI", website: "https://x.ai" },
	{ slug: "alibaba", name: "Alibaba", website: "https://www.alibaba.com" },
	{ slug: "higgsfield", name: "Higgsfield", website: "https://higgsfield.ai" },
	{ slug: "minimax", name: "MiniMax", website: "https://www.minimaxi.com" },
];

// ============================================================================
// MODELS
// ============================================================================
const modelRows = [
	// Image models
	{ slug: "nano-banana", name: "Nano Banana", type: "image" as const, provider: "higgsfield", description: "Fast image generation model." },
	{ slug: "nano-banana-pro", name: "Nano Banana Pro", type: "image" as const, provider: "higgsfield", description: "High-quality image generation." },
	{ slug: "nano-banana-2", name: "Nano Banana 2", type: "image" as const, provider: "higgsfield", description: "Next-gen image model." },
	{ slug: "seedream-4-5", name: "Seedream 4.5", type: "image" as const, provider: "bytedance", description: "ByteDance image model." },
	{ slug: "seedream-5-lite", name: "Seedream 5.0 Lite", type: "image" as const, provider: "bytedance", description: "Lightweight image model." },
	{ slug: "gpt-image-1-5", name: "GPT Image 1.5", type: "image" as const, provider: "openai", description: "OpenAI image generation." },
	{ slug: "grok-imagine-image", name: "Grok Imagine", type: "image" as const, provider: "xai", description: "xAI image generation." },
	{ slug: "flux-2-pro", name: "FLUX.2 Pro", type: "image" as const, provider: "black-forest-labs", description: "Professional image model." },
	{ slug: "qwen-image", name: "Qwen Image", type: "image" as const, provider: "alibaba", description: "Alibaba image model." },
	{ slug: "wan-2-7-image", name: "Wan 2.7 Image", type: "image" as const, provider: "alibaba", description: "Alibaba Wan image model." },
	// Video models - Kling family
	{ slug: "kling-3-0", name: "Kling 3.0", type: "video" as const, provider: "kuaishou", description: "High-quality video generation with audio support." },
	{ slug: "kling-3-0-omni", name: "Kling 3.0 Omni", type: "video" as const, provider: "kuaishou", description: "Omni video model." },
	{ slug: "kling-2-6", name: "Kling 2.6", type: "video" as const, provider: "kuaishou", description: "Video generation model." },
	{ slug: "kling-2-5", name: "Kling 2.5", type: "video" as const, provider: "kuaishou", description: "Video generation model." },
	// Video models - Seedance family
	{ slug: "seedance-2-0", name: "Seedance 2.0", type: "video" as const, provider: "bytedance", description: "ByteDance video generation." },
	{ slug: "seedance-2-0-fast", name: "Seedance 2.0 Fast", type: "video" as const, provider: "bytedance", description: "Fast video generation." },
	// Video models - Google Veo family
	{ slug: "google-veo-3", name: "Veo 3", type: "video" as const, provider: "google", description: "Google video generation with native audio." },
	{ slug: "google-veo-3-1", name: "Veo 3.1", type: "video" as const, provider: "google", description: "Google video generation." },
	{ slug: "google-veo-3-1-fast", name: "Veo 3.1 Fast", type: "video" as const, provider: "google", description: "Fast Google video." },
	{ slug: "google-veo-3-1-lite", name: "Veo 3.1 Lite", type: "video" as const, provider: "google", description: "Lightweight Google video." },
	// Video models - Wan family
	{ slug: "wan-2-7-video", name: "Wan 2.7 Video", type: "video" as const, provider: "alibaba", description: "Alibaba video model." },
	{ slug: "wan-2-6-video", name: "Wan 2.6 Video", type: "video" as const, provider: "alibaba", description: "Alibaba video model." },
	{ slug: "wan-2-5-video", name: "Wan 2.5 Video", type: "video" as const, provider: "alibaba", description: "Alibaba video model." },
	{ slug: "wan-2-2-video", name: "Wan 2.2 Video", type: "video" as const, provider: "alibaba", description: "Alibaba video model." },
	// Video models - Others
	{ slug: "sora-2", name: "Sora 2", type: "video" as const, provider: "openai", description: "OpenAI video generation." },
	{ slug: "grok-imagine-video", name: "Grok Imagine Video", type: "video" as const, provider: "xai", description: "xAI video generation." },
	{ slug: "hailuo-video-01", name: "Hailuo Video-01", type: "video" as const, provider: "minimax", description: "MiniMax 6s video generation." },
];

// ============================================================================
// TOOLS (formerly platforms)
// ============================================================================
const toolRows = [
	// API Platforms
	{
		slug: "replicate",
		name: "Replicate",
		category: "api-platforms",
		website: "https://replicate.com",
		pricingUrl: "https://replicate.com/pricing",
		shortDescription: "Run AI models in the cloud with a simple API.",
		pricingModel: "pay_per_use" as const,
		apiAvailable: true,
		pros: ["Pay-per-use pricing", "Wide model selection", "Easy API integration", "No commitment required"],
		cons: ["Can be expensive at scale", "Cold start latency", "Rate limits on free tier"],
		tags: ["has-api", "pay-per-use", "beginner-friendly"],
		useCases: ["image-generation", "video-generation"],
	},
	{
		slug: "fal",
		name: "fal.ai",
		category: "api-platforms",
		website: "https://fal.ai",
		pricingUrl: "https://fal.ai/pricing",
		shortDescription: "Fast inference API for generative AI models.",
		pricingModel: "pay_per_use" as const,
		apiAvailable: true,
		pros: ["Fast inference", "Competitive pricing", "Good documentation", "Real-time streaming"],
		cons: ["Smaller model selection", "Newer platform", "Limited enterprise features"],
		tags: ["has-api", "pay-per-use", "real-time"],
		useCases: ["image-generation", "video-generation"],
	},
	{
		slug: "atlascloud",
		name: "AtlasCloud",
		category: "api-platforms",
		website: "https://atlascloud.ai",
		pricingUrl: "https://atlascloud.ai/pricing",
		shortDescription: "Enterprise-grade AI model hosting and inference.",
		pricingModel: "pay_per_use" as const,
		apiAvailable: true,
		pros: ["Enterprise features", "SLA guarantees", "Custom deployments", "Dedicated support"],
		cons: ["Higher minimum spend", "Complex pricing", "Requires technical setup"],
		tags: ["has-api", "pay-per-use", "enterprise"],
		useCases: ["image-generation", "video-generation"],
	},
	// Creator Tools
	{
		slug: "higgsfield",
		name: "Higgsfield",
		category: "creator-tools",
		website: "https://higgsfield.ai",
		pricingUrl: "https://higgsfield.ai/pricing",
		shortDescription: "AI-powered creative studio for image and video generation.",
		pricingModel: "credits" as const,
		apiAvailable: false,
		pros: ["User-friendly interface", "Credit-based pricing", "Multiple model access", "Good for beginners"],
		cons: ["No API access", "Credits expire", "Limited customization"],
		tags: ["subscription", "beginner-friendly"],
		useCases: ["image-generation", "video-generation"],
	},
	{
		slug: "openart",
		name: "OpenArt",
		category: "creator-tools",
		website: "https://openart.ai",
		pricingUrl: "https://openart.ai/pricing",
		shortDescription: "AI art generator with training and generation tools.",
		pricingModel: "credits" as const,
		apiAvailable: false,
		pros: ["Model training", "Community features", "Style transfer", "Affordable plans"],
		cons: ["Limited video support", "No API", "Credit-based limits"],
		tags: ["subscription", "beginner-friendly"],
		useCases: ["image-generation", "image-editing"],
	},
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
async function main() {
	console.log("[db:seed] clearing existing data");
	await database.delete(toolModelPricing);
	await database.delete(pricingTiers);
	await database.delete(toolUseCases);
	await database.delete(toolTags);
	await database.delete(tools);
	await database.delete(models);
	await database.delete(providers);
	await database.delete(useCases);
	await database.delete(tags);
	await database.delete(categories);

	// Insert categories
	console.log("[db:seed] inserting categories");
	const insertedCategories = await database
		.insert(categories)
		.values(categoryRows)
		.returning({ id: categories.id, slug: categories.slug });
	const categoryIdBySlug = new Map(insertedCategories.map((row) => [row.slug, row.id]));

	// Insert tags
	console.log("[db:seed] inserting tags");
	const insertedTags = await database
		.insert(tags)
		.values(tagRows)
		.returning({ id: tags.id, slug: tags.slug });
	const tagIdBySlug = new Map(insertedTags.map((row) => [row.slug, row.id]));

	// Insert use cases
	console.log("[db:seed] inserting use cases");
	const insertedUseCases = await database
		.insert(useCases)
		.values(useCaseRows)
		.returning({ id: useCases.id, slug: useCases.slug });
	const useCaseIdBySlug = new Map(insertedUseCases.map((row) => [row.slug, row.id]));

	// Insert providers
	console.log("[db:seed] inserting providers");
	const insertedProviders = await database
		.insert(providers)
		.values(providerRows)
		.returning({ id: providers.id, slug: providers.slug });
	const providerIdBySlug = new Map(insertedProviders.map((row) => [row.slug, row.id]));

	// Insert models
	console.log("[db:seed] inserting models");
	const insertedModels = await database
		.insert(models)
		.values(
			modelRows.map((model) => ({
				slug: model.slug,
				name: model.name,
				type: model.type,
				description: model.description,
				providerId: providerIdBySlug.get(model.provider)!,
			})),
		)
		.returning({ id: models.id, slug: models.slug });
	const modelIdBySlug = new Map(insertedModels.map((row) => [row.slug, row.id]));

	// Insert tools
	console.log("[db:seed] inserting tools");
	const insertedTools = await database
		.insert(tools)
		.values(
			toolRows.map((tool) => ({
				slug: tool.slug,
				name: tool.name,
				categoryId: categoryIdBySlug.get(tool.category)!,
				website: tool.website,
				pricingUrl: tool.pricingUrl,
				shortDescription: tool.shortDescription,
				pricingModel: tool.pricingModel,
				apiAvailable: tool.apiAvailable,
				pros: tool.pros,
				cons: tool.cons,
			})),
		)
		.returning({ id: tools.id, slug: tools.slug });
	const toolIdBySlug = new Map(insertedTools.map((row) => [row.slug, row.id]));

	// Insert tool tags
	console.log("[db:seed] inserting tool tags");
	const toolTagRows: { toolId: string; tagId: string }[] = [];
	for (const tool of toolRows) {
		const toolId = toolIdBySlug.get(tool.slug)!;
		for (const tagSlug of tool.tags) {
			const tagId = tagIdBySlug.get(tagSlug);
			if (tagId) {
				toolTagRows.push({ toolId, tagId });
			}
		}
	}
	if (toolTagRows.length > 0) {
		await database.insert(toolTags).values(toolTagRows);
	}

	// Insert tool use cases
	console.log("[db:seed] inserting tool use cases");
	const toolUseCaseRows: { toolId: string; useCaseId: string }[] = [];
	for (const tool of toolRows) {
		const toolId = toolIdBySlug.get(tool.slug)!;
		for (const useCaseSlug of tool.useCases) {
			const useCaseId = useCaseIdBySlug.get(useCaseSlug);
			if (useCaseId) {
				toolUseCaseRows.push({ toolId, useCaseId });
			}
		}
	}
	if (toolUseCaseRows.length > 0) {
		await database.insert(toolUseCases).values(toolUseCaseRows);
	}

	// Insert pricing tiers
	console.log("[db:seed] inserting pricing tiers");

	// Higgsfield plans
	const higgsFieldId = toolIdBySlug.get("higgsfield")!;
	const insertedHiggsfieldPlans = await database
		.insert(pricingTiers)
		.values([
			{ toolId: higgsFieldId, name: "Starter", priceMonthly: "15.00", credits: 200, sortOrder: 1 },
			{ toolId: higgsFieldId, name: "Plus", priceMonthly: "39.00", credits: 1000, sortOrder: 2, isHighlighted: true },
			{ toolId: higgsFieldId, name: "Ultra", priceMonthly: "99.00", credits: 3000, sortOrder: 3 },
		])
		.returning({ id: pricingTiers.id, name: pricingTiers.name, toolId: pricingTiers.toolId });

	// OpenArt plans
	const openArtId = toolIdBySlug.get("openart")!;
	const insertedOpenArtPlans = await database
		.insert(pricingTiers)
		.values([
			{ toolId: openArtId, name: "Essential", priceMonthly: "14.00", credits: 4000, sortOrder: 1 },
			{ toolId: openArtId, name: "Advanced", priceMonthly: "29.00", credits: 12000, sortOrder: 2, isHighlighted: true },
			{ toolId: openArtId, name: "Infinite", priceMonthly: "56.00", credits: 24000, sortOrder: 3 },
		])
		.returning({ id: pricingTiers.id, name: pricingTiers.name, toolId: pricingTiers.toolId });

	// API platforms - Pay-as-you-go
	const replicateId = toolIdBySlug.get("replicate")!;
	const falId = toolIdBySlug.get("fal")!;
	const atlascloudId = toolIdBySlug.get("atlascloud")!;

	const insertedApiPlans = await database
		.insert(pricingTiers)
		.values([
			{ toolId: replicateId, name: "Pay-as-you-go", priceMonthly: "0.00", billingPeriod: "pay_as_you_go" as const, sortOrder: 1 },
			{ toolId: falId, name: "Pay-as-you-go", priceMonthly: "0.00", billingPeriod: "pay_as_you_go" as const, sortOrder: 1 },
			{ toolId: atlascloudId, name: "Pay-as-you-go", priceMonthly: "0.00", billingPeriod: "pay_as_you_go" as const, sortOrder: 1 },
		])
		.returning({ id: pricingTiers.id, name: pricingTiers.name, toolId: pricingTiers.toolId });

	// Build plan ID lookup
	const allPlans = [...insertedHiggsfieldPlans, ...insertedOpenArtPlans, ...insertedApiPlans];
	const planIdByKey = new Map(allPlans.map((row) => [`${row.toolId}:${row.name}`, row.id]));

	// Insert tool model pricing for Higgsfield
	console.log("[db:seed] inserting Higgsfield model pricing");
	const plusPlanId = planIdByKey.get(`${higgsFieldId}:Plus`)!;
	const plusCreditPrice = 39 / 1000; // $0.039 per credit

	await database.insert(toolModelPricing).values([
		// Image models
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("nano-banana")!, creditsPerUnit: "1", priceUsd: (1 * plusCreditPrice).toFixed(4), unit: "per_image", resolution: "720p" },
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("nano-banana-pro")!, creditsPerUnit: "2", priceUsd: (2 * plusCreditPrice).toFixed(4), unit: "per_image", resolution: "1080p" },
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("seedream-4-5")!, creditsPerUnit: "1", priceUsd: (1 * plusCreditPrice).toFixed(4), unit: "per_image", resolution: "2K" },
		// Video: Seedance 2.0 (720p only - 20 credits/5s = 4 credits/sec)
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("seedance-2-0")!, creditsPerUnit: "4.00", priceUsd: (4 * plusCreditPrice).toFixed(4), unit: "per_second", resolution: "720p" },
		// Video: Kling 3.0 - 720p (7 credits/5s = 1.4/sec) and 1080p (8 credits/5s = 1.6/sec)
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("kling-3-0")!, creditsPerUnit: "1.40", priceUsd: (1.4 * plusCreditPrice).toFixed(4), unit: "per_second", resolution: "720p" },
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("kling-3-0")!, creditsPerUnit: "1.60", priceUsd: (1.6 * plusCreditPrice).toFixed(4), unit: "per_second", resolution: "1080p" },
		// Video: Hailuo - 720p (6 credits/6s = 1/sec) and 1080p (10 credits/6s = 1.67/sec)
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, creditsPerUnit: "1.00", priceUsd: (1.0 * plusCreditPrice).toFixed(4), unit: "per_second", resolution: "720p", notes: "768p actual" },
		{ toolId: higgsFieldId, tierId: plusPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, creditsPerUnit: "1.67", priceUsd: (1.67 * plusCreditPrice).toFixed(4), unit: "per_second", resolution: "1080p" },
	]);

	// Insert tool model pricing for Replicate (API)
	console.log("[db:seed] inserting Replicate API pricing");
	const replicatePlanId = planIdByKey.get(`${replicateId}:Pay-as-you-go`)!;

	await database.insert(toolModelPricing).values([
		// Image models
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("seedream-4-5")!, priceUsd: "0.04", unit: "per_image", resolution: "2K" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("gpt-image-1-5")!, priceUsd: "0.013", unit: "per_image", resolution: "1080p" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("seedream-5-lite")!, priceUsd: "0.035", unit: "per_image", resolution: "2K" },
		// Video: Seedance 2.0 (max 720p - no 1080p support)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("seedance-2-0")!, priceUsd: "0.08", unit: "per_second", resolution: "720p", notes: "text-to-video" },
		// Video: Seedance 2.0 Fast (max 720p)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("seedance-2-0-fast")!, priceUsd: "0.07", unit: "per_second", resolution: "720p", notes: "text-to-video" },
		// Video: Veo 3 - 720p and 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3")!, priceUsd: "0.40", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3")!, priceUsd: "0.40", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Veo 3.1 - 720p and 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.40", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.40", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Veo 3.1 Fast - 720p and 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.15", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Veo 3.1 Lite - 720p and 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1-lite")!, priceUsd: "0.05", unit: "per_second", resolution: "720p" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("google-veo-3-1-lite")!, priceUsd: "0.08", unit: "per_second", resolution: "1080p" },
		// Video: Kling 3.0 - 720p and 1080p (standard-audio pricing)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.168", unit: "per_second", resolution: "720p", notes: "standard" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.252", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Hailuo/MiniMax - $0.50/6s video = $0.0833/sec
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, priceUsd: "0.0833", unit: "per_second", resolution: "720p", notes: "$0.50/6s" },
		// Video: Wan 2.2 - 720p ($1.00/5s = $0.20/sec)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.08", unit: "per_second", resolution: "720p", notes: "480p $0.40/5s" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.20", unit: "per_second", resolution: "1080p", notes: "720p $1.00/5s" },
		// Video: Grok Imagine Video - $0.05/sec (max 720p, no 1080p support)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("grok-imagine-video")!, priceUsd: "0.05", unit: "per_second", resolution: "720p" },
		// Video: Wan 2.5 - 480p, 720p, 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.05", unit: "per_second", resolution: "480p" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p" },
		// Video: Wan 2.6 - 720p, 1080p
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p" },
		// Video: Kling 3.0 Omni - 720p (standard), 1080p (pro)
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.168", unit: "per_second", resolution: "720p", notes: "standard" },
		{ toolId: replicateId, tierId: replicatePlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.224", unit: "per_second", resolution: "1080p", notes: "pro" },
	]);

	// Insert tool model pricing for fal.ai (API)
	console.log("[db:seed] inserting fal.ai API pricing");
	const falPlanId = planIdByKey.get(`${falId}:Pay-as-you-go`)!;

	await database.insert(toolModelPricing).values([
		// Image models
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("flux-2-pro")!, priceUsd: "0.05", unit: "per_image", resolution: "1080p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("seedream-4-5")!, priceUsd: "0.04", unit: "per_image", resolution: "2K" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("seedream-5-lite")!, priceUsd: "0.035", unit: "per_image", resolution: "2K" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("qwen-image")!, priceUsd: "0.02", unit: "per_megapixel", resolution: "1080p" },
		// Video: Kling 3.0 (with audio pricing) - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.112", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.168", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Veo 3.1 - 720p, 1080p, 4K (with audio)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.40", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.40", unit: "per_second", resolution: "1080p", notes: "with audio" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.60", unit: "per_second", resolution: "4K", notes: "with audio" },
		// Video: Veo 3.1 Fast - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.15", unit: "per_second", resolution: "720p", notes: "with audio" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p", notes: "with audio" },
		// Video: Veo 3.1 Lite - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1-lite")!, priceUsd: "0.05", unit: "per_second", resolution: "720p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3-1-lite")!, priceUsd: "0.08", unit: "per_second", resolution: "1080p" },
		// Video: Hailuo/MiniMax - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, priceUsd: "0.0667", unit: "per_second", resolution: "720p", notes: "768p actual" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, priceUsd: "0.111", unit: "per_second", resolution: "1080p" },
		// Video: Seedance 2.0 (max 720p)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("seedance-2-0")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		// Video: Seedance 2.0 Fast (max 720p)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("seedance-2-0-fast")!, priceUsd: "0.08", unit: "per_second", resolution: "720p" },
		// Video: Wan 2.7 - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-7-video")!, priceUsd: "0.104", unit: "per_second", resolution: "720p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-7-video")!, priceUsd: "0.16", unit: "per_second", resolution: "1080p" },
		// Video: Wan 2.2 - 720p and 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.06", unit: "per_second", resolution: "720p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.10", unit: "per_second", resolution: "1080p" },
		// Video: Grok Imagine Video - 720p (fal.ai pricing: 480p $0.05/sec, 720p $0.07/sec)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("grok-imagine-video")!, priceUsd: "0.07", unit: "per_second", resolution: "720p" },
		// Video: Veo 3 - 1080p (audio off/on)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("google-veo-3")!, priceUsd: "0.20", unit: "per_second", resolution: "1080p", notes: "audio off" },
		// Video: Kling 2.5 - 720p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-2-5")!, priceUsd: "0.07", unit: "per_second", resolution: "720p" },
		// Video: Kling 2.6 - 720p (with/without audio)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-2-6")!, priceUsd: "0.07", unit: "per_second", resolution: "720p", notes: "audio off" },
		// Video: Kling 3.0 Omni - 720p (standard), 1080p (pro)
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.168", unit: "per_second", resolution: "720p", notes: "standard" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.224", unit: "per_second", resolution: "1080p", notes: "pro" },
		// Video: Wan 2.5 - 480p, 720p, 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.05", unit: "per_second", resolution: "480p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p" },
		// Video: Wan 2.6 - 720p, 1080p
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: falId, tierId: falPlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p" },
	]);

	// Insert tool model pricing for AtlasCloud (API)
	console.log("[db:seed] inserting AtlasCloud API pricing");
	const atlascloudPlanId = planIdByKey.get(`${atlascloudId}:Pay-as-you-go`)!;

	await database.insert(toolModelPricing).values([
		// Video: Seedance 2.0 (max 720p - no 1080p support)
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("seedance-2-0")!, priceUsd: "0.085", unit: "per_second", resolution: "480p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("seedance-2-0")!, priceUsd: "0.127", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("seedance-2-0-fast")!, priceUsd: "0.068", unit: "per_second", resolution: "480p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("seedance-2-0-fast")!, priceUsd: "0.101", unit: "per_second", resolution: "720p" },
		// Video: Veo 3.1 variants - 720p and 1080p
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("google-veo-3-1-lite")!, priceUsd: "0.05", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.08", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("google-veo-3-1-fast")!, priceUsd: "0.10", unit: "per_second", resolution: "1080p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.16", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("google-veo-3-1")!, priceUsd: "0.20", unit: "per_second", resolution: "1080p" },
		// Video: Wan family - 480p, 720p, 1080p
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-7-video")!, priceUsd: "0.056", unit: "per_second", resolution: "480p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-7-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-7-video")!, priceUsd: "0.16", unit: "per_second", resolution: "1080p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.02", unit: "per_second", resolution: "480p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.03", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-2-video")!, priceUsd: "0.05", unit: "per_second", resolution: "1080p" },
		// Video: Kling 3.0 - 720p and 1080p
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.071", unit: "per_second", resolution: "720p", notes: "standard, 15% discount" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("kling-3-0")!, priceUsd: "0.095", unit: "per_second", resolution: "1080p", notes: "pro, 15% discount" },
		// Video: Kling 3.0 Omni - 720p and 1080p
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.071", unit: "per_second", resolution: "720p", notes: "standard, 15% discount" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("kling-3-0-omni")!, priceUsd: "0.095", unit: "per_second", resolution: "1080p", notes: "pro, 15% discount" },
		// Video: Hailuo Video-01 - 720p and 1080p (multiple tiers)
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, priceUsd: "0.19", unit: "per_second", resolution: "720p", notes: "fast" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("hailuo-video-01")!, priceUsd: "0.28", unit: "per_second", resolution: "1080p", notes: "standard" },
		// Video: Wan 2.5 - 480p, 720p, 1080p
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.05", unit: "per_second", resolution: "480p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.10", unit: "per_second", resolution: "720p" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-5-video")!, priceUsd: "0.15", unit: "per_second", resolution: "1080p" },
		// Video: Wan 2.6 - 720p (standard and flash)
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.018", unit: "per_second", resolution: "720p", notes: "flash, 30% discount" },
		{ toolId: atlascloudId, tierId: atlascloudPlanId, modelId: modelIdBySlug.get("wan-2-6-video")!, priceUsd: "0.07", unit: "per_second", resolution: "1080p", notes: "standard, 30% discount" },
	]);

	console.log("[db:seed] complete");
}

main().catch((error) => {
	console.error("[db:seed] failed", error);
	process.exit(1);
});
