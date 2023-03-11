import { EntityTarget } from "typeorm";

export function isEntityTargetFunction<T>(
	obj: any
): obj is () => EntityTarget<T> {
	// if not a function, return false.
	if (typeof obj !== "function") return false;
	const descriptor = Object.getOwnPropertyDescriptor(obj, "prototype");
	return descriptor?.writable ?? true;
}
