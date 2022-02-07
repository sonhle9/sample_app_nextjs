import {
  classes,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeading,
  DescList,
  DescItem,
  EditIcon,
  formatMoney,
} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {approverRole} from 'src/shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetApproverDetails} from '../approvers.queries';
import ApproverDetailsModal from './approver-details-modal';

interface IApproverDetails {
  id: string;
}

const ApproverDetails: React.VFC<IApproverDetails> = (props) => {
  const {data, isError} = useGetApproverDetails(props.id);
  const [editModal, setEditModal] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('approvals/approvers');
      return;
    }
  }, [isError]);

  return (
    <>
      <HasPermission accessWith={[approverRole.read]}>
        <div className="grid gap-4 max-w-6xl mx-auto px-4 pt-4 sm:px-6">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approver details</h1>
          </div>
          <Card>
            <CardHeading title="General">
              {data && (
                <HasPermission accessWith={[approverRole.update]}>
                  <Button
                    variant="outline"
                    minWidth="none"
                    leftIcon={<EditIcon />}
                    onClick={() => setEditModal(true)}>
                    EDIT
                  </Button>
                </HasPermission>
              )}
            </CardHeading>
            <CardContent>
              {data ? (
                <DescList>
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="User ID"
                    value={data.userEmail}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Approval limit"
                    value={<div className="flex-1">RM {formatMoney(data.approvalLimit)}</div>}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Status"
                    value={
                      data.status && (
                        <Badge
                          rounded="rounded"
                          className="uppercase"
                          color={data.status === 'active' ? 'success' : 'grey'}>
                          {data.status}
                        </Badge>
                      )
                    }
                  />
                </DescList>
              ) : (
                <div className="w-full h-40 flex items-center justify-center">...loading</div>
              )}
            </CardContent>
          </Card>
        </div>
      </HasPermission>
      {editModal && (
        <ApproverDetailsModal
          visible={editModal}
          approver={data}
          onClose={() => setEditModal(false)}
        />
      )}
    </>
  );
};

export default ApproverDetails;
