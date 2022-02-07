import {
  Badge,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  FilterControls,
  Filter,
  formatDate,
  PaginationNavigation,
  DataTableCaption,
} from '@setel/portal-ui';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {
  EApprovalRequestsFeature,
  EApprovalRequestsStatus,
  EFeatureTextPair,
  optFeatureFilter,
  optStatusFilter,
} from '../approval-requests.enum';
import {
  ApprovalRequestStatusColor,
  indicatorClassApprovalRequest,
} from './approval-requests-details';
import {useQueryParams} from 'src/react/routing/routing.context';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getApprovalRequests} from '../approval-requests.service';
import {Link} from 'src/react/routing/link';

interface IApprovalRequestProps {
  iActive: boolean;
}

interface FilterValue {
  status?: EApprovalRequestsStatus;
  feature?: EApprovalRequestsFeature;
  dateRange: [string, string];
}

const initialFilter: FilterValue = {
  status: null,
  feature: null,
  dateRange: ['', ''],
};

const computeFilterValues = ({
  dateRange: [dateFrom, dateTo],
  status,
  feature,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  return {
    ...filter,
    status,
    feature,
    dateFrom,
    dateTo,
  };
};

export const AllApprovalRequestsListing = (props: IApprovalRequestProps) => {
  const activated = useQueryParams();

  return activated ? <ApprovalRequestsList iActive={props.iActive} /> : null;
};

const ApprovalRequestsList = (props: IApprovalRequestProps) => {
  const {
    query: {data: data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'approvalRequests',
    queryFn: (currentValues) => getApprovalRequests(computeFilterValues(currentValues)),
    components: () => [
      {
        type: 'select',
        key: 'status',
        props: {
          label: 'Status',
          options: optStatusFilter,
          placeholder: 'Any statuses',
        },
      },
      {
        type: 'select',
        key: 'feature',
        props: {
          label: 'Feature',
          options: optFeatureFilter,
          placeholder: 'All features',
        },
      },
      {
        type: 'daterange',
        key: 'dateRange',
        props: {
          label: 'Last updated on',
          wrapperClass: 'sm:col-span-2',
        },
      },
    ],
  });
  React.useEffect(() => {
    if (!props.iActive) {
      filter[1].setValue('feature', null);
      filter[1].setValue('status', null);
      filter[1].setValue('dateRange', ['', '']);
    }
  }, [props.iActive]);

  return (
    <>
      <div className="grid gap-4">
        <FilterControls
          filter={filter}
          style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
          className={filter[0].applied.length ? '' : 'mb-4'}
        />
        <Filter filter={filter} />
        <DataTable
          striped
          pagination={
            <PaginationNavigation
              total={data?.totalDocs}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }
          isFetching={isFetching}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>FEATURE</Td>
              <Td>STATUS</Td>
              <Td>Requestor user ID</Td>
              <Td className="text-right">AMOUNT (RM)</Td>
              <Td className="text-right">LAST UPDATED ON</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {(data?.approvalRequests || []).map((item) => (
              <Tr
                key={item.id}
                render={(props) => (
                  <Link {...props} to={`/approvals/approval-requests/${item.id}`} target="_blank" />
                )}>
                <Td>{EFeatureTextPair[item.feature]}</Td>
                <Td>
                  <Badge
                    rounded="rounded"
                    color={ApprovalRequestStatusColor(item.status)}
                    className={`uppercase ${indicatorClassApprovalRequest(item.status)}`}>
                    {item.status}
                  </Badge>
                </Td>
                <Td>{item.createdByEmail}</Td>
                <Td className="text-right">{convertToSensitiveNumber(item?.amount)}</Td>
                <Td className="text-right">
                  {formatDate(item.updatedAt, {
                    formatType: 'dateAndTime',
                  })}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
          {data && !data?.approvalRequests.length && (
            <DataTableCaption>
              <div className="py-5">
                <div className="text-center py-5 text-md">
                  <p className="font-normal">You have no data to be displayed here</p>
                </div>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </div>
    </>
  );
};

export default AllApprovalRequestsListing;
