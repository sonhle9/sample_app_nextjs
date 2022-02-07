import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {filterEmptyString, IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {RecursivePartial} from 'src/shared/helpers/common';
import {IMerchantUpdateModel} from '../../../shared/interfaces/merchant.interface';
import {IFilter} from '../custom-field-rules/custom-field-rules.service';
import {
  cancelApprovalAdjustmentTrans,
  cancelApprovalExternalTopupTrans,
  cancelSmartpayApp,
  createAdjustmentTransaction,
  CreateAdjustmentTransactionData,
  createMerchant,
  createPrepaidAdjustmentTransaction,
  createSmartpayAccount,
  createSmartpayAccountAddresses,
  createSmartpayAccountContact,
  createSmartpayAccountSecurityDeposit,
  createSmartpayApplication,
  createSPCreditPeriodOverrun,
  deleteSmartpayAccount,
  deleteSmartpayAccountAddress,
  deleteSmartpayAccountContact,
  deleteSmartpayAccountSecurityDeposit,
  deleteSmartpayFile,
  deleteSPBalanceTempoCreditLimit,
  getCompanies,
  getEnterpriseMerchantUsers,
  getListAdjustmentTransaction,
  getListExternalTopupTransaction,
  getMerchantDetails,
  getMerchants,
  getMerchantsByEnterprise,
  GetMerchantsOptions,
  getMultipleMerchantDetails,
  getSmartpayAccountAddressDetail,
  getSmartpayAccountContactDetail,
  getSmartpayAccountDetails,
  getSmartpayAccountFiles,
  getSmartpayApplicationDetails,
  getSmartpayAssessmentDetails,
  getSmartpayFileUrlSigned,
  getSmartpaySecurityDepositDetails,
  getSmartpayTotalSecurityDeposits,
  getSPBalanceSummary,
  getSPBalanceTempoCreditLimit,
  importBulkAdjustments,
  importDefermentPeriodLimit,
  importTemporaryCreditLimit,
  indexMerchantType,
  readMerchantType,
  readOpsUserDetails,
  readSPCreditPeriodOverrun,
  resubmitSmartpayApp,
  sendForApproval,
  sendForApprovalExternalTopupTrans,
  updateMerchantDetails,
  updateMerchantLogo,
  updateMerchantSettingCustomFields,
  updateProductMerchant,
  updateSmartpayAccount,
  updateSmartpayAccountAddresses,
  updateSmartpayAccountContact,
  updateSmartpayAccountSecurityDeposit,
  updateSmartpayAssessment,
  updateSPBalanceTempoCreditLimit,
  uploadAdjustmentFile,
  uploadSmartpayFiles,
  validateBulkAdjustFile,
  validateBulkImportFile,
} from './merchants.service';
import {
  AuditLogFeatureName,
  CreateUpdateMerchantSmartpayPayload,
  CreditPeriodOverrunPayload,
  GiftCardExternalTopUp,
  ISecurityDeposit,
  Merchant,
  MerchantType,
  SetSmartpayAccountAddressPayload,
  SetSmartpayAccountContactPayload,
  SmartpayAccountAddress,
  SmartpayAccountContact,
  SmartpayAssessmentDetails,
  SmartpayBalanceTempoCreditLimit,
  SmartpayType,
} from './merchants.type';
import {updateApprovalRequestToCancel} from '../approval-requests/approval-requests.service';
import {SPAImportType} from './merchant.const';

export const merchantQueryKey = {
  merchantList: 'merchant_list',
  merchantSearch: 'merchant_search',
  merchantDetails: 'merchant_details',
  multipleMerchantDetails: 'multiple_merchant_details',
  merchantType: 'merchant_type',
  merchantTypeList: 'merchant_type_list',
  adjustmentTransactions: 'adjustmentTransactions',
  externalTopupTransactions: 'externalTopupTransactions',
  smartpayMerchants: 'smartpayMerchants',
  smartpayApps: 'smartpayApps',
  smartpayMerchantDetails: 'smartpayMerchantDetails',
  smartpayMerchantFiles: 'smartpayMerchantFiles',

  smartpayAddressesList: 'smartpayAddressesList',
  smartpayAddressDetail: 'smartpayAddressDetail',
  smartpayContactsList: 'smartpayContactsList',
  smartpayContactDetail: 'smartpayContactDetail',

  smartpaySecurityDepositsList: 'smartpaySecurityDepositsList',
  smartpayTotalSecurityDeposits: 'smartpayTotalSecurityDeposits',
  smartpaySecurityDepositDetails: 'smartpaySecurityDepositDetails',

  smartpayCompanyList: 'smartpayCompanyList',

  smartpayAssessmentDetails: 'smartpayAssessmentDetails',
  smartpayAssessmentHistory: 'smartpayAssessmentHistory',
  smartpayBalanceTempoCreditLimit: 'smartpayBalanceTempoCreditLimit',
  smartpayBalanceSummary: 'smartpayBalanceSummary',
  smartpayBalanceTrans: 'smartpayBalanceTrans',

  merchantLinkListing: 'merchant_link_listing',
  merchantLinkDetails: 'merchant_link_details',
  merchantLinkSearchMerchant: 'merchant_link_search_merchant',
  merchantLinkSearchMerchantByEnterprise: 'merchant_link_search_merchant_by_enterprise',

  periodOverrunList: 'periodOverrunList',
  limitOverrunList: 'limitOverrunList',
  periodOverrunHistoryList: 'periodOverrunHistoryList',
  limitOverrunHistoryList: 'limitOverrunHistoryList',
  limitOverrunDetails: 'limitOverrunDetails',
  periodOverrunDetails: 'periodOverrunDetails',

  enterpriseMerchantUsers: 'enterpriseMerchantUsers',
  auditLogs: 'auditLogs',
} as const;

export const useMerchantDetails = <Result = Merchant>(
  merchantId: string,
  options?: UseQueryOptions<Merchant, unknown, Result>,
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [merchantQueryKey.merchantDetails, merchantId],
    () => getMerchantDetails(merchantId),
    {
      ...options,
      placeholderData: () =>
        queryClient
          .getQueryData<IPaginationResult<Merchant>>([merchantQueryKey.merchantList], {
            exact: false,
          })
          ?.items.find((m) => m.id === merchantId),
    },
  );
};

