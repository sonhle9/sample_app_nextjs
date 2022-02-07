import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Row,
  DataTableCaption,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  Button,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {PageContainer} from '../../../components/page-container';
import {useBillingPlans} from '../billing-plan.queries';
import {Link} from '../../../routing/link';
import {useState} from 'react';
import {BillingPlanCreateModal} from './billing-plan-modal-smartpay';

export const BillingPlanListing = () => {
  const [isOpenBillingPlanModal, setOpenBillingPlanModal] = useState(false);
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const {data, isLoading, isError, error} = useBillingPlans({
    page,
    perPage,
  });

  const isEmptyBillingPlanList = !isLoading && data?.billingPlans?.length === 0;

  return (
    <>
      <PageContainer
        heading="Billing plans"
        action={
          !isEmptyBillingPlanList && (
            <Button
              onClick={() => setOpenBillingPlanModal(true)}
              leftIcon={<PlusIcon />}
              variant="primary">
              CREATE
            </Button>
          )
        }>
        {isError && <QueryErrorAlert error={error as any} />}
        {!isError && (
          <Table
            isLoading={isLoading}
            striped
            pagination={
              <PaginationNavigation
                total={data?.total}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            }>
            <Row groupType="thead">
              <Tr>
                <Td className="w-1/3">Billing plan</Td>
                <Td className="w-1/3 text-right">N0. of merchants subscribed</Td>
                <Td className="w-1/3 text-right">Last updated</Td>
              </Tr>
            </Row>
            <Row>
              {!isEmptyBillingPlanList &&
                data?.billingPlans?.map((billingPlan) => {
                  const merchantCount = billingPlan?.merchantCount ?? 0;
                  return (
                    <Tr
                      key={billingPlan.id}
                      render={(props) => (
                        <Link {...props} to={`/billing/billing-plans/${billingPlan.id}`} />
                      )}>
                      <Td>{billingPlan.name}</Td>
                      <Td className="text-right">{merchantCount}</Td>
                      <Td className="text-right">{formatDate(billingPlan?.updatedAt)}</Td>
                    </Tr>
                  );
                })}
            </Row>
            {isEmptyBillingPlanList && (
              <DataTableCaption>
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="pb-4">You have not added any billing plan yet</p>
                  <Button
                    onClick={() => setOpenBillingPlanModal(true)}
                    variant="outline"
                    leftIcon={<PlusIcon />}>
                    CREATE
                  </Button>
                </div>
              </DataTableCaption>
            )}
          </Table>
        )}
      </PageContainer>
      {isOpenBillingPlanModal && (
        <BillingPlanCreateModal onClose={() => setOpenBillingPlanModal(false)} />
      )}
    </>
  );
};
