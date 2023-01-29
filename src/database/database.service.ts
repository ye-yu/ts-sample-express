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
		const modelAny: any = model;
		if (this.repoCache[modelAny]) return this.repoCache[modelAny];
		const repo: any = this.defaultDataSource.getRepository(modelAny);
		this.repoCache[modelAny] = repo;
		return repo;
	}
}

export const DatabaseService = new DatabaseServiceImpl();
