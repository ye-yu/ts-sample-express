import path from "path";
import { LoggerService } from "../logger/logger.service.js";
import glob from "glob";
import { Get } from "./decorators/get.decorator.js";
import { Post } from "./decorators/post.decorator.js";
import { Put } from "./decorators/put.decorator.js";
import { Patch } from "./decorators/patch.decorator.js";
import { Delete } from "./decorators/delete.decorator.js";
import express = require("express");
import { locateWithSourceMap } from "../common/utils/locate-with-source-map.util.js";

export class ServerServiceImpl {
	readonly logger = LoggerService.for("server");
	readonly app: import("express").Application = express();
	async start(): Promise<void> {
		this.logger.info("Scanning request handlers...");

		const modelFilesCandidate = await glob("**/*.controller.js", {
			ignore: "node_modules/**",
			absolute: true,
		});

		const modelFiles = modelFilesCandidate.filter((e) => e);
		const modelFilesToImport = modelFiles;
		for (let index = 0; index < modelFilesToImport.length; index++) {
			const model = modelFilesToImport[index];
			const clogger = this.logger.for("importTasks");
			clogger.info("Importing %s", path.basename(model));
			await import(model);
		}
		this.logger.info("Finished importing request handlers");
	}

	async configureRoutes() {
		const methodDecorators = [Get, Post, Put, Patch, Delete];

		for (const decorator of methodDecorators) {
			for (const handler of decorator.handlers) {
				const location = await locateWithSourceMap(handler.handler);
				this.logger.info(
					`${decorator.method.toLocaleUpperCase()} ${handler.route} ` +
						`-> ` +
						`${handler.name} ` +
						`(${location.source}:${location.line}:${location.column})`
				);
			}
		}
	}
}

export const ServerService = new ServerServiceImpl();
