import {PaginationParams} from '@setel/portal-ui';
import {ajax, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';
import {environment} from '../../../environments/environment';
import {extractErrorWithConstraints} from '../../lib/utils';
import {Transaction} from '../collections/collections.type';
import {IFilter} from '../custom-field-rules/custom-field-rules.service';
import {TransactionSubType, TransactionType} from '../../services/api-merchants.type';
import {TransactionType as MerchantTransactionType} from './../../../shared/enums/merchant.enum';
import {RecursivePartial} from '../../../shared/helpers/common';
import {IMerchantUpdateModel} from '../../../shared/interfaces/merchant.interface';
import {
  AuditLogFeatureName,
  CreateUpdateMerchantSmartpayPayload,
  CreditPeriodOverrun,
  CreditPeriodOverrunPayload,
  GiftCardExternalTopUp,
  ISecurityDeposit,
  Merchant,
  MerchantAuditLog,
  MerchantSmartpay,
  MerchantSmartpayFile,
  MerchantType,
  MerchantUser,
  SetSmartpayAccountAddressPayload,
  SetSmartpayAccountContactPayload,
  SmartpayAccountAddress,
  SmartpayAccountContact,
  SmartpayAssessmentDetails,
  SmartpayBalancesPaginatedV2,
  SmartpayAssessmentHistory,
  SmartpayBalanceSummary,
  SmartpayBalanceTempoCreditLimit,
  SmartpayAccountDetails,
  PaginatedV2Request,
  SmartpayAccountImportRes,
  SPABulkAdjustmentsValidateRes,
} from './merchants.type';

const baseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;
const baseUrlCompany = `${environment.companiesApiBaseUrl}/api/companies`;
const baseUrlOps = `${environment.opsApiBaseUrl}/api/ops`;

export interface GetMerchantsOptions extends IPaginationParam {
  name?: string;
  searchValue?: string;
  merchantTypes?: string;
  includeBalances?: boolean;
}

export type SmartpayAssessmentHistoryFilter = {
  date?: string;
  eventType?: string;
  user?: string;
  search?: string;
} & IPaginationParam;

export type MerchantAuditLogsFilter = {
  refId?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
  userId?: string;
  searchValue?: string;
  featureName: AuditLogFeatureName;
} & IPaginationParam;

export interface GetMerchantsByEnterpriseOptions {
  name?: string;
  enterpriseId: string;
}

export const getMerchants = ({includeBalances = true, ...options}: GetMerchantsOptions) =>
  fetchPaginatedData<Merchant>(`${baseUrl}/admin/merchants`, options, {
    params: {
      includeBalances,
    },
  });

export const getMerchantsByEnterprise = (enterpriseId: string, name: string) =>
  ajax<Merchant[]>({
    url: `${baseUrl}/admin/merchants/index-by-enterprise/${enterpriseId}`,
    params: {
      name,
    },
  });

export const createMerchant = (data: IMerchantUpdateModel) =>
  ajax<Merchant>({
    url: `${baseUrl}/admin/merchants`,
    method: 'POST',
    data,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );

export interface CreateAdjustmentTransactionData {
  merchantId: string;
  amount: number;
  attributes: {
    comment: string;
  };
  userId: string;
}

export const createAdjustmentTransaction = (data: CreateAdjustmentTransactionData) => {
  return ajax<Merchant>({
    url: `${baseUrl}/admin/transactions/adjustments`,
    method: 'POST',
    data: {
      ...data,
      type: MerchantTransactionType.ADJUSTMENT,
      currency: 'MYR',
    },
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getMerchantDetails = (merchantId: string): Promise<Merchant> => {
  return ajax<Merchant>({
    url: `${baseUrl}/admin/merchants/${merchantId}`,
    params: {
      includeBalances: true,
      includeTimeline: true,
    },
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getMultipleMerchantDetails = (merchantIds: string[]): Promise<Array<Merchant>> => {
  return ajax.all(
    merchantIds.map((id) =>
      ajax<Merchant>({
        url: `${baseUrl}/admin/merchants/${id}`,
      }),
    ),
  );
};

export const updateMerchantLogo = (merchantId: string, logo: File) => {
  const formData = new FormData();
  formData.append('logo', logo);
  return ajax<Merchant>({
    url: `${baseUrl}/admin/merchants/${merchantId}/logo`,
    method: 'POST',
    data: formData,
  });
};

export const updateMerchantDetails = (merchantId: string, data: RecursivePartial<Merchant>) => {
  return ajax<Merchant>({
    url: `${baseUrl}/admin/merchants/${merchantId}`,
    method: 'PUT',
    data,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateMerchantSettingCustomFields = (
  merchantId: string,
  attributes: Record<string, string>,
) =>
  ajax<Merchant>({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/${merchantId}`,
    method: 'PUT',
    data: {
      attributes,
    },
  });

export const getListAdjustmentTransaction = (merchantId: string, filter: PaginationParams) => {
  return fetchPaginatedData<Transaction>(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions`,
    filter,
    {
      params: {
        merchantIds: [merchantId],
        type: TransactionType.EXTERNAL_ADJUSTMENT,
        subTypes: [
          TransactionSubType.EXTERNAL_ADJUSTMENT_AVAILABLE,
          TransactionSubType.EXTERNAL_ADJUSTMENT_PREPAID,
          TransactionSubType.BULK_ADJUSTMENT_AVAILABLE,
          TransactionSubType.BULK_ADJUSTMENT_PREPAID,
        ],
      },
    },
  );
};

export const getListExternalTopupTransaction = (merchantId: string, filter: PaginationParams) => {
  return fetchPaginatedData<Transaction>(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions`,
    filter,
    {
      params: {
        merchantIds: [merchantId],
        type: TransactionType.EXTERNAL_TOPUP,
      },
    },
  );
};

export const uploadAdjustmentFile = (merchantId: string, file: File): Promise<any> => {
  const url = `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions/adjustments/${merchantId}/upload-attachment`;
  const data = new FormData();
  data.append('file', file);

  return ajax<FormData>({url, data, method: 'POST'}).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    });
  });
};

export const createPrepaidAdjustmentTransaction = (data): Promise<any> => {
  const url = `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions/adjustments/prepaid`;

  return ajax({url, data, method: 'POST'}).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    });
  });
};

export const indexMerchantType = () =>
  ajax<Array<MerchantType>>({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types`,
  });

export const readMerchantType = (typeId: string) =>
  ajax<MerchantType>({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/${typeId}`,
  });

export const validateBulkImportFile = (f: File) => {
  const data = new FormData();
  data.append('file', f);
  return ajax({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions/external/bulk-import/validate-file`,
    data,
    method: 'POST',
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message:
        err.response.data.message || err.response.data.errors || extractErrorWithConstraints(err),
    });
  });
};

export const sendForApproval = (f: File) => {
  const data = new FormData();
  data.append('file', f);
  return ajax({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions/external/bulk-import/handle`,
    data,
    method: 'POST',
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message:
        err.response.data.message || err.response.data.errors || extractErrorWithConstraints(err),
    });
  });
};

export const sendForApprovalExternalTopupTrans = (
  topup: GiftCardExternalTopUp,
): Promise<Transaction> => {
  return ajax<Transaction>({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/transactions/external/top-ups`,
    data: topup,
    method: 'POST',
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message:
        err.response.data.message || err.response.data.errors || extractErrorWithConstraints(err),
    });
  });
};

export const cancelApprovalExternalTopupTrans = (transId: string) =>
  ajax<Merchant>({
    url: `${environment.merchantsApiBaseUrl}/api/workflows/admin/approval-requests/${transId}/cancel`,
    method: 'PUT',
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    });
  });

export const cancelApprovalAdjustmentTrans = (transId: string) =>
  ajax<Merchant>({
    url: `${environment.merchantsApiBaseUrl}/api/workflows/admin/approval-requests/${transId}/cancel`,
    method: 'PUT',
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    });
  });

export const updateProductMerchant = (merchantId: string, product: string, enable: boolean) =>
  ajax({
    url: `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/${merchantId}/${product}`,
    method: 'PUT',
    data: {
      enable,
    },
  }).catch((err) => {
    return Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    });
  });

