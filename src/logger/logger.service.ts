import pino from "pino";
import HttpLogger, { pinoHttp } from "pino-http";
import { ConfigService } from "../config/config.service.js";
import { getCurrentCallingLocation } from "../common/utils/get-current-calling-location.util.js";

export class LoggerServiceImpl implements pino.BaseLogger {
	level: string;
	readonly logger: HttpLogger.HttpLogger;
	constructor(logger?: HttpLogger.HttpLogger) {
		this.logger =
			logger ??
			pinoHttp({
				level: ConfigService.app.logLevel,
				transport:
					ConfigService.app.env === "development"
						? {
								target: "pino-pretty",
						  }
						: undefined,
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
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.fatal(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.fatal(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	error = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.error(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.error(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	warn = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.warn(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.warn(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	info = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.info(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.info(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	debug = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.debug(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.debug(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	trace = (message: string, ...formatter: any[]): void => {
		if (this.meta) {
			Object.assign(this.meta, this.getContextObject());
			this.logger.logger.trace(this.meta, message, ...formatter);
			this.meta = undefined;
		} else {
			this.logger.logger.trace(this.getContextObject(), message, ...formatter);
		}
		return;
	};
	silent = (..._: any[]): void => {
		return;
	};

	derivedLoggers: Record<string, LoggerServiceImpl> = {};
	private getContextObject(): { context: string; at: string } {
		return {
			context: this.context,
			at: getCurrentCallingLocation(),
		};
	}

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
