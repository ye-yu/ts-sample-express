import { RequestHandlerDecoratorType } from "./request-handler-decorator.type.js";
import { RequestHandlerFunctionInfo } from "./request-handler-function.type.js";
import { Router } from "express";

export type RequestHandlerDecoratorFunctionType = {
	(route: string): RequestHandlerDecoratorType;
	handlers: Array<RequestHandlerFunctionInfo>;
	method: keyof Pick<Router, "get" | "post" | "put" | "patch" | "delete">;
};
