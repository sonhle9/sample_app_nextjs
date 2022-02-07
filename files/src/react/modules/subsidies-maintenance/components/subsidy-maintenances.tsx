import * as React from 'react';
import {
  Badge,
  Button,
  CardHeading,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PlusIcon,
  usePaginationState,
  DataTableCaption,
  PaginationNavigation,
  formatDate,
  TabButtonGroup,
  Card,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {
  useSubsidyCostRecoveryRate,
  useSubsidyMaintenanceOverview,
  useSubsidyPrices,
} from '../subsidy-maintenance.queries';
import {
  mappingSubsidyStatusColor,
  SubsidyActionType,
  SubsidyCostRecoveryRate,
  SubsidyCostRecoveryRateTypes,
  SubsidyPrice,
  SubsidyPriceTypes,
} from '../subsidy-maintenance.types';
import {useMalaysiaTime} from '../../billing-invoices/billing-invoices.helpers';
import {PageContainer} from '../../../components/page-container';
import moment from 'moment';
import {SubsidyCreateForm} from './subsidy-create-form';
import {formatMoney} from '@setel/web-utils';
import {subsidyMaintenanceRole} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';

export const OverviewSubsidy = ({...props}) => {
  const {data, isLoading, error} = useSubsidyMaintenanceOverview();
  return (
    <div className={props.className}>
      <Card>
        <Card.Heading title="Overview" />
        <Card.Content className="flex p-0">
          {isLoading && <p title="Loading..." />}
          {error && <QueryErrorAlert error={error as any} />}
          {data &&
            data.map((item) => (
              <div key={item.title} className="border-r pu-border-gray-300 pu-py-7 pu-px-6 w-1/5">
                <p className="pu-text-mediumgrey text-xs font-normal">{item.title}</p>
                <p className="pu-font-medium pu-text-gray-900 pu-my-1">
                  RM {formatMoney(item.amount, {decimalPlaces: 4})}
                </p>
                <p className="text-lightgrey text-xs font-normal">
                  {item.startDate ? `Since ${moment(item.startDate).format('DD/MM/YYYY')}` : '-'}
                </p>
              </div>
            ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export const PaginatedPrices = ({...props}) => {
  const paginationState = usePaginationState({initialPerPage: 10});
  const [areaType, setAreaType] = React.useState(SubsidyPriceTypes[0]);
  const [subsidyFormType, setSubsidyFormType] = React.useState<SubsidyActionType>();
  const {data, isLoading, isFetching, error} = useSubsidyPrices({
    page: paginationState.page,
    perPage: paginationState.perPage,
    area: areaType,
  });

  const isEmpty = !isLoading && data?.isEmpty;

  return (
    <div className={props.className}>
      {error && <QueryErrorAlert error={error as any} />}
      <DataTable
        isLoading={isLoading}
        isFetching={isFetching}
        preContent={
          <TabButtonGroup
            value={areaType}
            onChangeValue={(value) => {
              paginationState.setPage(1);
              paginationState.setPerPage(10);
              setAreaType(value);
            }}
            options={SubsidyPriceTypes.map((price) => {
              return {label: price, value: price};
            })}
            className="px-3 sm:px-6 py-3"
          />
        }
        pagination={
          <PaginationNavigation
            pageSizeOptions={[10, 50, 100]}
            total={data?.total}
            hideIfSinglePage={data?.total < 10}
            perPage={paginationState.perPage}
            currentPage={paginationState.page}
            onChangePage={paginationState.setPage}
            onChangePageSize={paginationState.setPerPage}
            isFetching={isFetching}
          />
        }
        heading={
          <CardHeading title="Subsidy prices">
            {!isEmpty && (
              <HasPermission accessWith={[subsidyMaintenanceRole.modify]}>
                <Button
                  onClick={() => setSubsidyFormType(SubsidyActionType.subsidy_price)}
                  variant="primary"
                  minWidth="none"
                  leftIcon={<PlusIcon />}>
                  CREATE
                </Button>
              </HasPermission>
            )}
          </CardHeading>
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td className="text-right w-1/5">Subsidy price (RM)</Td>
            <Td className="w-5/12">Status</Td>
            <Td className="w-1/6">Start date</Td>
            <Td className="text-right">End date</Td>
          </Tr>
        </DataTableRowGroup>
        {isEmpty && (
          <DataTableCaption className="py-9">
            <p className="text-center text-sm">You have no data to be displayed here</p>
            <HasPermission accessWith={[subsidyMaintenanceRole.modify]}>
              <div className={'flex flex-col items-center mt-6'}>
                <Button
                  onClick={() => setSubsidyFormType(SubsidyActionType.subsidy_price)}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<PlusIcon />}>
                  CREATE SUBSIDY PRICE
                </Button>
              </div>
            </HasPermission>
          </DataTableCaption>
        )}
        {!isEmpty && (
          <DataTableRowGroup>
            {data?.prices.map((subsidyPrice: SubsidyPrice, index: number) => (
              <Tr data-testid="subsidy-plan-element" key={index} className="cursor-pointer">
                <Td className="text-right">
                  {formatMoney(subsidyPrice.price, {decimalPlaces: 4})}
                </Td>
                <Td>
                  <Badge color={mappingSubsidyStatusColor[subsidyPrice.status]}>
                    {subsidyPrice.status}
                  </Badge>
                </Td>
                <Td>
                  {formatDate(useMalaysiaTime(subsidyPrice.startDate), {
                    formatType: 'dateOnly',
                  })}
                </Td>
                <Td className="text-right">
                  {subsidyPrice.endDate
                    ? formatDate(useMalaysiaTime(subsidyPrice.endDate), {
                        formatType: 'dateOnly',
                      })
                    : '-'}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
      {subsidyFormType && (
        <SubsidyCreateForm
          type={SubsidyActionType.subsidy_price}
          currentTime={data.currentTime}
          onClose={() => setSubsidyFormType(undefined)}
        />
      )}
    </div>
  );
};

export const PaginatedCostRecoveryRates = ({...props}) => {
  const paginationState = usePaginationState({initialPerPage: 10});
  const [costRecoveryRateType, setCostRecoveryRateType] = React.useState(
    SubsidyCostRecoveryRateTypes[0],
  );
  const [subsidyFormType, setSubsidyFormType] = React.useState<SubsidyActionType>();
  const {data, isLoading, isFetching, error} = useSubsidyCostRecoveryRate({
    page: paginationState.page,
    perPage: paginationState.perPage,
    type: costRecoveryRateType,
  });

  const isEmpty = !isLoading && data?.isEmpty;

  return (
    <div className={props.className}>
      {error && <QueryErrorAlert error={error as any} />}
      <DataTable
        isLoading={isLoading}
        isFetching={isFetching}
        preContent={
          <TabButtonGroup
            value={costRecoveryRateType}
            onChangeValue={(value) => {
              paginationState.setPage(1);
              paginationState.setPerPage(10);
              setCostRecoveryRateType(value);
            }}
            options={SubsidyCostRecoveryRateTypes.map((price) => {
              return {label: price, value: price};
            })}
            className="px-3 sm:px-6 py-3"
          />
        }
        pagination={
          <PaginationNavigation
            pageSizeOptions={[10, 50, 100]}
            total={data?.total}
            hideIfSinglePage={data?.total < 10}
            perPage={paginationState.perPage}
            currentPage={paginationState.page}
            onChangePage={paginationState.setPage}
            onChangePageSize={paginationState.setPerPage}
            isFetching={isFetching}
          />
        }
        heading={
          <CardHeading title="Cost recovery rates">
            {!isEmpty && (
              <HasPermission accessWith={[subsidyMaintenanceRole.modify]}>
                <Button
                  onClick={() => setSubsidyFormType(SubsidyActionType.cost_recovery_rate)}
                  variant="primary"
                  minWidth="none"
                  leftIcon={<PlusIcon />}>
                  CREATE
                </Button>
              </HasPermission>
            )}
          </CardHeading>
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td className="text-right w-1/5">Cost recovery rate (RM)</Td>
            <Td className="w-5/12">Status</Td>
            <Td className="w-1/6">Start date</Td>
            <Td className="text-right">End date</Td>
          </Tr>
        </DataTableRowGroup>
        {isEmpty && (
          <DataTableCaption className="py-9">
            <p className="text-center text-sm">You have no data to be displayed here</p>
            <div className={'flex flex-col items-center mt-6'}>
              <HasPermission accessWith={[subsidyMaintenanceRole.modify]}>
                <Button
                  onClick={() => setSubsidyFormType(SubsidyActionType.cost_recovery_rate)}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<PlusIcon />}>
                  CREATE COST RECOVERY RATE
                </Button>
              </HasPermission>
            </div>
          </DataTableCaption>
        )}
        {!isEmpty && (
          <DataTableRowGroup>
            {data?.costRecoveryRates.map(
              (subsidyCostRecoveryRate: SubsidyCostRecoveryRate, index: number) => (
                <Tr data-testid="subsidy-plan-element" key={index} className="cursor-pointer">
                  <Td className="text-right">
                    {formatMoney(subsidyCostRecoveryRate.rate, {decimalPlaces: 4})}
                  </Td>
                  <Td>
                    <Badge color={mappingSubsidyStatusColor[subsidyCostRecoveryRate.status]}>
                      {subsidyCostRecoveryRate.status}
                    </Badge>
                  </Td>
                  <Td>
                    {formatDate(useMalaysiaTime(subsidyCostRecoveryRate.startDate), {
                      formatType: 'dateOnly',
                    })}
                  </Td>
                  <Td className="text-right">
                    {subsidyCostRecoveryRate.endDate
                      ? formatDate(useMalaysiaTime(subsidyCostRecoveryRate.endDate), {
                          formatType: 'dateOnly',
                        })
                      : '-'}
                  </Td>
                </Tr>
              ),
            )}
          </DataTableRowGroup>
        )}
      </DataTable>
      {subsidyFormType && (
        <SubsidyCreateForm
          type={SubsidyActionType.cost_recovery_rate}
          currentTime={data.currentTime}
          onClose={() => setSubsidyFormType(undefined)}
        />
      )}
    </div>
  );
};

export const SubsidyMaintenances = () => {
  return (
    <PageContainer className={'pt-8 sm:px-5'}>
      <div className="flex justify-between items-center flex-wrap mb-5">
        <h1 className="pu-text-2xl pu-font-medium pu-leading-8">Subsidy maintenance</h1>
      </div>
      <OverviewSubsidy className="mt-5" />
      <PaginatedPrices className="mt-8" />
      <PaginatedCostRecoveryRates className="mt-8" />
    </PageContainer>
  );
};
