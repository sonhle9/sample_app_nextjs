import {
  Badge,
  Card,
  CardHeading,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DescList,
  DescItem,
  formatDate,
  usePaginationState,
  PaginationNavigation,
} from '@setel/portal-ui';
import * as React from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {adminCircles} from 'src/shared/helpers/roles.type';
import {CircleMemberStatus} from 'src/shared/enums/circle.enum';
import {useGetSetelShareHistory} from '../../customers.queries';
import {Link} from 'src/react/routing/link';
import {
  circlePaymentMethodIconMap,
  circleMemberStatusColorMap,
  circleStatusColorMap,
  circlePaymentMethodStringMap,
} from 'src/react/modules/setelshare/setelshare.const';

export const CustomerSetelShare = ({userId}: {userId: string}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {
    isError: isHistoryRequestError,
    isLoading: isHistoryRequestLoading,
    data: historyRecords,
  } = useGetSetelShareHistory(userId, {page, perPage});

  return (
    <HasPermission accessWith={[adminCircles.adminCircleViewHistory]}>
      <Card
        data-testid="customer-auto-top-up-card"
        className="mb-8"
        expandable
        isOpen={isCardExpand}
        isLoading={isHistoryRequestLoading}
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <CardHeading title="Setel Share" />
        <Table
          native
          pagination={
            !!historyRecords?.items.length && (
              <PaginationNavigation
                total={historyRecords.totalDocs}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="pl-7">SETEL SHARE ID</Td>
              <Td>SETEL SHARE STATUS</Td>
              <Td>ROLE</Td>
              <Td>MEMBER STATUS</Td>
              <Td className="text-right">DELETED</Td>
            </Tr>
          </DataTableRowGroup>
          {!historyRecords?.items.length || isHistoryRequestError ? (
            <EmptyDataTableCaption />
          ) : (
            <DataTableRowGroup groupType="tbody">
              {historyRecords &&
                historyRecords.items.map((row) => (
                  <ExpandGroup key={row.circleId}>
                    <Tr>
                      <Td className="pl-7">
                        <ExpandButton data-testid="expand-button" />
                        <Link className="inline" to={`/circles/circles/${row.circleId}`}>
                          {row.circleId}
                        </Link>
                      </Td>
                      <Td className="uppercase">
                        <Badge color={circleStatusColorMap[row.status] || 'grey'}>
                          {row.status}
                        </Badge>
                      </Td>
                      <Td className="capitalize">{row.role}</Td>

                      <Td className="uppercase">
                        {row.memberStatus &&
                        [
                          CircleMemberStatus.JOINED,
                          CircleMemberStatus.INVITED,
                          CircleMemberStatus.REMOVED,
                        ].includes(row.memberStatus) ? (
                          <Badge color={circleMemberStatusColorMap[row.memberStatus] || 'grey'}>
                            {row.memberStatus}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </Td>
                      <Td className="text-right">{row.isDeleted ? 'Yes' : 'No'}</Td>
                    </Tr>
                    <ExpandableRow>
                      <DescList>
                        <DescItem
                          label="Payment method"
                          value={
                            <>
                              <div className="h-8 flex">
                                <img
                                  className="inline h-full w-auto"
                                  height="32"
                                  src={circlePaymentMethodIconMap[row.paymentMethod.type]}
                                  alt={row.paymentMethod.type}
                                />
                                <div className="flex flex-row mx-2 py-2">
                                  {circlePaymentMethodStringMap[row.paymentMethod.type]}
                                </div>
                              </div>
                            </>
                          }
                        />
                        <DescItem label="Created on" value={formatDate(row.createdAt)} />
                      </DescList>
                    </ExpandableRow>
                  </ExpandGroup>
                ))}
            </DataTableRowGroup>
          )}
        </Table>
      </Card>
    </HasPermission>
  );
};
