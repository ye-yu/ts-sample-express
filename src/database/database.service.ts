import { DataSource, EntityManager, ObjectLiteral, Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service.js";
import { defaultDataSource } from "./data-sources/default.data-source.js";
import { RepoGetterType } from "./types/repo-getter.type.js";
import { ModelType } from "./types/model.type.js";

export class DatabaseServiceImpl implements RepoGetterType {
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

	async transaction<T = any>(
		callback: (
			// TODO: see if entity manager is not needed and should we remove it
			entityManager: EntityManager,
			repoGetter: RepoGetterType
		) => Promise<T>
	): Promise<T> {
		return await this.defaultDataSource.transaction(async (manager) => {
			return await callback(manager, {
				repo(model) {
					return manager.getRepository(model);
				},
			});
		});
	}
}

export const DatabaseService = new DatabaseServiceImpl();
