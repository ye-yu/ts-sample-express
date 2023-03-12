import { OtpI18nEnum } from "../i18n/otp.enum.js";
import { OtpVerifyFailedObject } from "../objects/otp-verify-failed.object.js";

export const OTP_VERIFY_FAILED_INCORRECT: OtpVerifyFailedObject = {
	success: false,
	reason: "otp is incorrect",
	i18n: OtpI18nEnum.otp_verify_failed_incorrect,
};
