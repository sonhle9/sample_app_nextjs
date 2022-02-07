import * as React from 'react';
import {
  classes,
  Card,
  CardHeading,
  CardContent,
  EditIcon,
  JsonPanel,
  formatDate,
  Button,
  DataTable,
  PaginationNavigation,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  Badge,
  DataTableCaption,
  TabButtonGroup,
  formatMoney,
} from '@setel/portal-ui';
import cx from 'classnames';

import {useCurrentFuelPrice, useGetFuelPriceById} from '../fuel-price.queries';
import {FuelPriceFormModal} from './fuel-price-form-modal';
import {formatFuelPrice} from '../../../lib/utils';
import {FuelPriceSyncStatus, SitesFuelPriceSyncStatisticsResponse} from '../types';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getSites} from '../sites.service';
import {useFuelPriceSyncStatistic} from '../sites.queries';
import {FuelNamesFallBack} from '../fuel-price.const';

const fuelPriceSyncStatusToTabName = (status: FuelPriceSyncStatus) => {
  switch (status) {
    case FuelPriceSyncStatus.ALL: {
      return 'All';
    }
    case FuelPriceSyncStatus.NOT_RECEIVED: {
      return 'Not received';
    }
    case FuelPriceSyncStatus.RECEIVED: {
      return 'Received';
    }
    case FuelPriceSyncStatus.APPLIED: {
      return 'Applied';
    }
    default: {
      return '-';
    }
  }
};

const FUEL_PRICE_SYNC_STATUSES = Object.values(FuelPriceSyncStatus);

export function FuelPriceSyncRow(site: {
  siteId: string;
  name: string;
  received?: Date;
  applied?: Date;
}) {
  return (
    <Tr>
      <Td>{site.name}</Td>
      <Td>
        {site.applied ? (
          <Badge color={'success'}>APPLIED</Badge>
        ) : site.received ? (
          <Badge color={'warning'}>RECEIVED</Badge>
        ) : (
          <Badge color={'error'}>NOT RECEIVED</Badge>
        )}
      </Td>
      <Td>{site.received ? formatDate(site.received) : '-'}</Td>
      <Td className="text-right">{site.applied ? formatDate(site.applied) : '-'}</Td>
    </Tr>
  );
}

