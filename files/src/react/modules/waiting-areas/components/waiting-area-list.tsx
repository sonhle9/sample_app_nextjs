import * as React from 'react';
import {PageContainer} from '../../../components/page-container';
import {
  Badge,
  Button,
  DataTable as Table,
  DataTableCaption,
  FilterControls,
  Pagination,
  PlusIcon,
  titleCase,
} from '@setel/portal-ui';
import _startCase from 'lodash/startCase';
import {useWaitingAreaList} from '../waiting-areas.queries';
import {getWaitingAreaStatusColor} from '../waiting-areas.helper';
import {HasPermission} from '../../auth/HasPermission';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {WaitingAreaModal} from './waiting-area-modal';
import {Link} from 'src/react/routing/link';

export function WaitingAreaList() {
  const [isWaitingAreaModalVisible, setIsWaitingAreaModalVisible] = React.useState(false);
  const {query, pagination, filter} = useWaitingAreaList();
  const list = query.data?.items || [];
  const totalPage = Math.ceil(query.data?.total / pagination.perPage);

  return (
    <HasPermission accessWith={[retailRoles.waitingAreaView]}>
      <PageContainer
        heading="Waiting areas"
        className="space-y-4"
        action={
          <div className="flex">
            <HasPermission accessWith={[retailRoles.waitingAreaCreate]}>
              <Button
                variant="primary"
                leftIcon={<PlusIcon />}
                onClick={() => setIsWaitingAreaModalVisible(true)}>
                CREATE
              </Button>
              {isWaitingAreaModalVisible && (
                <WaitingAreaModal
                  isOpen={isWaitingAreaModalVisible}
                  onDismiss={() => setIsWaitingAreaModalVisible(false)}
                />
              )}
            </HasPermission>
          </div>
        }>
        <FilterControls filter={filter}></FilterControls>
        <Table
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          pagination={
            <Pagination
              variant="page-list"
              lastPage={Math.min(Math.max(5, pagination.page + 2), totalPage)}
              currentPage={pagination.page}
              pageSize={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
              onGoToLast={() => pagination.setPage(totalPage)}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Waiting Area</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th className="text-right">Tags</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {list.map((item) => (
              <Table.Tr
                key={item.id}
                className="cursor-pointer"
                render={(props) => <Link {...props} to={`/waiting-areas/${item.id}`} />}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{titleCase(item.type, {hasUnderscore: true})}</Table.Td>
                <Table.Td>
                  <Badge
                    size="large"
                    rounded="rounded"
                    color={getWaitingAreaStatusColor(item.status)}
                    className="uppercase tracking-wider">
                    {_startCase(item.status)}
                  </Badge>
                </Table.Td>
                <Table.Td className="text-right">
                  <div className="flex flex-wrap justify-end">
                    {item.tags.map((tag) => (
                      <div className="pt-2 pr-1" key={tag}>
                        <Badge color={'grey'}>{tag}</Badge>
                      </div>
                    ))}
                  </div>
                </Table.Td>
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
      </PageContainer>
    </HasPermission>
  );
}
