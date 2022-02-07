import {useMutation, useQuery} from 'react-query';
import {getCardholders, getCardholderDetails, updateCardholder} from './cardholder.service';
import {getCardholderFilterBy, getMerchants} from '../cards/card.service';
import {ICardholder} from './cardholder.type';
import {useQueryClient} from 'react-query';

const CARDHOLDER_LIST = 'cardholders';
const MERCHANTS_LIST = 'merchants_list';
const CARDHOLDER_FILTER = 'card_holder_filter';
const CARDHOLDER_DETAILS = 'card_holder_details';

export const useGetMerchantsFilterBy = (filter: Parameters<typeof getMerchants>[0]) => {
  return useQuery(
    [MERCHANTS_LIST, filter],
    () => {
      const res = getMerchants(filter)
        .then((value) => {
          return value.items.map((merchant) => {
            return {
              value: merchant.merchantId as string,
              label: `${merchant.name} - ${merchant.merchantId}` as string,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
      return res;
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useGetCardholderFilterBy = (filter: Parameters<typeof getCardholderFilterBy>[0]) => {
  return useQuery(
    [CARDHOLDER_FILTER, filter],
    () => {
      const res = getCardholderFilterBy(filter).then((value) => {
        return value.items.map((cardholder) => {
          return {
            value: cardholder.name as string,
            label: cardholder.name as string,
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

export const useGetCardholderFilterByIdNumber = (
  filter: Parameters<typeof getCardholderFilterBy>[0],
) => {
  return useQuery(
    [CARDHOLDER_FILTER, filter],
    () => {
      const res = getCardholderFilterBy(filter).then((value) => {
        return value.items.map((cardholder) => {
          return {
            value: cardholder.idNumber as string,
            label: cardholder.idNumber as string,
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

export const useGetCardholderFilterByContactNumber = (
  filter: Parameters<typeof getCardholderFilterBy>[0],
) => {
  return useQuery(
    [CARDHOLDER_FILTER, filter],
    () => {
      const res = getCardholderFilterBy(filter).then((value) => {
        return value.items.map((cardholder) => {
          return {
            value: cardholder.phoneNumber as string,
            label: cardholder.phoneNumber as string,
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

export const useGetCardholder = (filter: Parameters<typeof getCardholders>[0]) =>
  useQuery([CARDHOLDER_LIST, filter], () => getCardholders(filter), {keepPreviousData: true});

export const useGetCardholderDetails = (id: string) => {
  return useQuery([CARDHOLDER_DETAILS, id], () => getCardholderDetails(id));
};

export const useCardholderUpdate = (cardholderUpdate: ICardholder) => {
  const queryClient = useQueryClient();
  return useMutation(
    (cardholderOld: ICardholder) => updateCardholder(cardholderOld.id, cardholderOld),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CARDHOLDER_LIST]);
        if (cardholderUpdate) {
          queryClient.invalidateQueries([CARDHOLDER_DETAILS, cardholderUpdate.id]);
        }
      },
    },
  );
};

export const useGetCardGroupDetails = (id: string) => {
  return useQuery([CARDHOLDER_DETAILS, id], () => getCardholderDetails(id));
};
