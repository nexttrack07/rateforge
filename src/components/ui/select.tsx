import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	label?: string;
	placeholder?: string;
	className?: string;
}

function Select({
	value,
	onChange,
	options,
	label,
	placeholder = "Select...",
	className,
}: SelectProps) {
	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<label className="text-sm font-medium text-foreground">{label}</label>
			)}
			<div className="relative">
				<select
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={cn(
						"h-10 w-full appearance-none rounded-md border border-white/10 bg-white/[0.03] px-3.5 py-2 pr-10 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[color,box-shadow,border-color,background-color] outline-none",
						"focus:border-white/20 focus:bg-white/[0.045] focus:ring-ring/40 focus:ring-[3px]",
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					)}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((opt) => (
						<option key={opt.value} value={opt.value} className="bg-card">
							{opt.label}
						</option>
					))}
				</select>
				<ChevronDown
					size={16}
					className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
				/>
			</div>
		</div>
	);
}

export { Select, type SelectOption };
