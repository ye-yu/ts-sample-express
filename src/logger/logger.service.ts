import pino from "pino";
import HttpLogger, { pinoHttp } from "pino-http";
import { ConfigService } from "../config/config.service.js";

export class LoggerServiceImpl implements pino.BaseLogger {
	level: string;
	readonly logger: HttpLogger.HttpLogger;
	constructor(logger?: HttpLogger.HttpLogger) {
		this.logger =
			logger ??
			pinoHttp({
				level: ConfigService.app.logLevel,
				// to make it compatible with gcp log explorer
				messageKey: "message",
				errorKey: "message",
			});
	}
	meta: any;
	context = "default";
	setMeta(m: any): LoggerServiceImpl {
		this.meta = m;
		return this;
	}
	fatal = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.fatal(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.fatal(
				{ context: this.context },
				message,
				...formatter
			);
		}
		return;
	};
	error = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.error(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.error(
				{ context: this.context },
				message,
				...formatter
			);
		}
		return;
	};
	warn = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.warn(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.warn({ context: this.context }, message, ...formatter);
		}
		return;
	};
	info = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.info(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.info({ context: this.context }, message, ...formatter);
		}
		return;
	};
	debug = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.debug(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.debug(
				{ context: this.context },
				message,
				...formatter
			);
		}
		return;
	};
	trace = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, {
				context: this.context,
			});
			this.trace(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.trace(
				{ context: this.context },
				message,
				...formatter
			);
		}
		return;
	};
	silent = (..._: any[]): void => {
		return;
	};

	derivedLoggers: Record<string, LoggerServiceImpl> = {};
	for<T extends Object>(context: string | T): LoggerServiceImpl {
		const stringContext =
			typeof context === "string" ? context : context.constructor.name;
		if (this.derivedLoggers[stringContext])
			return this.derivedLoggers[stringContext];
		const logger = (this.derivedLoggers[stringContext] = new LoggerServiceImpl(
			this.logger
		));

		logger.context =
			this.context === "default"
				? stringContext
				: `${this.context}.${stringContext}`;
		return logger;
	}
}

export const LoggerService = new LoggerServiceImpl();
