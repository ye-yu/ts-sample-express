import { RequestHandlerFunctionInfo } from "../types/request-handler-function.type.js";
import { RequestHandlerDecoratorType } from "../types/request-handler-decorator.type.js";
import { RequestHandler } from "../types/request-handler.type.js";

export function createMethodDecorator(
	handlerList: Array<RequestHandlerFunctionInfo>
): (route: string) => RequestHandlerDecoratorType {
	return (route) => {
		return function <T extends RequestHandler>(
			_: T,
			name: string | symbol,
			desc: TypedPropertyDescriptor<any>
		) {
			name = String(name);
			handlerList.push({
				handler: desc.value,
				name,
				route,
			});
			return;
		};
	};
}
