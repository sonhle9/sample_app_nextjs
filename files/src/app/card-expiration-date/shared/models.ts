import {EditMode} from '../../card-range/shared/enum';
import {ICardExpiryDate} from 'src/shared/interfaces/card-expiry-date.interface';

export interface CardExpiryDateModalData {
  mode: EditMode;
  cardExpiryDateId?: string;
  cardExpiryDateData?: ICardExpiryDate;
}
