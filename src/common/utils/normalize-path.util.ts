import { locate } from "func-loc";
import { ILocation } from "func-loc/dist/cache-amanger.class.js";
import path from "path";
import { mapSourcePosition, Position } from "source-map-support";
import { ConfigService } from "../../config/config.service.js";

export function normalizePath(filePath: string) {
	if (ConfigService.app.env !== "development") return filePath;
	const map = cachedPosition;
	const currentDirectory = path.dirname(map.source);
	const relative = path.relative(currentDirectory, filePath);
	return relative.replaceAll("../", "").replaceAll("./", "");
}

const testEnvLocation = {
	path: import.meta.url.replace(/^file:\/\//, ""),
	source: import.meta.url,
	line: 0,
	column: 0,
};
const cachedPath: ILocation =
	ConfigService.app.env === "testing"
		? testEnvLocation
		: await locate(normalizePath);
const cachedPosition: Position =
	ConfigService.app.env === "testing"
		? testEnvLocation
		: mapSourcePosition(cachedPath);
