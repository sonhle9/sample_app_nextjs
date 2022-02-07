import {
  BareButton,
  Card,
  CardHeading,
  CardContent,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DescList,
  DescItem,
  Section,
  SectionHeading,
  classes,
  Text,
  Badge,
  formatDate,
  formatMoney,
  DataTableCaption,
} from '@setel/portal-ui';
import * as React from 'react';
import {useGetGoalById, useRegrantReward} from 'src/react/modules/customers/customers.queries';
import {Link} from 'src/react/routing/link';

const routeByType = {
  friend: '/accounts',
  order: '/orders',
  external_order: '/external-orders',
  topup: '/payments/transactions',
};

type GoalDetailsProps = {id: string};
export function GoalDetails({id}: GoalDetailsProps) {
  const query = useGetGoalById(id);
  const goal = query.data;
  const {mutateAsync: regrantReward} = useRegrantReward();

  return (
    <div className="mx-auto px-24 py-7">
      <div className="flex justify-between items-center">
        <Text className={classes.h1}>{goal?.title}</Text>
        <div className="text-right">
          {goal?.memberInfo?.userId && (
            <Link
              className="uppercase text-xs text-brand-500"
              to={`/customers/${goal.memberInfo.userId}`}>
              <strong>View User Dashboard</strong>
            </Link>
          )}
          {goal?.campaign && (
            <Link
              className="uppercase text-xs text-brand-500"
              to={`/rewards/rewards-campaigns/${goal.campaign}`}>
              <strong>View Campaign</strong>
            </Link>
          )}
        </div>
      </div>

      {goal?.criteria?.map(({_id, description, current, target}, index) => (
        <Section key={_id}>
          <SectionHeading title={`Criteria ${index + 1}`} />
          <Card expandable defaultIsOpen>
            <CardHeading title="General" />
            <CardContent>
              <DescList>
                <DescList.Item label="Description" value={description} />
                <DescList.Item
                  label="Progression"
                  value={
                    <Badge color={current >= target ? 'success' : 'grey'}>
                      {current} / {target}
                    </Badge>
                  }
                />
              </DescList>
            </CardContent>
          </Card>
        </Section>
      ))}

      <Section>
        <Card expandable defaultIsOpen>
          <CardHeading title="Actions" />
          <CardContent className="p-0">
            <Table isLoading={query.isLoading} isFetching={query.isFetching}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>id</Table.Td>
                  <Table.Td>type</Table.Td>
                  <Table.Td className="text-right">amount (rm)</Table.Td>
                  <Table.Td className="text-right">created on</Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {goal?.actions?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td className="cursor-pointer">
                      <a href={`${routeByType[item.type]}/${item.relatedDocumentId}`}>
                        {item.relatedDocumentId}
                      </a>
                    </Table.Td>
                    <Table.Td className="capitalize">{item.type}</Table.Td>
                    <Table.Td className="text-right">{formatMoney(item.amount)}</Table.Td>
                    <Table.Td className="text-right">{formatDate(item.createdAt)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              {goal?.actions?.length === 0 && (
                <DataTableCaption>
                  <div className="py-12">
                    <p className="text-center text-sm">You have no data to be displayed here</p>
                  </div>
                </DataTableCaption>
              )}
            </Table>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <Card expandable defaultIsOpen>
          <CardHeading title="Rewards" />
          <CardContent className="p-0">
            <Table native isLoading={query.isLoading} isFetching={query.isFetching}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>reward</Table.Th>
                  <Table.Th>status</Table.Th>
                  <Table.Th className="text-right">amount (rm)</Table.Th>
                  <Table.Th className="text-right">last attempted</Table.Th>
                  <Table.Th className="text-right">action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {goal?.rewards?.map((item) => (
                  <ExpandGroup key={item._id}>
                    <Table.Tr>
                      <Table.Td className="capitalize">
                        <ExpandButton />
                        {item.type}
                      </Table.Td>
                      <Table.Td className="uppercase">
                        <Badge color={item.isGranted ? 'success' : 'error'}>
                          {item.isGranted ? 'success' : 'fail'}
                        </Badge>
                      </Table.Td>
                      <Table.Td className="text-right">{formatMoney(item.amount)}</Table.Td>
                      <Table.Td className="text-right">
                        {formatDate(item.lastAttemptedToGrantAt)}
                      </Table.Td>
                      <Table.Td className="text-right">
                        {item.isGranted ? (
                          '-'
                        ) : (
                          <BareButton
                            className="h-10 text-brand-500 whitespace-nowrap"
                            onClick={() => regrantReward(item._id)}>
                            RE-GRANT
                          </BareButton>
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <ExpandableRow>
                      <DescList>
                        <DescItem label="Reward ID" value={item._id ?? '-'} />
                        <DescItem
                          label="Grant failure reason"
                          value={item.grantFailureReason ?? '-'}
                        />
                      </DescList>
                    </ExpandableRow>
                  </ExpandGroup>
                ))}
              </Table.Tbody>
              {goal?.rewards?.length === 0 && (
                <DataTableCaption>
                  <div className="py-12">
                    <p className="text-center text-sm">You have no data to be displayed here</p>
                  </div>
                </DataTableCaption>
              )}
            </Table>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
