import { TableColumn, getMetadataArgsStorage, ColumnType } from "typeorm";
import { ModelType } from "../types/model.type.js";

function columnTypeOfString(
	column?: ColumnType
): column is Exclude<
	ColumnType,
	BooleanConstructor | DateConstructor | NumberConstructor | StringConstructor
> {
	return typeof column === "string";
}

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

	if (columnTypeOfString(columnOptions.type)) {
		definition.type = columnOptions.type;
	} else {
		if (!definition.type) {
			const type = Reflect.getMetadata(
				"design:type",
				model.prototype,
				property as any
			);
			columnOptions.type = type;
		}
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
			case Date: {
				definition.type = "datetime";
				break;
			}
			case Boolean: {
				definition.type = "tinyint";
				break;
			}
			default: {
				const error = new Error("unable to infer column definition");
				const type = Reflect.getMetadata(
					"design:type",
					model.prototype,
					property as any
				);
				error.cause = {
					columnOptions,
					model,
					property,
					type: definition.type,
				};
				throw error;
			}
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
