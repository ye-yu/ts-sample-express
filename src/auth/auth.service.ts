import { hash } from "bcrypt";
import { randomFill } from "crypto";
import { promisify } from "util";
import { Time } from "../common/constants/time.enum.js";
import { DatabaseService } from "../database/database.service.js";
import { OtpLogModel } from "../database/models/otp-log.model.js";
import { UserModel } from "../database/models/user.model.js";
import { RepoGetterType } from "../database/types/repo-getter.type.js";
import { LoggerService } from "../logger/logger.service.js";
import { UserService } from "../user/user.service.js";
import { OtpI18nEnum } from "./i18n/otp.enum.js";
import { OtpFailedObject } from "./objects/otp-failed.object.js";
import { OtpSuccessObject } from "./objects/otp-success.object.js";

const randomFillAsync = promisify(randomFill);

type OtpResponse = OtpSuccessObject | OtpFailedObject;

export class AuthServiceImpl {
	readonly logger = LoggerService.for("auth");

	async generateOneTimePassword(): Promise<string> {
		const buffer = new Uint8Array(6);
		await randomFillAsync(buffer);
		return buffer.map((e) => e % 10).join("");
	}

	async requestOneTimePassword(email: string): Promise<OtpResponse> {
		const successResponse: OtpSuccessObject = {
			success: true,
			emailTo: email,
			i18n: OtpI18nEnum.otp_success,
		};
		const otpResponse = await DatabaseService.transaction(async (_, db) =>
			this.sendOtpInTransaction(db, email, successResponse)
		);

		return otpResponse;
	}

	// no actual emailing is performed
	async createAndSendOtpFor(
		dbService: RepoGetterType,
		user: UserModel
	): Promise<void> {
		const userModel = dbService.repo(UserModel);
		const otpModel = dbService.repo(OtpLogModel);
		const otp = await AuthService.generateOneTimePassword();
		const password = await hash(otp, 4);

		const otpRecord = otpModel.create({
			password,
			user,
			loggedInAt: null,
		});

		await otpModel.save(otpRecord);
		AuthService.logger.info(
			"No actual emailing is done. OTP for email %s is %s.",
			user.email,
			otp
		);
	}

	async sendOtpInTransaction(
		dbService: RepoGetterType,
		email: string,
		successResponse: OtpSuccessObject
	): Promise<OtpResponse> {
		const otpModel = dbService.repo(OtpLogModel);
		const userByEmail = await UserService.getOrCreateUser(email, dbService);

		const lastOtpRequest = await otpModel.findOne({
			where: {
				userId: userByEmail.id,
			},
			order: {
				id: "desc",
			},
		});

		if (!lastOtpRequest) {
			await this.createAndSendOtpFor(dbService, userByEmail);
			return successResponse;
		}

		const now = new Date();
		const otpHotDurations = 3 * Time.minutes;

		// if three minutes has passed since last request, allow rerequest another one
		if (lastOtpRequest.createdAt.getTime() + otpHotDurations > now.getTime()) {
			await this.createAndSendOtpFor(dbService, userByEmail);
			return successResponse;
		}

		const failed: OtpFailedObject = {
			success: false,
			emailTo: email,
			reason:
				"You already requested an OTP. Please wait for 3 minutes to request for another one.",
			i18n: OtpI18nEnum.otp_request_failed_already_requested,
		};

		return failed;
	}
}

export const AuthService = new AuthServiceImpl();
