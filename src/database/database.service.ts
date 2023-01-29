import { readdir } from "fs/promises";
import path from "path";
import { ConfigService } from "../config/config.service.js";
import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { LoggerService, LoggerServiceImpl } from "../logger/logger.service.js";
import { createDatasourceLogger } from "./utils/create-datasource-logger.util.js";
import { UseDataSourceRepo } from "./decorators/use-data-source-repo.decorator.js";
import { UseDataSourceMigration } from "./decorators/use-data-source-migration.decorator.js";

export class DatabaseServiceImpl {
	defaultDataSource: DataSource;
	async initDataSources(): Promise<void> {
		const datasourceOption: DataSourceOptions = {
			type: "mysql",
			url: ConfigService.database.databaseUrl,
			database: ConfigService.database.databaseDefaultDb,
			logger: createDatasourceLogger("default"),
			entities: UseDataSourceRepo.get("default"),
			migrations: UseDataSourceMigration.get("default"),
			migrationsTableName: "_typeorm_migrations",
		};

		if (
			ConfigService.database.databaseUsername &&
			ConfigService.database.databasePassword
		) {
			Object.assign(datasourceOption, {
				username: ConfigService.database.databaseUsername,
				password: ConfigService.database.databasePassword,
			});
		}

		this.defaultDataSource = new DataSource(datasourceOption);
		await this.defaultDataSource.initialize();
	}

	logger: LoggerServiceImpl;
	async start(): Promise<void> {
		this.logger = LoggerService.for(this);
		await this.scanModels();
		try {
			await this.scanMigrations();
		} catch (_) {
			this.logger.debug("No migrations file found.");
		}
		await this.initDataSources();
	}

	async scanModels(): Promise<void> {
		this.logger.info("Scanning models directory...");
		const currentPath = import.meta.url.substring("file://".length);
		const parentDirectory = path.dirname(currentPath);
		const modelsDirectory = path.join(parentDirectory, "models");
		const modelFilesCandidate = await readdir(modelsDirectory);
		const modelFiles = modelFilesCandidate.filter(
			(e) => e.endsWith(".ts") || e.endsWith(".js")
		);
		const modelFilesToImport = modelFiles.map((e) =>
			path.join(modelsDirectory, e)
		);
		const importTasks = modelFilesToImport.map(async (model) => {
			const logger = this.logger.for("importTasks");
			logger.debug("Importing %s", path.basename(model));
			await import(model);
		});

		await Promise.all(importTasks);
		this.logger.info("Finished importing models");
	}

	async scanMigrations(): Promise<void> {
		this.logger.info("Scanning migrations directory...");
		const currentPath = import.meta.url.substring("file://".length);
		const parentDirectory = path.dirname(currentPath);
		const migrationsDirectory = path.join(parentDirectory, "migrations");
		const modelFilesCandidate = await readdir(migrationsDirectory);
		const modelFiles = modelFilesCandidate.filter(
			(e) => e.endsWith(".ts") || e.endsWith(".js")
		);
		const modelFilesToImport = modelFiles.map((e) =>
			path.join(migrationsDirectory, e)
		);
		const importTasks = modelFilesToImport.map(async (model) => {
			const logger = this.logger.for("importTasks");
			logger.debug("Importing %s", path.basename(model));
			await import(model);
		});

		await Promise.all(importTasks);
		this.logger.info("Finished importing migrations");
	}

	repoCache: Record<any, Repository<any>> = {};
	repo<T extends Function>(model: T): Repository<T> {
		if (this.repoCache[model]) return this.repoCache[model];
		const repo: Repository<T> = this.defaultDataSource.getRepository(model);
		this.repoCache[model] = repo as any;
		return repo;
	}
}

export const DatabaseService = new DatabaseServiceImpl();
