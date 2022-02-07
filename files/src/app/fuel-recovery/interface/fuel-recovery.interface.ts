export interface FuelRecoveryInfo {
  fuelGrade: string;
  pricePerUnit: number;
  completedVolume?: number;
  completedAmount?: number;
  transactionCompletedAt: Date;
}

export interface IFuelRecoveryInfo {
  userId: string;
  orderId: string;
  name: string;
  stationName: string;
  stationId: string;
  pumpId: string;
  status: string;
  amount: string;
  createdAt: Date;
}

export interface IFuelRecoveryRole {
  hasFuelOrderRecoveryView: boolean;
  hasFuelOrderRecoveryUpdate: boolean;
}
