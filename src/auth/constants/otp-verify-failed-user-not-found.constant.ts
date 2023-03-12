import { OtpI18nEnum } from "../i18n/otp.enum.js";
import { OtpVerifyFailedObject } from "../objects/otp-verify-failed.object.js";

export const OTP_VERIFY_FAILED_USER_NOT_FOUND: OtpVerifyFailedObject = {
	success: false,
	reason: "user cannot be found",
	i18n: OtpI18nEnum.otp_verify_failed_user_not_found,
};
