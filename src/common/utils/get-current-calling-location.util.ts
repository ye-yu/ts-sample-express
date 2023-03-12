import { parse as parseStackTrace } from "stacktrace-parser";
import { normalizePath } from "./normalize-path.util.js";

const stackable: { stack?: string } = {};
export function getCurrentCallingLocation(skip = 3): string {
	Error.captureStackTrace(stackable);
	const rawStack = stackable.stack ?? "";
	const stack = parseStackTrace(rawStack);
	const previous = stack.at(skip);
	const normalizedPath = normalizePath(previous?.file ?? "");
	return `${normalizedPath}:${previous?.lineNumber}:${previous?.column}`;
}
