import { cn } from "@/lib/utils";

interface CostBarProps {
	items: Array<{
		id: string;
		label: string;
		value: number;
		color?: "primary" | "success" | "warning" | "danger" | "muted";
	}>;
	formatValue?: (value: number) => string;
	showLabels?: boolean;
	className?: string;
}

const colorClasses = {
	primary: "bg-primary",
	success: "bg-emerald-500",
	warning: "bg-amber-500",
	danger: "bg-rose-500",
	muted: "bg-white/20",
};

const textColorClasses = {
	primary: "text-primary",
	success: "text-emerald-400",
	warning: "text-amber-400",
	danger: "text-rose-400",
	muted: "text-muted-foreground",
};

export function CostBar({
	items,
	formatValue = (v) => `$${v.toFixed(2)}`,
	showLabels = true,
	className,
}: CostBarProps) {
	const maxValue = Math.max(...items.map((i) => i.value), 0.01);

	return (
		<div className={cn("space-y-3", className)}>
			{items.map((item, index) => {
				const percentage = (item.value / maxValue) * 100;
				const color = item.color ?? (index === 0 ? "success" : "muted");
				const isLowest =
					item.value === Math.min(...items.map((i) => i.value)) &&
					items.length > 1;

				return (
					<div key={item.id} className="space-y-1.5">
						{showLabels && (
							<div className="flex items-center justify-between text-sm">
								<span
									className={cn(
										"font-medium",
										isLowest ? "text-emerald-400" : "text-foreground"
									)}
								>
									{item.label}
								</span>
								<span
									className={cn(
										"tabular-nums",
										textColorClasses[color]
									)}
								>
									{formatValue(item.value)}
								</span>
							</div>
						)}
						<div className="relative h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500 ease-out",
									colorClasses[color]
								)}
								style={{ width: `${percentage}%` }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}

interface StackedCostBarProps {
	segments: Array<{
		id: string;
		label: string;
		value: number;
		color: "primary" | "success" | "warning" | "danger" | "muted";
	}>;
	total?: number;
	formatValue?: (value: number) => string;
	className?: string;
}

export function StackedCostBar({
	segments,
	total,
	formatValue = (v) => `$${v.toFixed(2)}`,
	className,
}: StackedCostBarProps) {
	const computedTotal = total ?? segments.reduce((sum, s) => sum + s.value, 0);

	return (
		<div className={cn("space-y-3", className)}>
			{/* Stacked bar */}
			<div className="relative h-4 w-full overflow-hidden rounded-full bg-white/[0.06]">
				<div className="flex h-full">
					{segments.map((segment) => {
						const percentage = (segment.value / computedTotal) * 100;
						return (
							<div
								key={segment.id}
								className={cn(
									"h-full transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full",
									colorClasses[segment.color]
								)}
								style={{ width: `${percentage}%` }}
								title={`${segment.label}: ${formatValue(segment.value)}`}
							/>
						);
					})}
				</div>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-x-4 gap-y-1">
				{segments.map((segment) => (
					<div key={segment.id} className="flex items-center gap-2 text-sm">
						<div
							className={cn("h-2.5 w-2.5 rounded-full", colorClasses[segment.color])}
						/>
						<span className="text-muted-foreground">{segment.label}</span>
						<span className="tabular-nums text-foreground">
							{formatValue(segment.value)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

interface BreakEvenChartProps {
	apiCostPerUnit: number;
	subscriptionCost: number;
	includedUnits: number;
	overageCost?: number;
	maxUnits?: number;
	unitLabel?: string;
	className?: string;
}

export function BreakEvenChart({
	apiCostPerUnit,
	subscriptionCost,
	includedUnits,
	overageCost = 0,
	maxUnits = 500,
	unitLabel = "generations",
	className,
}: BreakEvenChartProps) {
	// Calculate break-even point
	const breakEvenPoint =
		overageCost > 0 && overageCost < apiCostPerUnit
			? Math.ceil(
					(subscriptionCost - includedUnits * (apiCostPerUnit - overageCost)) /
						(apiCostPerUnit - overageCost)
				)
			: Math.ceil(subscriptionCost / apiCostPerUnit);

	const adjustedBreakEven = Math.max(0, breakEvenPoint);
	const chartMax = Math.max(maxUnits, adjustedBreakEven * 1.5);

	// Generate points for the chart
	const points = 50;
	const apiLine: Array<{ x: number; y: number }> = [];
	const subLine: Array<{ x: number; y: number }> = [];

	for (let i = 0; i <= points; i++) {
		const units = (i / points) * chartMax;
		apiLine.push({ x: units, y: units * apiCostPerUnit });

		const subCost =
			units <= includedUnits
				? subscriptionCost
				: subscriptionCost + (units - includedUnits) * overageCost;
		subLine.push({ x: units, y: subCost });
	}

	const maxY = Math.max(
		...apiLine.map((p) => p.y),
		...subLine.map((p) => p.y)
	);

	const toSvgX = (x: number) => (x / chartMax) * 100;
	const toSvgY = (y: number) => 100 - (y / maxY) * 90;

	const apiPath = apiLine
		.map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
		.join(" ");
	const subPath = subLine
		.map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
		.join(" ");

	return (
		<div className={cn("space-y-4", className)}>
			{/* Chart */}
			<div className="relative aspect-[2/1] w-full rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
				<svg
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className="h-full w-full"
				>
					{/* Grid lines */}
					{[0, 25, 50, 75, 100].map((y) => (
						<line
							key={y}
							x1="0"
							y1={y}
							x2="100"
							y2={y}
							stroke="currentColor"
							strokeOpacity="0.05"
							vectorEffect="non-scaling-stroke"
						/>
					))}

					{/* Break-even vertical line */}
					{adjustedBreakEven > 0 && adjustedBreakEven < chartMax && (
						<line
							x1={toSvgX(adjustedBreakEven)}
							y1="5"
							x2={toSvgX(adjustedBreakEven)}
							y2="100"
							stroke="currentColor"
							strokeOpacity="0.2"
							strokeDasharray="2,2"
							vectorEffect="non-scaling-stroke"
						/>
					)}

					{/* API line */}
					<path
						d={apiPath}
						fill="none"
						stroke="oklch(0.75 0.15 180)"
						strokeWidth="2"
						vectorEffect="non-scaling-stroke"
					/>

					{/* Subscription line */}
					<path
						d={subPath}
						fill="none"
						stroke="oklch(0.7 0.12 140)"
						strokeWidth="2"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>

				{/* Break-even marker */}
				{adjustedBreakEven > 0 && adjustedBreakEven < chartMax && (
					<div
						className="absolute top-2 -translate-x-1/2 rounded bg-white/10 px-2 py-1 text-xs font-medium"
						style={{ left: `${toSvgX(adjustedBreakEven)}%` }}
					>
						Break-even: {Math.round(adjustedBreakEven)} {unitLabel}
					</div>
				)}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
				<div className="flex items-center gap-2 text-sm">
					<div className="h-0.5 w-4 rounded-full bg-primary" />
					<span className="text-muted-foreground">API (pay-per-use)</span>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<div className="h-0.5 w-4 rounded-full bg-emerald-500" />
					<span className="text-muted-foreground">Subscription</span>
				</div>
			</div>

			{/* Summary */}
			<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center">
				{adjustedBreakEven > 0 ? (
					<>
						<div className="text-sm text-muted-foreground">
							Subscription becomes cheaper after
						</div>
						<div className="mt-1 text-2xl font-bold text-foreground">
							{Math.round(adjustedBreakEven)} {unitLabel}/month
						</div>
					</>
				) : (
					<div className="text-sm text-muted-foreground">
						API is always cheaper at current pricing
					</div>
				)}
			</div>
		</div>
	);
}
