import { DataSource, EntityManager, ObjectLiteral, Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service.js";
import { defaultDataSource } from "./data-sources/default.data-source.js";
import { RepoGetterType } from "./types/repo-getter.type.js";
import { ModelType } from "./types/model.type.js";
import { HealthServiceStatus } from "../health/types/health-service-status.type.js";
import { HealthService } from "../health/health.service.js";

export class DatabaseServiceImpl implements RepoGetterType {
	static readonly instance = new DatabaseServiceImpl();
	defaultDataSource: DataSource;
	initializationError: Error | null = null;
	async initDataSources(): Promise<void> {
		this.defaultDataSource = defaultDataSource;
		while (!this.defaultDataSource.isInitialized) {
			try {
				await this.defaultDataSource.initialize();
			} catch (error) {
				this.initializationError = error;
			}
		}
	}

	async healthCheck(): Promise<HealthServiceStatus> {
		if (!this.defaultDataSource.isInitialized) {
			return {
				ok: false,
				service: "database",
				message: this.initializationError?.message ?? "not initialized",
			};
		}
		await this.defaultDataSource.query("select 1;");
		return {
			ok: true,
			service: "database",
		};
	}

	readonly logger = LoggerService.for(this);
	async start(): Promise<void> {
		HealthService.registerHealthHook("database", this.healthCheck.bind(this));
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

export const DatabaseService = DatabaseServiceImpl.instance;
