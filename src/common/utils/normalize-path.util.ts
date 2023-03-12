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

const cachedPath: ILocation = await locate(normalizePath);
const cachedPosition: Position = mapSourcePosition(cachedPath);
