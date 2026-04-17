import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type ModelCategory,
	type PricingSurface,
	pricingEntries,
} from "@/lib/mock-pricing";

export const Route = createFileRoute("/compare")({
	component: ComparePage,
});

const categoryOptions: Array<{ value: ModelCategory | "all"; label: string }> = [
	{ value: "all", label: "All types" },
	{ value: "image", label: "Image" },
	{ value: "video", label: "Video" },
	{ value: "text", label: "Text" },
];

const surfaceOptions: Array<{ value: PricingSurface | "all"; label: string }> = [
	{ value: "all", label: "All" },
	{ value: "api", label: "API" },
	{ value: "platform", label: "Platform" },
];

function ComparePage() {
	const [category, setCategory] = useState<ModelCategory | "all">("all");
	const [surface, setSurface] = useState<PricingSurface | "all">("all");
	const [query, setQuery] = useState("");

	const filteredEntries = useMemo(() => {
		return pricingEntries.filter((entry) => {
			const matchesCategory = category === "all" || entry.category === category;
			const matchesSurface = surface === "all" || entry.surface === surface;
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

			return matchesCategory && matchesSurface && matchesQuery;
		});
	}, [category, query, surface]);

	const hasActiveFilters = category !== "all" || surface !== "all" || query.length > 0;

	const clearAllFilters = () => {
		setCategory("all");
		setSurface("all");
		setQuery("");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Compare AI pricing</h1>
				<p className="text-muted-foreground">
					Find the cheapest way to run any model across {pricingEntries.length} pricing options.
				</p>
			</div>

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

				{/* Surface Filter */}
				<div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
					{surfaceOptions.map((opt) => (
						<Button
							key={opt.value}
							type="button"
							size="sm"
							variant={surface === opt.value ? "default" : "ghost"}
							onClick={() => setSurface(opt.value)}
							className="h-7 px-3 text-xs"
						>
							{opt.label}
						</Button>
					))}
				</div>

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
					{surface !== "all" && (
						<Badge variant="secondary" className="gap-1.5 pr-1.5 capitalize">
							Surface: {surface}
							<button
								type="button"
								onClick={() => setSurface("all")}
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
