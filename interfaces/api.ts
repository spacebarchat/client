import { Message } from "@puyodead1/fosscord-types";
import { Snowflake } from "./common";

export interface APIUnavailableGuild {
  id: Snowflake;
  unavailable?: boolean;
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
  | IAPILoginResponseMFARequired
  | IAPILoginResponseCaptchaRequired
  | IAPILoginResponseSuccess
  | IAPIError;

export type IAPIMFAResponse = IAPILoginResponseSuccess | IAPIError;

export interface IAPIGetChannelMessagesQuery {
  /**
   * Get messages around this message ID
   */
  around?: Snowflake;
  /**
   * Get messages before this message ID
   */
  before?: Snowflake;
  /**
   * Get messages after this message ID
   */
  after?: Snowflake;
  /**
   * Max number of messages to return (1-100)
   *
   * @default 50
   */
  limit?: number;
}

export type IAPIGetChannelMessagesResult = Message[];
