import {
	Entity,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
	Column,
} from "typeorm";
import { getForeignKeyDefinition } from "./get-foreign-key-definition.util.js";
import { getTableName } from "./get-table-name.util.js";
import { describe, it } from "node:test";
import assert from "../../common/utils/test.util.js";

describe("getForeignKeyDefinition", () => {
	it("should be able to construct foreign key", () => {
		@Entity()
		class Model {
			@PrimaryGeneratedColumn("increment")
			primaryGenerated: number;

			@OneToMany(() => ForeignModel, (foreign) => foreign.model)
			foreign: ForeignModel[];
		}

		@Entity()
		class ForeignModel {
			@PrimaryGeneratedColumn("increment")
			primaryGenerated: number;

			@ManyToOne(() => Model, (model) => model.foreign)
			@JoinColumn({
				name: "modelId",
				referencedColumnName: "primaryGenerated",
			})
			model: Model;

			@Column({
				type: "bigint",
			})
			modelId: number;
		}

		const definition = getForeignKeyDefinition(ForeignModel, "model");
		assert.contains(definition.columnNames, "modelId");
		assert.contains(definition.referencedTableName, getTableName(Model));
		assert.contains(definition.referencedColumnNames, "primaryGenerated");
	});
});
