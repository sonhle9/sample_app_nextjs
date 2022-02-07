import * as React from 'react';
import {useGetLoyaltyCardGroup} from '../card-groups.queries';

export const useListCardGroups = (enabled?: boolean, params?: any) => {
  // uses params will error LY-1003
  const {data, isSuccess} = useGetLoyaltyCardGroup({perPage: 40}, {enabled});

  // Memoized id and card group name
  const [lookUpId, lookUpName] = React.useMemo(() => {
    const lookUpIdRecord: Record<string, string> = {};
    const lookUpNameRecord: Record<string, string> = {};

    (data?.items || []).map((cardGroup) => {
      lookUpIdRecord[cardGroup.id] = cardGroup.name;
      lookUpNameRecord[cardGroup.name] = cardGroup.id;
    });
    return [lookUpIdRecord, lookUpNameRecord];
  }, [data, params]);

  // Memoized option group
  const optionsGroup = React.useMemo(
    () =>
      (data?.items || []).map((cardGroup) => {
        return {label: cardGroup.name, value: cardGroup.id};
      }),
    [data],
  );

  return {
    data,
    lookUpId,
    lookUpName,
    optionsGroup,
    isSuccess,
  };
};

export const useGenerateCardGroups = ({
  cardGroupIdFilters,
  enabled,
  params,
  searchValue,
}: {
  cardGroupIdFilters?: string[];
  enabled?: boolean;
  params?: any;
  searchValue?: string;
}) => {
  const {data, isSuccess, lookUpId, lookUpName} = useListCardGroups(enabled, params);

  // Memoized filter look up
  const filterLookup = React.useMemo(() => {
    const lookUpObject: Record<string, boolean> = {};
    cardGroupIdFilters?.forEach((filterid) => {
      lookUpObject[filterid] = true;
    });
    return lookUpObject;
  }, [data, cardGroupIdFilters]);

  const inclusiveFiltered: string[] = []; // Create a string array of values matching id in cardGroupIdFilters
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
      searchBuffer = exclusiveFiltered.filter((cardGroupName) =>
        cardGroupName.toLowerCase().includes(searchValue.toLowerCase()),
      );
    } else {
      searchBuffer = exclusiveFiltered;
    }
    return searchBuffer;
  }, [data, searchValue]);

  return {
    data,
    isSuccess,
    inclusiveFiltered,
    exclusiveFiltered,
    searchResult,
    lookUpId,
    lookUpName,
  };
};
