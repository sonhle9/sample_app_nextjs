import * as React from 'react';
import {useGetLoyaltyCategories} from '../point-rules.queries';

export const useListLoyaltyCategories = (enabled?: boolean) => {
  const {data, isSuccess} = useGetLoyaltyCategories(undefined, {enabled});

  const [lookUpId, categoriesList] = React.useMemo(() => {
    const lookUpIdRecord: Record<string, string> = {};
    const categoriesListArray: string[] = [];

    // Memoized id lookup and categories list array
    (data || []).map((loyaltyCategory) => {
      const categoryName = `${loyaltyCategory.categoryCode} - ${loyaltyCategory.categoryName}`;
      lookUpIdRecord[loyaltyCategory.categoryCode] = categoryName;
      categoriesListArray.push(categoryName);
    });

    return [lookUpIdRecord, categoriesListArray];
  }, [data]);

  return {data, isSuccess, categoriesList, lookUpId};
};

export const useGenerateLoyaltyCategories = ({
  loyaltyCategoriesIdFilters,
  enabled,
  searchValue,
}: {
  loyaltyCategoriesIdFilters?: string[];
  enabled?: boolean;
  searchValue?: string;
}) => {
  const {data, isSuccess, lookUpId} = useListLoyaltyCategories(enabled);

  // Memoized filter look up
  const filterLookup = React.useMemo(() => {
    const lookUpObject: Record<string, boolean> = {};
    loyaltyCategoriesIdFilters?.forEach((filterid) => {
      lookUpObject[filterid] = true;
    });
    return lookUpObject;
  }, [data, loyaltyCategoriesIdFilters]);

  const inclusiveFiltered: string[] = []; // Create a string array of values matching id in loyaltyCategoriesIdFilters
  const exclusiveFiltered: string[] = []; // Create the complementarry array for inclusive filtered

  Object.entries(lookUpId).forEach(([key, value]) => {
    if (filterLookup[key]) {
      inclusiveFiltered.push(value);
    } else {
      exclusiveFiltered.push(value);
    }
  });

  const searchResult: string[] = React.useMemo(() => {
    let searchBuffer = [];
    if (searchValue) {
      searchBuffer = exclusiveFiltered.filter((loyaltyCategory) =>
        loyaltyCategory.toLowerCase().includes(searchValue.toLowerCase()),
      );
    } else {
      searchBuffer = exclusiveFiltered;
    }
    return searchBuffer;
  }, [data, searchValue]);

  return {data, isSuccess, lookUpId, inclusiveFiltered, exclusiveFiltered, searchResult};
};
