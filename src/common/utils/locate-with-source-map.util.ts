import { locate } from "func-loc";
import { mapSourcePosition, Position } from "source-map-support";
import { normalizePath } from "./normalize-path.util.js";

export async function locateWithSourceMap(func: any): Promise<Position> {
	const location = await locate(func);
	const map = mapSourcePosition(location);
	map.source = normalizePath(map.source);
	return map;
}
