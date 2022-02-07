import {useMutation, useQuery, useQueryClient} from 'react-query';
import {EStatus} from 'src/app/cards/shared/enums';
import {EFeature_Type} from '../approval-rules/approval-rules.type';
import {
  getCardDetails,
  getCards,
  getMerchants,
  getCardRanges,
  updateAdjustment,
  updateTransfer,
  getCardGroups,
  createBulkCard,
  getCardGroupsFilterBy,
  getCompaniesFilterBy,
  updateCard,
  deleteRequest,
  downloadCard,
  // sendEmail,
  getTransferRequest,
  getAdjustmentRequest,
  getCardRestriction,
  updateCardRestriction,
  updateStatusCards,
  sendMailHolistic,
  getBatchTransfer,
  getVehicles,
} from './card.service';
import {
  AdjustmentDetails,
  IEmailCardInput,
  IndexCard,
  TransferDetails,
  IRestrictionInput,
  IRestriction,
  VehiclesFilterType,
} from './card.type';
const CARDS = 'cards';
const CARD_RANGES = 'card_ranges';
const CARD_GROUPS = 'card_groups';
const VEHICLE = 'vehicle';
const MERCHANTS = 'merchants';
const MERCHANTS_FILTER_BY = 'merchants_filter_by';
const COMPANIES = 'companies';
const CARD_DETAILS = 'card_details';
const TRANSFER_REQUEST = 'transfer_request';
const ADJUSTMENT_REQUEST = 'adjustment_request';
const CARD_RESTRICTION = 'card_restriction';
export const BATCH_TRANSFER_DETAILS = 'batch_transfer_details';

export const useGetCardRestriction = (type: string, cardID: string) => {
  return useQuery([CARD_RESTRICTION, type, cardID], () => getCardRestriction(type, cardID));
};

export const useUpdateCardRestriction = (queryParam: IRestrictionInput) => {
  const queryClient = useQueryClient();
  return useMutation(
    (restriction: IRestriction) => {
      return updateCardRestriction(restriction);
    },
    {
      onSuccess: () => {
        if (queryParam) {
          queryClient.invalidateQueries([CARD_RESTRICTION]);
        }
      },
    },
  );
};

export const useCardDetails = (cardId: string) =>
  useQuery([CARD_DETAILS, cardId], () => getCardDetails(cardId), {enabled: Boolean(cardId)});

export const useUpdateTransfer = (currentCardId?: string) => {
  const queryClient = useQueryClient();
  return useMutation((cardTransfer: TransferDetails) => updateTransfer({...cardTransfer}), {
    onSuccess: () => {
      if (currentCardId) {
        queryClient.invalidateQueries([TRANSFER_REQUEST]);
      }
    },
  });
};

export const useUpdateAdjustment = (currentCardId: string) => {
  const queryClient = useQueryClient();
  return useMutation((cardAdjustment: AdjustmentDetails) => updateAdjustment({...cardAdjustment}), {
    onSuccess: () => {
      if (currentCardId) {
        queryClient.invalidateQueries([ADJUSTMENT_REQUEST]);
      }
    },
  });
};

export const useDeleteRequest = (currentRequest: AdjustmentDetails | TransferDetails) => {
  const queryClient = useQueryClient();
  return useMutation((requestId: string) => deleteRequest(requestId || currentRequest.id), {
    onSuccess: () => {
      if (currentRequest.id && currentRequest.feature === EFeature_Type.TRANSFER_CREATE) {
        queryClient.invalidateQueries([TRANSFER_REQUEST]);
      }
      if (currentRequest.id && currentRequest.feature === EFeature_Type.ADJUST_CREATE) {
        queryClient.invalidateQueries([ADJUSTMENT_REQUEST]);
      }
    },
  });
};

export const useSetCards = (currentCard: IndexCard) => {
  const queryClient = useQueryClient();
  return useMutation(
    (card: IndexCard) => (currentCard ? updateCard(card, card.id) : createBulkCard(card)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CARDS]);
        if (currentCard) {
          queryClient.invalidateQueries([CARD_DETAILS, currentCard.id]);
        }
      },
    },
  );
};

export const useUpdateStatusCards = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (card: {filterValues: Parameters<typeof updateStatusCards>[0]; status: EStatus}) =>
      updateStatusCards(card.filterValues, card.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CARDS]);
      },
    },
  );
};

