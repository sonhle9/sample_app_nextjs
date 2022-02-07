import moment from 'moment';
import {rest} from 'msw';
import {IPayoutProjection} from 'src/app/ledger/ledger.interface';
import {environment} from 'src/environments/environment';
import {createFixResponseHandler} from 'src/react/lib/mock-helper';

const mockProjections = ((): IPayoutProjection[] => {
  const result: IPayoutProjection[] = [];
  const baseDate = moment().utc().add(moment().utcOffset(), 'm').startOf('day');

  for (let i = -7; i < 10; i++) {
    const date = baseDate.clone().add(i, 'days');
    result.push({
      transactionDate: date.toISOString(),
      dayOfWeek: date.isoWeekday(),
      totalAmount: (Math.random() * 1000).toFixed(2),
      totalFees: (Math.random() * 1000).toFixed(2),
      isWeekend: date.isoWeekday() === 6 || date.isoWeekday() === 7,
      isHoliday: false,
      isReference: i === 0,
    });
  }

  return result;
})();

const BASE_URL = `${environment.processorApiBaseUrl}/api/processor`;

export const handlers = [
  rest.get(`${BASE_URL}/admin/payouts/projection`, createFixResponseHandler(mockProjections)),
  rest.get(
    `${BASE_URL}/admin/payouts/max`,
    createFixResponseHandler({transactionDate: '2021-01-07T00:00:00.000Z', totalAmount: '1607.88'}),
  ),
];
