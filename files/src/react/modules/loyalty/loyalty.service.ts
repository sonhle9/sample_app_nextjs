import {environment} from 'src/environments/environment';
import {extractError, getData, ajax} from 'src/react/lib/ajax';
import {
  Transactions,
  TransactionsParams,
  Card,
  CardParams,
  DailyTransactionParams,
  TransactionSummary,
  SearchParams,
  SearchResponse,
  UploadResponse,
  LoyaltyAccount,
  LoyaltyCardBalance,
  LoyaltyProgrammesParams,
  LoyaltyProgrammesOptOutParams,
  LoyaltyProgramme,
  LoyaltyManualGrantPointsParams,
  CardUnlinkParams,
  CardLinkParams,
  CardActivationParams,
} from './loyalty.type';
import {
  PointsAdjustmentParams,
  AdjustmentApprovalStatus,
  PointsTransferParams,
  PointsTransferResponse,
} from './points.type';
import {LoyaltyMembersParams, Member} from './loyalty-members.type';
import {PaginationMetadata} from 'src/shared/interfaces/pagination.interface';
import {deleteEmptyKeys} from 'src/shared/helpers/parseJSON';
import {ICustomerCardActivationResponse} from 'src/shared/interfaces/customer.interface';
import {ILoyaltyCard} from 'src/shared/interfaces/loyaltyCard.interface';
import {IGrantPetronasPointsResponse} from 'src/shared/interfaces/loyalty.interface';

const loyaltyBaseUrl = `${environment.loyaltyApiBaseUrl}/api/loyalty`;
const workflowApprovalBaseUrl = `${environment.workflowsApiBaseUrl}/api/workflows/admin/approval-requests`;

export const getLoyaltyMembers = (params?: LoyaltyMembersParams, nextPageToken?: string) =>
  getData<PaginationMetadata<Member[]>>(`${loyaltyBaseUrl}/admin/loyalty-members`, {
    params: {...params, nextPageToken},
  });

export const getLoyaltyMemberById = (id: string) =>
  getData<Member>(`${loyaltyBaseUrl}/admin/loyalty-members/${id}`);

export const updateLoyaltyMember = (data: Member) =>
  ajax({url: `${loyaltyBaseUrl}/admin/loyalty-members`, method: 'PUT', data})
    .then(() => Promise.resolve(true))
    .catch((e) =>
      Promise.reject({
        name: e.response.data.errorCode,
        message: extractError(e),
      }),
    );

export const getTransactions = (params?: TransactionsParams) => {
  deleteEmptyKeys(params);

  return getData<PaginationMetadata<Transactions[]>>(`${loyaltyBaseUrl}/transactions`, {params});
};

export const getCards = (params?: CardParams) => {
  deleteEmptyKeys(params);

  return getData<PaginationMetadata<Card[]>>(`${loyaltyBaseUrl}/admin/cards`, {params});
};

export const searchCards = (params?: SearchParams) =>
  getData<SearchResponse>(`${loyaltyBaseUrl}/admin/searchLoyaltyCards`, {params});

export const getTransactionById = (id: string) =>
  getData<Transactions>(`${loyaltyBaseUrl}/transactions/details/${id}`);

export const getCardsByUserId = (userId: string) =>
  ajax<Card>({
    url: `${loyaltyBaseUrl}/system/cards/${userId}`,
    method: 'GET',
  });

export const getDailyTransactions = (params?: DailyTransactionParams) => {
  deleteEmptyKeys(params);

  return getData<TransactionSummary[]>(`${loyaltyBaseUrl}/system/dailyTransaction`, {params});
};

export const getMonthlyTransactions = (params?: DailyTransactionParams) => {
  deleteEmptyKeys(params);

  return getData<TransactionSummary[]>(`${loyaltyBaseUrl}/system/monthlyTransactions`, {params});
};

export const getLoyaltyAccount = (cardNumber: string) =>
  getData<LoyaltyAccount>(`${loyaltyBaseUrl}/admin/loyaltyAccount/${cardNumber}`);

export const uploadFile = (data: File, filename?: string) => {
  const bodyFormData = new FormData();

  bodyFormData.append('file', data);

  return ajax<UploadResponse>({
    url: `${loyaltyBaseUrl}/admin/upload/${filename}`,
    method: 'POST',
    data: bodyFormData,
  });
};

export const getSignedUrl = (fileName: string) => {
  return getData<string>(`${loyaltyBaseUrl}/admin/getSignedUrl`, {params: {fileName}});
};

