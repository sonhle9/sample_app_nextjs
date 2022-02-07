import {TransactionFilters} from '../../services/api-ops.service';
import {PaginationParams} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import {useMutation, useQueryClient, useQuery, UseQueryOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  createTags,
  deleteDevice,
  getUserDevices,
  getUserProfile,
  IUpdateDeviceBody,
  IUserProfile,
  updateDevice,
  updatePhoneNumber,
  updateTags,
} from 'src/react/services/api-accounts.service';
import {indexExpiringBalance} from 'src/react/services/api-balance-expiry.service';
import {getCustomerAttributes} from 'src/react/services/api-attributes.service';
import {
  IIndexFraudProfileFilters,
  indexFraudProfiles,
  FraudProfile,
  getCustomerAccumulation,
  updateCustomerLimitation,
  UpdateUserLimitation,
} from 'src/react/services/api-blacklist.service';
import {IPeriodCustomerAccumulation} from 'src/app/api-blacklist-service';
import {
  emailStatementSummaryByUserId,
  indexMonthlyStatementSummaryByUserId,
} from 'src/react/services/api-budget.service';
import {
  getMemberTiers,
  getUserTierProgress,
  listActions,
  ReplaceTierRequestBody,
  replaceUserTier,
} from 'src/react/services/api-membership.service';
import {
  createExternalTransaction,
  grantWallet,
  indexCustomerTransactions,
  indexCustomerVendorTransactions,
  getOrder as getOptOrder,
  addUserLoyaltyCard,
  deleteUserLoyaltyCard,
  getUserAccountSetting,
  getUserWalletInfo,
  indexLmsLoyaltyTransactions,
  IndexLmsLoyaltyTransactionsFilter,
  indexUserLoyaltyTransactions,
  IWalletInfo,
  readAutoTopup,
  updateInternalUser,
  updateUserLoyaltyCard,
} from 'src/react/services/api-ops.service';
import {indexOrders} from 'src/react/services/api-orders.service';
import {
  getRefreshWalletBalanceByUserId,
  getTransaction,
  getUserIncomingBalance,
  getUserCreditCard,
  PaymentTransaction,
  indexUserCreditCards,
  getCustomerIncomingBalanceTransactions,
  deleteCreditCard,
} from 'src/react/services/api-payments.service';
import {getRiskProfileDetailsByUserId} from 'src/react/services/api-risk-profiles.service';

import {
  addCashbakCampaign,
  addReferrerCode,
  getGoalById,
  getReferrals,
  getReferrer,
  getRewardMemberInfo,
  listMemberGoals,
  regenerateReferralCode,
  regrantReward,
  updateGoal,
} from 'src/react/services/api-rewards.service';
import {getSmartPayCardByUserId, ISmartPayCard} from 'src/react/services/api-smartpay.service';
import {getStation} from 'src/react/services/api-stations.service';
import {
  indexVouchersByUserId,
  IVoucher,
  voidVoucherByCodeOrId,
} from 'src/react/services/api-vouchers.service';
import {IAutoTopup, ICreditCard} from 'src/shared/interfaces/creditCards.interface';
import {IExpiryWalletBalance} from 'src/shared/interfaces/expiryBalance.interface';
import {IBudget, ICustomBudget} from 'src/shared/interfaces/customer.interface';
import {
  IPaginatedResult,
  IPaginationResponse,
  IPaginationParams,
} from 'src/shared/interfaces/core.interface';
import {IEntity} from 'src/shared/interfaces/entity.interface';
import {IDevice} from 'src/shared/interfaces/devices';
import {
  ILMSTransaction,
  ILoyaltyTransaction,
  IPaginationMetadata,
} from 'src/shared/interfaces/loyalty.interface';
import {ILoyaltyCard, IUpdateLoyaltyCardInput} from 'src/shared/interfaces/loyaltyCard.interface';
import {
  IMembershipAction,
  ITier,
  IUserTierProgress,
} from 'src/shared/interfaces/membership.interface';
import {IOrder} from 'src/shared/interfaces/order.interface';
import {
  IGoalWithRelations,
  IMember,
  IReferral,
  IReferrer,
} from 'src/shared/interfaces/reward.interface';
import {IReadStation} from 'src/shared/interfaces/station.interface';
import {IStoreOrder} from 'src/shared/interfaces/storeOrder.interface';
import {
  ICreateTransactionInput,
  IGrantWalletInput,
  ITransaction,
  IVendorTransaction,
} from 'src/shared/interfaces/transaction.interface';
import {
  getCurrentCardActivationLimit,
  getUnlinkedLoyaltyCards,
  manualGrantLoyaltyPoints,
  resetCustomerCardActivationLimit,
} from '../loyalty/loyalty.service';
import {LoyaltyManualGrantPointsParams} from '../loyalty/loyalty.type';
import {paymentTransactionsQueryKey} from '../payments-transactions/payment-transactions.queries';
import {PaginationTokenResponse} from '../tokenPagination';
import {
  getCustomer,
  updateCustomer,
  getListCustomer,
  getCustomerLatestStoreOrders,
  getPaymentTransactions,
  getSetelShareHistoryByUserId,
} from './customers.service';
import {
  ICustomerAccountSettings,
  ICustomerRefreshBalanceResponse,
  ICustomerTransactions,
  IStoreOrdersFilter,
  IUpdateCustomer,
} from './customers.type';
import {IFuelOrdersFilter} from '../fuel-orders/fuel-orders.type';
import {
  createAdjustmentTransaction,
  GetWalletTransactionOptions,
  getWalletTransactions,
} from 'src/react/services/api-wallets.service';
import {
  CreateAdjustmentTransactionParams,
  ITransaction as IWalletTransaction,
} from 'src/shared/interfaces/wallet.interface';

