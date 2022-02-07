export type PointBalance = {
  cardNumber: string;
  memberId?: string;
  balance: number;
  floatingBalance: number;
  expiryDetails?: ExpiryDate[];
};

export type ExpiryDate = {
  expiryDate: string;
  points: number;
};
