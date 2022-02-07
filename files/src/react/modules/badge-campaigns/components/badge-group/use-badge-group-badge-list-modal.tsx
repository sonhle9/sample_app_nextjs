import {Modal, DataTable as Table, PaginationNavigation, DataTableCaption} from '@setel/portal-ui';
import * as React from 'react';
import {useBadgeGroupBadgeList} from '../../badge-campaigns.queries';
import {I18nString} from 'src/react/modules/badge-campaigns/badge-campaigns.type';
import {Link} from 'src/react/routing/link';

export function useBadgeGroupBadgeListModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const {query, pagination, filter} = useBadgeGroupBadgeList(isOpen);
  const list = query.data?.items || [];

  return {
    open: (id: string) => {
      const [, filterActions] = filter;
      filterActions.setValue('id', id);
      setIsOpen(true);
    },
    component: (
      <>
        {isOpen && (
          <Modal isOpen={isOpen} onDismiss={onClose} header="Total badge names" size="small">
            <Modal.Body className="-my-4 -mx-6">
              <Table
                isLoading={query.isLoading}
                isFetching={query.isFetching}
                pagination={
                  <PaginationNavigation
                    total={query.data?.total}
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    onChangePage={pagination.setPage}
                    onChangePageSize={pagination.setPerPage}
                  />
                }>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-center">no.</Table.Th>
                    <Table.Th>badge name</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {list.map((item, index) => (
                    <Table.Tr
                      key={item.id}
                      render={(props) => (
                        <Link {...props} to={`/gamification/badge-details/${item.id}`} />
                      )}>
                      <Table.Td className="text-center">
                        {pagination.perPage * (pagination.page - 1) + index + 1}
                      </Table.Td>
                      <Table.Td>{(item.content?.title as I18nString)?.en ?? '-'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                {!(query.isLoading && query.isFetching) && list.length === 0 && (
                  <DataTableCaption>
                    <div className="py-12">
                      <p className="text-center text-gray-400 text-sm">No data available.</p>
                    </div>
                  </DataTableCaption>
                )}
              </Table>
            </Modal.Body>
          </Modal>
        )}
      </>
    ),
  };
}
