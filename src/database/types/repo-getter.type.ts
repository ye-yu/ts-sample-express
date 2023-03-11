import { ObjectLiteral, Repository } from "typeorm";
import { ModelType } from "./model.type.js";

export type RepoGetterType = {
	repo<K extends ObjectLiteral>(model: ModelType<K>): Repository<K>;
};
