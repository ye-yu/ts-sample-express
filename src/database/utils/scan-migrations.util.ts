import { readdir } from "fs/promises";
import path from "path";
import { LoggerService } from "../../logger/logger.service.js";

export async function scanMigrations(): Promise<void> {
	const logger = LoggerService.for("database").for("scanMigrations");
	logger.info("Scanning migrations directory...");
	const currentPath = import.meta.url.substring("file://".length);
	const parentDirectory = path.dirname(currentPath);
	const migrationsDirectory = path.join(parentDirectory, "../migrations");
	const modelFilesCandidate = await readdir(migrationsDirectory);
	const modelFiles = modelFilesCandidate.filter(
		(e) => e.endsWith(".ts") || e.endsWith(".js")
	);
	const modelFilesToImport = modelFiles.map((e) =>
		path.join(migrationsDirectory, e)
	);

	for (let index = 0; index < modelFilesToImport.length; index++) {
		const model = modelFilesToImport[index];
		const clogger = logger.for("importTasks");
		clogger.info("Importing %s", path.basename(model));
		await import(model);
	}

	logger.info("Finished importing migrations");
}
