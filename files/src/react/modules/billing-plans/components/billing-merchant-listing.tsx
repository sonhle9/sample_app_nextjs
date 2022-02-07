import React from 'react';
import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Row,
  PaginationNavigation,
  CardHeading,
  usePaginationState,
  TextEllipsis,
  Card,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {Link} from 'src/react/routing/link';
import {useBillingPlanMerchants} from '../billing-plan.queries';

export const BillingMerchantsListing = ({billingPlanId}: {billingPlanId: string}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isLoading, isError, error} = useBillingPlanMerchants({
    page,
    perPage,
    billingPlanId,
  });

  const isEmptyAssignedMerchantList = !isLoading && data?.merchants?.length === 0;

  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      <Card className="mt-8">
        <CardHeading title="Merchant subscribed" />
        <Table
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
          {!isEmptyAssignedMerchantList && (
            <Row groupType="thead">
              <Tr>
                <Td className="px-7">MERCHANT NAME</Td>
              </Tr>
            </Row>
          )}
          <Row>
            {!isEmptyAssignedMerchantList &&
              data?.merchants.map((merchant) => (
                <Tr key={merchant.id}>
                  <Td
                    className="px-7"
                    render={(props) => (
                      <Link {...props} to={`/merchants/${merchant.merchantId}`} />
                    )}>
                    <TextEllipsis widthClass="max-w-xs" text={merchant.attributes.merchantName} />
                  </Td>
                </Tr>
              ))}
          </Row>
          {isEmptyAssignedMerchantList && (
            <Card>
              <p className="text-black text-center text-sm my-7">
                You have not assigned any merchants to this plan yet
              </p>
            </Card>
          )}
        </Table>
      </Card>
    </>
  );
};
