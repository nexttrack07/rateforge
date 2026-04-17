import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default: "bg-primary/15 text-primary border-primary/20 [a&]:hover:bg-primary/25",
				secondary:
					"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"bg-destructive/15 text-destructive border-destructive/20 [a&]:hover:bg-destructive/25",
				success:
					"bg-emerald-500/15 text-emerald-400 border-emerald-500/20 [a&]:hover:bg-emerald-500/25",
				warning:
					"bg-amber-500/15 text-amber-400 border-amber-500/20 [a&]:hover:bg-amber-500/25",
				outline:
					"border-white/15 text-muted-foreground bg-white/[0.03] [a&]:hover:bg-white/[0.06] [a&]:hover:text-foreground",
				ghost: "text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				link: "text-primary underline-offset-4 [a&]:hover:underline",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
