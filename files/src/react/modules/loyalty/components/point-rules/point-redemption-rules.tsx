import * as React from 'react';
import {
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DragHandle,
  Badge,
  arrayMove,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import {ReorderCreateButtonGroup} from './point-rules-reorder-create-button-group';
import {useGetAllRedemptionRules, useReorderPointRules} from '../../point-rules.queries';
import {
  Statuses,
  TargetType,
  Target,
  SourcesType,
  OperationType,
  Unit,
  PointRules,
} from '../../point-rules.type';
import {PointRuleCreateEditModal} from './point-rule-create-edit-modal';
import {getNameFromEnum} from 'src/react/lib/get-name-from-enum';
import {useCanEditRedemptionRules} from '../../custom-hooks/use-check-permissions';
import {PageContainer} from 'src/react/components/page-container';

const MAX_NUM_RULES = 7;

export const PointRedemptionRules = () => {
  const {data, isSuccess} = useGetAllRedemptionRules();
  const {mutate: mutateReorderRule} = useReorderPointRules();
  const canEditRedemptionRules = useCanEditRedemptionRules();
  const [redemptionRules, setRedemptionRules] = React.useState<PointRules[] | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [reorder, setReorder] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRedemptionRules(data);
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
      mutateReorderRule(redemptionRules.map((rule) => rule.id));
    }
    setReorder(!reorder);
  };

  const handleCancelReorder = () => {
    setRedemptionRules(data);
    setReorder(!reorder);
  };

  return (
    <>
      <PointRuleCreateEditModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        availablePriorities={availablePriorities}
        rule={{
          sourceType: SourcesType.LOYALTY_POINT,
          operationType: OperationType.REDEMPTION,
          unit: Unit.MONEY,
          status: Statuses.ENABLED,
        }}
      />
      <PageContainer
        heading="Loyalty point redemption rules"
        action={
          canEditRedemptionRules && (
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
            setRedemptionRules((rules) => {
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
              <Td>Target Type</Td>
              <Td>Target</Td>
              <Td className="text-right">Rate</Td>
              {reorder && (
                <Td className="w-1">
                  <></>
                </Td>
              )}
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {isSuccess &&
              redemptionRules?.map((rule) => (
                <Tr
                  render={(props) => (
                    <Link
                      {...props}
                      to={`/loyalty/point-redemption-rules/${rule.id}`}
                      data-testid="redemption-entry"
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
                    <span className="text-black">
                      {getNameFromEnum(rule.targetType, TargetType)}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-black">
                      {getNameFromEnum(rule.target, Target, rule.target === Target.MYR)}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className="text-black">{rule.ratio}</span>
                  </Td>
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
