import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: AdminLayoutPage,
});

function AdminLayoutPage() {
	return <Outlet />;
}
