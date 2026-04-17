import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const navItems = [
	{ to: "/compare", label: "Compare" },
	{ to: "/tools", label: "Tools" },
	{ to: "/about", label: "About" },
] as const;

export default function AppNav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate({ to: "/compare", search: { q: searchQuery.trim() } });
			setSearchQuery("");
			setSearchOpen(false);
		}
	};

	return (
		<header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
				{/* Logo */}
				<Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
					<Logo size="sm" />
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden items-center gap-1 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
							activeProps={{
								className:
									"rounded-md bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-foreground",
							}}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Right Side Actions */}
				<div className="flex items-center gap-2">
					{/* Search Toggle / Input */}
					{searchOpen ? (
						<form onSubmit={handleSearch} className="relative hidden sm:block">
							<Input
								type="search"
								placeholder="Search models..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-8 w-48 pr-8 text-sm lg:w-64"
								autoFocus
							/>
							<button
								type="button"
								onClick={() => {
									setSearchOpen(false);
									setSearchQuery("");
								}}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								<X size={14} />
							</button>
						</form>
					) : (
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setSearchOpen(true)}
							className="hidden text-muted-foreground hover:text-foreground sm:flex"
						>
							<Search size={16} />
						</Button>
					)}

					{/* Admin Link - Desktop */}
					<Link
						to="/admin"
						className="hidden rounded-md border border-white/[0.08] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground md:block"
						activeProps={{
							className:
								"hidden rounded-md border border-white/[0.08] bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-foreground md:block",
						}}
					>
						Admin
					</Link>

					{/* Mobile Menu */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground md:hidden"
							>
								<Menu size={20} />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72 bg-background">
							<SheetHeader>
								<SheetTitle>
									<Logo size="sm" />
								</SheetTitle>
							</SheetHeader>

							{/* Mobile Search */}
							<form onSubmit={handleSearch} className="mt-6">
								<div className="relative">
									<Search
										size={16}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									/>
									<Input
										type="search"
										placeholder="Search models..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>
							</form>

							{/* Mobile Nav Links */}
							<nav className="mt-6 flex flex-col gap-1">
								{navItems.map((item) => (
									<Link
										key={item.to}
										to={item.to}
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center justify-between rounded-lg px-3 py-2.5 text-foreground transition-colors hover:bg-white/[0.06]"
										activeProps={{
											className:
												"flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5 font-medium text-primary",
										}}
									>
										{item.label}
										<ArrowRight size={16} className="text-muted-foreground" />
									</Link>
								))}
								<div className="my-2 border-t border-white/[0.06]" />
								<Link
									to="/admin"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center justify-between rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
									activeProps={{
										className:
											"flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2.5 font-medium text-foreground",
									}}
								>
									Admin
									<ArrowRight size={16} className="text-muted-foreground" />
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
