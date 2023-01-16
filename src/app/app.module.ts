import { AppService } from "./app.service.js";

export class AppModule {
	static async start(): Promise<void> {
		await new AppService().start();
		return;
	}
}
