import {
  createModalStack,
  ModalOptions,
  ModalStackConfig,
} from 'react-native-modalfy';
import {HCaptchaMessage} from '../components/HCaptcha';
import AddServerModal from '../components/Modals/AddServerModal';
import CaptchaModal from '../components/Modals/CaptchaModal';
import CreateGuildModal from '../components/Modals/CreateGuildModal';
import JoinGuildModal from '../components/Modals/JoinGuildModal';
import TestModal from '../components/Modals/TestModal';

export interface ModalStackParamsList {
  CaptchaModal: {
    captchaSiteKey: string;
    onMessage: (message: HCaptchaMessage) => void;
  };
  TestModal: undefined;
  GuildCreateModal: undefined;
}

export const modalConfig: ModalStackConfig = {
  Test: TestModal,
  Captcha: CaptchaModal,
  AddServer: AddServerModal,
  JoinGuild: JoinGuildModal,
  CreateGuild: CreateGuildModal,
};
export const modalOptions: ModalOptions = {
  backdropOpacity: 0.6,
};

export const modalStack = createModalStack(modalConfig, modalOptions);
