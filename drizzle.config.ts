import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

function loadLocalDatabaseUrl() {
	if (process.env.DATABASE_URL) {
		return process.env.DATABASE_URL;
	}

	const envPath = resolve(process.cwd(), ".env");
	if (!existsSync(envPath)) {
		return "";
	}

	const envFile = readFileSync(envPath, "utf8");
	const match = envFile.match(/^DATABASE_URL=(.*)$/m);
	if (!match) {
		return "";
	}

	return match[1].trim().replace(/^['"]|['"]$/g, "");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: loadLocalDatabaseUrl(),
	},
});
