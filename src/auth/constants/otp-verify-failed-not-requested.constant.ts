import { OtpI18nEnum } from "../i18n/otp.enum.js";
import { OtpVerifyFailedObject } from "../objects/otp-verify-failed.object.js";

export const OTP_VERIFY_FAILED_NOT_REQUESTED: OtpVerifyFailedObject = {
	success: false,
	reason: "otp is not requested",
	i18n: OtpI18nEnum.otp_verify_failed_not_requested,
};
