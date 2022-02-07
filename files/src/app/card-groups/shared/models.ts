import {EditMode} from './enum';
import {ICardGroup} from 'src/shared/interfaces/card-group.interface';

export interface EditCardGroupModalData {
  mode: EditMode;
  cardGroupId?: string;
  cardGroupData?: ICardGroup;
}
