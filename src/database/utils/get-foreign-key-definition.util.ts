import {
	getMetadataArgsStorage,
	TableForeignKey,
	TableForeignKeyOptions,
} from "typeorm";
import { ModelType } from "../types/model.type.js";
import { getTableName } from "./get-table-name.util.js";
import { isEntityTargetFunction } from "./is-entity-target-function.util.js";

export const FOREIGN_MODEL_NOT_FOUND = new Error(
	"Cannot determine foreign model class name: not found"
);

const JOIN_COLUMN_NAME_NOT_DEFINED = new Error(
	"Join column name is not defined!"
);
export function getForeignKeyDefinition<T>(
	model: ModelType<T>,
	property: keyof T
): TableForeignKey {
	const relations = getMetadataArgsStorage().filterRelations(model);
	const joinColumns = getMetadataArgsStorage().filterJoinColumns(
		model,
		String(property)
	);

	const foreignModelOptional = relations.find((e) => e)?.type;
	if (!foreignModelOptional) {
		throw FOREIGN_MODEL_NOT_FOUND;
	}

	const foreignModel = isEntityTargetFunction(foreignModelOptional)
		? foreignModelOptional()
		: foreignModelOptional;

	const targetTableName = getTableName(model);
	const foreignTableName = getTableName(foreignModel);

	const joinColumnName = joinColumns.find((e) => e)?.name;

	if (!joinColumnName) {
		throw JOIN_COLUMN_NAME_NOT_DEFINED;
	}
	const referencedColumnName =
		joinColumns.find((e) => e)?.referencedColumnName ?? "id";
	const foreignKeyConstraintName =
		joinColumns.find((e) => e)?.foreignKeyConstraintName ??
		`${targetTableName}_${foreignTableName}_${joinColumnName}_${referencedColumnName}`;

	const tfkOption: TableForeignKeyOptions = {
		name: foreignKeyConstraintName,
		columnNames: [joinColumnName],
		referencedTableName: foreignTableName,
		referencedColumnNames: [referencedColumnName],
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	};
	return new TableForeignKey(tfkOption);
}
