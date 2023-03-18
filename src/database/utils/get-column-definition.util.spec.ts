import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { getColumnDefinition } from "./get-column-definition.util.js";
import { describe, it } from "node:test";
import assert from "../../common/utils/test.util.js";

describe("getColumnDefinition", () => {
	it("should be able to construct primary key", () => {
		@Entity()
		class Model {
			@PrimaryGeneratedColumn("increment")
			primaryGenerated: number;
		}

		const tableColumn = getColumnDefinition(Model, "primaryGenerated");
		assert.equal(tableColumn.name, "primaryGenerated");
		assert.isTrue(tableColumn.isGenerated);
		assert.equal(tableColumn.generationStrategy, "increment");
	});
});
