import {
  CirclePaymentMethodType,
  CircleMemberStatus,
  CircleStatus,
  CircleUserRole,
  PaymentMethodType,
} from '../enums/circle.enum';

export interface ICircleRole {
  hasAdminCircleList: string;
  hasAdminCircleView: string;
  hasAdminCircleUpdate: string;
  hasAdminCircleViewHistory: string;
}

export interface ICirclePaymentMethod {
  id: string;
  type: PaymentMethodType;
}

export interface ICircleMember {
  id?: string;
  userId: string;
  fullName?: string;
  memberStatus?: CircleMemberStatus;
  invitationToken: string;
  joinedDatetime?: string;
  leaveDatetime?: string;
  cancelDatetime?: string;
  accumulation?: number;
}

export interface ICircle {
  id: string;
  userId: string;
  fullName?: string;
  members: ICircleMember[];
  status: CircleStatus;
  paymentMethod: ICirclePaymentMethod;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CircleHistory {
  circleId: string;
  status: CircleStatus;
  isDeleted: boolean;
  createdAt: string;
  role: CircleUserRole;
  memberStatus: CircleMemberStatus;
  paymentMethod: {
    type: CirclePaymentMethodType;
  };
}

export interface ICircleTransaction {
  fullName?: string;
  amount?: number;
  orderId?: string;
  status?: string;
  createdAt?: string;
  userId?: string;
  id?: string;
  type?: string;
}

export interface ICircleTransactionFilter {
  page?: number;
  perPage?: number;
}

export interface IPagination {
  page: number;
  perPage: number;
  isLastPage: boolean;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setIsLastPage: (isLastPage: boolean) => void;
}
