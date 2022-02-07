import {environment} from 'src/environments/environment';
import {apiClientWithoutAuth} from '../lib/ajax';

const BASE_URL = environment.apiBaseUrl + '/api/smartpay';

export enum SmartPayCardStatus {
  active = 'active',
  inactive = 'inactive',
  frozen = 'frozen',
  block = 'block',
}
export enum SmartPayCardType {
  driver = 'driver',
  vehicle = 'vehicle',
  standalone = 'standalone',
}
export interface ISmartPayCard {
  mesraPoints: boolean;
  id: string;
  cardNumber: string;
  userId: string;
  cardType: SmartPayCardType;
  platNumber: string;
  expiryDate: string;
  status: SmartPayCardStatus;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
}

export const getSmartPayCardByUserId = (userId: string) =>
  apiClientWithoutAuth
    .get<ISmartPayCard[]>(`${BASE_URL}/cards/${userId}/card`)
    .then((res) => res.data);
