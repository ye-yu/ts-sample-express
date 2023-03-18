import { Post } from "../../server/decorators/post.decorator.js";
import { Put } from "../../server/decorators/put.decorator.js";
import { Request } from "../../server/types/request.type.js";
import { AuthService } from "../auth.service.js";

export class AuthController {
	static readonly instance = new AuthController();

	@Put("/api/v1/otp")
	async requestOtp(req: Request) {
		return await AuthService.requestOneTimePassword(req.body.email);
	}

	@Post("/api/v1/otp")
	async validateOtp(req: Request) {
		return await AuthService.verifyOneTimePassword(
			req.body.email,
			req.body.password
		);
	}
}