const CUSTOMER = 'customer';
const CUSTOMER_DETAILS = 'customer_details';
const LIST_CUSTOMER = 'list_customer';
const CUSTOMER_ORDERS = 'customer_orders';
const CUSTOMER_STORE_ORDERS = 'customer_store_orders';
export const PAYMENT_TRANSACTIONS = 'payment_transactions';
const OPT_ORDER_DETAILS = 'opt_order_details';
const INDEX_FRAUD_PROFILES = 'index_fraud_profiles';
const LIST_CUSTOMER_DEVICES = 'list_customer_devices';
const REFRESH_WALLET_BALANCE = 'refresh_wallet_balance';
const GET_WALLET_INFO = 'get_wallet_info';
const GET_ACCOUNT_SETTINGS = 'get_account_settings';
const GET_INCOMING_BALANCE = 'get_incoming_balance';
const GET_SMART_PAY_CARD = 'get_smart_pay_card';
const GET_LOYALTY_CARD_ACTIVATION_LIMIT = 'get_loyalty_card_activation_limit';
const GET_LOYALTY_CARD = 'get_loyalty_card';
const GET_USER_TIER_PROGRESS = 'get_user_tier_progress';
const LIST_ACTIONS = 'list_actions';
const LIST_CUSTOMER_ATTRIBUTES = 'list_customer_attributes';
const LIST_MEMBER_TIERS = 'list_member_tiers';
const LIST_USER_VOUCHERS = 'list_user_voucher';
const INDEX_CUSTOMER_TRANSACTION = 'index_customer_transaction';
const GET_CREDIT_CARD = 'get_credit_card';
const GET_AUTO_TOP_UP = 'get_auto_top_up';
const GET_EXPIRY_BALANCE = 'get_expiry_balance';
const GET_VENDOR_TRANSACTION = 'get_vendor_transaction';
const GET_INCOMING_BALANCE_TRANSACTIONS = 'get_incoming_balance_transactions';
const LIST_EXTERNAL_TRANSACTION = 'list_external_transaction';
const LIST_GRANT_WALLET = 'list_grant_wallet';
const LIST_BUDGETS = 'list_budget';
const LIST_BUDGETS_EMAIL = 'list_budget_email';
const GET_REWARD_MEMBER_INFO = 'get_reward_member_info';
const GET_USER_REFERRALS = 'get_user_referrals';
const GET_USER_REFERRER = 'get_user_referrer';
const LIST_MEMBER_GOALS = 'list_member_goals';
const FIND_GOAL = 'find_goal';
const GET_UNLINK_LOYALTY_CARDS = 'get_unlink_loyalty_cards';
const INDEX_USER_LOYALTY_TRANSACTIONS = 'index_user_loyalty_transactions';
const INDEX_LMS_LOYALTY_TRANSACTIONS = 'index_lms_loyalty_transactions';
const GET_CUSTOMER_ACCUMULATION = 'get_customer_accumulation';
const DELETE_CUSTOMER_CREDIT_CARD = 'delete_customer_credit_card';
const GET_WALLET_TRANSACTIONS = 'get_wallet_transactions';
const GET_SETELSHARE_HISTORY = 'get_setelshare_history';
export const useCustomer = (filter: Parameters<typeof getCustomer>[0]) => {
  return useQuery([CUSTOMER, filter], () => getCustomer(filter), {keepPreviousData: true});
};

