import {EApprovalRequestsFeature, EApprovalRequestsStatus} from './approval-requests.enum';

interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IApprovalRequestsRequest extends IRequest {
  feature?: EApprovalRequestsFeature;
  status?: EApprovalRequestsStatus;
  isNeedApproval?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface IApprovalRequests {
  id: string;
  attachments: string[];
  history: {
    level?: string;
    remark?: string;
    approverName: string;
    approverEmail: string;
    status: EApprovalRequestsStatus;
    updateAt: string;
  }[];
  logs: any[];
  feature: EApprovalRequestsFeature;
  amount: number;
  rawRequest: any;
  status: EApprovalRequestsStatus;
  createdBy: string;
  updatedBy: string;
  nextLevel: string;
  createdAt: string;
  updatedAt: string;
  totalRecords: number;
  isAccess: boolean;
  isApprover: boolean;
  createdByEmail: string;
}

interface IRawRequest {
  cardReplacementFee?: boolean;
}

export interface RawRequestUpdate {
  id: string;
  rawRequest: IRawRequest;
}
export interface IApprovalRequestUpdate {
  id: string;
  remark: string;
}
