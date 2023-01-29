import { LoggerService } from "../../logger/logger.service.js";
import { scanMigrations } from "../utils/scan-migrations.util.js";
import { scanModels } from "../utils/scan-models.util.js";

const logger = LoggerService.for("database");

await scanModels();
try {
	await scanMigrations();
} catch (_) {
	logger.debug("No migrations file found.");
}
