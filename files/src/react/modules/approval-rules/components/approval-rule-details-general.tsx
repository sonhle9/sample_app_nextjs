import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeading,
  DescList,
  DescItem,
  EditIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {EFeatureTypeText, IApprovalRule, Mode, Statuses} from '../approval-rules.type';
import ApprovalRulesDetailsModal from './approval-rules-details-modal';

interface IApprovalRuleDetailsGeneralProps {
  approvalRule: IApprovalRule;
}

const ApprovalRuleDetailsGeneral: React.VFC<IApprovalRuleDetailsGeneralProps> = (props) => {
  const data = props.approvalRule;
  const [editModal, setEditModal] = React.useState(false);

  return (
    <>
      <Card>
        <CardHeading title="General">
          {data && (
            <Button
              variant="outline"
              className="items-center"
              minWidth="none"
              leftIcon={<EditIcon />}
              onClick={() => setEditModal(true)}>
              EDIT
            </Button>
          )}
        </CardHeading>
        <CardContent>
          {data ? (
            <DescList>
              <DescItem
                labelClassName="text-sm"
                valueClassName="text-sm font-normal capitalize"
                label="Rule ID"
                value={data?.id}
              />
              <DescItem
                labelClassName="text-sm"
                valueClassName="text-sm font-normal capitalize"
                label="Feature"
                value={EFeatureTypeText[data?.feature] || data?.feature}
              />
              <DescItem
                labelClassName="text-sm"
                valueClassName="text-sm font-normal capitalize"
                label="Status"
                value={
                  data?.status && (
                    <Badge
                      rounded="rounded"
                      color={data.status === Statuses.ACTIVE ? 'success' : 'grey'}
                      className="uppercase">
                      {data.status}
                    </Badge>
                  )
                }
              />
            </DescList>
          ) : (
            <div className="w-full h-40 flex items-center justify-center">
              <span>...loading</span>
            </div>
          )}
        </CardContent>
      </Card>

      {editModal && (
        <ApprovalRulesDetailsModal
          mode={Mode.EDIT_GENERAL}
          approvalRule={data}
          visible={editModal}
          onClose={() => setEditModal(false)}
        />
      )}
    </>
  );
};

export default ApprovalRuleDetailsGeneral;
