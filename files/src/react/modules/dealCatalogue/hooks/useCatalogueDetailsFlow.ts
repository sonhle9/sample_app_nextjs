import {useTransientState} from '@setel/portal-ui';
import {useCallback, useState} from 'react';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from 'react-query';
import {useReorder} from 'src/react/hooks/use-reorder';
import {useRouter} from 'src/react/routing/routing.context';
import {onlyDomainError, onUnknownError} from '../../../errors';
import {CreatedDeal} from '../../deal/deals.type';
import {
  deleteDealCatalogue,
  findDealCatalogue,
  findDealCatalogueDeals,
  updateCatalogueDealRelations,
  updateDealCatalogue,
} from '../dealCatalogue.service';
import {DealCatalogue, DealCatalogueAction, DealCatalogueStatus} from '../dealCatalogue.type';
import {FIND_DEAL_CATALOGUE_DEALS_KEY} from './useCatalogueDealsFlow';
import {LIST_CATALOGUES_KEY} from './useCatalogueWithDealsNumber';

export type ModalKeys = 'details' | 'deals' | 'confirmDeleteCatalogue';

const initialShowModal: Record<ModalKeys, boolean> = {
  details: false,
  deals: false,
  confirmDeleteCatalogue: false,
};

export const useCatalogueDetailsFlow = (id: string) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(initialShowModal);
  const toggleShowModal = (name: ModalKeys) =>
    setShowModal({...showModal, [name]: !showModal[name]});
  const [errorMessage, setErrorMessage] = useTransientState<string | null>(null, 5 * 1000);

  const catchError = useCallback((error) => {
    try {
      onlyDomainError<{message: string}>(({data: {message}}) => setErrorMessage(message))(error);
    } catch (e) {
      onUnknownError(e);
      setErrorMessage('Something went wrong');
    }
  }, []);

  const catalogue = useQuery(['dealCatalogueDetails', id], () =>
    findDealCatalogue({catalogueId: id, raw: true, allStatuses: true}),
  );

  const queryClient = useQueryClient();

  const updateCatalogue = useMutation(
    (data: Partial<DealCatalogue>) => updateDealCatalogue(id, data),
    {
      onSuccess: (data: Partial<DealCatalogue>) => {
        queryClient.setQueryData(['dealCatalogueDetails', id], (prev: DealCatalogue) => ({
          ...prev,
          ...data,
        }));
      },
      onError: catchError,
      onSettled: () => setShowModal(initialShowModal),
    },
  );

  const deleteCatalogue = useMutation(() => deleteDealCatalogue(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(LIST_CATALOGUES_KEY);
      router.navigateByUrl('/deals/deal-catalogues');
    },
    onError: catchError,
  });

  const deals = useInfiniteQuery(
    [FIND_DEAL_CATALOGUE_DEALS_KEY, {catalogueId: id}],
    ({pageParam = '1'}) =>
      findDealCatalogueDeals({
        pageToken: pageParam,
        catalogueId: id,
      }),
    {
      getNextPageParam: (last) => last.nextPageToken,
    },
  );

  const hasRequiredFields = !!catalogue.data?.title && !!catalogue.data?.icon.url;
  const isReadyForPublish = hasRequiredFields && deals.data && deals.data.pages[0]?.data.length;
  const isPublished = catalogue.data?.status === DealCatalogueStatus.PUBLISHED;

  const [deleteDealCandidate, setDeleteDealCandidate] =
    useState<Pick<CreatedDeal, '_id' | 'name'> & {page: number}>(null);
  const {mutate: deleteDeal, isLoading: isDeleting} = useMutation(
    (dealId: string) =>
      updateCatalogueDealRelations({
        catalogueId: id,
        changes: [{dealId, type: DealCatalogueAction.UNLINK}],
      }),
    {
      onSuccess: (_, _dealId) => {
        setDeleteDealCandidate(null);
        queryClient.invalidateQueries(['findDeals']);

        queryClient.setQueryData<typeof deals.data>(
          [FIND_DEAL_CATALOGUE_DEALS_KEY, {catalogueId: id}],
          (prev) => {
            const index = prev.pages[deleteDealCandidate.page].data.findIndex(
              (deal) => deal._id === deleteDealCandidate._id,
            );
            return {
              pages: [
                ...prev.pages.slice(0, deleteDealCandidate.page),
                {
                  ...prev.pages[deleteDealCandidate.page],
                  data: [
                    ...prev.pages[deleteDealCandidate.page].data.slice(0, index),
                    ...prev.pages[deleteDealCandidate.page].data.slice(index + 1),
                  ],
                },
                ...prev.pages.slice(deleteDealCandidate.page + 1),
              ],
              pageParams: prev.pageParams,
            };
          },
        );
      },
    },
  );

  const sortable = useReorder({
    queryKey: [FIND_DEAL_CATALOGUE_DEALS_KEY, {catalogueId: id}],
    sortProperty: 'score',
    idProperty: '_id',
    onSave: (updates) =>
      updateCatalogueDealRelations({
        catalogueId: id,
        changes: Object.keys(updates).map((key) => ({
          dealId: key,
          score: updates[key],
          type: DealCatalogueAction.CHANGE_SCORE,
        })),
      }),
  });

  return {
    deals,
    catalogue,
    errorMessage,
    updateCatalogue,
    deleteCatalogue,
    showModal,
    toggleShowModal,
    isReadyForPublish,
    isPublished,
    deleteDeal,
    deleteDealCandidate,
    setDeleteDealCandidate,
    isDeleting,
    sortable,
  };
};
