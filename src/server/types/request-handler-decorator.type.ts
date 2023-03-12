import { RequestHandler } from "express";

export type RequestHandlerDecoratorType = <T extends RequestHandler>(
	target: Object,
	propertyKey: string | symbol,
	descriptor: TypedPropertyDescriptor<T>
) => void | TypedPropertyDescriptor<T>;