export const useMultipleMerchantDetails = <Result = Array<Merchant>>(
  merchantIds: string[],
  options?: UseQueryOptions<Array<Merchant>, unknown, Result>,
) => {
  return useQuery(
    [merchantQueryKey.multipleMerchantDetails, merchantIds],
    () => getMultipleMerchantDetails(merchantIds),
    options,
  );
};

export const useMerchantSearch = <Result = IPaginationResult<Merchant>>(
  options: GetMerchantsOptions,
  queryOptions: UseQueryOptions<IPaginationResult<Merchant>, unknown, Result> = {},
) =>
  useQuery(
    [merchantQueryKey.merchantSearch, options],
    () =>
      getMerchants({
        includeBalances: false,
        ...filterEmptyString(options),
      }),
    queryOptions,
  );

export const useCreateMerchant = (typeCode: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({logo, ...data}: IMerchantUpdateModel & {logo?: File}) => {
      if (logo) {
        return createMerchant(data).then((merchant) =>
          updateMerchantLogo(merchant.merchantId, logo),
        );
      }
      return createMerchant(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.merchantList]);
        queryClient.invalidateQueries([`${merchantQueryKey.merchantTypeList}-${typeCode}`]);
      },
    },
  );
};

export const useCreateMerchantAdjustment = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Omit<CreateAdjustmentTransactionData, 'merchantId'>) =>
      createAdjustmentTransaction({
        ...data,
        merchantId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.merchantList]);
        queryClient.invalidateQueries([merchantQueryKey.merchantDetails, merchantId]);
      },
    },
  );
};

