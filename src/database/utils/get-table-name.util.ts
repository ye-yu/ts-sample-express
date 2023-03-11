export function getTableName(model: any): string {
	if (model["_tableName"]) return model["_tableName"];
	const name: string = model.name;
	return (model["_tableName"] = name
		.split("")
		.flatMap((e) => (e.toUpperCase() === e ? ["_", e] : [e]))
		.join("")
		.toLocaleLowerCase()
		.replace(/_model$/g, "")
		.substring(1));
}
