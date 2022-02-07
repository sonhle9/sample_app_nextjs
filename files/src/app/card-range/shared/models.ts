import {EditMode} from './enum';
import {ICardRange} from 'src/shared/interfaces/card-range.interface';

export interface CardRangeModalData {
  mode: EditMode;
  cardRangeId?: string;
  cardRangeData?: ICardRange;
}
