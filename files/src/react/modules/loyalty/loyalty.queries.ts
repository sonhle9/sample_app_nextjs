import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseMutationOptions,
} from 'react-query';
import {
  getTransactions,
  getCards,
  getDailyTransactions,
  getMonthlyTransactions,
  searchCards,
  getTransactionById,
  getLoyaltyAccount,
  pointAdjustment,
  updateWorkflowApproval,
  transferPoints,
  getLoyaltyMembers,
  getLoyaltyMemberById,
  updateLoyaltyMember,
  getLoyaltyMemberByUserId,
  getCardBalanceByCardNumber,
  getMemberProgramme,
  optOutMemberProgramme,
  getSignedUrl,
  deleteCard,
  issueCardByUserId,
  linkPhysicalCard,
  activateCard,
  getCardsByUserId,
} from './loyalty.service';
import {
  TransactionsParams,
  CardParams,
  DailyTransactionParams,
  SearchParams,
  TransactionTypes,
  LoyaltyCardBalance,
  LoyaltyProgrammesParams,
  LoyaltyProgrammesOptOutParams,
  CardUnlinkParams,
  Transactions,
  CardLinkParams,
  CardActivationParams,
} from './loyalty.type';
import {
  PointsAdjustmentParams,
  PointsAdjusmentApprovalParams,
  PointsTransferParams,
} from './points.type';
import {Member, LoyaltyMembersParams} from './loyalty-members.type';
import {getS3FileKeyFromURL} from 'src/shared/helpers/get-s3-filekey';
import {PaginationMetadata} from 'src/shared/interfaces/pagination.interface';
import {retryGrantPetronasPoints} from 'src/react/services/api-ops.service';
import {AxiosError} from 'axios';

export const useIndexTransactions = (
  params?: TransactionsParams,
  options: UseQueryOptions<PaginationMetadata<Transactions[]>> = {},
) => useQuery(['getTransactions', params], () => getTransactions(params), {...options});

export const useIndexTransactionsByType = (
  type?: TransactionTypes,
  params?: Omit<TransactionsParams, 'types'>,
) => {
  const transactionType =
    type === TransactionTypes.EARN
      ? [
          TransactionTypes.EARN,
          TransactionTypes.EXTERNAL_EARN,
          TransactionTypes.EARN_REVERSAL,
          TransactionTypes.EARN_VOID,
        ]
      : type === TransactionTypes.EXTERNAL_EARN
      ? [TransactionTypes.EARN, TransactionTypes.EXTERNAL_EARN]
      : type === TransactionTypes.REDEEM
      ? [
          TransactionTypes.REDEEM,
          TransactionTypes.EXTERNAL_REDEEM,
          TransactionTypes.REDEEM_CAPTURE,
          TransactionTypes.REDEEM_AUTH,
          TransactionTypes.REDEEM_REVERSAL,
          TransactionTypes.REDEEM_VOID,
        ]
      : type === TransactionTypes.EXTERNAL_REDEEM
      ? [TransactionTypes.REDEEM, TransactionTypes.EXTERNAL_REDEEM]
      : type;

  return useQuery(['getTransactions', params, transactionType], () =>
    getTransactions({...params, types: transactionType}),
  );
};

export const useGetTransactionById = (id: string) =>
  useQuery(['getTransactionById', id], () => getTransactionById(id));

export const useGetTransactionsByUserId = (
  id?: string,
  params?: Omit<TransactionsParams, 'userId'>,
) =>
  useQuery(
    ['getTransactionsByUserId', id, params],
    () => getTransactions({userId: id, ...params}),
    {enabled: !!id},
  );

export const useGetTransactionsByCardNumber = (
  cardNumber?: string,
  params?: Omit<TransactionsParams, 'cardNumber'>,
) =>
  useQuery(
    ['getTransactionsByCardNumber', cardNumber, params],
    () => getTransactions({cardNumber, ...params}),
    {enabled: !!cardNumber},
  );

export const useGetCards = (
  params?: CardParams,
  options?: Pick<UseQueryOptions, 'enabled' | 'retry'>,
) => useQuery(['getCards', params], () => getCards(params), options);

export const useGetLoyaltyAccount = (
  cardNumber: string,
  options?: Pick<UseQueryOptions, 'enabled' | 'retry'>,
) => useQuery(['getLoyaltyAccount', cardNumber], () => getLoyaltyAccount(cardNumber), options);

export const useSearchCards = (
  params?: SearchParams,
  options?: Pick<UseQueryOptions, 'enabled' | 'retry'>,
) => useQuery(['searchCards', params], () => searchCards(params), options);

export const useGetDailyTransactions = (params?: DailyTransactionParams) =>
  useQuery(['getDailyTransactions', params], () => getDailyTransactions(params));

export const useGetMonthlyTransactions = (params?: DailyTransactionParams) =>
  useQuery(['getMonthlyTransactions', params], () => getMonthlyTransactions(params));

export const useAdjustPoints = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (
      data: Omit<PointsAdjustmentParams, 'attachment'> & {
        file: File;
        fileName?: string;
      },
    ) => pointAdjustment(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getTransactions');
        queryClient.invalidateQueries('getTransactionsByUserId');
        queryClient.invalidateQueries('getTransactionsByCardNumber');
      },
    },
  );
};