export const useUpdateMerchantDetails = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({logo, ...data}: RecursivePartial<Merchant> & {logo?: File}) => {
      if (logo) {
        return updateMerchantLogo(merchantId, logo).then(() =>
          updateMerchantDetails(merchantId, data),
        );
      }

      return updateMerchantDetails(merchantId, {
        ...data,
        logoUrl: logo === null ? null : undefined,
      });
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([merchantQueryKey.merchantDetails, merchantId]),
    },
  );
};

export const useUpdateMerchantCustomFields = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (attributes: Record<string, string>) =>
      updateMerchantSettingCustomFields(merchantId, attributes),
    {
      onSuccess: (result) =>
        queryClient.invalidateQueries([merchantQueryKey.merchantDetails, result.merchantId]),
    },
  );
};

export const useValidateBulkImportFile = () => {
  return useMutation((f: File) => validateBulkImportFile(f));
};

export const useSendForApproval = () => {
  return useMutation((f: File) => sendForApproval(f));
};

export const useSendForApprovalExternalTopupTrans = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({file, ...topup}: GiftCardExternalTopUp & {file: File}) => {
      return uploadAdjustmentFile(merchantId, file).then((res) => {
        return sendForApprovalExternalTopupTrans({
          ...topup,
          attachment: res.attachmentFileUrl,
        });
      });
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([merchantQueryKey.externalTopupTransactions, merchantId]),
    },
  );
};

export const useExternalTopupTransaction = (
  merchantId: string,
  filters: Parameters<typeof getListExternalTopupTransaction>[1],
) => {
  return useQuery(
    [merchantQueryKey.externalTopupTransactions, merchantId, filters],
    () => getListExternalTopupTransaction(merchantId, filters),
    {
      keepPreviousData: true,
    },
  );
};

export const useCancelApprovalExternalTopupTrans = () => {
  const queryClient = useQueryClient();
  return useMutation((approvalId: string) => cancelApprovalExternalTopupTrans(approvalId), {
    onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.externalTopupTransactions),
  });
};

export const useAdjustmentTransaction = (
  merchantId: string,
  filters: Parameters<typeof getListAdjustmentTransaction>[1],
) => {
  return useQuery(
    [merchantQueryKey.adjustmentTransactions, merchantId, filters],
    () => getListAdjustmentTransaction(merchantId, filters),
    {
      keepPreviousData: true,
    },
  );
};

export const useCreatePrepaidAdjustmentTransaction = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({file, ...data}: RecursivePartial<any> & {file?: File}) => {
      if (file) {
        return uploadAdjustmentFile(merchantId, file).then((res) => {
          return createPrepaidAdjustmentTransaction({
            ...data,
            amount: +data.amount,
            attachment: res.attachmentFileUrl,
          });
        });
      }

      return createPrepaidAdjustmentTransaction(data);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.adjustmentTransactions),
    },
  );
};

export const useMerchantType = (typeId: string) =>
  useQuery([merchantQueryKey.merchantType, typeId], () => typeId && readMerchantType(typeId));

export const useListMerchantTypes = <Result = MerchantType[]>(
  options: UseQueryOptions<MerchantType[], unknown, Result> = {},
) => useQuery(merchantQueryKey.merchantType, indexMerchantType, options);

export const useCancelApprovalAdjustmentTrans = (transId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return cancelApprovalAdjustmentTrans(transId);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.adjustmentTransactions),
    },
  );
};

export const useUpdateProductMerchant = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({product, enable}: {product: string; enable: boolean}) =>
      updateProductMerchant(merchantId, product, enable),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.merchantDetails, merchantId]);
      },
    },
  );
};

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery(['merchants', filter], () => searchMerchantsWithNameOrID(filter), {
    keepPreviousData: true,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        metadata: merchant.merchantId,
      })),
  });
};

