import { DatabaseService } from "../database/database.service.js";
import { LoggerService } from "../logger/logger.service.js";

export class AppService {
	async start(): Promise<void> {
		const logger = LoggerService.for(this);
		logger.info("Initializing database...");
		await DatabaseService.start();
		return;
	}
}
