interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IFeeSettingsRequest extends IRequest {
  feeSettingId?: string;
}

export type FeeSetting = {
  feeSettingId: string;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type IEditFeeSetting = {
  feeSettingId: string;
  name: string;
  amount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
};

export type IEditFeeSettingBody = {
  amount: number;
};
