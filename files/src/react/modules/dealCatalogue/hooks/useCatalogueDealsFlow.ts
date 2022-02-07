import {useDebounce} from '@setel/portal-ui';
import {useCallback, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {DealStatus} from '../../deal/deal.const';
import {listDeals} from '../../deal/deals.service';
import {updateCatalogueDealRelations} from '../dealCatalogue.service';
import {CatalogueDeal, DealCatalogueAction} from '../dealCatalogue.type';

export const FIND_DEAL_CATALOGUE_DEALS_KEY = 'dealCatalogueDeals';

export const useCatalogueDealsFlow = ({
  catalogueId,
  onSuccessSave,
}: {
  catalogueId: string;
  onSuccessSave?: () => void;
}) => {
  const [deals, setDeals] = useState<CatalogueDeal[]>([]);

  const addDeal = useCallback((newDeal) => {
    setDeals((currentDeals) => [newDeal, ...currentDeals]);
  }, []);

  const deleteDeal = useCallback((_id: string) => {
    setDeals((currentDeals) => {
      const index = currentDeals.findIndex((deal) => deal._id === _id);
      return [...currentDeals.slice(0, index), ...currentDeals.slice(index + 1)];
    });
  }, []);

  const queryClient = useQueryClient();

  const {mutate: saveChanges, isLoading: isSaving} = useMutation(
    () =>
      updateCatalogueDealRelations({
        catalogueId,
        changes: deals.map(({_id}) => ({dealId: _id, type: DealCatalogueAction.LINK})),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(FIND_DEAL_CATALOGUE_DEALS_KEY);
        queryClient.invalidateQueries(['findDeals']);
        onSuccessSave();
      },
    },
  );

  const [searchDealRawInput, setSearchDealInput] = useState<string>(null);
  const [searchFilter, setSearchFilter] = useState('name');
  const searchDealDebouncedInput = useDebounce(searchDealRawInput);
  const searchDealResponse = useQuery(
    ['findDeals', searchDealDebouncedInput],
    () =>
      listDeals({[searchFilter]: searchDealDebouncedInput, notInCatalogue: catalogueId}).then(
        ({data}) => data,
      ),
    {enabled: !!searchDealDebouncedInput},
  );

  const foundDeals = searchDealResponse.data?.filter(
    ({_id, status, voucherBatch}) =>
      !deals.find((deal) => deal._id === _id) && status !== DealStatus.REJECTED && !!voucherBatch,
  );
  const isSearching =
    searchDealRawInput !== searchDealDebouncedInput || searchDealResponse.isLoading;

  return {
    deals,
    deleteDeal,
    addDeal,
    setSearchDealInput,
    isSearching,
    saveChanges,
    isSaving,
    foundDeals,
    searchFilter,
    setSearchFilter,
  };
};
