import { DatabaseService } from "../database/database.service.js";
import { LoggerService } from "../logger/logger.service.js";
import { ServerService } from "../server/server.service.js";

export class AppService {
	async start(): Promise<void> {
		const logger = LoggerService.for(this);
		logger.info("Initializing database...");
		await ServerService.start();
		await ServerService.configureRoutes();
		// serve endpoints immediately
		await ServerService.serve();
		await DatabaseService.start();
		return;
	}
}
