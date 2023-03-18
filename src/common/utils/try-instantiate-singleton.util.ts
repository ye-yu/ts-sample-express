import { SingletonInstantiatable } from "../types/singleton-instantiatable.type.js";

export function tryInstantiateSingleton<T>(
	constructorFn: SingletonInstantiatable<T>
): T {
	constructorFn.instance ??= new constructorFn();
	if ("instance" in constructorFn) {
		return constructorFn.instance as T;
	}
	throw new Error("cannot instantiate " + constructorFn.name);
}
