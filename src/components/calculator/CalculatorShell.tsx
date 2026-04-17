import type * as React from "react";
import { Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorShellProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	onShare?: () => void;
	embedUrl?: string;
	className?: string;
}

export function CalculatorShell({
	title,
	description,
	children,
	onShare,
	embedUrl,
	className,
}: CalculatorShellProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent",
				className
			)}
		>
			{/* Subtle glow effect */}
			<div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-primary/10 blur-3xl" />

			{/* Header */}
			<div className="relative border-b border-white/[0.06] bg-white/[0.02] px-6 py-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-lg font-semibold text-foreground">{title}</h2>
						{description && (
							<p className="mt-1 text-sm text-muted-foreground">{description}</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						{onShare && (
							<Button
								variant="ghost"
								size="sm"
								onClick={onShare}
								className="gap-1.5 text-muted-foreground hover:text-foreground"
							>
								<Share2 size={14} />
								Share
							</Button>
						)}
						{embedUrl && (
							<a
								href={embedUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							>
								<ExternalLink size={14} />
								Embed
							</a>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="relative p-6">{children}</div>
		</div>
	);
}

interface CalculatorSectionProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export function CalculatorSection({
	title,
	children,
	className,
}: CalculatorSectionProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{title && (
				<h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{title}
				</h3>
			)}
			{children}
		</div>
	);
}

interface CalculatorGridProps {
	children: React.ReactNode;
	className?: string;
}

export function CalculatorGrid({ children, className }: CalculatorGridProps) {
	return (
		<div
			className={cn(
				"grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1px_1fr]",
				className
			)}
		>
			{children}
		</div>
	);
}

export function CalculatorDivider() {
	return (
		<div className="hidden bg-white/[0.06] lg:block" aria-hidden="true" />
	);
}
