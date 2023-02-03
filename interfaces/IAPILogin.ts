export interface IAPILoginRequest {
  login: string;
  password: string;
  undelete?: boolean;
  captcha_key?: string;
  login_source?: string;
  gift_code_sku_id?: string;
}

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

export type IAPILoginResponseCaptchaRequired =
  | IAPILoginResponseCaptchaRequiredRecaptcha
  | IAPILoginResponseCaptchaRequiredHCaptcha;

export interface IAPILoginResponseSuccess {
  token: string;
  settings: {
    locale: string;
    theme: string;
  };
}

export type IAPILoginResponse =
  | IAPILoginResponseMFARequired
  | IAPILoginResponseCaptchaRequired
  | IAPILoginResponseSuccess;
