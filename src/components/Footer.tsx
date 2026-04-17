import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const footerLinks = {
	product: [
		{ to: "/compare", label: "Compare prices" },
		{ to: "/tools", label: "Calculators" },
	],
	resources: [
		{ to: "/about", label: "About" },
		{ to: "/about", label: "Methodology" },
	],
};

export function Footer() {
	return (
		<footer className="border-t border-white/[0.06] bg-background/50">
			<div className="mx-auto max-w-6xl px-6 py-12">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Logo size="sm" />
						<p className="mt-4 max-w-sm text-sm text-muted-foreground">
							Compare AI model pricing across APIs and platforms.
							Stop overpaying for image, video, and text generation.
						</p>
					</div>

					{/* Product Links */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Product</h3>
						<ul className="mt-4 space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Resources</h3>
						<ul className="mt-4 space-y-3">
							{footerLinks.resources.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Rateforge. Pricing data updated daily.
					</p>
					<p className="text-xs text-muted-foreground">
						Built for creators who care about costs.
					</p>
				</div>
			</div>
		</footer>
	);
}
