import {DevicesStatus} from './enums';

export interface IDeviceUpdateModel {
  merchantMerchantIds?: string[];
  serialNo?: string;
  modelDevice?: string;
  status?: DevicesStatus;
}