export interface GetSmartpayAccountOptions extends IPaginationParam {
  searchValue?: string;
  status?: string;
  fleetPlan?: string;
  businessCategory?: string;
  companyType?: string;
}

export const createSmartpayAccount = (payload: CreateUpdateMerchantSmartpayPayload) => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts`,
    method: 'POST',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccounts = (options: GetSmartpayAccountOptions) => {
  return fetchPaginatedData<MerchantSmartpay>(
    `${baseUrl}/admin/merchant-smartpay-accounts`,
    options,
  );
};

export const getSmartpayAccountDetails = (merchantId: string): Promise<SmartpayAccountDetails> => {
  return ajax<SmartpayAccountDetails>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/${merchantId}`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const createSmartpayApplication = (payload: CreateUpdateMerchantSmartpayPayload) => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/applications`,
    method: 'POST',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayApplications = (options: GetSmartpayAccountOptions) => {
  return fetchPaginatedData<MerchantSmartpay>(
    `${baseUrl}/admin/merchant-smartpay-accounts/applications`,
    options,
  );
};

export const getSmartpayApplicationDetails = (appId: string): Promise<MerchantSmartpay> => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/applications/${appId}`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateSmartpayAccount = (
  id: string,
  data: CreateUpdateMerchantSmartpayPayload,
): Promise<MerchantSmartpay> => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/${id}`,
    method: 'PUT',
    data,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const deleteSmartpayAccount = (id: string) => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/${id}`,
    method: 'DELETE',
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const cancelSmartpayApp = (requestId: string) => {
  return ajax<MerchantSmartpay>({
    url: `${environment.workflowsApiBaseUrl}/api/workflows/admin/approval-requests/${requestId}/cancel`,
    method: 'PUT',
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const resubmitSmartpayApp = (applicationId: string, email: string) => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-accounts/${applicationId}/resubmit`,
    method: 'PUT',
    data: {email},
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAssessmentDetails = (appId: string): Promise<SmartpayAssessmentDetails> => {
  return ajax<SmartpayAssessmentDetails>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${appId}/credit-assessments`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayCreditAssessmentHistory = (
  spaId: string,
  options: SmartpayAssessmentHistoryFilter,
) => {
  return fetchPaginatedData<SmartpayAssessmentHistory>(
    `${baseUrl}/admin/merchant-smartpay-account/${spaId}/credit-assessments-history`,
    options,
  );
};

export const updateSmartpayMerchant = (
  id: string,
  data: CreateUpdateMerchantSmartpayPayload,
): Promise<MerchantSmartpay> => {
  return ajax<MerchantSmartpay>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${id}`,
    method: 'PUT',
    data,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateSmartpayAssessment = (
  appId: string,
  data: SmartpayAssessmentDetails,
): Promise<SmartpayAssessmentDetails> => {
  return ajax<SmartpayAssessmentDetails>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${appId}/credit-assessments`,
    method: 'POST',
    data,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccountFiles = (id: string, options: IPaginationParam) => {
  return fetchPaginatedData<MerchantSmartpayFile>(
    `${baseUrl}/admin/merchant-smartpay-account/${id}/file-managers`,
    options,
  );
};

export const uploadSmartpayFiles = (id: string, files: File[]): Promise<MerchantSmartpayFile[]> => {
  const uploadPromises: Promise<MerchantSmartpayFile>[] = [];
  files.map((f) => {
    const formData = new FormData();
    formData.append('file', f);
    uploadPromises.push(
      ajax<MerchantSmartpayFile>({
        url: `${baseUrl}/admin/merchant-smartpay-account/${id}/upload`,
        method: 'POST',
        data: formData,
      }),
    );
  });
  return Promise.all(uploadPromises);
};

export const deleteSmartpayFile = (fileId: string): Promise<MerchantSmartpayFile> => {
  return ajax<MerchantSmartpayFile>({
    url: `${baseUrl}/admin/merchant-smartpay-account/file-manager/${fileId}`,
    method: 'DELETE',
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayFileUrlSigned = (fileId: string): Promise<string> => {
  return ajax<string>({
    url: `${baseUrl}/admin/merchant-smartpay-account/file-manager/${fileId}/get-signed-url`,
    method: 'GET',
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccountAddresses = (applicationId: string, option: IPaginationParam) => {
  return fetchPaginatedData<SmartpayAccountAddress>(
    `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/addresses`,
    option,
  );
};

export const createSmartpayAccountAddresses = (
  applicationId: string,
  payload: SetSmartpayAccountAddressPayload,
) => {
  return ajax<SmartpayAccountAddress>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/addresses`,
    method: 'POST',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccountAddressDetail = (id: string) => {
  return ajax<SmartpayAccountAddress>({
    url: `${baseUrl}/admin/merchant-smartpay-account/addresses/${id}`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateSmartpayAccountAddresses = (
  id: string,
  payload: SetSmartpayAccountAddressPayload,
) => {
  return ajax<SmartpayAccountAddress>({
    url: `${baseUrl}/admin/merchant-smartpay-account/addresses/${id}`,
    method: 'PUT',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const deleteSmartpayAccountAddress = (id: string) => {
  return ajax<SmartpayAccountAddress>({
    url: `${baseUrl}/admin/merchant-smartpay-account/addresses/${id}`,
    method: 'DELETE',
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccountContacts = (applicationId: string, option: IPaginationParam) => {
  return fetchPaginatedData<SmartpayAccountContact>(
    `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/contacts`,
    option,
  );
};

export const createSmartpayAccountContact = (
  applicationId: string,
  payload: SetSmartpayAccountContactPayload,
) => {
  return ajax<SmartpayAccountContact>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/contact`,
    method: 'POST',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpayAccountContactDetail = (id: string) => {
  return ajax<SmartpayAccountContact>({
    url: `${baseUrl}/admin/merchant-smartpay-account/contacts/${id}`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateSmartpayAccountContact = (
  id: string,
  payload: SetSmartpayAccountContactPayload,
) => {
  return ajax<SmartpayAccountContact>({
    url: `${baseUrl}/admin/merchant-smartpay-account/contacts/${id}`,
    method: 'PUT',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const deleteSmartpayAccountContact = (id: string) => {
  return ajax<SmartpayAccountContact>({
    url: `${baseUrl}/admin/merchant-smartpay-account/contacts/${id}`,
    method: 'DELETE',
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getCompanies = (filters: IFilter): Promise<any> => {
  return ajax<any>({
    url: `${baseUrlCompany}/admin/companies?keyWord=${filters.name}&companyType=${filters.companyType}&perPage=${filters.perPage}`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpaySecurityDeposits = (applicationId: string, option: IPaginationParam) => {
  return fetchPaginatedData<ISecurityDeposit>(
    `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/security-deposits`,
    option,
  );
};

export const getSmartpayTotalSecurityDeposits = (applicationId: string) => {
  return ajax<any>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/security-deposits/total`,
  }).catch((err: any) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSmartpaySecurityDepositDetails = (depositId: string) => {
  return !!depositId
    ? ajax<any>({
        url: `${baseUrl}/admin/security-deposits/${depositId}`,
      }).catch((err: any) =>
        Promise.reject({
          name: err.response.data.errorCode,
          message: extractErrorWithConstraints(err),
        }),
      )
    : null;
};

export const createSmartpayAccountSecurityDeposit = (
  applicationId: string,
  payload: ISecurityDeposit,
) => {
  return ajax<ISecurityDeposit>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${applicationId}/security-deposits`,
    method: 'POST',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const updateSmartpayAccountSecurityDeposit = (
  depositId: string,
  payload: ISecurityDeposit,
) => {
  return ajax<ISecurityDeposit>({
    url: `${baseUrl}/admin/security-deposits/${depositId}`,
    method: 'PUT',
    data: payload,
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const deleteSmartpayAccountSecurityDeposit = (depositId: string) => {
  return ajax<any>({
    url: `${baseUrl}/admin/security-deposits/${depositId}`,
    method: 'DELETE',
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: extractErrorWithConstraints(err),
    }),
  );
};

export const getSPBalanceTempoCreditLimit = (merchantId: string) => {
  return ajax<SmartpayBalanceTempoCreditLimit>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/temporary-credit-limit`,
  });
};

export const getSPBalanceSummary = (merchantId: string) => {
  return ajax<SmartpayBalanceSummary>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/balances`,
  });
};

export const updateSPBalanceTempoCreditLimit = (
  merchantId: string,
  data: SmartpayBalanceTempoCreditLimit,
): Promise<SmartpayBalanceTempoCreditLimit> => {
  return ajax<SmartpayBalanceTempoCreditLimit>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/temporary-credit-limit`,
    method: 'POST',
    data,
  });
};

export const deleteSPBalanceTempoCreditLimit = (merchantId: string) => {
  return ajax<any>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/temporary-credit-limit`,
    method: 'DELETE',
  });
};

export const getSPMCreditPeriodOverrun = (merchantId: string, option: IPaginationParam) => {
  return fetchPaginatedData<CreditPeriodOverrun>(
    `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/credit-period-overrun`,
    option,
  );
};

export const createSPCreditPeriodOverrun = (
  merchantId: string,
  periodOverrun: CreditPeriodOverrunPayload,
) => {
  return ajax<CreditPeriodOverrun>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/credit-period-overrun`,
    method: 'POST',
    data: periodOverrun,
  });
};

export const readSPCreditPeriodOverrun = (periodOverrunId: string) => {
  return ajax<CreditPeriodOverrun>({
    url: `${baseUrl}/admin/merchant-smartpay-account/credit-period-overrun/${periodOverrunId}`,
    method: 'GET',
  });
};

export const getSmartpayAuditLogs = (options: MerchantAuditLogsFilter) => {
  return fetchPaginatedData<MerchantAuditLog>(`${baseUrl}/admin/audit-logs`, options);
};

export const getEnterpriseMerchantUsers = () => {
  return ajax<MerchantUser[]>({
    url: `${baseUrl}/admin/merchants/enterprise/users-merchant`,
  });
};

export const getSPBalanceTransactions = (merchantId: string, options: PaginatedV2Request) => {
  return ajax<SmartpayBalancesPaginatedV2>({
    url: `${baseUrl}/admin/merchant-smartpay-account/${merchantId}/transactions`,
    method: 'GET',
    params: options,
  });
};

export const importTemporaryCreditLimit = (file: File) => {
  const data = new FormData();
  data.append('file', file);

  return ajax<SmartpayAccountImportRes>({
    url: `${baseUrl}/admin/merchant-smartpay-account/temporary-credit-limit/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const importDefermentPeriodLimit = (file: File) => {
  const data = new FormData();
  data.append('file', file);

  return ajax<SmartpayAccountImportRes>({
    url: `${baseUrl}/admin/merchant-smartpay-account/credit-period-overrun/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const validateBulkAdjustFile = (file: File) => {
  const data = new FormData();
  data.append('file', file);
  return ajax<SPABulkAdjustmentsValidateRes>({
    url: `${baseUrl}/admin/merchant-smartpay-account/bulk-adjustments/validate`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch((err) =>
    Promise.reject({
      name: err.response.data.errorCode,
      message: err.response.data?.errors || extractErrorWithConstraints(err),
    }),
  );
};

export const importBulkAdjustments = (file: File) => {
  const data = new FormData();
  data.append('file', file);

  return ajax<SmartpayAccountImportRes>({
    url: `${baseUrl}/admin/merchant-smartpay-account/bulk-adjustments/import`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const readOpsUserDetails = (userId: string) => {
  return ajax<{
    id: string;
    email: string;
    fullName: string;
  }>({
    url: `${baseUrlOps}/admin/admin-users/${userId}`,
    method: 'GET',
  });
};
