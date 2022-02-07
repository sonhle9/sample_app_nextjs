import {
  Badge,
  Button,
  Card,
  CardHeading,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTable,
  EditIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {IApprovalRule, Mode} from '../approval-rules.type';
import ApprovalRulesDetailsModal from './approval-rules-details-modal';

interface IApprovalRuleDetailsProps {
  approvalRule: IApprovalRule;
}

const ApprovalRuleDetailsApprovers: React.VFC<IApprovalRuleDetailsProps> = (props) => {
  const data = props.approvalRule;
  const [editModal, setEditModal] = React.useState(false);
  const newData = data?.levels?.filter((e) => e.approvers.length);

  return (
    <>
      <Card>
        <CardHeading title="Approvers">
          {data && (
            <Button
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              onClick={() => setEditModal(true)}>
              EDIT
            </Button>
          )}
        </CardHeading>
        <DataTable>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="pl-7">LEVEL</Td>
              <Td className="pl-7">APPROVERS NAME</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {newData?.map((listApprover, index) => (
              <Tr key={index}>
                <Td className="w-1/5 pl-7">Level {listApprover.level}</Td>
                <Td>
                  {listApprover.approvers.map((value, i) => {
                    return (
                      <Badge
                        size="large"
                        color={'grey'}
                        key={i}
                        rounded="full"
                        className="tracking-normal mr-2 mb-2">
                        {value.userEmail}
                      </Badge>
                    );
                  })}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        </DataTable>
      </Card>

      {editModal && (
        <ApprovalRulesDetailsModal
          mode={Mode.EDIT_APPROVER}
          approvalRule={data}
          visible={editModal}
          onClose={() => setEditModal(false)}
        />
      )}
    </>
  );
};

export default ApprovalRuleDetailsApprovers;
