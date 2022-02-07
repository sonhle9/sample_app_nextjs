export interface IPukalSedutFilter {
  searchSPA?: string;
  status?: string;
  type?: string;
  code?: string;
}

export interface IPukalSedut {
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
}

export const convertAppliedArray2Objects = (appliedArr: any): IPukalSedutFilter => {
  const rv = {};
  for (const element of appliedArr) {
    if (element !== undefined) rv[element.prop] = element.value;
  }
  return rv;
};
