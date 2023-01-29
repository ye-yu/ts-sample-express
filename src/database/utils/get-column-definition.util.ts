import { TableColumn, getMetadataArgsStorage } from "typeorm";
import { UserModel } from "../models/user.model.js";
import { ModelType } from "../types/model.type.js";

export function getColumnDefinition<T>(
	model: ModelType<T>,
	property: keyof T
): TableColumn {
	const properties = getMetadataArgsStorage().filterColumns(model);
	const columnOptions = properties.find(
		(e) => e.propertyName === property
	)?.options;
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
		definition.generationStrategy = "increment";
		definition.isGenerated = true;
	}

	definition.name = String(property);

	return definition;
}

getColumnDefinition(UserModel, "id");