export const pointAdjustment = async (
  data: Omit<PointsAdjustmentParams, 'attachment'> & {
    file: File;
    fileName?: string;
  },
) => {
  const uploadRes =
    data.file && (await uploadFile(data.file, `${data.cardNumber}-${data.adjustmentType}`));

  return ajax({
    url: `${loyaltyBaseUrl}/admin/points/adjustment`,
    method: 'POST',
    data: {
      referenceId: `${data.adjustmentType}_${data.cardNumber}_${Date.now()}`,
      attachment: uploadRes?.url,
      ...data,
    },
  }).catch((e) =>
    Promise.reject({
      name: e.response.data.errorCode,
      message: e.response?.data?.response?.body?.message || JSON.stringify(e.response?.data),
    }),
  );
};

export const updateWorkflowApproval = (status: AdjustmentApprovalStatus, workflowId?: string) => {
  switch (status) {
    case AdjustmentApprovalStatus.APPROVED:
      return ajax({
        url: `${workflowApprovalBaseUrl}/${workflowId}/approve`,
        method: 'PUT',
      }).catch((e) =>
        Promise.reject({
          name: e.response.data.errorCode,
          message:
            e.response.status === 403 ? 'Forbidden: Update workflow approval' : extractError(e),
        }),
      );

    case AdjustmentApprovalStatus.REJECTED:
      return ajax({url: `${workflowApprovalBaseUrl}/${workflowId}/reject`, method: 'PUT'}).catch(
        (e) =>
          Promise.reject({
            name: e.response.data.errorCode,
            message:
              e.response.status === 403 ? 'Forbidden: Update workflow approval' : extractError(e),
          }),
      );

    default:
      throw new Error('Invalid approval status request');
  }
};

export const transferPoints = (data: PointsTransferParams) =>
  ajax<PointsTransferResponse>({
    url: `${loyaltyBaseUrl}/admin/points/transfer`,
    method: 'POST',
    data: {
      referenceId: `${data.sourceCardNumber}_${data.destinationCardNumber}_${Date.now()}`,
      ...data,
    },
  }).catch((e) =>
    Promise.reject({
      name: e.response.data.errorCode,
      message: e.response?.data?.response?.body?.message || JSON.stringify(e.response?.data),
    }),
  );

export const getLoyaltyMemberByUserId = (userId: string) =>
  ajax.get<Member>(`${loyaltyBaseUrl}/admin/loyalty-members/by-user/${userId}`);

export const getCardBalanceByCardNumber = (cardNumber: string) =>
  ajax
    .get<LoyaltyCardBalance>(`${loyaltyBaseUrl}/admin/cards/${cardNumber}`)
    .catch((e) => extractError(e));

export const getCurrentCardActivationLimit = (userId: string) =>
  ajax.get<{retryCount: number}>(
    `${loyaltyBaseUrl}/admin/searchLoyaltyCards/cardActivationLimit?userId=${userId}`,
  );

export const getMemberProgramme = (params: LoyaltyProgrammesParams) =>
  getData<LoyaltyProgramme>(
    `${loyaltyBaseUrl}/admin/members/${params.memberId}/programmes/${params.code}`,
  );

export const optOutMemberProgramme = (params: LoyaltyProgrammesOptOutParams) =>
  ajax({
    url: `${loyaltyBaseUrl}/admin/members/${params.memberId}/programmes/${params.code}/opt-out`,
    method: 'POST',
    data: {
      reason: params.reason,
    },
  }).catch((e) => {
    return Promise.reject({
      name: e.response.data.errorCode,
      message: extractError(e),
    });
  });

export const resetCustomerCardActivationLimit = (userId: string) =>
  ajax.put<ICustomerCardActivationResponse>(
    `${loyaltyBaseUrl}/admin/searchLoyaltyCards/resetCardActivationLimit?userId=${userId}`,
  );

export const getUnlinkedLoyaltyCards = (userId: string) =>
  ajax.get<ILoyaltyCard[]>(`${loyaltyBaseUrl}/system/cards/unlink/${userId}`);

export const manualGrantLoyaltyPoints = (params: LoyaltyManualGrantPointsParams) =>
  ajax.post<IGrantPetronasPointsResponse>(
    `${loyaltyBaseUrl}/system/manuallyGrantPetronasPoints`,
    params,
  );

export const deleteCard = (data: CardUnlinkParams) =>
  ajax({
    url: `${loyaltyBaseUrl}/admin/cards`,
    method: 'DELETE',
    data,
  });

export const issueCardByUserId = (userId: string) =>
  ajax.post<any>(`${loyaltyBaseUrl}/system/cards/issue/${userId}`);

export const linkPhysicalCard = (data: CardLinkParams) =>
  ajax<Partial<Card>>({url: `${loyaltyBaseUrl}/admin/cards`, method: 'POST', data});

export const activateCard = (params: CardActivationParams) =>
  ajax.put<ILoyaltyCard>(`${loyaltyBaseUrl}/admin/activateCard`, params);