export const useCreateSmartpayAccountOrApplication = (smartpayType?: SmartpayType) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: CreateUpdateMerchantSmartpayPayload) =>
      smartpayType === SmartpayType.ACCOUNT
        ? createSmartpayAccount(data)
        : createSmartpayApplication(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(merchantQueryKey.smartpayApps);
        queryClient.invalidateQueries(merchantQueryKey.smartpayMerchants);
        queryClient.invalidateQueries([[merchantQueryKey.smartpayMerchants]]);
      },
    },
  );
};

export const useSmartpayAccountDetails = (id: string) => {
  return useQuery([merchantQueryKey.smartpayMerchantDetails, id], () =>
    getSmartpayAccountDetails(id),
  );
};

export const useSmartpayApplicationDetails = (id: string) => {
  return useQuery([merchantQueryKey.smartpayMerchantDetails, id], () =>
    getSmartpayApplicationDetails(id),
  );
};

export const useUpdateSmartpayAccount = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: CreateUpdateMerchantSmartpayPayload) => updateSmartpayAccount(id, payload),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([merchantQueryKey.smartpayMerchantDetails, id]),
    },
  );
};

export const useDeleteSmartpayAccount = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteSmartpayAccount(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(merchantQueryKey.smartpayMerchants);
      queryClient.invalidateQueries([[merchantQueryKey.smartpayMerchants]]);
      queryClient.invalidateQueries(merchantQueryKey.smartpayApps);
    },
  });
};

export const useCancelSmartpayApp = () => {
  const queryClient = useQueryClient();
  return useMutation((requestId: string) => cancelSmartpayApp(requestId), {
    onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.smartpayMerchantDetails),
  });
};

export const useResubmitSmartpayApp = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({applicationId, email}: {applicationId: string; email: string}) =>
      resubmitSmartpayApp(applicationId, email),
    {
      onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.smartpayMerchantDetails),
    },
  );
};

export const useSmartpayAssessmentDetails = (appId: string) => {
  return useQuery([merchantQueryKey.smartpayAssessmentDetails, appId], () =>
    getSmartpayAssessmentDetails(appId),
  );
};

export const useUpdateSmartpayAssessment = (appId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: SmartpayAssessmentDetails) => updateSmartpayAssessment(appId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([merchantQueryKey.smartpayAssessmentDetails, appId]);
        queryClient.invalidateQueries(
          `${merchantQueryKey.auditLogs}_${AuditLogFeatureName.CREDIT_ASSESSMENT}`,
        );
      },
    },
  );
};

export const useSetSmartpayAccountAddress = (
  applicationId: string,
  currentAddress: SmartpayAccountAddress,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (address: SetSmartpayAccountAddressPayload) =>
      currentAddress
        ? updateSmartpayAccountAddresses(currentAddress.id, address)
        : createSmartpayAccountAddresses(applicationId, address),
    {
      onSuccess: () => {
        if (currentAddress) {
          queryClient.invalidateQueries([
            merchantQueryKey.smartpayAddressDetail,
            currentAddress.id,
          ]);
        }
        queryClient.invalidateQueries([[merchantQueryKey.smartpayAddressesList, applicationId]]);
      },
    },
  );
};

export const useSmartpayAccountAddressDetail = (id: string) => {
  return useQuery([merchantQueryKey.smartpayAddressDetail, id], () =>
    getSmartpayAccountAddressDetail(id),
  );
};

export const useDeleteSmartpayAccountAddress = (address: SmartpayAccountAddress) => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteSmartpayAccountAddress(id), {
    onSuccess: () =>
      queryClient.invalidateQueries([
        [merchantQueryKey.smartpayAddressesList, address.applicationId],
      ]),
  });
};

export const useGetSmartpayFiles = (id: string, filter: IPaginationParam) => {
  return useQuery(
    [merchantQueryKey.smartpayMerchantFiles, filter],
    () => getSmartpayAccountFiles(id, filter),
    {keepPreviousData: true},
  );
};

export const useUploadSmartpayFiles = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((files: File[]) => uploadSmartpayFiles(id, files), {
    onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.smartpayMerchantFiles),
  });
};

