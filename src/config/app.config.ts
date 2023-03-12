import pino from "pino";

export class AppConfig {
	get env(): string {
		return process.env.NODE_ENV?.toLocaleLowerCase("en-us") ?? "development";
	}

	get appPort(): string {
		return process.env.APP_PORT?.toLocaleLowerCase("en-us") ?? "3000";
	}

	get logLevel(): pino.LevelWithSilent {
		const levels = [
			"fatal",
			"error",
			"warn",
			"info",
			"debug",
			"trace",
			"silent",
		] as const;
		return (
			levels.find(
				(e) => process.env.LOG_LEVEL?.toLocaleLowerCase("en-us") === e
			) ?? "info"
		);
	}
}
