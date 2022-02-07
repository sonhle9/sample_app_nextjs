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
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {EFeatureTypeText, Levels, Mode, Statuses} from '../approval-rules.type';
import ApprovalRulesDetailsModal from './approval-rules-details-modal';
import {useQueryParams} from 'src/react/routing/routing.context';
import {getApprovalRules} from '../approval-rules.service';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {HasPermission} from '../../auth/HasPermission';
import {approvalRuleRole} from 'src/shared/helpers/pdb.roles.type';

export const ApprovalRulesListing = () => {
  const activated = useQueryParams();

  return activated ? <ApprovalRulesList /> : null;
};
const initialFilter = {};

const ApprovalRulesList = () => {
  const {
    query: {data: data, isFetching},
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'approvalRules',
    queryFn: (currentValues) => getApprovalRules(currentValues),
    components: () => [],
  });

  const [createModal, setCreateModal] = React.useState(false);

  const levelApproval = (level: Levels[]) =>
    level.findIndex((x) => x.approvers.length === 0) === -1
      ? level.length
      : level.findIndex((x) => x.approvers.length === 0);

  return (
    <>
      <HasPermission accessWith={[approvalRuleRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 mb-15">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approval rules</h1>
            <HasPermission accessWith={[approvalRuleRole.create]}>
              <Button
                variant="primary"
                onClick={() => setCreateModal(true)}
                leftIcon={<PlusIcon />}>
                CREATE
              </Button>
            </HasPermission>
          </div>
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
                <Td>RULE ID</Td>
                <Td>FEATURE</Td>
                <Td>STATUS</Td>
                <Td>APPROVAL LEVELS</Td>
                <Td className="text-right">LAST UPDATED ON</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup groupType="tbody">
              {(data?.approvalRules || []).map((rule) => (
                <Tr
                  key={rule.id}
                  render={(props) => (
                    <Link {...props} to={`/approvals/approval-rules/${rule.id}`} />
                  )}>
                  <Td>{rule.id}</Td>
                  <Td>{EFeatureTypeText[rule.feature] || rule.feature}</Td>
                  <Td>
                    <Badge
                      color={rule.status === Statuses.ACTIVE ? 'success' : 'grey'}
                      rounded="rounded"
                      className="uppercase">
                      {rule.status}
                    </Badge>
                  </Td>
                  <Td>{levelApproval(rule.levels)}</Td>
                  <Td className="text-right">
                    {formatDate(rule.updatedAt, {
                      formatType: 'dateAndTime',
                    })}
                  </Td>
                </Tr>
              ))}
            </DataTableRowGroup>
            {data && !data?.approvalRules.length && (
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
      </HasPermission>

      {createModal && (
        <ApprovalRulesDetailsModal
          mode={Mode.ADD}
          visible={createModal}
          onClose={() => setCreateModal(false)}
        />
      )}
    </>
  );
};

export default ApprovalRulesListing;
