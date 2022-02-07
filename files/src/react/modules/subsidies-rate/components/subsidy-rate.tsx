import * as React from 'react';
import {
  CardHeading,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  usePaginationState,
  DataTableCaption,
  PaginationNavigation,
  formatDate,
  TabButtonGroup,
  Card,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useSubsidyRateOverview, useSubsidyRates} from '../subsidy-rate.queries';
import {SubsidyRate} from '../subsidy-rate.types';
import {useMalaysiaTime} from '../../billing-invoices/billing-invoices.helpers';
import {PageContainer} from '../../../components/page-container';
import moment from 'moment';
import {formatMoney} from '@setel/web-utils';
import {
  SubsidyCostRecoveryRateTypes,
  SubsidyPriceTypes,
} from '../../subsidies-maintenance/subsidy-maintenance.types';

export const OverviewSubsidy = ({...props}) => {
  const {data, isLoading, error} = useSubsidyRateOverview();
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

export const PaginatedRates = (props: {
  subsidyRateOptions: string[];
  className: string;
  type: string;
}) => {
  const paginationState = usePaginationState({initialPerPage: 10});
  const [areaType, setAreaType] = React.useState(props.subsidyRateOptions[0]);
  const {data, isLoading, isFetching, error} = useSubsidyRates({
    page: paginationState.page,
    perPage: paginationState.perPage,
    type: areaType,
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
            options={props.subsidyRateOptions.map((price) => {
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
        heading={<CardHeading title={`${props.type}s`} />}>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td className="text-right w-1/5">{props.type} (RM)</Td>
            <Td className="w-1/2">Start date</Td>
            <Td className="text-right">End date</Td>
          </Tr>
        </DataTableRowGroup>
        {isEmpty && (
          <DataTableCaption className="py-9">
            <p className="text-center text-sm">You have no data to be displayed here</p>
          </DataTableCaption>
        )}
        {!isEmpty && (
          <DataTableRowGroup>
            {data?.rates.map((subsidyRate: SubsidyRate, index: number) => (
              <Tr data-testid="subsidy-plan-element" key={index} className="cursor-pointer">
                <Td className="text-right">{formatMoney(subsidyRate.rate, {decimalPlaces: 4})}</Td>
                <Td>
                  {formatDate(useMalaysiaTime(subsidyRate.startDate), {
                    formatType: 'dateOnly',
                  })}
                </Td>
                <Td className="text-right">
                  {subsidyRate.endDate
                    ? formatDate(useMalaysiaTime(subsidyRate.endDate), {
                        formatType: 'dateOnly',
                      })
                    : '-'}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};

export const SubsidyRates = () => {
  return (
    <PageContainer className={'pt-8 sm:px-5'}>
      <div className="flex justify-between items-center flex-wrap mb-5">
        <h1 className="pu-text-2xl pu-font-medium pu-leading-8">Subsidy rates</h1>
      </div>
      <OverviewSubsidy className="mt-5" />
      <PaginatedRates className="mt-8" subsidyRateOptions={SubsidyPriceTypes} type="Subsidy rate" />
      <PaginatedRates
        className="mt-8"
        subsidyRateOptions={SubsidyCostRecoveryRateTypes}
        type="Cost recovery rate"
      />
    </PageContainer>
  );
};
