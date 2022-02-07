import {PaginationField} from 'src/shared/interfaces/pagination.interface';

export enum SessionStatuses {
  UNKNOWN = 'UNKNOWN',
  VOIDED = 'VOIDED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum PaymentId {
  SETEL_WALLET = 'setel_wallet',
  CREDIT_CARD = 'credit_card',
}

export type SessionsParams = {
  profileId?: string;
  merchantId?: string;
  locationId?: string;
  paymentId?: string;
  batchId?: string;
  sessionStatus?: string | SessionStatuses;
  createdAt?: any;
  createdSince?: string;
  createdUntil?: string;
  dateRange?: string[];
} & PaginationField;

export type SessionDetailsResponse = {
  session: SessionData;
};

export type SessionData = {
  id: string;
  profileId: string;
  merchantId: string;
  locationId: string;
  checkinAt: string;
  checkoutAt: string;
  finalFees: number;
  paymentId: string;
  shiftId: string;
  status: SessionStatuses;
  createdAt: string;
  updatedAt: string;
  batchId: string;
  locationName: string;
  plateNumber: string;
  userId: string;
  userFullname: string;
  locationGpsCoordinates: number[];
  locationAddress: string;
  serverTimestamp: string;
};

export type LocationParams = {
  id?: string;
  locationCode?: string;
  merchantId?: string;
  name?: string;
  locationStatus?: string;
} & PaginationField;

export type LocationData = {
  id: string;
  merchantId: string;
  locationCode: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  locationStatus: string;
  hasPlateReader: true;
  hasSeasonParking: true;
  hasTicket: true;
  hasQrPayment: true;
  parkingRatesUrl: string;
  gpsCoordinates: number[];
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
};
