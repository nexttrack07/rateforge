import { cn } from "@/lib/utils";

export function AdminSelect({
	className,
	...props
}: React.ComponentProps<"select">) {
	return (
		<select
			className={cn(
				"border-white/10 h-10 w-full rounded-md border bg-white/[0.03] px-3.5 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-[color,box-shadow,border-color,background-color] focus-visible:border-white/20 focus-visible:bg-white/[0.045] focus-visible:ring-ring/40 focus-visible:ring-[3px]",
				className,
			)}
			{...props}
		/>
	);
}
