export interface IFeesFilterRequest {
  status?: string;
  type?: string;
  filterByTime?: string;
  timeFrom?: string;
  timeTo?: string;
  page?: number;
  perPage?: number;
}

export interface IFee {
  amount: number;
  status: string;
  attributes: {merchantName: string};
  createdAt: string;
  merchantId: string;
  transactionUid: string;
}

export interface IFeesSendEmailModalProps {
  visible: boolean;
  onClose?: () => void;
  filter: any;
}
