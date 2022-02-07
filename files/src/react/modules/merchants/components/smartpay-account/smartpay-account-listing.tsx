import * as React from 'react';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../merchants.queries';
import {getSmartpayAccounts} from '../../merchants.service';
import {
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayStatus,
  MerchantSmartpayFleetPlan,
  MerchantSmartpayFleetPlanOption,
  SmartpayType,
} from '../../merchants.type';
import {
  DataTable,
  DataTableCaption,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  FilterControls,
  PaginationNavigation,
  Badge,
  Button,
  DropdownMenu,
  Text,
} from '@setel/portal-ui';
import {PageContainer} from '../../../../components/page-container';
import {SmartpayAccountCreateModal} from './smartpay-account-create-modal';
import {useNotification} from '../../../../hooks/use-notification';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {extractErrorWithConstraints} from '../../../../lib/utils';
import {getOptionLabel, getSmartpayMerchantStatusBadgeColor} from '../../merchants.lib';
import {formatDate, PlusIcon} from '@setel/web-utils';
import {useRouter} from '../../../../routing/routing.context';
import {MerchantTypeCodes} from '../../../../../shared/enums/merchant.enum';
import {SmartpayAccountImportModal} from './smartpay-account-import-modal';
import {SPAImportType} from '../../merchant.const';
import {capitalize} from '../../../../../shared/helpers/common';

export const SmartpayAccountListing = (props: {userEmail?: string}) => {
  const statusOptions = [
    {
      label: 'Active',
      value: MerchantSmartpayStatus.ACTIVE,
    },
    {
      label: 'Frozen',
      value: MerchantSmartpayStatus.FROZEN,
    },
    {
      label: 'Overdue',
      value: MerchantSmartpayStatus.OVERDUE,
    },
    {
      label: 'Deferred',
      value: MerchantSmartpayStatus.DEFERRED,
    },
    {
      label: 'Dormant',
      value: MerchantSmartpayStatus.DORMANT,
    },
    {
      label: 'Closed',
      value: MerchantSmartpayStatus.CLOSED,
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
    queryKey: [merchantQueryKey.smartpayMerchants, SmartpayType.ACCOUNT],
    queryFn: (filterValue) => {
      return getSmartpayAccounts({
        ...filterValue,
        searchValue: filterValue.searchValue.trim() || undefined,
        status: filterValue.status || undefined,
        fleetPlan: filterValue.fleetPlan || undefined,
        businessCategory: filterValue.businessCategory || undefined,
        companyType: filterValue.companyType || undefined,
      });
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
          placeholder: `Enter merchant id, company / individual name`,
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const router = useRouter();
  const showMessage = useNotification();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState({
    isShow: false,
    importType: SPAImportType.LIMIT,
  });

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
      heading={'Accounts'}
      action={
        <div className="inline-flex space-x-3">
          <DropdownMenu variant="outline" label="IMPORT">
            <DropdownMenu.Items>
              <DropdownMenu.Item
                onSelect={() =>
                  setShowImportModal({
                    isShow: true,
                    importType: SPAImportType.PERIOD,
                  })
                }>
                <Text className="text-black">Deferment period</Text>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() =>
                  setShowImportModal({
                    isShow: true,
                    importType: SPAImportType.LIMIT,
                  })
                }>
                <Text className="text-black">Temporary credit limit</Text>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() =>
                  setShowImportModal({
                    isShow: true,
                    importType: SPAImportType.ADJUST,
                  })
                }>
                <Text className="text-black">Bulk adjustments</Text>
              </DropdownMenu.Item>
            </DropdownMenu.Items>
          </DropdownMenu>
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
      {showImportModal.isShow && (
        <SmartpayAccountImportModal
          onDone={(type: any, message: string) => {
            setShowImportModal({
              ...showImportModal,
              isShow: false,
            });
            showMessage({
              title: `${capitalize(type)}!`,
              variant: type,
              description: message,
            });
          }}
          onDismiss={() =>
            setShowImportModal({
              ...showImportModal,
              isShow: false,
            })
          }
          importType={showImportModal.importType}
        />
      )}
      {showCreateModal && (
        <SmartpayAccountCreateModal
          userEmail={props.userEmail}
          smartpayType={SmartpayType.ACCOUNT}
          onDone={() => {
            setShowCreateModal(false);
            showMessage({
              title: 'Successful!',
              description: 'You have successfully created your SmartPay account.',
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
              <Td>Merchant ID</Td>
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
                      `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/merchant/${smartpayMerchant.merchantId}`,
                    )
                  }>
                  <Td>{smartpayMerchant.merchantId}</Td>
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
                      smartpayMerchant.smartPayAccountAttributes.fleetPlan,
                    )}
                  </Td>
                  <Td>{smartpayMerchant.smartPayAccountAttributes.companyOrIndividualName}</Td>
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
                No smartpay account merchant found.
              </div>
            )}
          </DataTableCaption>
        </DataTable>
      </div>
    </PageContainer>
  );
};
