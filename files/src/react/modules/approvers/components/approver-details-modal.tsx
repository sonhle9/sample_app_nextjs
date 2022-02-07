import {
  Alert,
  AlertMessages,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelect,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextInput,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useRouter} from 'src/react/routing/routing.context';
import {useDeleteApprover, useSetApprover} from '../approvers.queries';
import {IApprover} from '../approvers.type';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {HasPermission} from '../../auth/HasPermission';
import {approverRole} from 'src/shared/helpers/pdb.roles.type';

function emailIsValid(email: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
}

const optStatus = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'disabled',
    label: 'Disabled',
  },
];

interface IApproverDetailsModalProps {
  visible: boolean;
  approver?: IApprover;
  onClose?: () => void;
}

interface Validate {
  email: string;
  status: string;
}

const ApproverDetailsModal: React.VFC<IApproverDetailsModalProps> = (props) => {
  const [email, setEmail] = React.useState<string>(props?.approver?.userEmail || null);
  const [limitValue, setLimitValue] = React.useState(
    convertToSensitiveNumber(props?.approver?.approvalLimit),
  );
  const [status, setStatus] = React.useState<string>(props?.approver?.status || '');
  const [errorMsg, setErrorMsg] = React.useState([]);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);
  const [validate, setValidate] = React.useState<Validate>({
    email: '',
    status: '',
  });
  const {mutate: setApprover} = useSetApprover(props?.approver);
  const {mutate: deleteApprover} = useDeleteApprover(props.approver);

  const router = useRouter();

  const showMessage = useNotification();

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };

  const onUpdateApprover = () => {
    if (emailIsValid(email) && status) {
      setApprover(
        {
          userEmail: email,
          approvalLimit: Number(limitValue) || props?.approver?.approvalLimit,
          status: status,
        },
        {
          onSuccess: () => {
            showMessage({
              title: 'Success!',
              description: props.approver ? 'Update approver success' : 'Create approver success',
            });
            close();
          },
          onError: async (err: any) => {
            const response = await (err.response && err.response.data);
            if (response && response.statusCode === 400) {
              if (!Array.isArray(response.message)) {
                setErrorMsg([response.message]);
              } else if (Array.isArray(response.message) && !!response.message.length) {
                const messageErr = [];
                response.message.forEach((mess) => {
                  messageErr.push(...Object.values(mess.constraints));
                });
                setErrorMsg(_.uniq(messageErr));
              }
              return;
            }
          },
        },
      );
    } else {
      const validates: Validate = {
        email: '',
        status: '',
      };
      if (!email || !emailIsValid(email)) {
        validates['email'] = 'Invalid email address';
      }
      if (!status) {
        validates['status'] = 'This is field required';
      }
      setValidate(validates);
    }
  };

  const onDeleteCompany = () => {
    deleteApprover(props.approver.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        showMessage({
          title: 'Deleted',
          description: 'Approver deleted',
        });
        close();
        router.navigateByUrl('approvals/approvers');
      },
      onError: () => {
        showMessage({
          variant: 'error',
          title: 'Failed!',
          description: 'Delete approver failed',
        });
      },
    });
  };

  const title = !!props.approver ? 'Edit details' : 'Create new approver';

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={() => close()} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody className="space-y-4">
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg} />
            </Alert>
          )}
          <Field className="grid grid-cols-3 grid-flow-row gap-4">
            <Label className="flex items-center">User ID</Label>
            <div className="col-span-2">
              <TextInput
                type="email"
                placeholder="Enter user email address"
                className="w-full"
                value={email}
                onChangeValue={(value: string) => {
                  setEmail(value);
                  setValidate((state) => ({...state, email: ''}));
                  setErrorMsg([]);
                }}
              />
              {validate?.email && <p className="text-red-500">{validate.email}</p>}
            </div>
          </Field>
          <Field className="grid grid-cols-3 grid-flow-row gap-4">
            <Label className="flex items-center">Approval limit</Label>
            <div className="col-span-2">
              <MoneyInput
                value={limitValue}
                onChangeValue={(value) => {
                  setLimitValue(value);
                  setErrorMsg([]);
                }}
                className="w-60"
              />
            </div>
          </Field>
          <Field className="grid grid-cols-3 grid-flow-row gap-4">
            <Label className="flex items-center">Status</Label>
            <div className="col-span-2">
              <DropdownSelect
                name="status"
                className="w-60"
                value={status}
                onChangeValue={(value) => {
                  setStatus(value);
                  setValidate((state) => ({...state, status: ''}));
                  setErrorMsg([]);
                }}
                options={[
                  {
                    label: 'Please select',
                    value: '',
                  },
                  ...optStatus,
                ]}
              />
              {validate?.status && <p className="text-red-500">{validate.status}</p>}
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            {!!props.approver ? (
              <HasPermission accessWith={[approverRole.delete]}>
                <span
                  className="text-red-500 cursor-pointer"
                  onClick={() => setVisibleDeleteConfirm(true)}>
                  DELETE
                </span>
              </HasPermission>
            ) : (
              <div />
            )}
            <div className="flex items-center">
              <Button variant="outline" onClick={() => close()}>
                CANCEL
              </Button>
              <Button className="ml-4" variant="primary" onClick={onUpdateApprover}>
                {!!props.approver ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete this approver?">
            This action cannot be undone and you will not be able to recover any data.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteCompany}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

export default ApproverDetailsModal;
