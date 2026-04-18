import type { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import AppNav from "../components/AppNav";
import { Footer } from "../components/Footer";
import appCss from "../styles.css?url";
import {
	SITE_NAME,
	SITE_URL,
	SITE_DESCRIPTION,
	DEFAULT_OG_IMAGE,
	createOrganizationSchema,
	createWebsiteSchema,
	serializeJsonLd,
} from "../lib/seo";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE_NAME },
			{ name: "description", content: SITE_DESCRIPTION },
			// Open Graph defaults
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
			{ property: "og:title", content: SITE_NAME },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:image", content: DEFAULT_OG_IMAGE },
			// Twitter Card defaults
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_NAME },
			{ name: "twitter:description", content: SITE_DESCRIPTION },
			{ name: "twitter:image", content: DEFAULT_OG_IMAGE },
			// Additional SEO
			{ name: "theme-color", content: "#0a0a0a" },
			{ name: "robots", content: "index, follow" },
		],
		links: [
			{ rel: "canonical", href: SITE_URL },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap",
			},
			{ rel: "stylesheet", href: appCss },
		],
		scripts: [
			{
				type: "application/ld+json",
				children: serializeJsonLd([
					createOrganizationSchema(),
					createWebsiteSchema(),
				]),
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => (
		<div className="flex min-h-screen items-center justify-center bg-muted">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-foreground">404</h1>
				<p className="mt-2 text-muted-foreground">Page not found</p>
			</div>
		</div>
	),
});

function RootDocument() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
					<AppNav />
					<main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
						<Outlet />
					</main>
					<Footer />
				</div>
				<Scripts />
			</body>
		</html>
	);
}
