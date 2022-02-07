import * as React from 'react';
import {
  Badge,
  BadgeProps,
  CardHeading,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  PaginationNavigation,
  DescList,
  DescItem,
  formatDate,
  ExternalIcon,
} from '@setel/portal-ui';
import {useUserBadgeList} from '../badge-campaigns.queries';
import {UserBadgeStatus} from 'src/react/modules/badge-campaigns/badge-campaigns.type';

const COLOR_BY_STATUS: Record<UserBadgeStatus, BadgeProps['color']> = {
  LOCKED: 'grey',
  UNLOCKED: 'success',
  IN_PROGRESS: 'grey',
};

export function CustomerBadgeList({userId}) {
  const {query, pagination} = useUserBadgeList(userId);
  const list = query.data?.items || [];
  return (
    <Table
      native
      expandable
      heading={<CardHeading title="Badges" data-testid="badge-card-heading" />}
      isFetching={query.isFetching}
      pagination={
        query.data && (
          <PaginationNavigation
            variant="page-list"
            currentPage={pagination?.page}
            perPage={pagination?.perPage}
            total={query?.data?.total}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        )
      }>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>badge name</Table.Th>
          <Table.Th>badge label</Table.Th>
          <Table.Th className="text-right">status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {list.map((item) => (
          <ExpandGroup key={`${item.id}-${item.recurringIndex}-${item.periodIndex}`}>
            <Table.Tr>
              <Table.Td>
                <ExpandButton />
                {item.content?.title}
              </Table.Td>
              <Table.Td>{item.badge?.name}</Table.Td>
              <Table.Td className="text-right">
                <Badge
                  className="tracking-wider font-semibold"
                  rounded="rounded"
                  color={COLOR_BY_STATUS[item.status]}>
                  {item.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
            <ExpandableRow>
              <DescList>
                {item.category !== 'OPT_IN' && (
                  <>
                    <DescItem
                      label="Goals"
                      value={
                        <ol className="list-decimal list-inside">
                          {item.goals?.map((goal) => (
                            <li key={goal._id} className="pb-5 last:pb-0">
                              <div className="inline-flex items-center">
                                {goal.title}
                                <a
                                  href={`/customers/goals/${goal._id}`}
                                  className="flex text-brand-500 ml-1">
                                  <ExternalIcon />
                                </a>
                              </div>
                            </li>
                          ))}
                        </ol>
                      }
                    />
                    <DescItem label="Reward campaign name" value={item.campaign?.name ?? '-'} />
                  </>
                )}
                <DescItem
                  label="Granted date"
                  value={item.createdAt ? formatDate(item.createdAt) : '-'}
                />
                <DescItem
                  label="Unlocked date"
                  value={item.unlockedAt ? formatDate(item.unlockedAt) : '-'}
                />
              </DescList>
            </ExpandableRow>
          </ExpandGroup>
        ))}
      </Table.Tbody>
    </Table>
  );
}
