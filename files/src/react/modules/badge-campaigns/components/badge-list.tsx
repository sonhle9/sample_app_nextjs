import {
  Button,
  PlusIcon,
  Filter,
  FilterControls,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableCaption,
  Pagination,
  DescList,
  DescItem,
} from '@setel/portal-ui';
// why hide? https://setelnow.atlassian.net/browse/GA-1452
// import {formatThousands} from 'src/shared/helpers/formatNumber';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {badgeRoles} from 'src/shared/helpers/roles.type';
import {useBadgeList} from '../badge-campaigns.queries';
import {BadgeStatus} from './badge-status';
import {BadgeModal} from './badge-modal';
import {useRouter} from 'src/react/routing/routing.context';

export function BadgeList() {
  const [isBadgeModalVisible, setIsBadgeModalVisible] = React.useState(false);
  const router = useRouter();
  const {query, pagination, filter} = useBadgeList();
  const list = query.data?.items || [];
  const totalPage = Math.ceil(query.data?.total / pagination.perPage);

  return (
    <HasPermission accessWith={[badgeRoles.read]}>
      <PageContainer
        heading="Badge list"
        className="space-y-4"
        action={
          <div className="flex">
            <HasPermission accessWith={[badgeRoles.create]}>
              <Button
                variant="primary"
                leftIcon={<PlusIcon />}
                onClick={() => setIsBadgeModalVisible(true)}>
                CREATE
              </Button>
            </HasPermission>
          </div>
        }>
        <FilterControls filter={filter}></FilterControls>
        <Filter filter={filter}></Filter>
        <Table
          native
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
              <Table.Th>badge label</Table.Th>
              <Table.Th>badge name</Table.Th>
              <Table.Th>status</Table.Th>
              <Table.Th>progression</Table.Th>
              {/* why hide? https://setelnow.atlassian.net/browse/GA-1452 */}
              {/* <Table.Th className="text-right">badge unlocked</Table.Th> */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {list.map((item) => (
              <ExpandGroup key={item.id}>
                <Table.Tr
                  className="cursor-pointer"
                  onClick={() => router.navigateByUrl(`/gamification/badge-details/${item.id}`)}>
                  <Table.Td>
                    <ExpandButton onClick={(e) => e.stopPropagation()} />
                    {item.name}
                  </Table.Td>
                  <Table.Td>{item.content?.title ?? '-'}</Table.Td>
                  <Table.Td>
                    <BadgeStatus status={item.availabilityStatus} />
                  </Table.Td>
                  <Table.Td>{item.progressionType}</Table.Td>
                  {/* why hide? https://setelnow.atlassian.net/browse/GA-1452 */}
                  {/* <Table.Td className="text-right">
                    {formatThousands(item.totalBadgeUnlocked)}
                  </Table.Td> */}
                </Table.Tr>
                <ExpandableRow>
                  <DescList>
                    <DescItem label="Badge group" value={item.group.name?.en ?? '-'} />
                    <DescItem label="Reward campaign name" value={item.campaign?.name ?? '-'} />
                  </DescList>
                </ExpandableRow>
              </ExpandGroup>
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
        <BadgeModal isOpen={isBadgeModalVisible} onClose={() => setIsBadgeModalVisible(false)} />
      </PageContainer>
    </HasPermission>
  );
}
