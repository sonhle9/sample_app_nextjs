import * as React from 'react';
import {
  DataTable as Table,
  PaginationNavigation,
  Button,
  CardHeading,
  usePaginationState,
  TextEllipsis,
  PlusIcon,
  formatDate,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {FeePlansModalAssign} from './fee-plans-modal-assign';
import {Link} from 'src/react/routing/link';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {useFeePlanMerchants} from '../../fee-plans.queries';

export const FeeMerchantsListing = ({feePlanId}: {feePlanId: string}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const {data, isLoading, isError, error} = useFeePlanMerchants({
    id: feePlanId,
    page,
    perPage,
  });

  const isEmptyAssignedMerchantList = !isLoading && data?.merchants?.length === 0;

  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      <Table
        heading={
          <CardHeading title="Merchants">
            {!isEmptyAssignedMerchantList && (
              <Button
                onClick={() => setShowAssignModal(true)}
                variant="outline"
                minWidth="none"
                leftIcon={<PlusIcon />}
                data-testid="assign-merchant-btn">
                ADD
              </Button>
            )}
          </CardHeading>
        }
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            total={data?.total}
            currentPage={page}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
          />
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Merchant name</Table.Th>
            <Table.Th className="text-right">Assigned on</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {!isEmptyAssignedMerchantList && (
          <Table.Tbody>
            {data?.merchants.map((merchant) => (
              <Table.Tr
                key={merchant.merchantId}
                render={(props) => <Link {...props} to={`/merchants/${merchant.merchantId}`} />}>
                <Table.Td>
                  <TextEllipsis widthClass="max-w-xs" text={merchant.name} />
                </Table.Td>
                <Table.Td className="text-right">{formatDate(merchant.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        )}
        {isEmptyAssignedMerchantList && (
          <EmptyDataTableCaption
            action={
              <Button
                onClick={() => setShowAssignModal(true)}
                variant="outline"
                leftIcon={<PlusIcon />}>
                ADD MERCHANTS
              </Button>
            }
          />
        )}
      </Table>
      {showAssignModal && (
        <FeePlansModalAssign setShowModal={setShowAssignModal} feePlanId={feePlanId} />
      )}
    </>
  );
};
