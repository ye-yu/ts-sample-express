import { RequestHandlerFunctionInfo } from "../types/request-handler-function.type.js";
import { RequestHandlerDecoratorType } from "../types/request-handler-decorator.type.js";
import { tryInstantiateSingleton } from "../../common/utils/try-instantiate-singleton.util.js";

export function createMethodDecorator(
	handlerList: Array<RequestHandlerFunctionInfo>
): (route: string) => RequestHandlerDecoratorType {
	return (route) => {
		return function (
			target: any,
			name: string | symbol,
			desc: TypedPropertyDescriptor<any>
		) {
			const instance = tryInstantiateSingleton(target.constructor);
			name = String(name);
			handlerList.push({
				handler: desc.value,
				bindTo: instance,
				name,
				route,
			});
			return;
		};
	};
}