export const useSetUpdateCustomer = (update: IUpdateCustomer) => {
  const queryClient = useQueryClient();
  return useMutation(() => updateCustomer(update), {
    onSuccess: () => {
      queryClient.invalidateQueries([CUSTOMER_DETAILS]);
    },
  });
};

export const useCustomerDetails = (filter: string, options: UseQueryOptions<IUserProfile> = {}) =>
  useQuery([CUSTOMER_DETAILS, filter], () => getUserProfile(filter), options);

export const useStation = <Result = IReadStation, Error = unknown>(
  stationId: string,
  config?: UseQueryOptions<IReadStation, Error, Result>,
) => useQuery(['getStation', stationId], () => getStation(stationId), config);

export const useCustomerLatestOrders = <Result = IPaginationResult<IOrder>, Error = unknown>(
  pagination: IPaginationParam,
  filter: IFuelOrdersFilter,
  options?: UseQueryOptions<IPaginationResult<IOrder>, Error, Result>,
) => useQuery([CUSTOMER_ORDERS, filter], () => indexOrders(pagination, filter), options);

export function useCustomerLatestStoreOrders<
  Result = IPaginationResult<IStoreOrder>,
  Error = unknown,
>(
  pagination?: IPaginationParam,
  filter?: IStoreOrdersFilter,
  options?: UseQueryOptions<IPaginationResult<IStoreOrder>, Result, Error>,
) {
  return useQuery(
    [CUSTOMER_STORE_ORDERS, filter],
    () => getCustomerLatestStoreOrders(pagination, filter),
    options,
  );
}

export const usePaymentTransactions = (
  filter: ICustomerTransactions,
  options: UseQueryOptions<PaymentTransaction[], {message: string}> = {},
) => useQuery([PAYMENT_TRANSACTIONS, filter], () => getPaymentTransactions(filter), {...options});

export const useListCustomer = () => {
  return useQuery([LIST_CUSTOMER], () => getListCustomer());
};

export const usePaymentTransactionDetails = (
  trxId: string,
  options: UseQueryOptions<PaymentTransaction> = {},
) =>
  useQuery([paymentTransactionsQueryKey.transactionDetails, trxId], () => getTransaction(trxId), {
    ...options,
  });

export const useIndexFraudProfiles = (
  filter: IIndexFraudProfileFilters,
  options?: UseQueryOptions<IPaginationResult<FraudProfile>>,
) => useQuery([INDEX_FRAUD_PROFILES, filter], () => indexFraudProfiles(filter), options);

export const useGetUserDevices = (
  userId: string,
  options?: UseQueryOptions<IPaginatedResult<IDevice[]>, unknown>,
  paginationParams?: PaginationParams,
) =>
  useQuery(
    [LIST_CUSTOMER_DEVICES, userId],
    () => getUserDevices(userId, paginationParams),
    options,
  );

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({deviceId, updateDeviceBody}: {deviceId: string; updateDeviceBody: IUpdateDeviceBody}) =>
      updateDevice(deviceId, updateDeviceBody),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LIST_CUSTOMER_DEVICES]);
      },
    },
  );
};

export const useGetRefreshWalletBalance = (
  userId: string,
  options?: UseQueryOptions<ICustomerRefreshBalanceResponse, unknown>,
) =>
  useQuery(
    [REFRESH_WALLET_BALANCE, userId],
    () => getRefreshWalletBalanceByUserId(userId),
    options,
  );

export const useGetWalletInfo = (userId: string, options?: UseQueryOptions<IWalletInfo, unknown>) =>
  useQuery([GET_WALLET_INFO, userId], () => getUserWalletInfo(userId), options);

export const useUpdateInternalUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, isInternalUser}: {userId: string; isInternalUser: boolean}) =>
      updateInternalUser(userId, isInternalUser),
    {onSuccess: () => queryClient.invalidateQueries([CUSTOMER_DETAILS])},
  );
};

export const useUserAccountSettings = (
  userId: string,
  options?: UseQueryOptions<ICustomerAccountSettings, unknown>,
) => useQuery([GET_ACCOUNT_SETTINGS, userId], () => getUserAccountSetting(userId), options);

export const useUserIncomingBalance = (
  userId: string,
  options?: UseQueryOptions<number, unknown>,
) => useQuery([GET_INCOMING_BALANCE, userId], () => getUserIncomingBalance(userId), options);

