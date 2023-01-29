import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { getColumnDefinition } from "./get-column-definition.util.js";

describe("getColumnDefinition", () => {
	it("should be able to construct primary key", () => {
		@Entity()
		class Model {
			@PrimaryGeneratedColumn("increment")
			primaryGenerated: number;
		}

		const tableColumn = getColumnDefinition(Model, "primaryGenerated");
		expect(tableColumn.name).toEqual("primaryGenerated");
		expect(tableColumn.isGenerated).toEqual(true);
		expect(tableColumn.generationStrategy).toEqual("increment");
	});
});
