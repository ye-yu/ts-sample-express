import { AppModule } from "./app.module.js";
import { describe, it } from "node:test";
import assert from "../common/utils/test.util.js";

describe("AppModule", () => {
	it("should be defined", () => {
		assert.defined(AppModule);
	});
});
