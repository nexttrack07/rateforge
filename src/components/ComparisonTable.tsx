import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { PricingEntry } from "@/lib/pricing/queries";
import { cn } from "@/lib/utils";

type SortField = "model" | "price" | "platform" | "updated";
type SortDirection = "asc" | "desc";

export function ComparisonTable({
	entries,
	title,
	description,
	showSorting = true,
}: {
	entries: PricingEntry[];
	title: string;
	description?: string;
	showSorting?: boolean;
}) {
	const [sortField, setSortField] = useState<SortField>("price");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedEntries = useMemo(() => {
		if (!showSorting) return entries;

		return [...entries].sort((a, b) => {
			let comparison = 0;
			switch (sortField) {
				case "model":
					comparison = a.modelName.localeCompare(b.modelName);
					break;
				case "price":
					comparison = a.priceValue - b.priceValue;
					break;
				case "platform":
					comparison = a.platformName.localeCompare(b.platformName);
					break;
				case "updated":
					comparison = a.lastUpdatedLabel.localeCompare(b.lastUpdatedLabel);
					break;
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});
	}, [entries, sortField, sortDirection, showSorting]);

	// Calculate price range for color coding
	const priceRange = useMemo(() => {
		if (entries.length === 0) return { min: 0, max: 1 };
		const prices = entries.map((e) => e.priceValue);
		return { min: Math.min(...prices), max: Math.max(...prices) };
	}, [entries]);

	const getPriceColor = (price: number) => {
		if (priceRange.max === priceRange.min) return "text-foreground";
		const normalized = (price - priceRange.min) / (priceRange.max - priceRange.min);
		if (normalized <= 0.33) return "text-emerald-400";
		if (normalized <= 0.66) return "text-amber-400";
		return "text-rose-400";
	};

	const lowestPrice = priceRange.min;

	return (
		<Card className="gap-0 overflow-hidden py-0">
			<CardHeader className="border-b border-white/[0.06] bg-white/[0.01] py-5">
				<CardTitle>{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="sticky top-0 z-10 bg-card/95 text-[11px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
							<tr className="border-b border-white/[0.06]">
								<SortableHeader
									label="Model"
									field="model"
									currentField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									showSorting={showSorting}
								/>
								<th className="px-4 py-3.5 font-medium">Provider</th>
								<th className="px-4 py-3.5 font-medium">Type</th>
								<SortableHeader
									label="Platform"
									field="platform"
									currentField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									showSorting={showSorting}
								/>
								<SortableHeader
									label="Price"
									field="price"
									currentField={sortField}
									direction={sortDirection}
									onSort={handleSort}
									showSorting={showSorting}
									className="text-right"
								/>
								<th className="px-4 py-3.5 font-medium">Resolution</th>
								<th className="px-4 py-3.5 font-medium">Updated</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/[0.04]">
							{sortedEntries.map((entry) => {
								const isBestValue = entry.priceValue === lowestPrice && entries.length > 1;
								return (
									<tr
										key={entry.id}
										className={cn(
											"align-top transition-colors hover:bg-white/[0.03]",
											isBestValue && "bg-emerald-500/[0.03]"
										)}
									>
										<td className="px-4 py-4">
											<div className="flex items-start gap-2">
												<div>
													<div className="font-medium text-foreground">
														{entry.modelName}
													</div>
													<div className="mt-1.5">
														<Badge variant="outline">{entry.category}</Badge>
													</div>
												</div>
											</div>
										</td>
										<td className="px-4 py-4 text-muted-foreground">
											{entry.providerName}
										</td>
										<td className="px-4 py-4">
											<Badge variant={entry.surface === "api" ? "default" : "outline"}>
												{entry.surface}
											</Badge>
										</td>
										<td className="px-4 py-4 text-muted-foreground">
											<div>{entry.platformName}</div>
											{entry.planName ? (
												<div className="mt-1 text-xs opacity-70">{entry.planName}</div>
											) : null}
										</td>
										<td className="px-4 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												{isBestValue && (
													<Badge variant="success" className="gap-1">
														<Trophy size={10} />
														Best
													</Badge>
												)}
												<div>
													<div className={cn("font-semibold", getPriceColor(entry.priceValue))}>
														{entry.priceLabel}
													</div>
													<div className="mt-0.5 text-xs text-muted-foreground">
														{entry.unitLabel}
													</div>
												</div>
											</div>
										</td>
										<td className="px-4 py-4 text-muted-foreground">
											{entry.resolution ?? "—"}
											{entry.audioIncluded ? (
												<div className="mt-1 text-xs font-medium text-primary">
													+ audio
												</div>
											) : null}
										</td>
										<td className="px-4 py-4 text-muted-foreground">
											<div>{entry.lastUpdatedLabel}</div>
											{entry.notes ? (
												<div className="mt-1 max-w-48 text-xs opacity-70">{entry.notes}</div>
											) : null}
										</td>
									</tr>
								);
							})}
							{sortedEntries.length === 0 && (
								<tr>
									<td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
										No results match your filters
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}

function SortableHeader({
	label,
	field,
	currentField,
	direction,
	onSort,
	showSorting,
	className,
}: {
	label: string;
	field: SortField;
	currentField: SortField;
	direction: SortDirection;
	onSort: (field: SortField) => void;
	showSorting: boolean;
	className?: string;
}) {
	const isActive = currentField === field;

	if (!showSorting) {
		return <th className={cn("px-4 py-3.5 font-medium", className)}>{label}</th>;
	}

	return (
		<th className={cn("px-4 py-3.5 font-medium", className)}>
			<button
				type="button"
				onClick={() => onSort(field)}
				className={cn(
					"inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
					isActive && "text-foreground"
				)}
			>
				{label}
				{isActive ? (
					direction === "asc" ? (
						<ArrowUp size={12} className="text-primary" />
					) : (
						<ArrowDown size={12} className="text-primary" />
					)
				) : (
					<ArrowUpDown size={12} className="opacity-40" />
				)}
			</button>
		</th>
	);
}
