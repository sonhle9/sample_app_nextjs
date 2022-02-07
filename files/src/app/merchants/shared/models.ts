import {EditMode} from './enums';
import {IMerchant} from '../../../shared/interfaces/merchant.interface';

export interface EditMerchantModalData {
  mode: EditMode;
  merchantId?: string;
  merchantData?: IMerchant;
}
