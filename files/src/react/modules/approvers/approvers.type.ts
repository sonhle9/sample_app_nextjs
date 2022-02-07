interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IApproversRequest extends IRequest {
  userEmail?: string;
}

export interface IApprover {
  id: string;
  userEmail: string;
  approvalLimit: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateApproverInput {
  userEmail: string;
  approvalLimit: number;
  status: string;
}
