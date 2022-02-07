export interface ICreditCard {
  isDefault: boolean;
  id: string;
  paymentToken: string;
  cardSchema: string;
  lastFourDigits: string;
  tokenizationRequestId: string;
  userId: string;
}

export interface IAutoTopup {
  id: string;
  userId: string;
  createdAt: Date;
  creditCardId: string;
  isActivated: boolean;
  minimumBalanceThreshold: number;
  topupAmount: number;
  updatedAt: Date;
  cardSchema: string;
  lastFourDigits: string;
}
