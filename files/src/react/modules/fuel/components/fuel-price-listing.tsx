import * as React from 'react';
import moment from 'moment';
import {
  classes,
  formatMoney,
  Text,
  DataTable as Table,
  DataTableRow as Tr,
  DataTableCell as Td,
  DataTableRowGroup,
  MiniAscendingIcon,
  MiniDescendingIcon,
  PaginationNavigation,
  PlusIcon,
  usePaginationState,
  Button,
  Indicator,
  Badge,
} from '@setel/portal-ui';
import cx from 'classnames';
import {useCurrentFuelPrice, useIndexFuelPrices} from '../fuel-price.queries';
import {
  CurrentPrices,
  CurrentFuelPrice,
  SitesFuelPriceSyncStatisticsResponse,
  IFuelType,
} from '../types';
import {FuelPriceFormModal} from './fuel-price-form-modal';
import {Link} from '../../../../react/routing/link';
import {formatFuelPrice} from '../../../lib/utils';
import {useFuelPriceSyncStatistic} from '../sites.queries';
import {FuelNamesFallBack} from '../fuel-price.const';

export const FuelPriceListing = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {data: currentFuelPriceData} = useCurrentFuelPrice();
  const {data: currentFuelPriceStatistics} = useFuelPriceSyncStatistic(currentFuelPriceData?.id);

  return (
    <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 my-8">
      <div className="flex justify-between">
        <h1 className={classes.h1}>Fuel Price</h1>
        <div>
          <Button variant="primary" leftIcon={<PlusIcon />} onClick={() => setVisibleModal(true)}>
            CREATE
          </Button>
        </div>
      </div>
      <div className={cx('mb-4')}>
        <CurrentFuelPrice
          fuelPrices={currentFuelPriceData?.prices ?? []}
          currentFuelPriceData={currentFuelPriceData}
          currentFuelPriceStatistics={currentFuelPriceStatistics}
        />
      </div>
      <FuelPriceList currentFuelPriceData={currentFuelPriceData?.prices ?? []} />
      <FuelPriceFormModal
        fuelNames={
          currentFuelPriceData?.prices &&
          currentFuelPriceData.prices.reduce((acc, curr) => {
            acc[curr.fuelType] = curr.shortName;
            return acc;
          }, FuelNamesFallBack)
        }
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </div>
  );
};

const CurrentFuelPriceSyncStatistics = ({
  image,
  text,
  count,
}: {
  image: string;
  text: string;
  count: number;
}) => {
  return (
    <div className={cx('flex', 'flex-row', 'm-1', 'place-items-center')}>
      <img src={image} className={cx('inline', 'h-6', 'm-1')} />
      <Text className={cx('text-base', 'text-gray-500', 'm-1')}>{text}</Text>
      <Text className="m-1">{count}</Text>
    </div>
  );
};

