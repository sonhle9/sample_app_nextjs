import {
  Badge,
  Button,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
} from '@setel/portal-ui';
import * as React from 'react';
import ApproverDetailsModal from './approver-details-modal';
import {useQueryParams} from 'src/react/routing/routing.context';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getApprovers} from '../approvers.service';
import {Link} from 'src/react/routing/link';
import {HasPermission} from '../../auth/HasPermission';
import {approverRole} from 'src/shared/helpers/pdb.roles.type';

function convertToSensitiveNumber(num: number) {
  if (!num) {
    return '0.00';
  }
  return '' + new Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(num);
}

export const ApproverListing = () => {
  const activated = useQueryParams();

  return activated ? <ApproverList /> : null;
};

const initialFilter = {};

const ApproverList: React.VFC = () => {
  const {
    query: {data: data, isFetching},
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'approvers',
    queryFn: (currentValues) => getApprovers(currentValues),
    components: () => [],
  });

  const [createModal, setCreateModal] = React.useState(false);

  return (
    <>
      <HasPermission accessWith={[approverRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 mb-15">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approvers</h1>
            <HasPermission accessWith={[approverRole.create]}>
              <Button variant="primary" onClick={() => setCreateModal(true)}>
                + CREATE
              </Button>
            </HasPermission>
          </div>
          <>
            <div>
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
                    <Td>USER ID</Td>
                    {/* <Td>USER NAME</Td> */}
                    <Td className="text-right">APPROVAL LIMIT (RM)</Td>
                    <Td>STATUS</Td>
                    <Td className="text-right">CREATED ON</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {(data?.approvers || []).map((item) => (
                    <Tr
                      key={item.id}
                      render={(props) => (
                        <Link {...props} to={`/approvals/approvers/${item.id}`} />
                      )}>
                      <Td>{item.userEmail}</Td>
                      {/* {item.userName}</Td> */}
                      <Td className="text-right">{convertToSensitiveNumber(item.approvalLimit)}</Td>
                      <Td>
                        <Badge
                          color={item.status === 'active' ? 'success' : 'grey'}
                          rounded="rounded"
                          className="uppercase">
                          {item.status}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        {formatDate(item.createdAt, {
                          formatType: 'dateAndTime',
                        })}
                      </Td>
                    </Tr>
                  ))}
                </DataTableRowGroup>
                {data && !data?.approvers.length && (
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
        </div>
      </HasPermission>

      {createModal && (
        <ApproverDetailsModal visible={createModal} onClose={() => setCreateModal(false)} />
      )}
    </>
  );
};

export default ApproverListing;
