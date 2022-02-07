import * as React from 'react';
import {
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DragHandle,
  Badge,
  arrayMove,
  formatDate,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import {ReorderCreateButtonGroup} from './point-rules-reorder-create-button-group';
import {useGetAllEarningRules, useReorderPointRules} from '../../point-rules.queries';
import {Statuses, OperationType, Unit, PointRules} from '../../point-rules.type';
import {PointRuleCreateEditModal} from './point-rule-create-edit-modal';
import {useCanEditEarningRules} from '../../custom-hooks/use-check-permissions';
import {PageContainer} from 'src/react/components/page-container';

const MAX_NUM_RULES = 7;

export const PointEarningRules = () => {
  const {data, isSuccess} = useGetAllEarningRules();
  const {mutate: mutateReorderRule} = useReorderPointRules();
  const canEditEarningRules = useCanEditEarningRules();

  const [earningRules, setEarningRules] = React.useState<PointRules[] | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [reorder, setReorder] = React.useState<boolean>(false);

  React.useEffect(() => {
    setEarningRules(data);
  }, [data]);

  const availablePriorities = React.useMemo(() => {
    const start = data && isSuccess ? data.length : 0;

    if (start < MAX_NUM_RULES) {
      return Array(MAX_NUM_RULES - start)
        .fill(0)
        .map((_, idx) => start + 1 + idx);
    }

    return [];
  }, [data, isSuccess]);

  const handleReorder = () => {
    if (reorder) {
      mutateReorderRule(earningRules.map((rule) => rule.id));
    }
    setReorder(!reorder);
  };

  const handleCancelReorder = () => {
    setEarningRules(data);
    setReorder(!reorder);
  };

  return (
    <>
      <PointRuleCreateEditModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        availablePriorities={availablePriorities}
        rule={{
          operationType: OperationType.EARN,
          unit: Unit.MONEY,
          status: Statuses.ENABLED,
        }}
      />
      <PageContainer
        heading="Loyalty point earning rules"
        action={
          canEditEarningRules && (
            <ReorderCreateButtonGroup
              isReorder={reorder}
              handleOrderButton={handleReorder}
              handleCancelReorder={handleCancelReorder}
              handleCreateButton={() => setIsOpen(true)}
            />
          )
        }>
        <DataTable
          sortable
          useDragHandle
          striped
          onSortEnd={({oldIndex, newIndex}) =>
            setEarningRules((rules) => {
              const newArray = arrayMove(rules, oldIndex, newIndex).map((rule, index) => {
                return {...rule, priority: index + 1};
              });
              return newArray;
            })
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Priority</Td>
              <Td>Status</Td>
              <Td>Name</Td>
              <Td className="text-right">Rate</Td>
              <Td className="text-right">Start date</Td>
              <Td className="text-right">End date</Td>
              {reorder && (
                <Td className="w-1">
                  <></>
                </Td>
              )}
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {isSuccess &&
              earningRules?.map((rule) => (
                <Tr
                  render={(props) => (
                    <Link
                      {...props}
                      to={`/loyalty/point-earning-rules/${rule.id}`}
                      data-testid="earning-entry"
                    />
                  )}
                  key={rule.id}>
                  <Td>{rule.priority}</Td>
                  <Td>
                    <Badge
                      color={rule.status === Statuses.DISABLED ? 'error' : 'turquoise'}
                      className="uppercase"
                      data-testid="status-badge">
                      {rule.status}
                    </Badge>
                  </Td>
                  <Td>
                    <span className="text-black">{rule.title}</span>
                  </Td>
                  <Td className="text-right">
                    <span className="text-black">{rule.ratio}</span>
                  </Td>
                  <Td className="text-right">
                    <span className="text-black">
                      {rule?.startAt ? formatDate(rule.startAt) : '-'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className="text-black">
                      {rule?.expireAt ? formatDate(rule.expireAt) : '-'}
                    </span>
                  </Td>{' '}
                  {reorder && (
                    <Td>
                      <DragHandle className="p-0 h-4 -m-1" />
                    </Td>
                  )}
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      </PageContainer>
    </>
  );
};
