import {SupportOutageVariantEnum} from './contants/outage.contants';

export const isChatOutageOn = (variableOption: SupportOutageVariantEnum) =>
  variableOption === SupportOutageVariantEnum.CHAT_OFF_SUPPORT_ON;
