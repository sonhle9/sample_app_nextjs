import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getCardRanges,
  getCardRangeDetails,
  createCardRange,
  updateCardRange,
} from './card-range.service';
import {ICardRangeInput, ICardRange} from './card-range.type';

const CARDRANGE_LIST = 'cardRanges';
const CARD_RANGE_DETAILS = 'card_range_list';

export const useGetCardRanges = (filter: Parameters<typeof getCardRanges>[0]) => {
  useQuery([CARDRANGE_LIST, filter], () => getCardRanges(filter), {keepPreviousData: true});
};

export const useGetCardRangeDetails = (id: string) => {
  return useQuery([CARDRANGE_LIST, id], () => getCardRangeDetails(id));
};

export const useSetCardRanges = (currentCardRange: ICardRange) => {
  const queryClient = useQueryClient();
  return useMutation(
    (cardRange: ICardRangeInput) =>
      currentCardRange ? updateCardRange(cardRange, cardRange.id) : createCardRange(cardRange),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CARDRANGE_LIST]);
        if (currentCardRange) {
          queryClient.invalidateQueries([CARD_RANGE_DETAILS, currentCardRange.id]);
        }
      },
    },
  );
};
