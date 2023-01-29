export interface DatasourceRegistryHandler {
	(source?: string): ClassDecorator;
	get(source?: string): Function[];
}
