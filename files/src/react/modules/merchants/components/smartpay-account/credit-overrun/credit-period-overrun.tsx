import * as React from 'react';
import {useDataTableState} from '../../../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../../merchants.queries';
import {getSPMCreditPeriodOverrun} from '../../../merchants.service';
import {
  DataTable,
  DataTableCaption,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  DataTableRow as Tr,
  DataTableCell as Td,
  Badge,
} from '@setel/portal-ui';

import {MerchantTypeCodes} from '../../../../../../shared/enums/merchant.enum';
import {useRouter} from '../../../../../routing/routing.context';
import {getSmartpayMerchantStatusBadgeColor} from '../../../merchants.lib';
import {QueryErrorAlert} from '../../../../../components/query-error-alert';

export const CreditPeriodOverrun = (props: {merchantId: string}) => {
  const router = useRouter();
  const {pagination, query} = useDataTableState({
    initialFilter: {},
    queryKey: `${merchantQueryKey.periodOverrunList}_${props.merchantId}`,
    queryFn: (pagingParam) => getSPMCreditPeriodOverrun(props.merchantId, pagingParam),
  });

  return (
    <>
      {query.error && !query.isLoading && <QueryErrorAlert error={query.error as any} />}
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
            <Td className="pl-7">Period</Td>
            <Td>Approval status</Td>
            <Td>Remarks</Td>
            <Td className="text-right pr-7">Created on</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {query.data &&
            query.data.items.map((periodOverrun, index) => (
              <Tr
                key={index}
                className="cursor-pointer"
                onClick={() =>
                  router.navigateByUrl(
                    `/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/merchant/${props.merchantId}/period-overrun/${periodOverrun.id}`,
                  )
                }>
                <Td className="pl-7">
                  {formatDate(periodOverrun.startDate, {formatType: 'dateOnly'})}
                  {' - '}
                  {formatDate(periodOverrun.endDate, {formatType: 'dateOnly'})}
                </Td>
                <Td>
                  <Badge
                    color={getSmartpayMerchantStatusBadgeColor(periodOverrun.status)}
                    className={'uppercase'}>
                    {periodOverrun.status}
                  </Badge>
                </Td>
                <Td>{periodOverrun.remark}</Td>
                <Td className="text-right pr-7">{formatDate(periodOverrun.createdAt)}</Td>
              </Tr>
            ))}
        </DataTableRowGroup>
        {query.data?.isEmpty && (
          <DataTableCaption>
            <div className="py-6">
              <p className="text-center text-gray-400 text-sm">No period found</p>
            </div>
          </DataTableCaption>
        )}
      </DataTable>
    </>
  );
};
