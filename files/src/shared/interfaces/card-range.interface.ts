export interface ICardRange {
  id: string;
  type: string;
  name: string;
  description: string;
  cardGroups: string;
  startNumber: string;
  currentNumber?: string;
  endNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICardRangeRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}

export interface ICardRangeIndexParams {
  type?: string;
  name?: string;
  startNumber?: string;
}