export const useDeleteSmartpayFile = () => {
  const queryClient = useQueryClient();
  return useMutation((fileId: string) => deleteSmartpayFile(fileId), {
    onSuccess: () => queryClient.invalidateQueries(merchantQueryKey.smartpayMerchantFiles),
  });
};

export const useGetSmartpayFileUrlSigned = () => {
  return useMutation((fileId: string) => getSmartpayFileUrlSigned(fileId));
};

export const useSetSmartpayAccountContact = (
  applicationId: string,
  currentContact: SmartpayAccountContact,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (contact: SetSmartpayAccountContactPayload) =>
      currentContact
        ? updateSmartpayAccountContact(currentContact.id, contact)
        : createSmartpayAccountContact(applicationId, contact),
    {
      onSuccess: () => {
        if (currentContact) {
          queryClient.invalidateQueries([
            merchantQueryKey.smartpayContactDetail,
            currentContact.id,
          ]);
        }
        queryClient.invalidateQueries([[merchantQueryKey.smartpayContactsList, applicationId]]);
      },
    },
  );
};

export const useSmartpayAccountContactDetail = (id: string) => {
  return useQuery([merchantQueryKey.smartpayContactDetail, id], () =>
    getSmartpayAccountContactDetail(id),
  );
};

export const useDeleteSmartpayAccountContact = (contact: SmartpayAccountContact) => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteSmartpayAccountContact(id), {
    onSuccess: () =>
      queryClient.invalidateQueries([
        [merchantQueryKey.smartpayContactsList, contact.applicationId],
      ]),
  });
};

export const useCompanies = (filters: IFilter) => {
  return useQuery([merchantQueryKey.smartpayCompanyList, filters], () => getCompanies(filters), {
    keepPreviousData: true,
  });
};

export const useTotalSecurityDeposits = (applicationId: string) => {
  return useQuery([merchantQueryKey.smartpayTotalSecurityDeposits, applicationId], () =>
    getSmartpayTotalSecurityDeposits(applicationId),
  );
};

export const useSecurityDepositDetails = (depositId: string) => {
  return useQuery([merchantQueryKey.smartpaySecurityDepositDetails, depositId], () =>
    getSmartpaySecurityDepositDetails(depositId),
  );
};

export const useSetSPASecurityDeposit = (
  applicationId: string,
  currentDeposit: ISecurityDeposit,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (contact: ISecurityDeposit) =>
      currentDeposit
        ? updateSmartpayAccountSecurityDeposit(currentDeposit.id, contact)
        : createSmartpayAccountSecurityDeposit(applicationId, contact),
    {
      onSuccess: () => {
        if (currentDeposit) {
          queryClient.invalidateQueries(merchantQueryKey.smartpaySecurityDepositDetails);
        }
        queryClient.invalidateQueries([
          [merchantQueryKey.smartpaySecurityDepositsList, applicationId],
        ]);
        queryClient.invalidateQueries(merchantQueryKey.smartpayTotalSecurityDeposits);
        queryClient.invalidateQueries(
          `${merchantQueryKey.auditLogs}_${AuditLogFeatureName.SECURITY_DEPOSIT}`,
        );
      },
    },
  );
};

export const useDeleteSPASecurityDeposit = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation((depositId: string) => deleteSmartpayAccountSecurityDeposit(depositId), {
    onSuccess: () => {
      queryClient.invalidateQueries([
        [merchantQueryKey.smartpaySecurityDepositsList, applicationId],
      ]);
      queryClient.invalidateQueries(merchantQueryKey.smartpayTotalSecurityDeposits);
      queryClient.invalidateQueries(
        `${merchantQueryKey.auditLogs}_${AuditLogFeatureName.SECURITY_DEPOSIT}`,
      );
    },
  });
};

export const useSPBalancesTempoCreditLimit = (merchantId: string) => {
  return useQuery([merchantQueryKey.smartpayBalanceTempoCreditLimit, merchantId], () =>
    getSPBalanceTempoCreditLimit(merchantId),
  );
};

