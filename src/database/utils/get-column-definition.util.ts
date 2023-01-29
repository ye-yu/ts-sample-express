import { TableColumn, getMetadataArgsStorage } from "typeorm";
import { ModelType } from "../types/model.type.js";

export function getColumnDefinition<T>(
	model: ModelType<T>,
	property: keyof T
): TableColumn {
	const columns = getMetadataArgsStorage().filterColumns(model);
	const columnOptions = columns.find(
		(e) => e.propertyName === property
	)?.options;

	const generationsOptions = getMetadataArgsStorage().findGenerated(
		model,
		String(property)
	);
	if (!columnOptions) {
		const error = new Error("Unable to find property in model");
		error.cause = {
			model,
			property,
		};
		throw error;
	}
	const definition = new TableColumn();

	switch (columnOptions.type) {
		case Number: {
			definition.type = "int";
			break;
		}
		case String: {
			definition.type = "varchar";
			definition.length = `${columnOptions?.length ?? 100}`;
			break;
		}
		default: {
			const error = new Error("unable to infer column definition");
			error.cause = columnOptions;
			throw error;
		}
	}

	// check primary
	definition.isPrimary = columnOptions.primary ?? false;
	if (definition.isPrimary) {
		definition.primaryKeyConstraintName =
			columnOptions.primaryKeyConstraintName;
		definition.type = "bigint";
		if (generationsOptions) {
			definition.generationStrategy = generationsOptions.strategy;
			definition.isGenerated = true;
		}
	}

	definition.name = String(property);

	return definition;
}
