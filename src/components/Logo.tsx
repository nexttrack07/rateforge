import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	showText?: boolean;
	size?: "sm" | "md" | "lg";
}

const sizes = {
	sm: { icon: 24, text: "text-[15px]", gap: "gap-2.5" },
	md: { icon: 28, text: "text-lg", gap: "gap-3" },
	lg: { icon: 36, text: "text-2xl", gap: "gap-4" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
	const { icon, text, gap } = sizes[size];

	return (
		<div className={cn("flex items-center", gap, className)}>
			<svg
				width={icon}
				height={icon}
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Rateforge logo"
			>
				{/* Three stacked bars - comparison/rates */}
				<rect x="4" y="6" width="18" height="5" rx="2.5" fill="url(#bar-gradient)" />
				<rect x="4" y="13.5" width="24" height="5" rx="2.5" fill="url(#bar-gradient)" fillOpacity="0.7" />
				<rect x="4" y="21" width="14" height="5" rx="2.5" fill="url(#bar-gradient)" fillOpacity="0.4" />

				{/* Spark accent */}
				<circle cx="27" cy="6" r="3" className="fill-primary" />

				<defs>
					<linearGradient id="bar-gradient" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
						<stop stopColor="oklch(0.8 0.15 180)" />
						<stop offset="1" stopColor="oklch(0.6 0.13 180)" />
					</linearGradient>
				</defs>
			</svg>
			{showText && (
				<span
					className={cn("font-semibold tracking-normal text-foreground", text)}
					style={{ fontFamily: "'Space Grotesk', sans-serif" }}
				>
					Rate<span className="text-primary">forge</span>
				</span>
			)}
		</div>
	);
}

export function LogoIcon({ className, size = 24 }: { className?: string; size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Rateforge"
		>
			<rect x="4" y="6" width="18" height="5" rx="2.5" fill="url(#icon-bar-gradient)" />
			<rect x="4" y="13.5" width="24" height="5" rx="2.5" fill="url(#icon-bar-gradient)" fillOpacity="0.7" />
			<rect x="4" y="21" width="14" height="5" rx="2.5" fill="url(#icon-bar-gradient)" fillOpacity="0.4" />
			<circle cx="27" cy="6" r="3" fill="oklch(0.75 0.15 180)" />
			<defs>
				<linearGradient id="icon-bar-gradient" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
					<stop stopColor="oklch(0.8 0.15 180)" />
					<stop offset="1" stopColor="oklch(0.6 0.13 180)" />
				</linearGradient>
			</defs>
		</svg>
	);
}