export const useSmartPayCard = (
  userId: string,
  options?: UseQueryOptions<ISmartPayCard[], unknown>,
) => useQuery([GET_SMART_PAY_CARD, userId], () => getSmartPayCardByUserId(userId), options);

export const useCurrentLoyaltyCardActivationLimit = (
  userId: string,
  options?: UseQueryOptions<{retryCount: number}, unknown>,
) =>
  useQuery(
    [GET_LOYALTY_CARD_ACTIVATION_LIMIT, userId],
    () => getCurrentCardActivationLimit(userId),
    options,
  );

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({deviceId, adminUsername}: {deviceId: string; adminUsername: string}) =>
      deleteDevice(deviceId, adminUsername),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LIST_CUSTOMER_DEVICES]);
      },
    },
  );
};

export const useListUserVouchers = (
  userId: string,
  pagination?: PaginationParams,
  options?: UseQueryOptions<IPaginationResult<IVoucher>, unknown>,
) =>
  useQuery(
    [LIST_USER_VOUCHERS, userId, pagination],
    () => indexVouchersByUserId(userId, pagination),
    {keepPreviousData: true, ...options},
  );

export const useVoidVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation((codeOrId: string) => voidVoucherByCodeOrId(codeOrId), {
    onSuccess: () => {
      queryClient.invalidateQueries([LIST_USER_VOUCHERS]);
    },
  });
};

export const useUserTierProgress = (
  userId: string,
  options?: UseQueryOptions<IUserTierProgress, unknown>,
) => useQuery([GET_USER_TIER_PROGRESS, userId], () => getUserTierProgress(userId), options);

export const useListActions = (
  userId?: string,
  pagination?: IPaginationParam,
  options?: UseQueryOptions<PaginationTokenResponse<IMembershipAction>, unknown>,
) =>
  useQuery([LIST_ACTIONS, userId, pagination], () => listActions(userId, pagination), {
    keepPreviousData: true,
    ...options,
  });

export const useMemberTiers = (options?: UseQueryOptions<ITier[], unknown>) =>
  useQuery([LIST_MEMBER_TIERS], () => getMemberTiers(), options);

export const useReplaceUserTier = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, requestBody}: {userId: string; requestBody: ReplaceTierRequestBody}) =>
      replaceUserTier(userId, requestBody),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_USER_TIER_PROGRESS]);
      },
    },
  );
};

export const useIndexUserCreditCards = (
  userId: string,
  options?: UseQueryOptions<ICreditCard[], unknown>,
) => useQuery([GET_CREDIT_CARD, userId], () => indexUserCreditCards(userId), options);

export const useReadAutoTopup = (userId: string, options?: UseQueryOptions<IAutoTopup, unknown>) =>
  useQuery([GET_AUTO_TOP_UP, userId], () => readAutoTopup(userId), options);

export const useIndexExpiringBalance = (
  userId: string,
  options?: UseQueryOptions<IExpiryWalletBalance, unknown>,
) => useQuery([GET_EXPIRY_BALANCE, userId], () => indexExpiringBalance(userId), options);

export const useIndexCustomerVendorTransactions = (
  userId: string,
  options?: UseQueryOptions<IVendorTransaction[], unknown>,
) =>
  useQuery(
    [GET_VENDOR_TRANSACTION, userId],
    () => indexCustomerVendorTransactions(userId),
    options,
  );

export const useGetCustomerIncomingBalanceTransactions = (
  userId: string,
  options?: UseQueryOptions<ITransaction[], unknown>,
) =>
  useQuery(
    [GET_INCOMING_BALANCE_TRANSACTIONS, userId],
    () => getCustomerIncomingBalanceTransactions(userId),
    options,
  );

export function useIndexCustomerTransactions<Result = IPaginationResult<ITransaction>>(
  params: TransactionFilters,
  config?: UseQueryOptions<IPaginationResult<ITransaction>, Result>,
) {
  return useQuery(
    [INDEX_CUSTOMER_TRANSACTION, params],
    () => indexCustomerTransactions(params),
    config,
  );
}

export const usecreateExternalTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation((params: ICreateTransactionInput) => createExternalTransaction(params), {
    onSuccess: () => {
      queryClient.invalidateQueries([LIST_EXTERNAL_TRANSACTION]);
    },
  });
};

export const useGrantWallet = () => {
  const queryClient = useQueryClient();
  return useMutation((params: IGrantWalletInput) => grantWallet(params), {
    onSuccess: () => {
      queryClient.invalidateQueries([LIST_GRANT_WALLET]);
    },
  });
};

