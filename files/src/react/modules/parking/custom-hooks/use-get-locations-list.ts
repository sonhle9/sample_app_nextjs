import * as React from 'react';
import {LocationParams} from '../parking.type';
import {useGetLocations} from '../parking.queries';

export const useGetLocationsList = (params?: LocationParams) => {
  const {data, isSuccess, isLoading} = useGetLocations(params);

  const optionsGroup = React.useMemo(
    () =>
      (data?.data || []).map((locations) => {
        return {label: locations.name, value: locations.id};
      }),
    [data, isSuccess],
  );

  return {
    data,
    isSuccess,
    isLoading,
    optionsGroup,
  };
};
