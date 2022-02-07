import {useQuery, UseQueryOptions, useMutation, useQueryClient} from 'react-query';
import {getCardGroups} from 'src/react/modules/card-groups/card-group.service';
import {ICardGroupsRequest} from 'src/react/modules/card-groups/card-group.type';
import {updateCardGroup} from 'src/react/modules/cards/card.service';

export const useGetLoyaltyCardGroup = (
  params?: Omit<ICardGroupsRequest, 'cardType' | 'level'>,
  options: Pick<UseQueryOptions, 'enabled'> = {enabled: true},
) =>
  useQuery(
    ['getLoyaltyCardGroup', params],
    () => getCardGroups({...params, cardType: 'loyalty', level: 'enterprise'}),
    options,
  );

export const useUpdateCards = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation((input: {status: string; cardGroup: string}) => updateCardGroup(input, id), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyMemberById');
      queryClient.invalidateQueries('getLoyaltyMemberByUserId');
      queryClient.invalidateQueries('getCardBalanceByCardNumber');
    },
  });
};
