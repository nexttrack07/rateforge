import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

function loadLocalDatabaseUrl() {
	if (process.env.DATABASE_URL) {
		return process.env.DATABASE_URL;
	}

	const envPath = resolve(process.cwd(), ".env");
	if (!existsSync(envPath)) {
		return undefined;
	}

	const envFile = readFileSync(envPath, "utf8");
	const match = envFile.match(/^DATABASE_URL=(.*)$/m);
	if (!match) {
		return undefined;
	}

	return match[1].trim().replace(/^['"]|['"]$/g, "");
}

const databaseUrl = loadLocalDatabaseUrl();

export const db = databaseUrl
	? drizzle(neon(databaseUrl))
	: null;
