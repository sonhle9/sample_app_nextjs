import * as React from 'react';
import {
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  PlusIcon,
} from '@setel/portal-ui';
import {useGetPointExpiry} from '../../point-rules.queries';
import {PointExpiriesCreateEditModal} from './point-expiries-create-edit-modal';
import {OperationType, PointRulesExpiries} from '../../point-rules.type';
import {useGetCardGroupDetails} from 'src/react/modules/card-groups/card-group.queries';
import {formatThousands} from 'src/shared/helpers/formatNumber';
import {useCanEditPointExpiries} from '../../custom-hooks/use-check-permissions';
import {PageContainer} from 'src/react/components/page-container';

export const PointExpiries = () => {
  const {data, isLoading, isError} = useGetPointExpiry(OperationType.EARN);
  const canEditPointExpiries = useCanEditPointExpiries();
  const [isOpen, setIsOpen] = React.useState(false);
  const [pointExpiries, setPointExpiries] = React.useState(undefined);

  const handleOpenRule = (pointExpiriesData: PointRulesExpiries) => {
    setIsOpen(true);
    setPointExpiries(pointExpiriesData);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setPointExpiries(undefined);
  };

  return (
    <>
      <PointExpiriesCreateEditModal
        isOpen={isOpen}
        onDismiss={handleDismiss}
        pointExpiries={pointExpiries}
      />
      <PageContainer
        heading="Point expiries"
        action={
          canEditPointExpiries && (
            <Button
              variant="primary"
              className="h-11"
              data-testid="create-button"
              onClick={() => {
                setIsOpen(true);
              }}
              leftIcon={<PlusIcon />}>
              CREATE
            </Button>
          )
        }>
        <DataTable isLoading={isLoading} skeletonRowNum={3}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Card group</Td>
              <Td className="text-right">Validity duration</Td>
            </Tr>
          </DataTableRowGroup>
          {data && data.length && !isError ? (
            <DataTableRowGroup>
              {data.map((pointExpiriesEntry) => (
                <PointExpiriesEntry
                  pointExpiries={pointExpiriesEntry}
                  onClick={handleOpenRule}
                  key={pointExpiriesEntry.id}
                />
              ))}
            </DataTableRowGroup>
          ) : (
            <DataTableCaption
              className="text-center py-12 text-mediumgrey text-md"
              data-testid="no-point-expiries">
              <p>No point expiries found</p>
            </DataTableCaption>
          )}
        </DataTable>
      </PageContainer>
    </>
  );
};

type PointExpiriesEntryProps = {
  pointExpiries: PointRulesExpiries;
  onClick: (pointExpiries: PointRulesExpiries) => void;
};

const PointExpiriesEntry: React.VFC<PointExpiriesEntryProps> = ({pointExpiries, onClick}) => {
  const {data: category} = useGetCardGroupDetails(pointExpiries?.cardCategory[0]);
  return (
    <Tr
      render={(props) => (
        <div {...props} onClick={() => onClick(pointExpiries)} data-testid="point-expiry-entry" />
      )}
      className="cursor-pointer">
      <Td>{category?.name}</Td>
      <Td className="text-right">
        {pointExpiries.expireAfter.months
          ? `${formatThousands(pointExpiries.expireAfter.months)} months`
          : pointExpiries.expireAfter.days
          ? `${formatThousands(pointExpiries.expireAfter.days)} days`
          : ''}
      </Td>
    </Tr>
  );
};