export const useIndexMonthlyStatementSummaryByUserId = (
  userId: string,
  pagination?: IPaginationParams,
  options?: UseQueryOptions<IPaginationResult<IBudget>, unknown>,
) =>
  useQuery(
    [LIST_BUDGETS, userId, pagination],
    () => indexMonthlyStatementSummaryByUserId(userId, pagination),
    {keepPreviousData: true, ...options},
  );

export const useEmailStatementSummaryByUserId = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation((params: ICustomBudget) => emailStatementSummaryByUserId(userId, params), {
    onSuccess: () => {
      queryClient.invalidateQueries([LIST_BUDGETS_EMAIL]);
    },
  });
};

export const useCustomerAttributes = (userId: string, options?: UseQueryOptions<IEntity>) =>
  useQuery([LIST_CUSTOMER_ATTRIBUTES, userId], () => getCustomerAttributes(userId), options);

export const useRewardMemberInfo = (userId: string, options?: UseQueryOptions<IMember, unknown>) =>
  useQuery([GET_REWARD_MEMBER_INFO, userId], () => getRewardMemberInfo(userId), options);

export const useRegenerateReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation((userId: string) => regenerateReferralCode(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_REWARD_MEMBER_INFO]);
    },
  });
};

export const useResetCardActivationLimit = () => {
  const queryClient = useQueryClient();
  return useMutation((userId: string) => resetCustomerCardActivationLimit(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_LOYALTY_CARD_ACTIVATION_LIMIT]);
    },
  });
};

export const useGetReferrals = (
  userId: string,
  pagination?: PaginationParams,
  options?: UseQueryOptions<IPaginationResponse<IReferral>, unknown>,
) =>
  useQuery(
    [GET_USER_REFERRALS, userId, pagination],
    () => getReferrals(userId, pagination),
    options,
  );

export const useGetReferrer = (userId: string, options?: UseQueryOptions<IReferrer, unknown>) =>
  useQuery([GET_USER_REFERRER, userId], () => getReferrer(userId), options);

export const useAddReferrer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, referrerCode}: {userId: string; referrerCode: string}) =>
      addReferrerCode(userId, referrerCode),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_REWARD_MEMBER_INFO]);
        queryClient.invalidateQueries([GET_USER_REFERRER]);
      },
    },
  );
};

export const useUpdateTags = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, tags}: {userId: string; tags: string[]}) => updateTags(userId, tags),
    {
      onSuccess: () => queryClient.invalidateQueries([CUSTOMER_DETAILS]),
    },
  );
};

export const useListMemberGoals = (
  userId: string,
  pagination?: PaginationParams,
  options?: UseQueryOptions<IPaginationResponse<IGoalWithRelations>, unknown>,
) =>
  useQuery(
    [LIST_MEMBER_GOALS, userId, pagination],
    () => listMemberGoals(userId, pagination),
    options,
  );

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation((goal: IGoalWithRelations) => updateGoal(goal), {
    onSuccess: () => {
      queryClient.invalidateQueries([LIST_MEMBER_GOALS]);
    },
  });
};

export const useAddCashbackCampaign = () => {
  return useMutation((userId: string) => addCashbakCampaign(userId), {});
};

export const useGetGoalById = (id: string) => useQuery([FIND_GOAL, id], () => getGoalById(id));

export const useRegrantReward = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation((rewardId: string) => regrantReward(rewardId), {
    onSuccess: () => {
      queryClient.invalidateQueries([FIND_GOAL]).then(() =>
        setNotify({
          variant: 'success',
          title: 'Successfully submitted for regrant/reprocess.',
        }),
      );
    },
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
  });
};
export const useUpdatePhoneNumber = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, phone}: {userId: string; phone: string}) => updatePhoneNumber(userId, phone),
    {
      onSuccess: () => queryClient.invalidateQueries([CUSTOMER_DETAILS]),
    },
  );
};

export const useCreateTags = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, tags}: {userId: string; tags: string[]}) => createTags(userId, tags),
    {
      onSuccess: () => queryClient.invalidateQueries([CUSTOMER_DETAILS]),
    },
  );
};

export const useOptOrder = (orderId: string, options: UseQueryOptions<IOrder> = {}) =>
  useQuery([OPT_ORDER_DETAILS, orderId], () => getOptOrder(orderId), {...options});

