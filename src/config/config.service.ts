import { config } from "dotenv";
import { AppConfig } from "./app.config.js";
import { DatabaseConfig } from "./database.config.js";

export class ConfigServiceImpl {
	constructor() {
		config();
	}

	readonly app = new AppConfig();
	readonly database = new DatabaseConfig();
}

export const ConfigService = new ConfigServiceImpl();
