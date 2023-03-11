import { isEntityTargetFunction } from "./is-entity-target-function.util.js";

describe("isEntityTargetFunction", () => {
	it("should return true for functions", () => {
		function randomFunction() {}
		expect(isEntityTargetFunction(randomFunction)).toBeTruthy();
	});
	it("should return true for lambdas", () => {
		class randomClass {}
		expect(isEntityTargetFunction(() => randomClass)).toBeTruthy();
	});
	it("should return false for classes", () => {
		class randomClass {}
		expect(isEntityTargetFunction(randomClass)).toBeFalsy();
	});
	it("should return false for non functions", () => {
		expect(isEntityTargetFunction("hello")).toBeFalsy();
		expect(isEntityTargetFunction(123)).toBeFalsy();
		expect(isEntityTargetFunction(false)).toBeFalsy();
	});
});
