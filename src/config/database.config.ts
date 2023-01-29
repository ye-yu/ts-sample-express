export class DatabaseConfig {
	get databaseUrl(): string {
		return process.env.DATABASE_URL ?? "mysql://127.0.0.1:3306/";
	}

	get databaseUsername(): string {
		return process.env.DATABASE_USERNAME ?? "";
	}

	get databasePassword(): string {
		return process.env.DATABASE_PASSWORD ?? "";
	}

	get databaseDefaultDb(): string {
		return process.env.DATABASE_DEFAULT_DB ?? "app";
	}
}
