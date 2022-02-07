export interface ICardExpiryDate {
  id: string;
  type: string;
  formFactor: string;
  cardRange: string;
  expiryPeriod?: number;
  autoRenewal?: number;
}

export interface ICardExpiryDateRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}
