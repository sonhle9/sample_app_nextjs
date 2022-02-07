export interface IUserOrderReport {
  userId: string;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  orderCount: number;
}

export interface IReportRole {
  hasMenu: boolean;
}
