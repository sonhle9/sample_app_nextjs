import * as React from 'react';
import {Button, OrderIcon, PlusIcon} from '@setel/portal-ui';

export const ReorderCreateButtonGroup = (props: {
  isReorder: boolean;
  handleCancelReorder: () => void;
  handleOrderButton: () => void;
  handleCreateButton: () => void;
}) => {
  const {isReorder, handleCancelReorder, handleOrderButton, handleCreateButton} = props;
  return (
    <div className="p-0 m-0 flex space-x-5">
      <Button
        variant={'outline'}
        className="h-11"
        onClick={isReorder ? handleCancelReorder : handleOrderButton}
        leftIcon={isReorder ? undefined : <OrderIcon />}
        data-testid="button-group-left">
        {isReorder ? 'CANCEL' : 'RE-ORDER'}
      </Button>
      <Button
        variant="primary"
        className="h-11"
        onClick={isReorder ? handleOrderButton : handleCreateButton}
        leftIcon={isReorder ? undefined : <PlusIcon />}
        data-testid="button-group-right">
        {isReorder ? 'SAVE CHANGES' : 'CREATE'}
      </Button>
    </div>
  );
};
