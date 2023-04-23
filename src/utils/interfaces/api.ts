export interface IAPILoginResponseMFARequired {
	token: null;
	mfa: true;
	sms: boolean;
	webauthn?: string;
	ticket: string;
}

export type IAPIRecatchaErrorCodes =
	| "missing-input-secret"
	| "invalid-input-secret"
	| "missing-input-response"
	| "invalid-input-response"
	| "bad-request"
	| "timeout-or-duplicate";
export type IAPIHCaptchaErrorCodes =
	| "missing-input-secret"
	| "invalid-input-secret"
	| "missing-input-response"
	| "invalid-input-response"
	| "bad-request"
	| "invalid-or-already-seen-response"
	| "not-using-dummy-passcode"
	| "sitekey-secret-mismatch";

export interface IAPILoginResponseCaptchaRequiredRecaptcha {
	captcha_key: ["captcha-required" & IAPIRecatchaErrorCodes];
	captcha_sitekey: string;
	captcha_service: "recaptcha";
}

export interface IAPILoginResponseCaptchaRequiredHCaptcha {
	captcha_key: ["captcha-required" & IAPIHCaptchaErrorCodes];
	captcha_sitekey: string;
	captcha_service: "hcaptcha";
}

export type IAPIResponseCaptchaRequired =
	| IAPILoginResponseCaptchaRequiredRecaptcha
	| IAPILoginResponseCaptchaRequiredHCaptcha;

export interface IAPILoginResponseSuccess {
	token: string;
	settings: {
		locale: string;
		theme: string;
	};
}

export interface IAPIError {
	code: number;
	message: string;
	errors?: {
		[key: string]: {
			_errors: {
				code: string;
				message: string;
			}[];
		};
	};
}

export type IAPILoginResponse =
	| IAPILoginResponseSuccess
	| IAPILoginResponseMFARequired;

export type IAPILoginResponseError =
	| IAPILoginResponseMFARequired
	| IAPIResponseCaptchaRequired
	| IAPIError;

export interface IAPILoginRequest {
	login: string;
	password: string;
	undelete?: boolean;
	captcha_key?: string;
	login_source?: string;
	gift_code_sku_id?: string;
}

export interface IAPIRegisterRequest {
	username: string;
	password?: string;
	consent: boolean;
	email?: string;
	fingerprint?: string;
	invite?: string;
	date_of_birth?: string;
	gift_code_sku_id?: string;
	captcha_key?: string;
	promotional_email_opt_in?: boolean;
}

export type IAPIRegisterResponseError = IAPIResponseCaptchaRequired | IAPIError;

export interface IAPITOTPRequest {
	code: string;
	ticket: string;
	gift_code_sku_id?: string | null;
	login_source?: string | null;
}

export interface IAPIPasswordResetRequest {
	login: string;
	captcha_key?: string;
}

export enum APIErrorCodes {
	ACCOUNT_DELETED = 20011,
	ACCOUNT_DISABLED = 20013,
}

// export type RESTAPIPostInviteResponse = {} | IAPIError;
