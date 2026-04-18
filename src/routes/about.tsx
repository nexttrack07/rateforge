import { createFileRoute } from "@tanstack/react-router";
import { createSEOMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/about")({
	component: AboutPage,
	head: () => ({
		meta: createSEOMeta({
			title: "About Rateforge",
			description:
				"Learn about Rateforge, the independent AI pricing comparison tool. Our methodology, data sources, and mission to help creators understand AI costs.",
			canonical: `${SITE_URL}/about`,
		}),
	}),
});

function AboutPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold tracking-tight">About Rateforge</h1>
			<p className="max-w-3xl text-muted-foreground">
				Rateforge is a public pricing comparison product for AI generation
				models and platforms. It is intended to help creators understand actual
				costs, not just nominal credits or marketing plans.
			</p>
		</div>
	);
}
