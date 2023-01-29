import { DatabaseService } from "src/database/database.service.js";
import { LoggerService } from "src/logger/logger.service.js";

export class AppService {
	async start(): Promise<void> {
		const logger = LoggerService.for(this);
		logger.debug("Initializing database...");
		await DatabaseService.start();
		return;
	}
}