const CurrentFuelPrice = ({
  fuelPrices,
  currentFuelPriceData,
  currentFuelPriceStatistics,
}: {
  fuelPrices: CurrentPrices[];
  currentFuelPriceData: CurrentFuelPrice;
  currentFuelPriceStatistics: SitesFuelPriceSyncStatisticsResponse;
}) => {
  return (
    <div className="card rounded-lg">
      <div className={cx('flex', 'flex-col', 'grid', 'divide-y')}>
        <div className={cx('flex-auto', 'flex-col', 'ml-6', 'm-4')}>
          <div className={cx('flex', 'flex-row', 'justify-between')}>
            <Text className={cx('flex', classes.h2)}>Current fuel prices</Text>
            <div className={cx('flex', 'flex-row', 'justify-center')}>
              <CurrentFuelPriceSyncStatistics
                image={'assets/images/icons/not_received.svg'}
                text={'Not received'}
                count={currentFuelPriceStatistics?.notReceived ?? 0}
              />
              <CurrentFuelPriceSyncStatistics
                image={'assets/images/icons/received.svg'}
                text={'Received'}
                count={currentFuelPriceStatistics?.received ?? 0}
              />
              <CurrentFuelPriceSyncStatistics
                image={'assets/images/icons/applied.svg'}
                text={'Applied'}
                count={currentFuelPriceStatistics?.applied ?? 0}
              />
            </div>
          </div>
          <Text className={cx(classes.h4, 'text-gray-500', 'text-sm')}>
            {moment(currentFuelPriceData?.startDate).format('DD MMM YYYY')}
            {' - '}
            {moment(currentFuelPriceData?.endDate).format('DD MMM YYYY')}
          </Text>
        </div>
        <div className={cx('flex', 'grid', 'grid-flow-col', 'grid-rows-1', 'divide-x')}>
          {!!fuelPrices.length &&
            fuelPrices.map(({fuelType, diff, currentPrice, shortName}, idx) => (
              <CurrentFuelPriceDetail
                idx={idx}
                title={shortName}
                type={fuelType}
                priceDiff={diff}
                currentPrice={currentPrice}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

function PriceDiff({priceDiff}: {priceDiff: number}) {
  return (
    <div className="flex">
      {priceDiff !== 0 && (
        <Indicator
          color={isNegative(priceDiff) ? 'turquoise' : 'error'}
          icon={isNegative(priceDiff) ? <MiniAscendingIcon /> : <MiniDescendingIcon />}
          className={cx(' self-center')}
        />
      )}
      <p className={cx(getDiffColor(priceDiff), 'text-sm', 'm-1', 'self-center')}>
        {String(formatMoney(priceDiff)).replace('-', '')}
      </p>
    </div>
  );
}

const CurrentFuelPriceDetail = ({
  idx,
  title,
  type,
  currentPrice,
  priceDiff,
}: {
  idx: number;
  title: string;
  type: string;
  currentPrice: number;
  priceDiff: number;
}) => {
  const fuelColor = {
    [IFuelType.PRIMAX_95]: 'lemon-500',
    [IFuelType.PRIMAX_97]: 'turquoise-800',
    [IFuelType.DIESEL]: 'black',
    [IFuelType.EURO5]: 'brand-500',
  };

  return (
    <div key={idx}>
      <div className={cx('ml-2')}>
        <div className={cx('flex', 'flex-col', 'm-4')}>
          <div className={cx('flex', 'flex-row', 'place-items-center')}>
            <div
              className={cx('flex-none', 'rounded-full', 'w-4', 'h-4', `bg-${fuelColor[type]}`)}
            />
            <p
              className={cx('flex', 'flex-grow', 'm-1', 'text-mediumgrey', 'text-xs', 'uppercase')}>
              <strong>{title}</strong>
            </p>
          </div>
          <div className={cx('flex', 'flex-row', 'place-items-center')}>
            <div className={cx('flex-none', 'rounded-full', 'w-4', 'h-4')} />
            <div className={cx('flex', 'flex-col', 'm-1')}>
              <p className={cx('flex', 'flex-grow', 'text-base', 'font-medium')}>
                {formatMoney(currentPrice, 'RM')}
              </p>
              <PriceDiff priceDiff={priceDiff} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FuelPriceListRow = ({
  currentDate,
  fuelPriceId,
  startDate,
  endDate,
  prices,
}: {
  currentDate: Date;
  fuelPriceId: string;
  startDate: string;
  endDate: string;
  prices: {price: number}[];
}) => {
  const {data: currentFuelPriceSyncStatistics} = useFuelPriceSyncStatistic(fuelPriceId);
  return (
    <Tr
      key={fuelPriceId}
      render={(p) => <Link {...p} to={`/fuelling/fuel-price/${fuelPriceId}`} />}>
      <Td>
        <div className={cx('ml-2')}>
          <Text className={cx('text-left')}>
            {moment(startDate).format('DD MMM YYYY')}
            {' - '}
            {moment(endDate).format('DD MMM YYYY')}
          </Text>
          {moment(startDate).isAfter(currentDate) && (
            <Text className={cx('text-sm', 'text-gray-500')}>Upcoming fuel price</Text>
          )}
        </div>
      </Td>
      <Td className="text-center">
        <Badge color={'error'} className="ml-8">
          {currentFuelPriceSyncStatistics?.notReceived ?? 0}
        </Badge>
      </Td>
      <Td className="text-center">
        <Badge color={'warning'}>{currentFuelPriceSyncStatistics?.received ?? 0}</Badge>
      </Td>
      <Td className="text-center">
        <Badge color={'success'}>{currentFuelPriceSyncStatistics?.applied ?? 0}</Badge>
      </Td>
      <Td className="text-right">{formatFuelPrice(prices[0].price)}</Td>
      <Td className="text-right">{formatFuelPrice(prices[1].price)}</Td>
      <Td className="text-right">{formatFuelPrice(prices[2].price)}</Td>
      <Td className="text-right">{formatFuelPrice(prices[3].price)}</Td>
    </Tr>
  );
};

const FuelPriceList = ({currentFuelPriceData}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: fuelPriceList} = useIndexFuelPrices({page, perPage});

  if (!fuelPriceList) {
    return null;
  }

  const currentDate = new Date();

  return (
    <div className="card rounded-lg">
      <div className={cx('card-body')}>
        <div className={cx('ml-1')}>
          <Text className={classes.h2}>Fuel Prices</Text>
        </div>
      </div>
      <div className={cx('border')}>
        <Table>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="text-left">
                <div className={cx('ml-2')}>DATE RANGE</div>
              </Td>
              <Td className="text-right">NOT RECEIVED</Td>
              <Td className="text-right">RECEIVED</Td>
              <Td className="text-right">APPLIED</Td>
              {currentFuelPriceData.map(({fuelType, shortName}) => (
                <Td key={fuelType} className="text-right">
                  {shortName} (RM/L)
                </Td>
              ))}
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {fuelPriceList.items.map((item) => (
              <FuelPriceListRow
                currentDate={currentDate}
                fuelPriceId={item.id}
                startDate={item.startDate}
                endDate={item.endDate}
                prices={item.prices}
              />
            ))}
          </DataTableRowGroup>
        </Table>
      </div>
      <div className="card-body">
        <PaginationNavigation
          total={fuelPriceList.total}
          currentPage={page}
          perPage={perPage}
          onChangePage={setPage}
          onChangePageSize={setPerPage}
        />
      </div>
    </div>
  );
};

function isNegative(price: number): boolean {
  return `${price}`.startsWith('-');
}

function getDiffColor(price: number): string {
  if (price === 0) {
    return 'text-lightgrey';
  }
  if (isNegative(price)) {
    return 'text-success-500';
  }
  return 'text-error-500';
}
