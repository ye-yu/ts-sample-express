import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service.js";
import { defaultDataSource } from "./data-sources/default.data-source.js";
import { ModelType } from "./types/model.type.js";

export class DatabaseServiceImpl {
	defaultDataSource: DataSource;
	async initDataSources(): Promise<void> {
		this.defaultDataSource = defaultDataSource;
		await this.defaultDataSource.initialize();
	}

	readonly logger = LoggerService.for(this);
	async start(): Promise<void> {
		await this.initDataSources();
	}

	repoCache: Record<any, Repository<any>> = {};
	repo<K extends ObjectLiteral>(model: ModelType<K>): Repository<K> {
		if (this.repoCache[model as any]) return this.repoCache[model as any];
		const repo = this.defaultDataSource.getRepository(model as any);
		this.repoCache[model as any] = repo as any;
		return repo as any;
	}
}

export const DatabaseService = new DatabaseServiceImpl();