export const useSPBalanceSummary = (merchantId: string) => {
  return useQuery([merchantQueryKey.smartpayBalanceSummary, merchantId], () =>
    getSPBalanceSummary(merchantId),
  );
};

export const useUpdateSPBalancesTempoCreditLimit = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: SmartpayBalanceTempoCreditLimit) =>
      updateSPBalanceTempoCreditLimit(merchantId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          merchantQueryKey.smartpayBalanceTempoCreditLimit,
          merchantId,
        ]);
        queryClient.invalidateQueries([merchantQueryKey.smartpayBalanceSummary, merchantId]);
      },
    },
  );
};

export const useDeleteSPBalancesTempoCreditLimit = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteSPBalanceTempoCreditLimit(merchantId), {
    onSuccess: () => {
      queryClient.invalidateQueries([merchantQueryKey.smartpayBalanceTempoCreditLimit, merchantId]);
      queryClient.invalidateQueries([merchantQueryKey.smartpayBalanceSummary, merchantId]);
    },
  });
};

export const useSearchMerchant = (searchValue: string) => {
  return useQuery(
    [merchantQueryKey.merchantLinkSearchMerchant, searchValue],
    () =>
      getMerchants({
        includeBalances: false,
        page: 1,
        perPage: 50,
        searchValue: searchValue || undefined,
      }),
    {
      keepPreviousData: true,
      select: (merchants) =>
        merchants.items.map((m) => ({
          label: m.name,
          value: m.merchantId,
        })),
    },
  );
};

export const useSearchMerchantByEnterprise = (searchValue: string, enterpriseId: string) => {
  return useQuery(
    [merchantQueryKey.merchantLinkSearchMerchantByEnterprise, searchValue, enterpriseId],
    () => (enterpriseId ? getMerchantsByEnterprise(enterpriseId, searchValue || undefined) : null),
    {
      keepPreviousData: true,
      select: (merchants) =>
        merchants
          ? merchants.map((m) => ({
              label: m.name,
              value: m.merchantId,
            }))
          : [],
    },
  );
};

export const useCreateSPCreditPeriodOverrun = (merchantId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (overrun: CreditPeriodOverrunPayload) => createSPCreditPeriodOverrun(merchantId, overrun),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${merchantQueryKey.periodOverrunList}_${merchantId}`);
      },
    },
  );
};

export const useReadSPPeriodOverrun = (periodOverrunId: string) => {
  return useQuery([merchantQueryKey.periodOverrunDetails, periodOverrunId], () =>
    readSPCreditPeriodOverrun(periodOverrunId),
  );
};

export const useCancelApprovalSPPeriodOverrun = (merchantId: string, periodOverrunId: string) => {
  const queryClient = useQueryClient();
  return useMutation((approveId: string) => updateApprovalRequestToCancel(approveId), {
    onSuccess: () => {
      queryClient.invalidateQueries([merchantQueryKey.periodOverrunDetails, periodOverrunId]);
      queryClient.invalidateQueries(`${merchantQueryKey.periodOverrunList}_${merchantId}`);
    },
  });
};

export const useGetEnterpriseMerchantUsers = () => {
  return useQuery(merchantQueryKey.enterpriseMerchantUsers, () => getEnterpriseMerchantUsers());
};

export const useSmartpayAccountImportCsv = (importType: SPAImportType) => {
  return useMutation((file: File) => {
    switch (importType) {
      case SPAImportType.ADJUST:
        return importBulkAdjustments(file);
      case SPAImportType.LIMIT:
        return importTemporaryCreditLimit(file);
      case SPAImportType.PERIOD:
        return importDefermentPeriodLimit(file);
    }
  });
};

export const useSPAValidateBulkAdjustFile = () => {
  return useMutation((file: File) => validateBulkAdjustFile(file));
};

export const useReadOpsUserDetails = (userId: string) => {
  return useQuery([merchantQueryKey.merchantDetails, userId], () => readOpsUserDetails(userId));
};
