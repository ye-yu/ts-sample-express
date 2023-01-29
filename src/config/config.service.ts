import { config } from "dotenv";
import { AppConfig } from "./app.config.js";

export class ConfigServiceImpl {
	constructor() {
		config();
	}

	readonly app = new AppConfig();
}

export const ConfigService = new ConfigServiceImpl();
