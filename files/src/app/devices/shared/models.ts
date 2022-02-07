import {IDevice} from '../../../shared/interfaces/merchant.interface';
import {EditMode} from './enums';

export interface EditDeviceModalData {
  mode: EditMode;
  deviceData?: IDevice;
}
