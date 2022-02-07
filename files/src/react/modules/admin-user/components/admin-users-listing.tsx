import * as React from 'react';
import {
  Button,
  Card,
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  PlusIcon,
  usePaginationState,
} from '@setel/portal-ui';
import {useAdminUsers} from '../admin-users.queries';
import {Link} from '../../../routing/link';
import {AdminUserDetailsModal} from './admin-user-details-modal';

export const AdminUserListing = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const {data} = useAdminUsers({
    page,
    perPage,
  });

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Users</h1>
          <Button
            data-testid="btn-create"
            variant="primary"
            onClick={() => setVisibleModal(true)}
            leftIcon={<PlusIcon />}>
            CREATE
          </Button>
        </div>
        {data && (
          <>
            <div>
              <DataTable
                striped
                pagination={
                  !!data.users.length && (
                    <PaginationNavigation
                      total={data.totalDocs}
                      currentPage={page}
                      perPage={perPage}
                      onChangePage={setPage}
                      onChangePageSize={setPerPage}
                    />
                  )
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Name</Td>
                    <Td>Email</Td>
                    <Td>Access</Td>
                    <Td className="text-right">Created On</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {data.users.map((user) => (
                    <Tr
                      render={(props) => <Link {...props} to={`/admin-users/${user.id}`} />}
                      key={user.id}>
                      <Td className="break-all" data-testid="user-name">
                        {user.name}
                      </Td>
                      <Td className="break-all" data-testid="user-email">
                        {user.email}
                      </Td>
                      <Td
                        className="break-all"
                        data-testid="user-access"
                        style={{maxWidth: '246px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {user.accessNames}
                      </Td>
                      <Td className="text-right" data-testid="user-createAt">
                        {formatDate(user.createdAt, {
                          formatType: 'dateAndTime',
                        })}
                      </Td>
                    </Tr>
                  ))}
                </DataTableRowGroup>
              </DataTable>
              {!data.users.length && (
                <Card className="w-full flex items-center justify-center py-12">
                  No users found
                </Card>
              )}
            </div>
          </>
        )}
      </div>
      <AdminUserDetailsModal
        visible={visibleModal}
        onClose={() => {
          setVisibleModal(false);
        }}
      />
    </>
  );
};
