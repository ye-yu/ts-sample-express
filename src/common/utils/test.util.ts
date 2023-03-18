import _assert, { strict } from "node:assert";

export const defined = <T>(
	input: T | null | undefined,
	message?: string
): asserts input => {
	strict.notEqual(input, null, message ?? `expected defined but received null`);
	strict.notEqual(
		input,
		undefined,
		message ?? `expected defined but received undefined`
	);
};

export const isTrue = (input: any, message?: string): asserts input => {
	strict.equal(input, true, message ?? `expected true but received ${input}`);
};

export const isFalse = (input: any, message?: string): asserts input => {
	strict.equal(input, false, message ?? `expected false but received ${input}`);
};

type PrimitiveDefined = string | number | boolean;

export const isPrimitiveDefined = (input: any): input is PrimitiveDefined => {
	return (
		typeof input === "string" ||
		typeof input === "number" ||
		typeof input === "boolean"
	);
};

type TypeOf =
	| "string"
	| "number"
	| "boolean"
	| "null"
	| "undefined"
	| "object"
	| "function";

export const getTypeOfPrimitives = (input: any): TypeOf => {
	if (
		isPrimitiveDefined(input) ||
		typeof input === "function" ||
		typeof input === "undefined"
	) {
		return typeof input as TypeOf;
	}
	if (input === null) {
		return "null";
	}
	return "object";
};

export const getTypeOf = <B extends Object = any>(input: any): TypeOf | B => {
	const typeofPrimitive = getTypeOfPrimitives(input);
	if (typeofPrimitive != "object") {
		return typeofPrimitive;
	}
	return input.constructor;
};

export const sameType = (
	item1: any,
	item2: any,
	message?: string
): asserts item1 => {
	const typeOfPrimitivesItem1 = getTypeOfPrimitives(item1);
	const typeOfPrimitivesItem2 = getTypeOfPrimitives(item2);

	if (
		typeOfPrimitivesItem1 === "object" &&
		typeOfPrimitivesItem2 === "object"
	) {
		const item1InstanceofItem2Constructor = item1 instanceof item2.constructor;
		const item2InstanceofItem1Constructor = item2 instanceof item1.constructor;
		strict.equal(
			item1InstanceofItem2Constructor,
			true,
			message ??
				`expected type of item 1 ${typeOfPrimitivesItem1} to equal type of item 2 ${typeOfPrimitivesItem2}`
		);
		strict.equal(
			item2InstanceofItem1Constructor,
			true,
			message ??
				`expected type of item 2 ${typeOfPrimitivesItem2} to equal type of item 1 ${typeOfPrimitivesItem1}`
		);
	}

	// if any of them are primitive and are defined, use typeof evaluation
	strict.equal(
		typeOfPrimitivesItem1,
		typeOfPrimitivesItem2,
		message ??
			`expected type of item 1 ${typeOfPrimitivesItem1} to equal type of item 2 ${typeOfPrimitivesItem2}`
	);
};

export const contains = (
	input: any,
	searchItem: any,
	message?: string
): asserts searchItem => {
	if (typeof input === "string") {
		assert.sameType(input, searchItem);
		return;
	}
	if ("includes" in input && typeof input["includes"] === "function") {
		const searchResult = input.includes(searchItem);
		assert.isTrue(
			searchResult,
			message ?? `expected object to contain ${searchItem}`
		);
		return;
	}
	assert.fail(
		message ??
			`input is not searchable: there is no 'includes' function in input of type ${typeof input}`
	);
};

type Assertions = Omit<
	typeof _assert,
	| "equal"
	| "notEqual"
	| "deepEqual"
	| "notDeepEqual"
	| "ok"
	| "strictEqual"
	| "deepStrictEqual"
	| "ifError"
	| "strict"
> & {
	equal: typeof strict.strictEqual;
	notEqual: typeof strict.notStrictEqual;
	deepEqual: typeof strict.deepStrictEqual;
	notDeepEqual: typeof strict.notDeepStrictEqual;
	// Mapped types and assertion functions are incompatible?
	// TS2775: Assertions require every name in the call target
	// to be declared with an explicit type annotation.
	ok: typeof strict.ok;
	defined: typeof defined;
	isTrue: typeof isTrue;
	isFalse: typeof isFalse;
	sameType: typeof sameType;
	contains: typeof contains;
	strictEqual: typeof strict.strictEqual;
	deepStrictEqual: typeof strict.deepStrictEqual;
	ifError: typeof strict.ifError;
};

export const assert: Assertions = {
	...strict,
	defined,
	isTrue,
	isFalse,
	sameType,
	contains,
};

export default assert;
