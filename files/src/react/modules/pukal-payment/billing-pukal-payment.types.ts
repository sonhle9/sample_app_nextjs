export interface IPukalPaymentFilter {
  searchInvoice?: string;
  status?: string;
  type?: string;
  code?: string;
  statementDate?: Date;
}

export interface IPukalAccount {
  merchantName: string;
  merchantId: string;
  pukalType?: string;
  agCode?: string;
  projectSetia?: string;
  activationDate?: string;
  terminationDate?: string;
  terminationFlag?: boolean;
  checkDigitIndicator?: boolean;
  warrantDepartment?: string;
  warrantPTJ?: string;
  voteCode?: string;
  chargeDepartment?: string;
  chargePTJ?: string;
  prgActAmanah?: string;
  sortKey?: string;
  agObjectCode?: string;
  registrationDate?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPukalAccountCreateRequest {
  merchantName: string;
  merchantId: string;
  pukalType?: string;
  agCode?: string;
  projectSetia?: string;
  activationDate?: string;
  terminationFlag?: any;
  checkDigitIndicator?: any;
  warrantDepartment?: string;
  warrantPTJ?: string;
  voteCode?: string;
  chargeDepartment?: string;
  chargePTJ?: string;
  prgActAmanah?: string;
  sortKey?: string;
  agObjectCode?: string;
  registrationDate?: string;
}
