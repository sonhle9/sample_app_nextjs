import {
  Alert,
  Card,
  CardContent,
  classes,
  DataTable,
  DataTableRowGroup,
  FieldContainer,
  SearchTextInput,
  PaginationNavigation,
  TextEllipsis,
  usePaginationState,
} from '@setel/portal-ui';
import {useState} from 'react';
import {DataTableRow as Tr} from '@setel/portal-ui';
import {DataTableCell as Td} from '@setel/portal-ui';
import {Link} from '../../../routing/link';
import * as React from 'react';
import {filterMerchantName} from '../merchant-users.service';
import {useMerchantUsers} from '../merchant-users.queries';
export const MerchantUserListing = () => {
  const [filterText, setFilterText] = useState('');
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, isFetching, isError} = useMerchantUsers({
    page,
    perPage,
    sortDate: 'desc',
    name: filterText.trim() !== '' ? filterText.trim() : undefined,
    email: filterText.trim() !== '' ? filterText.trim() : undefined,
  });

  const isEmptyMerchantUserList = !data || !data.items || data?.items?.length === 0;
  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Merchant users</h1>
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        {!isError && (
          <>
            <Card className="mb-3 grid grid-cols-2 gap-4">
              <CardContent className="mt-3">
                <FieldContainer label="Search">
                  <SearchTextInput
                    placeholder={'Search by name/email'}
                    value={filterText}
                    onChangeValue={(val: string) => {
                      setFilterText(val);
                      setPage(1);
                    }}
                  />
                </FieldContainer>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <DataTable
                isLoading={isFetching}
                striped
                pagination={
                  <PaginationNavigation
                    total={data && data.total}
                    currentPage={page}
                    perPage={perPage}
                    onChangePage={setPage}
                    onChangePageSize={setPerPage}
                  />
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Name</Td>
                    <Td>Email</Td>
                    <Td className="w-1/7">Access Level</Td>
                    <Td>Merchant</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {!isFetching &&
                    !isError &&
                    !isEmptyMerchantUserList &&
                    data?.items.map((merchantUser, index) => (
                      <Tr
                        render={(props) => (
                          <Link {...props} to={`/merchant-users/${merchantUser.user.userId}`} />
                        )}
                        key={index}>
                        <Td>{merchantUser?.user.name}</Td>
                        <Td>{merchantUser?.user.email}</Td>
                        <Td>
                          {merchantUser?.user && merchantUser?.user?.companyId
                            ? 'Company'
                            : 'Merchant'}
                        </Td>
                        <Td>
                          {merchantUser?.merchants && merchantUser?.merchants.length > 0 ? (
                            <TextEllipsis
                              text={filterMerchantName(merchantUser?.merchants)}
                              widthClass="w-72"
                            />
                          ) : (
                            ''
                          )}
                        </Td>
                      </Tr>
                    ))}
                </DataTableRowGroup>
              </DataTable>
              {isEmptyMerchantUserList && (
                <Card className="w-full flex items-center justify-center py-12">
                  No users found
                </Card>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
};
