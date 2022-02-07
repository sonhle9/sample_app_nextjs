import {IconButton, TrashIcon, TextareaField, MoneyInput, FieldContainer} from '@setel/portal-ui';
import * as React from 'react';

export enum UpdateTypes {
  DESCRIPTION = 'description',
  AMOUNT = 'amount',
  REMOVE = 'remove',
}

export function ItemCard({
  index,
  indexOffset = 1,
  description,
  amount,
  showError,
  handleUpdate,
}: {
  index: number;
  indexOffset?: number;
  description?: string;
  amount?: string;
  showError: boolean;
  handleUpdate: (type: UpdateTypes, index: number, val?: string) => void;
}) {
  const [itemDescription, setItemDescription] = React.useState(description ?? '');
  const [itemAmount, setItemAmount] = React.useState(amount ?? '');

  const updateDescription = (val) => {
    setItemDescription(val);
    handleUpdate(UpdateTypes.DESCRIPTION, index, val);
  };

  const updateAmount = (val) => {
    setItemAmount(val);
    handleUpdate(UpdateTypes.AMOUNT, index, val);
  };

  const removeItem = () => {
    handleUpdate(UpdateTypes.REMOVE, index);
  };

  return (
    <div className="border border-gray-200	border-solid px-3 mt-6">
      <div className="py-3 items-center grid grid-cols-12 gap-4">
        <span className="text-base	font-medium col-span-11">Item {index + indexOffset}</span>
        <IconButton style={{justifyContent: 'flex-end'}} className="p-0">
          <TrashIcon className="w-5 h-5 text-red-500" onClick={removeItem} />
        </IconButton>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <TextareaField
            className="text-sm"
            required
            label="Item details"
            value={itemDescription}
            onChangeValue={updateDescription}
            layout="vertical"
            placeholder="Enter item details"
            status={showError && itemDescription === '' ? 'error' : undefined}
            helpText={showError && itemDescription === '' ? 'Field cannot be empty' : undefined}
          />
        </div>
        <FieldContainer
          label="Amount"
          layout="vertical"
          className="text-sm"
          status={showError && itemAmount === '' ? 'error' : undefined}
          helpText={showError && itemAmount === '' ? 'Field cannot be empty' : undefined}>
          <MoneyInput onChangeValue={updateAmount} value={itemAmount} placeholder="0.00" />
        </FieldContainer>
      </div>
    </div>
  );
}
