import { RequestHandler } from "express";
import { Prototype } from "../../common/types/prototype.type.js";

export type RequestHandlerDecoratorType = <T extends RequestHandler>(
	target: Prototype,
	propertyKey: string | symbol,
	descriptor: TypedPropertyDescriptor<T>
) => void | TypedPropertyDescriptor<T>;
