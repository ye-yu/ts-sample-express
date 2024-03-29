import { RequestHandler } from "./request-handler.type.js";

export type RequestHandlerFunctionInfo = {
	name: string;
	handler: RequestHandler;
	bindTo: any;
	route: string;
};
