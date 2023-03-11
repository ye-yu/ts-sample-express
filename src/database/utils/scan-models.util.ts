import { readdir } from "fs/promises";
import path from "path";
import { LoggerService } from "../../logger/logger.service.js";

export async function scanModels(): Promise<void> {
	const logger = LoggerService.for("database").for("scanModels");
	logger.info("Scanning models directory...");
	const currentPath = import.meta.url.substring("file://".length);
	const parentDirectory = path.dirname(currentPath);
	const modelsDirectory = path.join(parentDirectory, "../models");
	const modelFilesCandidate = await readdir(modelsDirectory);
	const modelFiles = modelFilesCandidate.filter(
		(e) => e.endsWith(".ts") || e.endsWith(".js")
	);
	const modelFilesToImport = modelFiles.map((e) =>
		path.join(modelsDirectory, e)
	);
	for (let index = 0; index < modelFilesToImport.length; index++) {
		const model = modelFilesToImport[index];
		const clogger = logger.for("importTasks");
		clogger.debug("Importing %s", path.basename(model));
		await import(model);
	}
	logger.info("Finished importing models");
}