export const useGetUnlinkLoyaltyCards = (
  userId: string,
  options?: UseQueryOptions<ILoyaltyCard[], unknown>,
) => useQuery([GET_UNLINK_LOYALTY_CARDS, userId], () => getUnlinkedLoyaltyCards(userId), options);

export const useIndexUserLoyaltyTransactions = (
  userId: string,
  pagination?: IPaginationParam,
  options?: UseQueryOptions<IPaginationMetadata<ILoyaltyTransaction[]>, unknown>,
) =>
  useQuery(
    [INDEX_USER_LOYALTY_TRANSACTIONS, userId, pagination],
    () => indexUserLoyaltyTransactions(userId, pagination),
    options,
  );

export const useIndexLmsLoyaltyTransactions = (
  filter: IndexLmsLoyaltyTransactionsFilter,
  options?: UseQueryOptions<IPaginationResult<ILMSTransaction>, unknown>,
) =>
  useQuery(
    [INDEX_LMS_LOYALTY_TRANSACTIONS, filter],
    () => indexLmsLoyaltyTransactions(filter),
    options,
  );

export const useManualGrantLoyaltyPoints = () => {
  const queryClient = useQueryClient();
  return useMutation((params: LoyaltyManualGrantPointsParams) => manualGrantLoyaltyPoints(params), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_LOYALTY_CARD]);
      queryClient.invalidateQueries([INDEX_USER_LOYALTY_TRANSACTIONS]);
    },
  });
};

export const useUpdateUserLoyaltyCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      userId,
      cardNumber,
      body,
    }: {
      userId: string;
      cardNumber: string;
      body: IUpdateLoyaltyCardInput;
    }) => updateUserLoyaltyCard(userId, cardNumber, body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_LOYALTY_CARD]);
      },
    },
  );
};

export const useDeleteUserLoyaltyCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, cardNumber}: {userId: string; cardNumber: string}) =>
      deleteUserLoyaltyCard(userId, cardNumber),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_LOYALTY_CARD]);
        queryClient.invalidateQueries([INDEX_USER_LOYALTY_TRANSACTIONS]);
        queryClient.invalidateQueries([GET_UNLINK_LOYALTY_CARDS]);
      },
    },
  );
};

export const useAddUserloyaltyCard = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({userId, cardNumber}: {userId: string; cardNumber: string}) =>
      addUserLoyaltyCard(userId, cardNumber),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_LOYALTY_CARD]);
      },
    },
  );
};

export const useGetAccumulations = (
  userId: string,
  options?: UseQueryOptions<{
    daily: IPeriodCustomerAccumulation;
    monthly: IPeriodCustomerAccumulation;
    annually: IPeriodCustomerAccumulation;
  }>,
) => useQuery([GET_CUSTOMER_ACCUMULATION, userId], () => getCustomerAccumulation(userId), options);

export const useUpdateUserLimitation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: UpdateUserLimitation) => updateCustomerLimitation(input), {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_CUSTOMER_ACCUMULATION]);
    },
  });
};

export const useGetUserCreditCard = (userId, cardId) =>
  useQuery([userId, cardId], () => getUserCreditCard(userId, cardId), {
    retry: (retryCount, err: AxiosError) => {
      return err?.response?.status !== 400 && retryCount < 3;
    },
  });

export const useDeleteCreditCard = () => {
  const queryClient = useQueryClient();
  return useMutation(({cardNumber}: {cardNumber: string}) => deleteCreditCard(cardNumber), {
    onSuccess: () => {
      queryClient.invalidateQueries([DELETE_CUSTOMER_CREDIT_CARD]);
    },
  });
};

export const useGetRiskProfileDetails = (userId: string) =>
  useQuery([userId], () => getRiskProfileDetailsByUserId(userId));

export const useGetWalletTransactions = (
  params?: GetWalletTransactionOptions,
  options?: UseQueryOptions<IPaginationResult<IWalletTransaction>, AxiosError>,
) => useQuery([GET_WALLET_TRANSACTIONS, params], () => getWalletTransactions(params), options);

export const useCreateAdjustmentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: CreateAdjustmentTransactionParams) => createAdjustmentTransaction(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_WALLET_TRANSACTIONS]);
        queryClient.invalidateQueries([REFRESH_WALLET_BALANCE]);
      },
    },
  );
};

export const useGetSetelShareHistory = (userId: string, params: IPaginationParam) =>
  useQuery([GET_SETELSHARE_HISTORY, userId, params.page, params.perPage], () =>
    getSetelShareHistoryByUserId(userId, params),
  );
