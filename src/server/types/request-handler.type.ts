import { Request } from "./request.type.js";

export type RequestHandler = (req: Request) => Promise<any>;
