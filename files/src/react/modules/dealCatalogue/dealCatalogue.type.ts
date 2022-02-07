import {LocalizedOtp, LocalizedString} from 'src/react/shared/i18n';
import {DomainError} from '../../errors';
import {CreatedDeal, CurrentDealPrice} from '../deal/deals.type';

export enum DealCatalogueStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum DealCatalogueVariant {
  REGULAR = 'REGULAR',
  HIGHLIGHTED = 'HIGHLIGHTED',
}

export type DealCatalogue<T extends LocalizedOtp = 'raw'> = {
  _id: string;
  title: LocalizedString<T>;
  score: number;
  icon: SubmittedImage;
  status: DealCatalogueStatus;
  createdAt: string;
  variant: DealCatalogueVariant;
  activeDealsCount: number;
};

export type GeneralDealCataloguePayload = Pick<DealCatalogue, 'title' | 'icon' | 'variant'>;

export type SubmittedImage = {
  url?: string;
  file?: File;
};

export type GeneralDomainError = DomainError<{message: string}>;

export enum DealCatalogueAction {
  LINK = 'LINK',
  UNLINK = 'UNLINK',
  CHANGE_SCORE = 'CHANGE_SCORE',
}

export type UploadedFile = {
  url: string;
  name: string;
  originalName: string;
};

export type CatalogueDeal = CreatedDeal<CurrentDealPrice> & {
  score: number;
  merchant: Merchant;
};

export type Merchant = {
  id: string;
  name: string;
};
