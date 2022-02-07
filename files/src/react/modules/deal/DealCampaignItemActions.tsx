import * as React from 'react';
import {DropdownMenu, DotVerticalIcon} from '@setel/portal-ui';
import {DealStatus, StateTransitionFrom} from './deal.const';
import {useMutation, useQueryClient} from 'react-query';
import {updateDealStatus} from './deals.service';

export type DealCampaignItemActionsProps = {
  status: DealStatus;
  dealId: string;
};

const StatusActionLabel = {
  [DealStatus.APPROVED]: 'Approve',
  [DealStatus.REJECTED]: 'Reject',
};

export const DealCampaignItemActions: React.VFC<DealCampaignItemActionsProps> = ({
  status,
  dealId,
}) => {
  const queryClient = useQueryClient();
  const {mutate: updateStatus} = useMutation(updateDealStatus, {
    onSuccess: () => queryClient.invalidateQueries(['deals']),
  });

  const possibleStatuses = StateTransitionFrom[status];
  if (!possibleStatuses?.length) {
    return null;
  }
  return (
    <DropdownMenu
      variant="icon"
      label={
        <>
          <span className="sr-only">Actions</span>
          <DotVerticalIcon className="w-5 h-5 text-gray-500" />
        </>
      }>
      <DropdownMenu.Items className="min-w-32">
        {possibleStatuses.map((pStatus) => (
          <DropdownMenu.Item key={pStatus} onSelect={() => updateStatus({status: pStatus, dealId})}>
            {StatusActionLabel[pStatus]}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Items>
    </DropdownMenu>
  );
};
