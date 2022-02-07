export interface ICsvFileResponse {
  userId: string;
  amount: number;
  message: string;
}

export interface IBalanceBatchUploadHistoryItem {
  fileId: string;
  fileName: string;
  successfullTransactionsCount: number;
  failureTransactionsCount: number;
  userId?: string;
}

export interface IBatchGrantBalanceData {
  items: ICsvFileResponse[];
  batchName: string;
}
