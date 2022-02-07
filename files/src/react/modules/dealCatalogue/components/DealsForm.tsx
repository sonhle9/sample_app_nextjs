import * as RS from '@setel/portal-ui';
import * as React from 'react';
import {useCatalogueDealsFlow} from '../hooks/useCatalogueDealsFlow';
import {DealsTable} from './DealsTable';

export type DealsFormProps = {
  onDismiss: () => void;
  catalogueId: string;
};

export const DealsForm: React.VFC<DealsFormProps> = ({onDismiss, catalogueId}) => {
  const {
    setSearchDealInput,
    addDeal,
    deleteDeal,
    isSearching,
    foundDeals,
    saveChanges,
    isSaving,
    deals,
    searchFilter,
    setSearchFilter,
  } = useCatalogueDealsFlow({
    catalogueId,
    onSuccessSave: onDismiss,
  });

  return (
    <RS.Modal isOpen onDismiss={onDismiss} aria-label="Add deal to catalogue">
      <RS.ModalHeader>Add deal to catalogue</RS.ModalHeader>
      <RS.ModalBody className="py-6">
        <div className="flex">
          <RS.DropdownSelectField
            value={searchFilter}
            onChangeValue={(val) => setSearchFilter(val)}
            options={[
              {label: 'Deal', value: 'name'},
              {label: 'Merchant', value: 'merchantName'},
            ]}
          />
          <RS.SearchInput
            wrapperClass="w-full h-10 ml-2"
            onInputValueChange={setSearchDealInput}
            placeholder="Add items by deals name or merchant.."
            onSelect={addDeal}
            results={
              isSearching
                ? []
                : foundDeals?.map((deal) => ({
                    value: deal,
                    label: deal.name,
                    description: deal.voucherBatch?.merchant?.name,
                  }))
            }
          />
        </div>
        <DealsTable editMode dealsPages={[{data: deals}]} deleteDeal={deleteDeal} />
      </RS.ModalBody>
      <RS.ModalFooter className="flex justify-end items-center space-x-3">
        <RS.Button
          isLoading={isSaving}
          className="tracking-wider font-semibold"
          variant="outline"
          onClick={onDismiss}>
          CANCEL
        </RS.Button>
        <RS.Button
          onClick={() => saveChanges()}
          isLoading={isSaving}
          className="tracking-wider font-semibold"
          type="submit"
          variant="primary">
          SAVE CHANGES
        </RS.Button>
      </RS.ModalFooter>
    </RS.Modal>
  );
};