export const FuelPriceDetails = ({fuelPriceId}: {fuelPriceId: string}) => {
  const {data: fuelPrice} = useGetFuelPriceById(fuelPriceId);
  const {data: currentFuelPriceData} = useCurrentFuelPrice();
  const {
    pagination: {page, perPage, setPage, setPerPage},
    filter,
    query: {data: sites, isLoading: sitesLoading, isFetching: sitesFetching},
  } = useDataTableState({
    initialFilter: {
      keyWord: '',
      status: FuelPriceSyncStatus.ALL,
    },
    queryKey: 'get_sites',
    queryFn: ({keyWord, page, perPage, status}) =>
      getSites({
        fuelPriceId,
        keyWord,
        page,
        perPage,
        status,
      }),
    components: [
      {
        key: 'keyWord',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search site name',
          wrapperClass: 'min-w-full',
          layout: 'vertical',
        },
      },
    ],
    keepPreviousData: true,
  });
  const [filterState, filterActions] = filter;
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {data: currentFuelPriceSyncStatistics} = useFuelPriceSyncStatistic(fuelPriceId);

  if (!fuelPrice) {
    return null;
  }

  const fuelNames =
    currentFuelPriceData?.prices &&
    currentFuelPriceData.prices.reduce((acc, curr) => {
      acc[curr.fuelType] = curr.shortName;
      return acc;
    }, FuelNamesFallBack);

  return (
    <React.Fragment>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 my-8">
        <div className="flex justify-between">
          <h1 className={`${classes.h1} text-darkgrey`}>Fuel price details</h1>
        </div>

        <div className={cx('mb-4')}>
          <Card>
            <CardHeading title="Details">
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                onClick={() => setVisibleModal(true)}
                minWidth="none">
                EDIT
              </Button>
            </CardHeading>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-mediumgrey">
                  <p>{'Start & end date'}</p>
                </div>
                <div className="col-span-3">
                  <p>
                    {formatDate(fuelPrice.startDate, {formatType: 'dateOnly'})}
                    {' - '}
                    {formatDate(fuelPrice.endDate, {formatType: 'dateOnly'})}
                  </p>
                </div>
                <div className="col-span-1 text-mediumgrey">
                  <p>{fuelNames?.PRIMAX_95}</p>
                </div>
                <div className="col-span-3">
                  <p>{formatMoney(formatFuelPrice(fuelPrice.prices[0].price), 'RM')}</p>
                </div>
                <div className="col-span-1 text-mediumgrey">
                  <p>{fuelNames?.PRIMAX_97}</p>
                </div>
                <div className="col-span-3">
                  <p>{formatMoney(formatFuelPrice(fuelPrice.prices[1].price), 'RM')}</p>
                </div>
                <div className="col-span-1 text-mediumgrey">
                  <p>{fuelNames?.DIESEL}</p>
                </div>
                <div className="col-span-3">
                  <p>{formatMoney(formatFuelPrice(fuelPrice.prices[2].price), 'RM')}</p>
                </div>
                <div className="col-span-1 text-mediumgrey">
                  <p>{fuelNames?.EURO5}</p>
                </div>
                <div className="col-span-3">
                  <p>{formatMoney(formatFuelPrice(fuelPrice.prices[3].price), 'RM')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={cx('mb-4')}>
          <Card>
            <CardHeading title="Sites" />
            <div className={cx('flex', 'flex-col', 'divide-x')}>
              <DataTable
                isLoading={sitesLoading}
                isFetching={sitesFetching}
                filter={filter}
                preContent={
                  <TabButtonGroup
                    value={filterState.values.status}
                    onChangeValue={filterActions.setValueCurry('status')}
                    options={FUEL_PRICE_SYNC_STATUSES.map((tab) => ({
                      label: fuelPriceSyncStatusToTabName(tab),
                      value: tab,
                      badge: mapToTotalCount(tab, currentFuelPriceSyncStatistics) ?? 0,
                    }))}
                    className="px-3 sm:px-6 py-3"
                  />
                }
                pagination={
                  <PaginationNavigation
                    currentPage={page}
                    perPage={perPage}
                    onChangePage={setPage}
                    onChangePageSize={setPerPage}
                    total={sites?.totalDocs ?? 0}
                  />
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>{'Site Name'}</Td>
                    <Td>{'Status'}</Td>
                    <Td>{'Received Date & Time'}</Td>
                    <Td className={cx('text-right')}>{'Applied Date & Time'}</Td>
                  </Tr>
                </DataTableRowGroup>
                {!sitesLoading && sites?.docs?.length === 0 && (
                  <DataTableCaption>
                    <div className="py-5">
                      <p className="text-center text-sm">No records found</p>
                    </div>
                  </DataTableCaption>
                )}
                <DataTableRowGroup groupType="tbody">
                  {sites?.docs?.map((site, idx) => (
                    <FuelPriceSyncRow
                      key={idx}
                      siteId={site.siteId}
                      name={site.name}
                      received={site.receivedAt}
                      applied={site.appliedAt}
                    />
                  ))}
                </DataTableRowGroup>
              </DataTable>
            </div>
          </Card>
        </div>

        <JsonPanel allowToggleFormat={true} json={fuelPrice as any} defaultOpen />
      </div>
      <FuelPriceFormModal
        fuelNames={fuelNames}
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        data={fuelPrice}
      />
    </React.Fragment>
  );
};

const mapToTotalCount = (
  tab: FuelPriceSyncStatus,
  statistics: SitesFuelPriceSyncStatisticsResponse,
): number | undefined => {
  switch (tab) {
    case FuelPriceSyncStatus.NOT_RECEIVED:
      return statistics?.notReceived;
    case FuelPriceSyncStatus.RECEIVED:
      return statistics?.received;
    case FuelPriceSyncStatus.APPLIED:
      return statistics?.applied;
    case FuelPriceSyncStatus.ALL:
      return statistics?.all;
    default:
      return 0;
  }
};
