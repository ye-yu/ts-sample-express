import { DatasourceRegistryHandler } from "../types/datasource-registry-handler.type.js";

export const repoDatasourceRegistries: Record<string, Function[]> = {};

export const UseDataSourceRepo: DatasourceRegistryHandler = (
	source = "default"
) => {
	return (target) => {
		repoDatasourceRegistries[source] = repoDatasourceRegistries[source] ?? [];
		repoDatasourceRegistries[source].push(target);
	};
};

UseDataSourceRepo.get = (source = "default"): Function[] => {
	return repoDatasourceRegistries[source] ?? [];
};