export const useAdjustmentApproval = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: PointsAdjusmentApprovalParams) =>
      updateWorkflowApproval(data.adjustmentStatus, data.workflowId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getTransactions');
        queryClient.invalidateQueries('getTransactionsByUserId');
        queryClient.invalidateQueries('getTransactionsByCardNumber');
        queryClient.invalidateQueries('getPointTransactions');
      },
    },
  );
};

export const useTransferPoints = () => {
  const queryClient = useQueryClient();
  return useMutation((data: PointsTransferParams) => transferPoints(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getTransactions');
      queryClient.invalidateQueries('getTransactionsByUserId');
      queryClient.invalidateQueries('getTransactionsByCardNumber');
      queryClient.invalidateQueries('getPointsBalanceExpiry');
    },
  });
};

export const useGetLoyaltyMembers = <Result = PaginationMetadata<Member[]>>(
  params?: LoyaltyMembersParams,
  options: UseInfiniteQueryOptions<PaginationMetadata<Member[]>, unknown, Result> = {},
) =>
  useInfiniteQuery(
    ['getLoyaltyMembers', params],
    ({pageParam}) => getLoyaltyMembers(params, pageParam),
    {
      getNextPageParam: (last) => last.metadata.nextPageToken,
      ...options,
    },
  );

export const useGetLoyaltyMembersByCardNumber = <Result = PaginationMetadata<Member[]>>(
  cardNumber: string,
  options?: UseQueryOptions<PaginationMetadata<Member[]>, unknown, Result>,
) =>
  useQuery(
    ['getLoyaltyMemberByCardNumber', cardNumber],
    () => getLoyaltyMembers({cardNumber}),
    options,
  );

export const useGetLoyaltyMemberById = (
  id: string,
  options: Pick<UseQueryOptions, 'enabled'> = {enabled: true},
) =>
  useQuery(['getLoyaltyMemberById', id], () => getLoyaltyMemberById(id), {
    enabled: !!id && options.enabled,
  });

export const useUpdateLoyaltyMember = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Member) => updateLoyaltyMember(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
    },
  });
};

export const useGetLoyaltyMemberByUserId = (
  userId: string,
  options?: UseQueryOptions<Member, unknown>,
) =>
  useQuery(['getLoyaltyMemberByUserId', userId], () => getLoyaltyMemberByUserId(userId), options);

export const useGetCardBalanceByCardNumber = (
  cardNumber: string,
  options: UseQueryOptions<LoyaltyCardBalance> = {},
) =>
  useQuery(
    ['getCardBalanceByCardNumber', cardNumber],
    () => getCardBalanceByCardNumber(cardNumber),
    options,
  );

export const useGetMemberProgrammesByCode = (params: LoyaltyProgrammesParams) =>
  useQuery(['getMemberProgramme', params], () => getMemberProgramme(params), {
    enabled: !!params.memberId && !!params.code,
  });

export const useOptOutProgrammes = () => {
  const queryClient = useQueryClient();
  return useMutation((params: LoyaltyProgrammesOptOutParams) => optOutMemberProgramme(params), {
    onSuccess: () => {
      queryClient.invalidateQueries('getTransactions');
      queryClient.invalidateQueries('getTransactionsByUserId');
    },
  });
};

export const useGetSignedUrl = (url?: string, enabled: boolean = true) => {
  const fileName = getS3FileKeyFromURL(url);
  return useQuery(['getSignedUrl', url], () => getSignedUrl(fileName), {
    enabled: !!fileName && enabled,
  });
};

export const useUnlinkCard = () => {
  const queryClient = useQueryClient();
  return useMutation((data: CardUnlinkParams) => deleteCard(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
      queryClient.invalidateQueries('getLoyaltyMemberByUserId');
      queryClient.invalidateQueries('getCardBalanceByCardNumber');
    },
  });
};

export const useIssueCardByUserId = () => {
  const queryClient = useQueryClient();
  return useMutation((userId: string) => issueCardByUserId(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
    },
  });
};

export const useRetryGrantPetronasPoints = (
  orderId: string,
  options?: UseMutationOptions<any, AxiosError<{message: string}>, number, unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation((amount: number) => retryGrantPetronasPoints(orderId, amount), {
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries('getTransactions');
      options?.onSuccess?.(...args);
    },
  });
};

export const useLinkToPhysicalCard = () => {
  const queryClient = useQueryClient();
  return useMutation((data: CardLinkParams) => linkPhysicalCard(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
    },
  });
};

export const useActivateCard = () => {
  const queryClient = useQueryClient();
  return useMutation((data: CardActivationParams) => activateCard(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
    },
  });
};

export const useGetCardsByUserId = (userId?: string) => {
  return useQuery(['getCardsByUserId', userId], () => getCardsByUserId(userId), {
    retry: (retryCount, err) => {
      const error = err as AxiosError;
      return retryCount < 3 && error?.response?.status !== 404;
    },
  });
};
