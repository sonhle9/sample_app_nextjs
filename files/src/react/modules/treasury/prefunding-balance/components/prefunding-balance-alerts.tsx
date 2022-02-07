import {
  Button,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  usePaginationState,
  PaginationNavigation,
  Alert,
  CardHeading,
  BareButton,
  PlusIcon,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {useDeleteAlert, usePrefundingBalancesAlert} from '../prefunding-balance.query';
import {PrefundingBalanceAddAlertModal} from './prefunding-balance-add-alert-modal';

export const PrefundingBalanceAlerts = () => {
  const [visibleBalanceAlertModal, setVisibleBalanceAlertModal] = useState(false);
  const pagination = usePaginationState();

  const {
    data: resolvedData,
    isLoading,
    isError,
  } = usePrefundingBalancesAlert({
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const {mutate: deleteAlert} = useDeleteAlert();

  return (
    <>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          heading={
            <CardHeading title="Prepaid balance alerts">
              <Button
                onClick={() => setVisibleBalanceAlertModal(true)}
                leftIcon={<PlusIcon />}
                variant="outline">
                ADD ALERT
              </Button>
            </CardHeading>
          }
          expandable
          defaultIsOpen
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Type</Td>
              <Td>Message</Td>
              <Td>Limit</Td>
              <Td className="text-right">Action</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((prefundingBalanceAlerts, index) => (
                <Tr key={index} data-testid="balance-alerts-record">
                  <Td>{prefundingBalanceAlerts.id}</Td>
                  <Td>{prefundingBalanceAlerts.text}</Td>
                  <Td>{prefundingBalanceAlerts.limit}</Td>
                  <Td className="text-right">
                    <BareButton
                      className="text-error"
                      onClick={() => deleteAlert(prefundingBalanceAlerts.id)}>
                      DELETE
                    </BareButton>
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
      {visibleBalanceAlertModal && (
        <PrefundingBalanceAddAlertModal
          visible={true}
          onClose={() => setVisibleBalanceAlertModal(false)}
        />
      )}
    </>
  );
};
