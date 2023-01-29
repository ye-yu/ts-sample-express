import { AppService } from "./app.service.js";

export class AppModuleImpl {
	readonly service = new AppService();
	async start(): Promise<void> {
		await this.service.start();
		return;
	}
}

export const AppModule = new AppModuleImpl();
