import assert from "../../common/utils/test.util.js";
import { isEntityTargetFunction } from "./is-entity-target-function.util.js";
import { describe, it } from "node:test";

describe("isEntityTargetFunction", () => {
	it("should return true for functions", () => {
		function randomFunction() {}
		assert.isTrue(isEntityTargetFunction(randomFunction));
	});
	it("should return true for lambdas", () => {
		class randomClass {}
		assert.isTrue(isEntityTargetFunction(() => randomClass));
	});
	it("should return false for classes", () => {
		class randomClass {}
		assert.isFalse(isEntityTargetFunction(randomClass));
	});
	it("should return false for non functions", () => {
		assert.isFalse(isEntityTargetFunction("hello"));
		assert.isFalse(isEntityTargetFunction(123));
		assert.isFalse(isEntityTargetFunction(false));
	});
});
