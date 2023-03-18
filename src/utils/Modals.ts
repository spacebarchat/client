import {HCaptchaMessage} from '../components/HCaptcha';

export interface ModalStackParamsList {
  CaptchaModal: {
    captchaSiteKey: string;
    onMessage: (message: HCaptchaMessage) => void;
  };
  TestModal: undefined;
}
