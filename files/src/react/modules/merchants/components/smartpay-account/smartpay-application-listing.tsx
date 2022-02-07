import * as React from 'react';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../merchants.queries';
import {getSmartpayApplications} from '../../merchants.service';
import {
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayStatus,
  MerchantSmartpayFleetPlan,
  MerchantSmartpayFleetPlanOption,
} from '../../merchants.type';
import {
  Button,
  DataTable,
  DataTableCaption,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  FilterControls,
  PaginationNavigation,
  PlusIcon,
  Badge,
} from '@setel/portal-ui';
import {PageContainer} from '../../../../components/page-container';
import {SmartpayAccountCreateModal} from './smartpay-account-create-modal';
import {useNotification} from '../../../../hooks/use-notification';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {extractErrorWithConstraints} from '../../../../lib/utils';
import {getOptionLabel, getSmartpayMerchantStatusBadgeColor} from '../../merchants.lib';
import {formatDate} from '@setel/web-utils';
import {useRouter} from '../../../../routing/routing.context';
import {MerchantTypeCodes} from '../../../../../shared/enums/merchant.enum';

export const SmartpayApplicationListing = (props: {userEmail?: string}) => {
  const statusOptions = [
    {
      label: 'Pending',
      value: MerchantSmartpayStatus.PENDING,
    },
    {
      label: 'Rejected',
      value: MerchantSmartpayStatus.REJECTED,
    },
    {
      label: 'Cancelled',
      value: MerchantSmartpayStatus.CANCELLED,
    },
  ];
  const {pagination, query, filter} = useDataTableState({
    initialFilter: {
      searchValue: '',
      status: '',
      fleetPlan: '',
      businessCategory: '',
      companyType: '',
    },
    queryKey: merchantQueryKey.smartpayApps,
    queryFn: (filterValue) => {
      return getSmartpayApplications({
        ...filterValue,
        searchValue: filterValue.searchValue.trim() || undefined,
        status: filterValue.status || undefined,
        fleetPlan: filterValue.fleetPlan || undefined,
        businessCategory: filterValue.businessCategory || undefined,
        companyType: filterValue.companyType || undefined,
      });
    },
    onChange: (filter) => {
      setIsNoFilter(
        !filter.searchValue &&
          !filter.status &&
          !filter.fleetPlan &&
          !filter.businessCategory &&
          !filter.companyType,
      );
    },
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: [
            {
              label: 'Any statuses',
              value: '',
            },
            ...statusOptions,
          ],
        },
      },
      {
        key: 'fleetPlan',
        type: 'select',
        props: {
          label: 'Fleet plan',
          options: [
            {
              label: 'Any fleet plans',
              value: '',
            },
            {
              label: 'Prepaid',
              value: MerchantSmartpayFleetPlan.PREPAID,
            },
            {
              label: 'Postpaid',
              value: MerchantSmartpayFleetPlan.POSTPAID,
            },
          ],
        },
      },
      {
        key: 'companyType',
        type: 'select',
        props: {
          label: 'Company type',
          options: [
            {
              label: 'Any company types',
              value: '',
            },
            ...MerchantSmartpayCompanyTypeOptions,
          ],
        },
      },
      {
        key: 'businessCategory',
        type: 'select',
        props: {
          label: 'Business category',
          options: [
            {
              label: 'Any business categories',
              value: '',
            },
            ...MerchantSmartpayBusinessCategoryOptions,
          ],
        },
      },
      {
        key: 'searchValue',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter application id, company / individual name',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const router = useRouter();
  const showMessage = useNotification();
  const [isNoFilter, setIsNoFilter] = React.useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const [{}, {resetValue}] = filter;

  React.useEffect(() => {
    resetValue('status');
    resetValue('searchValue');
    resetValue('businessCategory');
    resetValue('companyType');
    resetValue('fleetPlan');
  }, []);

  return (
    <PageContainer
      heading={'Applications'}
      action={
        <div className="inline-flex space-x-3">
          {props.userEmail && (
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              leftIcon={<PlusIcon />}>
              CREATE
            </Button>
          )}
        </div>
      }>
      {showCreateModal && (
        <SmartpayAccountCreateModal
          userEmail={props.userEmail}
          onDone={() => {
            setShowCreateModal(false);
            showMessage({
              title: 'Successful!',
              description: 'Application has been successfully submitted.',
            });
          }}
          onDismiss={() => setShowCreateModal(false)}
        />
      )}
      <div className="space-y-8">
        <FilterControls className={'grid-cols-4'} filter={filter} />
        <DataTable
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          pagination={
            <PaginationNavigation
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={query.data ? query.data.total : 0}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Application ID</Td>
              <Td>Status</Td>
              <Td>Fleet plan</Td>
              <Td>Company/Individual name</Td>
              <Td className={'text-right'}>Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {query.data &&
              query.data.items.map((smartpayMerchant, index) => (
                <Tr
                  className={'cursor-pointer'}
                  key={index}
                  onClick={() =>
                    router.navigateByUrl(
                      `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/application/${smartpayMerchant.applicationId}`,
                    )
                  }>
                  <Td>{smartpayMerchant.applicationId}</Td>
                  <Td>
                    <Badge
                      color={getSmartpayMerchantStatusBadgeColor(smartpayMerchant.status || '')}
                      className={'uppercase'}>
                      {smartpayMerchant.status || '-'}
                    </Badge>
                  </Td>
                  <Td>
                    {getOptionLabel(
                      MerchantSmartpayFleetPlanOption,
                      smartpayMerchant.generalInfo.fleetPlan,
                    )}
                  </Td>
                  <Td>{smartpayMerchant.companyOrIndividualInfo.companyOrIndividualName}</Td>
                  <Td className={'text-right'}>{formatDate(smartpayMerchant.createdAt)}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {!query.isFetching && query.error && (
              <QueryErrorAlert
                error={{message: extractErrorWithConstraints(query.error as any).toString()}}
              />
            )}
            {query.data && !query.data.items.length && (
              <div className="w-full py-12 text-sm flex items-center justify-center">
                {isNoFilter ? (
                  <div>
                    <p className={'mb-3'}>
                      You have not created any smartpay account application yet.
                    </p>
                    <div className={'flex items-center justify-center'}>
                      <Button
                        onClick={() => setShowCreateModal(true)}
                        variant="outline"
                        leftIcon={<PlusIcon />}>
                        CREATE
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>No smartpay account application found.</>
                )}
              </div>
            )}
          </DataTableCaption>
        </DataTable>
      </div>
    </PageContainer>
  );
};
