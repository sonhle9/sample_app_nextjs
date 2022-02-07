import {useMutation, useQuery, useQueryClient} from 'react-query';
import {getCardGroupsFilterBy, getMerchants} from '../cards/card.service';
import {
  getCardGroups,
  getCardGroupDetails,
  updateCardGroup,
  createCardGroup,
} from './card-group.service';
import {ICardGroup, ICardGroupInput} from './card-group.type';

const MERCHANTS_LIST = 'merchants_list';
const CARDGROUP_LIST = 'cardGroups';
const CARD_GROUP_DETAILS = 'card_group_list';
const CARD_GROUPS_FILTER = 'card_group_filter';

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

export const useGetCardGroups = (filter: Parameters<typeof getCardGroups>[0]) =>
  useQuery([CARDGROUP_LIST, filter], () => getCardGroups(filter), {keepPreviousData: true});

export const useGetCardGroupDetails = (id: string) => {
  return useQuery([CARD_GROUP_DETAILS, id], () => getCardGroupDetails(id));
};

export const useSetCardGroups = (currentCardGroup: ICardGroup) => {
  const queryClient = useQueryClient();
  return useMutation(
    (cardGroup: ICardGroupInput) =>
      currentCardGroup ? updateCardGroup(cardGroup, cardGroup.id) : createCardGroup(cardGroup),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CARDGROUP_LIST]);
        if (currentCardGroup) {
          queryClient.invalidateQueries([CARD_GROUP_DETAILS, currentCardGroup.id]);
        }
      },
    },
  );
};

export const useGetCardGroupsFilterBy = (filter: Parameters<typeof getCardGroupsFilterBy>[0]) => {
  return useQuery(
    [CARD_GROUPS_FILTER, filter],
    () => {
      const res = getCardGroupsFilterBy(filter).then((value) => {
        return value.items.map((cardGroup: ICardGroup) => {
          return {
            value: cardGroup.name as string,
            label: cardGroup?.description
              ? `${cardGroup.name} - ${cardGroup.description}`
              : (cardGroup.name as string),
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
