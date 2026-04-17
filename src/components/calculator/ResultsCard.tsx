import { TrendingDown, TrendingUp, Minus, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
	title: string;
	value: string;
	subtitle?: string;
	trend?: "up" | "down" | "neutral";
	trendLabel?: string;
	highlight?: "best" | "worst" | "default";
	breakdown?: Array<{ label: string; value: string; percentage?: number }>;
	className?: string;
}

export function ResultsCard({
	title,
	value,
	subtitle,
	trend,
	trendLabel,
	highlight = "default",
	breakdown,
	className,
}: ResultsCardProps) {
	const TrendIcon =
		trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg border p-5 transition-all",
				highlight === "best" &&
					"border-emerald-500/30 bg-emerald-500/[0.05]",
				highlight === "worst" &&
					"border-rose-500/30 bg-rose-500/[0.05]",
				highlight === "default" &&
					"border-white/[0.08] bg-white/[0.02]",
				className
			)}
		>
			{/* Highlight badge */}
			{highlight === "best" && (
				<Badge
					variant="success"
					className="absolute right-3 top-3 gap-1"
				>
					<Trophy size={10} />
					Best value
				</Badge>
			)}

			{/* Title */}
			<div className="text-sm font-medium text-muted-foreground">{title}</div>

			{/* Main value */}
			<div className="mt-2 flex items-baseline gap-3">
				<span
					className={cn(
						"text-3xl font-bold tabular-nums tracking-tight",
						highlight === "best" && "text-emerald-400",
						highlight === "worst" && "text-rose-400",
						highlight === "default" && "text-foreground"
					)}
				>
					{value}
				</span>
				{trend && trendLabel && (
					<span
						className={cn(
							"flex items-center gap-1 text-sm font-medium",
							trend === "down" && "text-emerald-400",
							trend === "up" && "text-rose-400",
							trend === "neutral" && "text-muted-foreground"
						)}
					>
						<TrendIcon size={14} />
						{trendLabel}
					</span>
				)}
			</div>

			{/* Subtitle */}
			{subtitle && (
				<div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
			)}

			{/* Cost breakdown */}
			{breakdown && breakdown.length > 0 && (
				<div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
					{breakdown.map((item) => (
						<div
							key={item.label}
							className="flex items-center justify-between text-sm"
						>
							<span className="text-muted-foreground">{item.label}</span>
							<div className="flex items-center gap-2">
								<span className="font-medium tabular-nums text-foreground">
									{item.value}
								</span>
								{item.percentage !== undefined && (
									<span className="text-xs text-muted-foreground">
										({item.percentage}%)
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface ComparisonResultProps {
	options: Array<{
		id: string;
		name: string;
		subtitle?: string;
		cost: number;
		costLabel: string;
		features?: string[];
	}>;
	className?: string;
}

export function ComparisonResult({ options, className }: ComparisonResultProps) {
	if (options.length === 0) return null;

	const sortedOptions = [...options].sort((a, b) => a.cost - b.cost);
	const bestCost = sortedOptions[0]?.cost ?? 0;

	return (
		<div className={cn("space-y-3", className)}>
			{sortedOptions.map((option, index) => {
				const isBest = index === 0 && options.length > 1;
				const savings = option.cost - bestCost;
				const savingsPercent =
					bestCost > 0 ? Math.round((savings / option.cost) * 100) : 0;

				return (
					<div
						key={option.id}
						className={cn(
							"relative flex items-center gap-4 rounded-lg border p-4 transition-all",
							isBest
								? "border-emerald-500/30 bg-emerald-500/[0.05]"
								: "border-white/[0.08] bg-white/[0.02]"
						)}
					>
						{/* Rank */}
						<div
							className={cn(
								"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
								isBest
									? "bg-emerald-500/20 text-emerald-400"
									: "bg-white/[0.06] text-muted-foreground"
							)}
						>
							{index + 1}
						</div>

						{/* Info */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<span className="font-medium text-foreground">
									{option.name}
								</span>
								{isBest && (
									<Badge variant="success" className="gap-1">
										<Sparkles size={10} />
										Recommended
									</Badge>
								)}
							</div>
							{option.subtitle && (
								<div className="mt-0.5 text-sm text-muted-foreground">
									{option.subtitle}
								</div>
							)}
							{option.features && option.features.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-1.5">
									{option.features.map((f) => (
										<Badge key={f} variant="outline" className="text-xs">
											{f}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* Cost */}
						<div className="text-right">
							<div
								className={cn(
									"text-lg font-bold tabular-nums",
									isBest ? "text-emerald-400" : "text-foreground"
								)}
							>
								{option.costLabel}
							</div>
							{!isBest && savings > 0 && (
								<div className="mt-0.5 text-xs text-muted-foreground">
									+${savings.toFixed(2)} ({savingsPercent}% more)
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
