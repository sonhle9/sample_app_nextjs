import React, {useState} from 'react';
import {
  Button,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as TrGroup,
  formatDate,
  Skeleton,
} from '@setel/portal-ui';

import cx from 'classnames';
import {PageContainer} from 'src/react/components/page-container';
import {usePayoutProjection} from '../../treasury-reports.queries';
import {PayoutProjectionCalculateModal} from './payout-projection-calculate-modal';
import {getConsecutiveOffDays} from 'src/react/services/api-processor.service';

export const PayoutProjection = () => {
  const [visibleCalculateModal, setVisibleCalculateModal] = useState(false);
  const {data: payouts, isLoading} = usePayoutProjection();
  return (
    <PageContainer heading="Payout Projection">
      <Table data-testid="settlement-summaries-details-table" striped responsive>
        <TrGroup groupType="thead">
          <Tr className="text-center">
            <Td className="sm:pl-7"></Td>
            {payouts &&
              payouts.map((payout, index) => (
                <Td
                  className={cx(
                    'text-left',
                    payout.isReference ? 'bg-brand-100 bg-opacity-20' : '',
                  )}
                  key={index}>
                  {isLoading ? <Skeleton /> : payout.preText}
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <p className="whitespace-nowrap">
                      {formatDate(payout.transactionDate, {format: 'dd MMM yyyy'})}
                    </p>
                  )}
                  {payout.isReference && (
                    <Button
                      variant="primary"
                      className="mt-2 uppercase"
                      onClick={() => setVisibleCalculateModal(true)}>
                      Calculate
                    </Button>
                  )}
                </Td>
              ))}
          </Tr>
        </TrGroup>
        <TrGroup>
          <Tr>
            <Td className="whitespace-nowrap capitalize">Total amount</Td>
            {payouts &&
              payouts.map((payout, index) => (
                <Td
                  key={index}
                  className={cx(
                    'align-middle text-left',
                    payout.isReference ? 'bg-brand-100 bg-opacity-20' : '',
                  )}>
                  {isLoading ? <Skeleton /> : payout.totalAmount}
                </Td>
              ))}
          </Tr>
        </TrGroup>
        <TrGroup>
          <Tr>
            <Td className="whitespace-nowrap capitalize">Total free</Td>
            {payouts &&
              payouts.map((payout, index) => (
                <Td
                  key={index}
                  className={cx(
                    'align-middle text-left',
                    payout.isReference ? 'bg-brand-100 bg-opacity-20' : '',
                  )}>
                  {isLoading ? <Skeleton /> : payout.totalFees}
                </Td>
              ))}
          </Tr>
        </TrGroup>
        <TrGroup>
          <Tr>
            <Td className="whitespace-nowrap capitalize">Public holiday</Td>
            {payouts &&
              payouts.map((payout, index) => (
                <Td
                  key={index}
                  className={cx(
                    'align-middle text-left',
                    payout.isReference ? 'bg-brand-100 bg-opacity-20' : '',
                  )}>
                  {isLoading ? <Skeleton /> : payout.isHoliday ? 'Yes' : ''}
                </Td>
              ))}
          </Tr>
        </TrGroup>
        <TrGroup>
          <Tr>
            <Td>Weekend</Td>
            {payouts &&
              payouts.map((payout, index) => (
                <Td
                  key={index}
                  className={cx(
                    'align-middle text-left',
                    payout.isReference ? 'bg-brand-100 bg-opacity-20' : '',
                  )}>
                  {isLoading ? <Skeleton /> : payout.isWeekend ? 'Yes' : ''}
                </Td>
              ))}
          </Tr>
        </TrGroup>
      </Table>
      {visibleCalculateModal && (
        <PayoutProjectionCalculateModal
          consecutiveOffDays={getConsecutiveOffDays(payouts)}
          onClose={() => setVisibleCalculateModal(false)}
        />
      )}
    </PageContainer>
  );
};
