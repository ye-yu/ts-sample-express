import { LoggerService } from "../../logger/logger.service.js";
import { QueryRunner, Logger } from "typeorm";

export function createDatasourceLogger(datasource: string): Logger {
	const logger = LoggerService.for("datasource").for(datasource);
	const dsLogger: Logger = {
		logQuery: function (
			query: string,
			parameters?: any[] | undefined,
			queryRunner?: QueryRunner | undefined
		) {
			logger
				.setMeta({
					query,
					parameters,
					queryRunner,
				})
				.debug(`Query executed: %s`, query);
		},
		logQueryError: function (
			error: string | Error,
			query: string,
			parameters?: any[] | undefined,
			queryRunner?: QueryRunner | undefined
		) {
			const errorString = typeof error === "string" ? error : error.message;
			logger
				.setMeta({
					error,
					query,
					parameters,
					queryRunner,
				})
				.error(`Query returned error: %s. Query: %s`, error, query);
		},
		logQuerySlow: function (
			time: number,
			query: string,
			parameters?: any[] | undefined,
			queryRunner?: QueryRunner | undefined
		) {
			logger
				.setMeta({
					query,
					parameters,
					queryRunner,
				})
				.warn(`Query slow execution: %s ms. Query: %s`, time, query);
		},
		logSchemaBuild: function (
			message: string,
			queryRunner?: QueryRunner | undefined
		) {
			logger
				.setMeta({
					message,
					queryRunner,
				})
				.debug(`Query building schema: %s`, message);
		},
		logMigration: function (
			message: string,
			queryRunner?: QueryRunner | undefined
		) {
			logger
				.setMeta({
					message,
					queryRunner,
				})
				.info(`Query applying migration: %s`, message);
		},
		log: function (
			level: "warn" | "info" | "log",
			message: any,
			queryRunner?: QueryRunner | undefined
		) {
			if (level === "log") {
				logger
					.setMeta({
						message,
						queryRunner,
					})
					.debug(`Query: %s`, message);
			} else {
				logger
					.setMeta({
						message,
						queryRunner,
					})
					[level](`Query: %s`, message);
			}
		},
	};

	return dsLogger;
}
