import {
  dedupeArray,
  DropdownMultiSelect,
  DropdownMultiSelectProps,
  useDebounce,
} from '@setel/portal-ui';
import * as React from 'react';
import {useMerchantSearch, useMultipleMerchantDetails} from '../merchants.queries';

export interface MerchantMultiSelectProps
  extends Omit<DropdownMultiSelectProps, 'options' | 'onInputValueChange'> {
  currentValues?: Array<string>;
}

export const MerchantMultiSelect = ({currentValues, ...props}: MerchantMultiSelectProps) => {
  const [searchText, setSearchText] = React.useState('');
  const appliedSearchText = useDebounce(searchText);

  const merchantQuery = useMerchantSearch(
    {
      name: appliedSearchText,
    },
    {
      select: (result) =>
        result.items.map((merchant) => ({
          value: merchant.merchantId,
          label: merchant.name,
        })),
    },
  );

  const currentMerchantDetails = useMultipleMerchantDetails(currentValues || [], {
    enabled: currentValues && currentValues.length > 0,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
      })),
  });

  const merchantOptions = React.useMemo(() => {
    if (!currentMerchantDetails.data) {
      return merchantQuery.data;
    }
    if (!merchantQuery.data) {
      return currentMerchantDetails.data;
    }

    return dedupeArray(currentMerchantDetails.data.concat(merchantQuery.data), 'value');
  }, [currentMerchantDetails.data, merchantQuery.data]);

  return (
    <DropdownMultiSelect
      {...props}
      options={searchText === appliedSearchText ? merchantOptions : undefined}
      onInputValueChange={setSearchText}
    />
  );
};
