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

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Rateforge",
			},
			{
				name: "description",
				content:
					"Compare AI model and platform pricing for image, video, and text generation.",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap",
			},
			{
				rel: "stylesheet",
				href: appCss,
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
