import { RequestHandlerDecoratorFunctionType } from "../types/request-handler-decorator-function.type.js";
import { RequestHandlerFunctionInfo } from "../types/request-handler-function.type.js";
import { createMethodDecorator } from "../utils/create-method-decorator.util.js";

const list = new Array<RequestHandlerFunctionInfo>();
export const Post = createMethodDecorator(
	list
) as RequestHandlerDecoratorFunctionType;
Post.handlers = list;
Post.method = "post";
