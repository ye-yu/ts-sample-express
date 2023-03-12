import { compareSync, hash } from "bcrypt";
import { randomFill } from "crypto";
import { promisify } from "util";
import { DatabaseService } from "../database/database.service.js";
import { OtpLogModel } from "../database/models/otp-log.model.js";
import { UserModel } from "../database/models/user.model.js";
import { RepoGetterType } from "../database/types/repo-getter.type.js";
import { LoggerService } from "../logger/logger.service.js";
import { UserService } from "../user/user.service.js";
import { OTP_HOT_DURATION } from "./constants/otp-hot-duration.constant.js";
import { OTP_VERIFY_FAILED_EXPIRED } from "./constants/otp-verify-failed-expired.constant.js";
import { OTP_VERIFY_FAILED_INCORRECT } from "./constants/otp-verify-failed-incorrect.constant.js";
import { OTP_VERIFY_FAILED_NOT_REQUESTED } from "./constants/otp-verify-failed-not-requested.constant.js";
import { OTP_VERIFY_FAILED_USER_NOT_FOUND } from "./constants/otp-verify-failed-user-not-found.constant.js";
import { OTP_VERIFY_SUCCESS } from "./constants/otp-verify-success.constant.js";
import { OtpI18nEnum } from "./i18n/otp.enum.js";
import { OtpFailedObject } from "./objects/otp-failed.object.js";
import { OtpSuccessObject } from "./objects/otp-success.object.js";
import { OtpVerifyFailedObject } from "./objects/otp-verify-failed.object.js";
import { OtpVerifySuccessObject } from "./objects/otp-verify-success.object.js";

const randomFillAsync = promisify(randomFill);

type OtpRequestResult = OtpSuccessObject | OtpFailedObject;
type OtpVerifyResult = OtpVerifySuccessObject | OtpVerifyFailedObject;

export class AuthServiceImpl {
	readonly logger = LoggerService.for("auth");

	async generateOneTimePassword(): Promise<string> {
		const buffer = new Uint8Array(6);
		await randomFillAsync(buffer);
		return buffer.map((e) => e % 10).join("");
	}

	async verifyOneTimePassword(
		email: string,
		password: string
	): Promise<OtpVerifyResult> {
		// TODO: should we do read-lock?
		const user = await UserService.getUser(email);
		if (!user) {
			return OTP_VERIFY_FAILED_USER_NOT_FOUND;
		}
		const otpModel = DatabaseService.repo(OtpLogModel);

		const lastOtpRequest = await otpModel.findOne({
			where: {
				userId: user.id,
			},
			order: {
				id: "desc",
			},
		});

		if (!lastOtpRequest) {
			return OTP_VERIFY_FAILED_NOT_REQUESTED;
		}

		if (this.hasOtpExpired(lastOtpRequest)) {
			return OTP_VERIFY_FAILED_EXPIRED;
		}

		if (this.isOtpIncorrect(lastOtpRequest, password)) {
			return OTP_VERIFY_FAILED_INCORRECT;
		}

		return OTP_VERIFY_SUCCESS;
	}

	async requestOneTimePassword(email: string): Promise<OtpRequestResult> {
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
	): Promise<OtpRequestResult> {
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

		// if three minutes has passed since last request, allow rerequest another one
		if (this.hasOtpExpired(lastOtpRequest)) {
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

	hasOtpExpired(lastOtpRequest: OtpLogModel) {
		const now = new Date();
		return (
			lastOtpRequest.createdAt.getTime() + OTP_HOT_DURATION > now.getTime()
		);
	}

	isOtpIncorrect(lastOtpRequest: OtpLogModel, password: string) {
		return !compareSync(password, lastOtpRequest.password);
	}
}

export const AuthService = new AuthServiceImpl();
