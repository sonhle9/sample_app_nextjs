import {useState} from 'react';
import {useInfiniteQuery, useMutation, useQueryClient} from 'react-query';
import {useRouter} from 'src/react/routing/routing.context';
import {useReorder} from '../../../hooks/use-reorder';
import {CreatedDeal} from '../../deal/deals.type';
import {createDealCatalogue, listCatalogues, updateCatalogueScores} from '../dealCatalogue.service';

export const LIST_CATALOGUES_KEY = 'listCatalogues';

export const useCataloguesWithDealsNumber = () => {
  const router = useRouter();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const queryClient = useQueryClient();
  // const [tokens, setTokens] = useState<string[]>([]);
  // const list = usePaginationByToken({
  //   key: 'listCatalogues',
  //   params: {allStatuses: true, withActiveDealsCount: true, perPage: 3},
  //   queryFn: listCatalogues,
  //   tokens,
  //   onTokensChange: setTokens,
  // });

  const catalogues = useInfiniteQuery(
    LIST_CATALOGUES_KEY,
    ({pageParam = '1'}) =>
      listCatalogues({
        pageToken: pageParam,
        allStatuses: true,
        withActiveDealsCount: true,
      }),
    {
      getNextPageParam: (last) => last.nextPageToken,
    },
  );

  const sortable = useReorder({
    queryKey: LIST_CATALOGUES_KEY,
    sortProperty: 'score',
    idProperty: '_id',
    onSave: (updates) =>
      updateCatalogueScores({
        changes: Object.keys(updates).map((catalogueId) => ({
          catalogueId,
          score: updates[catalogueId],
        })),
      }),
  });

  const {mutateAsync: createCatalogue} = useMutation(createDealCatalogue, {
    onSuccess: ({_id}: CreatedDeal) => {
      queryClient.invalidateQueries(LIST_CATALOGUES_KEY);
      router.navigateByUrl(`/deals/deal-catalogues/${_id}`);
    },
  });

  return {
    catalogues,
    isCreateVisible,
    setIsCreateVisible,
    createCatalogue,
    sortable,
  };
};
