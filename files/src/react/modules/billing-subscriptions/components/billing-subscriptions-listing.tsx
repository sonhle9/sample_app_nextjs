import * as React from 'react';
import {PageContainer} from '../../../components/page-container';
import {
  DropdownSelectField,
  usePaginationState,
  PaginationNavigation,
  FieldContainer,
  Badge,
  formatDate,
  FilterControls,
  SearchTextInput,
  Button,
  DataTable as Table,
  DataTableRowGroup as Row,
  DataTableRow as Tr,
  DataTableCell as Td,
  PlusIcon,
} from '@setel/portal-ui';
import {HasPermission} from '../../auth/HasPermission';
import {billingSubscriptionsRole} from '../../../../shared/helpers/roles.type';
import {BillingSubscriptionsModalCreate} from './billing-subscriptions-modal-create';
import {useBillingSubscriptions} from '../billing-subscriptions.queries';
import {
  getSubscriptionStatusColor,
  ISubscriptionFilter,
  SubscriptionStatusOptions,
} from '../billing-subscriptions.types';
import {useEffect, useState} from 'react';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {Link} from '../../../routing/link';
import {filterEmptyString} from 'src/react/lib/ajax';
import {mappingStatus} from '../billing-subscriptions.constants';
import {useMalaysiaTime} from '../billing-subscriptions.helpers';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {indicatorClassBillingSubscriptions} from './billing-subscriptions-details';

function SubscriptionFilter(props: {
  onSearch: (values: ISubscriptionFilter) => void;
  currentFilters?: ISubscriptionFilter;
}) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>(
    props.currentFilters?.status,
  );
  const [searchMerchantName, setMerchantName] = React.useState('');

  useEffect(() => {
    props.onSearch({status: subscriptionStatus, searchMerchantName});
  }, [subscriptionStatus, searchMerchantName]);

  return (
    <>
      <div className="mb-8">
        <FilterControls className="grid gap-4 lg:grid-cols-4">
          <DropdownSelectField
            label={'Status'}
            name={'status'}
            value={subscriptionStatus}
            onChangeValue={(status) => setSubscriptionStatus(status)}
            placeholder={'Any status'}
            data-testid="dd-tag"
            options={SubscriptionStatusOptions}
          />
          <FieldContainer label="Search" className="col-span-2">
            <SearchTextInput
              value={searchMerchantName}
              onChangeValue={setMerchantName}
              placeholder="Merchant name"
            />
          </FieldContainer>
        </FilterControls>
      </div>
    </>
  );
}

export const PaginatedSubscriptions = (props: {
  filters: ISubscriptionFilter;
  pagination: ReturnType<typeof usePaginationState>;
}) => {
  const {data, isLoading, isError, error} = useBillingSubscriptions({
    page: props.pagination.page,
    perPage: props.pagination.perPage,
    ...filterEmptyString(props.filters),
  });

  const isEmptyBillingSubscriptionList = !isLoading && data?.billingSubscriptions?.length === 0;

  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <Table
          isLoading={isLoading}
          striped
          pagination={
            <PaginationNavigation
              total={data?.total}
              currentPage={props.pagination.page}
              perPage={props.pagination.perPage}
              onChangePage={props.pagination.setPage}
              onChangePageSize={props.pagination.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td className="w-3/12">Merchant name</Td>
              <Td className="w-2/12">Status</Td>
              <Td className="w-3/12">Billing plan</Td>
              <Td className="w-2/12 text-right">Next renewal</Td>
              <Td className="w-2/12 text-right">Next Billing</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingSubscriptionList &&
              data?.billingSubscriptions?.map((billingSubscription) => (
                <Tr
                  key={billingSubscription.id}
                  render={(billingProps) => (
                    <Link
                      {...billingProps}
                      to={`/billing/billing-subscriptions/${billingSubscription.id}`}
                    />
                  )}>
                  <Td>{billingSubscription.attributes?.merchantName}</Td>
                  <Td>
                    <Badge
                      rounded="rounded"
                      color={getSubscriptionStatusColor(billingSubscription.status)}
                      className={`uppercase ${indicatorClassBillingSubscriptions(
                        billingSubscription.status,
                      )}`}
                      key={billingSubscription.status}>
                      {mappingStatus[billingSubscription.status]}
                    </Badge>
                  </Td>
                  <Td>{billingSubscription.attributes?.billingPlanName}</Td>
                  <Td className="text-right">
                    {billingSubscription.nextRenewalAt
                      ? formatDate(useMalaysiaTime(billingSubscription.nextRenewalAt), {
                          formatType: 'dateOnly',
                        })
                      : '-'}
                  </Td>
                  <Td className="text-right">
                    {billingSubscription.nextBillingAt
                      ? formatDate(useMalaysiaTime(billingSubscription.nextBillingAt), {
                          formatType: 'dateOnly',
                        })
                      : '-'}
                  </Td>
                </Tr>
              ))}
          </Row>
          {isEmptyBillingSubscriptionList && (
            <EmptyDataTableCaption content="You have no data to be displayed here" />
          )}
        </Table>
      )}
    </>
  );
};

export const BillingSubscriptionListing = () => {
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const [filters, setFilters] = React.useState<ISubscriptionFilter>({});
  const paginationState = usePaginationState();

  const onSearch = (newFilters: ISubscriptionFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };

  return (
    <PageContainer
      heading={'Billing subscriptions'}
      className={'space-y-4'}
      action={
        <HasPermission accessWith={[billingSubscriptionsRole.modify]}>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              leftIcon={<PlusIcon />}
              onClick={() => setShowModalCreate(true)}
              data-testid="btn-create">
              CREATE
            </Button>
            {showModalCreate && (
              <BillingSubscriptionsModalCreate
                showModal={showModalCreate}
                setShowModal={setShowModalCreate}
              />
            )}
          </div>
        </HasPermission>
      }>
      <HasPermission accessWith={[billingSubscriptionsRole.view]}>
        <SubscriptionFilter onSearch={onSearch} currentFilters={filters} />
        <PaginatedSubscriptions filters={filters} pagination={paginationState} />
      </HasPermission>
    </PageContainer>
  );
};
