import { DatabaseService } from "../database/database.service.js";
import { LoggerService } from "../logger/logger.service.js";
import { UserModel } from "../database/models/user.model.js";

export class AppService {
	async start(): Promise<void> {
		const logger = LoggerService.for(this);
		logger.debug("Initializing database...");
		await DatabaseService.start();
		const userModel = DatabaseService.repo(UserModel);
		const singleUser = await userModel.find();
		console.log(singleUser);
		return;
	}
}
