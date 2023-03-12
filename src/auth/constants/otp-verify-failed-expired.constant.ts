import { OtpI18nEnum } from "../i18n/otp.enum.js";
import { OtpVerifyFailedObject } from "../objects/otp-verify-failed.object.js";

export const OTP_VERIFY_FAILED_EXPIRED: OtpVerifyFailedObject = {
	success: false,
	reason: "otp has expired",
	i18n: OtpI18nEnum.otp_verify_failed_expired,
};
