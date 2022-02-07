import type {Observable} from 'rxjs';

export interface IDashboardTemplate {
  isLoading: boolean;
  apiFunction: () => Observable<any>;
}

export interface IFailedOrder {
  orderId: string;
  userFullName: string;
  stationId: string;
  stationName: string;
  orderStatus: string;
  createdAt: Date;
}

export interface IFailTopup {
  id: string;
  userId: string;
  fullName: string;
  subtype: string;
  createdAt: Date;
}

export interface IDashboardRole {
  hasMenu: boolean;
}

export interface IStatistics {
  attempts?: number;
  success?: number;
  failed?: number;
  pending?: number;
  cancelled?: number;
}

export interface ITopupPendingStatus {
  total?: number;
  avg?: number;
}

export interface IFuelProcessErrorStatistics {
  createOrder?: number;
  reservePump?: number;
  paymentAuth?: number;
  fuelReady?: number;
  fuelComplete?: number;
  paymentCharged?: number;
  orderConfirm?: number;
  issuePoints?: number;
}

export interface IOrderDashboard {
  fuelStatistics: IStatistics;
  topupStatistics: IStatistics;
  fuelProcessErrorStatistics: IFuelProcessErrorStatistics;
  topupPendingStatus: ITopupPendingStatus;
}