export const useGetCards = (filter: Parameters<typeof getCards>[0]) =>
  useQuery([CARDS, filter], () => getCards(filter), {keepPreviousData: true});

export const useGetCardsReference = (filter: Parameters<typeof getCards>[0]) =>
  useQuery([CARDS, filter], () => getCards(filter), {
    enabled: Boolean(filter.referenceRequestId),
  });

export const useGetMerchants = (filter: Parameters<typeof getMerchants>[0]) => {
  return useQuery(
    [MERCHANTS, filter],
    () => {
      const res = getMerchants(filter).then((value) => {
        return value.items.map((merchant) => {
          return {
            value: merchant.merchantId as string,
            label: `${merchant.name} - ${merchant.merchantId}` as string,
          };
        });
      });
      return res;
    },
    {keepPreviousData: true},
  );
};

export const useGetMerchantsFilterBy = (filter: Parameters<typeof getMerchants>[0]) => {
  return useQuery([MERCHANTS_FILTER_BY, filter], () => getMerchants(filter), {
    keepPreviousData: true,
  });
};

export const useGetCompaniesFilterBy = (filter: Parameters<typeof getCompaniesFilterBy>[0]) => {
  return useQuery(
    [COMPANIES, filter],
    () => {
      const res = getCompaniesFilterBy(filter).then((value) => {
        return value.items.map((company) => {
          return {
            value: company._id as string,
            label: company.name as string,
          };
        });
      });
      return res;
    },
    {keepPreviousData: true},
  );
};

export const useGetCardGroupsFilterBy = (filter: Parameters<typeof getCardGroupsFilterBy>[0]) => {
  return useQuery(
    [CARD_GROUPS, filter],
    () => {
      const res = getCardGroupsFilterBy(filter).then((value) => {
        return value.items.map((cardGroup) => {
          return {
            value: cardGroup.id as string,
            label: cardGroup.name as string,
          };
        });
      });
      return res;
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useGetCardRanges = (filter: Parameters<typeof getCardRanges>[0]) => {
  return useQuery(
    [CARD_RANGES, filter],
    () => {
      const res = getCardRanges(filter).then((value) => {
        return value.items.filter((cardRange) => {
          if (!cardRange.currentNumber) {
            return cardRange;
          } else if (Number(cardRange.endNumber) - Number(cardRange.currentNumber) > 0) {
            return cardRange;
          }
        });
      });
      return res;
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useGetTransferRequest = (filter: Parameters<typeof getTransferRequest>[0]) => {
  return useQuery([TRANSFER_REQUEST, filter], () => getTransferRequest(filter), {
    keepPreviousData: true,
  });
};

export const useGetAdjustmentRequest = (filter: Parameters<typeof getAdjustmentRequest>[0]) => {
  return useQuery([ADJUSTMENT_REQUEST, filter], () => getAdjustmentRequest(filter), {
    keepPreviousData: true,
  });
};

export const useGetCardGroups = (filter: Parameters<typeof getCardGroups>[0]) =>
  useQuery([CARD_GROUPS, filter], () => getCardGroups(filter), {
    keepPreviousData: true,
  });

export const useDownloadCards = () => {
  return useMutation((filter: Parameters<typeof downloadCard>[0]) => downloadCard(filter));
};

export const useSendEmails = () => useMutation((data: IEmailCardInput) => sendMailHolistic(data));

export const useBatchTransferDetails = (batchId: string) =>
  useQuery([BATCH_TRANSFER_DETAILS, batchId], () => getBatchTransfer(batchId), {
    enabled: Boolean(batchId),
  });

export const useGetVehiclePlateNumberQuery = (filter: VehiclesFilterType) => {
  return useQuery({
    queryKey: [VEHICLE, filter],
    queryFn: () => {
      const res = getVehicles(filter).then((value: any) => {
        return value.items.map((vehicle: any) => {
          return {
            value: vehicle.vehicleNumber as string,
            label: vehicle.vehicleNumber as string,
          };
        });
      });
      return res;
    },
    keepPreviousData: true,
  });
};

export const useGetMerchantsManual = (filter: Parameters<typeof getMerchants>[0]) => {
  return useQuery(
    [MERCHANTS, filter],
    () => {
      const res = getMerchants(filter).then((value) => {
        return value.items.map((merchant) => {
          return {
            value: merchant.merchantId as string,
            label: `${merchant.merchantId} - ${merchant.name}` as string,
          };
        });
      });
      return res;
    },
    {keepPreviousData: true},
  );
};
