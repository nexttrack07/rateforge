import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, AlertCircle, Database } from "lucide-react";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	getPricingEntries,
	getPricingFilterOptions,
	type ModelCategory,
	type PricingEntry,
} from "@/lib/pricing/queries";
import { pricingEntries as mockPricingEntries } from "@/lib/mock-pricing";
import { createSEOMeta, createFAQSchema, serializeJsonLd, SITE_URL } from "@/lib/seo";

const compareFAQs = [
	{
		question: "How do you calculate AI model pricing?",
		answer:
			"We normalize all pricing to USD per generation. For platforms using credits, we calculate the actual dollar cost based on their subscription plans. For APIs, we use the published per-request pricing.",
	},
	{
		question: "Which AI platforms do you compare?",
		answer:
			"We compare pricing across major platforms including Replicate, fal.ai, Higgsfield, OpenArt, and AtlasCloud. We're constantly adding more platforms.",
	},
	{
		question: "How often is the pricing data updated?",
		answer:
			"We update pricing data daily to ensure accuracy. Prices are sourced directly from official platform pricing pages.",
	},
];

export const Route = createFileRoute("/compare")({
	component: ComparePage,
	head: () => ({
		meta: createSEOMeta({
			title: "Compare AI Model Pricing",
			description:
				"Side-by-side comparison of AI model pricing across all major platforms. Find the cheapest place to run Kling, FLUX, Veo, Sora, and more.",
			canonical: `${SITE_URL}/compare`,
			keywords: [
				"AI model pricing comparison",
				"Kling pricing",
				"FLUX pricing",
				"Veo pricing",
				"AI video cost",
				"AI image generation cost",
			],
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: serializeJsonLd(createFAQSchema(compareFAQs)),
			},
		],
	}),
	loader: async () => {
		try {
			const [pricingResult, filterOptions] = await Promise.all([
				getPricingEntries(),
				getPricingFilterOptions(),
			]);
			return { ...pricingResult, filterOptions };
		} catch (error) {
			console.error("Failed to load pricing data:", error);
			return {
				entries: [] as PricingEntry[],
				hasData: false,
				filterOptions: { categories: [], platforms: [], resolutions: [] as string[] },
			};
		}
	},
});

const categoryOptions: Array<{ value: ModelCategory | "all"; label: string }> = [
	{ value: "all", label: "All types" },
	{ value: "image", label: "Image" },
	{ value: "video", label: "Video" },
	{ value: "text", label: "Text" },
];

function ComparePage() {
	const loaderData = Route.useLoaderData();
	const [category, setCategory] = useState<ModelCategory | "all">("all");
	const [resolution, setResolution] = useState<string>("all");
	const [query, setQuery] = useState("");

	const resolutions: string[] = loaderData.filterOptions?.resolutions ?? [];

	// Use DB data if available, otherwise fall back to mock data
	const usingMockData = !loaderData.hasData || loaderData.entries.length === 0;
	const sourceEntries: PricingEntry[] = usingMockData
		? (mockPricingEntries as unknown as PricingEntry[])
		: loaderData.entries;

	const filteredEntries = useMemo(() => {
		return sourceEntries.filter((entry) => {
			const matchesCategory = category === "all" || entry.category === category;
			const matchesResolution = resolution === "all" || entry.resolution === resolution;
			const normalizedQuery = query.trim().toLowerCase();
			const haystack = [
				entry.modelName,
				entry.providerName,
				entry.platformName,
				entry.planName ?? "",
			]
				.join(" ")
				.toLowerCase();
			const matchesQuery =
				normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

			return matchesCategory && matchesResolution && matchesQuery;
		});
	}, [sourceEntries, category, resolution, query]);

	const hasActiveFilters = category !== "all" || resolution !== "all" || query.length > 0;

	const clearAllFilters = () => {
		setCategory("all");
		setResolution("all");
		setQuery("");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Compare AI pricing</h1>
				<p className="text-muted-foreground">
					Find the cheapest way to run any model across {sourceEntries.length} pricing options.
				</p>
			</div>

			{/* Data source indicator */}
			{usingMockData && (
				<div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm">
					<AlertCircle size={16} className="shrink-0 text-amber-400" />
					<span className="text-amber-200">
						Showing sample data. Connect database and add real pricing to see live data.
					</span>
				</div>
			)}

			{!usingMockData && (
				<div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
					<Database size={16} className="shrink-0 text-emerald-400" />
					<span className="text-emerald-200">
						Live pricing data from database ({sourceEntries.length} entries)
					</span>
				</div>
			)}

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative flex-1 min-w-[200px] max-w-sm">
					<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search models, platforms..."
						className="pl-9 pr-9"
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X size={14} />
						</button>
					)}
				</div>

				{/* Category Filter */}
				<div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
					{categoryOptions.map((opt) => (
						<Button
							key={opt.value}
							type="button"
							size="sm"
							variant={category === opt.value ? "default" : "ghost"}
							onClick={() => setCategory(opt.value)}
							className="h-7 px-3 text-xs"
						>
							{opt.label}
						</Button>
					))}
				</div>

				{/* Resolution Filter */}
				{resolutions.length > 0 && (
					<div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1 overflow-x-auto">
						<Button
							type="button"
							size="sm"
							variant={resolution === "all" ? "default" : "ghost"}
							onClick={() => setResolution("all")}
							className="h-7 px-3 text-xs shrink-0"
						>
							All resolutions
						</Button>
						{resolutions.map((res) => (
							<Button
								key={res}
								type="button"
								size="sm"
								variant={resolution === res ? "default" : "ghost"}
								onClick={() => setResolution(res)}
								className="h-7 px-3 text-xs shrink-0"
							>
								{res}
							</Button>
						))}
					</div>
				)}

				{/* Clear All */}
				{hasActiveFilters && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
					>
						<X size={12} />
						Clear all
					</Button>
				)}
			</div>

			{/* Active Filter Chips */}
			{hasActiveFilters && (
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs text-muted-foreground">Filtering by:</span>
					{query && (
						<Badge variant="secondary" className="gap-1.5 pr-1.5">
							Search: "{query}"
							<button
								type="button"
								onClick={() => setQuery("")}
								className="rounded-sm hover:bg-white/10"
							>
								<X size={12} />
							</button>
						</Badge>
					)}
					{category !== "all" && (
						<Badge variant="secondary" className="gap-1.5 pr-1.5 capitalize">
							Type: {category}
							<button
								type="button"
								onClick={() => setCategory("all")}
								className="rounded-sm hover:bg-white/10"
							>
								<X size={12} />
							</button>
						</Badge>
					)}
					{resolution !== "all" && (
						<Badge variant="secondary" className="gap-1.5 pr-1.5">
							Resolution: {resolution}
							<button
								type="button"
								onClick={() => setResolution("all")}
								className="rounded-sm hover:bg-white/10"
							>
								<X size={12} />
							</button>
						</Badge>
					)}
				</div>
			)}

			{/* Results */}
			<ComparisonTable
				entries={filteredEntries}
				title="Pricing comparison"
				description={`${filteredEntries.length} result${filteredEntries.length === 1 ? "" : "s"} · Sorted by price (lowest first)`}
			/>
		</div>
	);
}
