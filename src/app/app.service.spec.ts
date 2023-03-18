import { AppService } from "./app.service.js";
import { describe, it } from "node:test";
import assert from "../common/utils/test.util.js";

describe("AppService", () => {
	it("should be defined", () => {
		assert.defined(AppService);
	});
});
