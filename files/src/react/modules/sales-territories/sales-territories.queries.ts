import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  addSalesTerritoryMerchants,
  createSalesTerritory,
  deleteSalesTerritory,
  exportSalesTerritoryMerchants,
  getNoTerritoryMerchants,
  getSalesTerritoriesPaginated,
  getSalesTerritoryDetails,
  importSalesTerritory,
  removeSalesTerritoryMerchants,
  transferSalesTerritoryMerchants,
  updateSalesTerritory,
} from './sales-territories.service';
import {ISalesTerritory} from './sales-territories.type';

export const salesTerritoryQueryKey = {
  salesTerritoryList: 'sales_territory_list',
  salesTerritoryDetails: 'sales_territory_detail',
  merchantList: 'merchant_list',
  merchantSearch: 'merchant_search',
};

export const useGetSalesTerritories = (req: Parameters<typeof getSalesTerritoriesPaginated>[0]) => {
  return useQuery(
    [salesTerritoryQueryKey.salesTerritoryList, {merchantTypeId: req.merchantTypeId}],
    () => getSalesTerritoriesPaginated(req),
    {
      keepPreviousData: true,
    },
  );
};

export const useSalesTerritoryDetails = (salesTerritoryId?: string) =>
  useQuery([salesTerritoryQueryKey.salesTerritoryDetails, salesTerritoryId], () =>
    getSalesTerritoryDetails(salesTerritoryId),
  );

export const useSetSalesTerritory = (
  merchantTypeId: string,
  currentSalesTerritory?: ISalesTerritory,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (salesTerritory: ISalesTerritory) =>
      currentSalesTerritory
        ? updateSalesTerritory({
            ...currentSalesTerritory,
            ...salesTerritory,
          })
        : createSalesTerritory(salesTerritory),
    {
      onSuccess: () => {
        if (currentSalesTerritory) {
          queryClient.invalidateQueries([
            salesTerritoryQueryKey.salesTerritoryDetails,
            currentSalesTerritory.id,
          ]);
        }
        queryClient.invalidateQueries([
          [salesTerritoryQueryKey.salesTerritoryList, {merchantTypeId}],
        ]);
      },
    },
  );
};

export const useDeleteSalesTerritory = (currentSalesTerritory?: ISalesTerritory) => {
  const queryClient = useQueryClient();
  return useMutation(
    (salesTerritoryId: string) =>
      deleteSalesTerritory(salesTerritoryId || currentSalesTerritory.id),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([
          [
            salesTerritoryQueryKey.salesTerritoryList,
            {merchantTypeId: currentSalesTerritory.merchantTypeId},
          ],
        ]),
    },
  );
};

export const useAddTerritoryMerchants = (salesTerritoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (merchantIds: string[]) => addSalesTerritoryMerchants(salesTerritoryId, merchantIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([[salesTerritoryQueryKey.merchantList, {salesTerritoryId}]]);
      },
    },
  );
};

export const useRemoveTerritoryMerchants = (salesTerritoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (merchantIds: string[]) => removeSalesTerritoryMerchants(salesTerritoryId, merchantIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([[salesTerritoryQueryKey.merchantList, {salesTerritoryId}]]);
      },
    },
  );
};

export const useTransferTerritoryMerchants = (salesTerritoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newSalesTerritoryId: string) =>
      transferSalesTerritoryMerchants(salesTerritoryId, newSalesTerritoryId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([[salesTerritoryQueryKey.merchantList, {salesTerritoryId}]]);
      },
    },
  );
};

export const useExportTerritoryMerchants = () => {
  return useMutation((salesTerritoryId: string) => exportSalesTerritoryMerchants(salesTerritoryId));
};

export const useImportSalesTerritory = (merchantTypeId: string) => {
  const queryClient = useQueryClient();
  return useMutation((file: File) => importSalesTerritory(merchantTypeId, file), {
    onSuccess: () => {
      queryClient.invalidateQueries([
        [salesTerritoryQueryKey.salesTerritoryList, {merchantTypeId}],
      ]);
    },
  });
};

export const useGetNoTerritoryMerchants = (filter: Parameters<typeof getNoTerritoryMerchants>[0]) =>
  useQuery([salesTerritoryQueryKey.merchantSearch, filter], () => getNoTerritoryMerchants(filter));
