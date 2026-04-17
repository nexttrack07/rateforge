import { cn } from "@/lib/utils";

interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	valueLabel?: string | ((value: number) => string);
	className?: string;
}

function Slider({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	label,
	valueLabel,
	className,
}: SliderProps) {
	const percentage = ((value - min) / (max - min)) * 100;

	const displayValue =
		typeof valueLabel === "function"
			? valueLabel(value)
			: valueLabel ?? value.toLocaleString();

	return (
		<div className={cn("space-y-3", className)}>
			{label && (
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium text-foreground">{label}</label>
					<span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary tabular-nums">
						{displayValue}
					</span>
				</div>
			)}
			<div className="relative">
				<div className="pointer-events-none absolute inset-0 flex items-center">
					<div className="h-2 w-full rounded-full bg-white/[0.08]">
						<div
							className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all"
							style={{ width: `${percentage}%` }}
						/>
					</div>
				</div>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className={cn(
						"relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent",
						"[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.2)] [&::-webkit-slider-thumb]:transition-shadow",
						"[&::-webkit-slider-thumb]:hover:shadow-[0_0_0_6px_rgba(var(--primary-rgb),0.25)]",
						"[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
					)}
				/>
			</div>
		</div>
	);
}

export { Slider };
