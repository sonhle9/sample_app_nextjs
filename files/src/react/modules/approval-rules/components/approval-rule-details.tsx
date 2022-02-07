import {classes} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {approvalRuleRole} from 'src/shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetApprovalRuleDetails} from '../approval-rules.queries';
import ApprovalRuleDetailsApprovers from './approval-rule-details-approvers';
import ApprovalRuleDetailsGeneral from './approval-rule-details-general';

interface IApprovalRuleDetailsProps {
  id: string;
}

const ApprovalRuleDetails: React.VFC<IApprovalRuleDetailsProps> = (props) => {
  const {data, isError} = useGetApprovalRuleDetails(props.id);

  const router = useRouter();

  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('approval-rules');
      return;
    }
  }, [isError]);

  return (
    <>
      <HasPermission accessWith={[approvalRuleRole.read]}>
        <div className="grid gap-4 max-w-6xl mx-auto px-4 pt-4 sm:px-6">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approval rule details</h1>
          </div>
          <div className="space-y-8">
            <ApprovalRuleDetailsGeneral approvalRule={data} />
            <ApprovalRuleDetailsApprovers approvalRule={data} />
          </div>
        </div>
      </HasPermission>
    </>
  );
};

export default ApprovalRuleDetails;
