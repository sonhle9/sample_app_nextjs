import {IAdminUser, IMutationAdminUser, IUserGroup, ValidateMessage} from '../admin-users.type';
import * as React from 'react';
import {useRouter} from '../../../routing/routing.context';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
  AlertMessages,
  Alert,
  DropdownMultiSelect,
  BareButton,
  SyncIcon,
} from '@setel/portal-ui';
import {useAdminUserGroup, useDeleteAdminUser, useSetAdminUser} from '../admin-users.queries';
import {MIN_PASSWORD_LENGTH, validatePassword as passwordValidator} from '../admin-users.service';
import passwordGenerator from 'generate-password-browser';
interface IAdminUserDetailsModal {
  visible: boolean;
  adminUser?: IAdminUser;
  onClose?: () => void;
}

export const AdminUserDetailsModal = (props: IAdminUserDetailsModal) => {
  const [name, setName] = React.useState(props.adminUser?.fullName || '');
  const [email, setEmail] = React.useState(props.adminUser?.email || '');
  const [isShowPassword, setShowPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [accesses, setAccesses] = React.useState((props.adminUser?.accesses || []) as IUserGroup[]);
  const [errorMsg, setErrorMsg] = React.useState({
    name: props.adminUser?.name ? '' : ValidateMessage.name,
    email: props.adminUser?.email ? '' : ValidateMessage.email,
    password: props.adminUser ? '' : ValidateMessage.password,
  });
  const [apiErrorMsg, setApiErrorMsg] = React.useState([]);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);

  const cancelRef = React.useRef(null);
  const {mutate: setAdminUser} = useSetAdminUser(props.adminUser);
  const {data: userAccesses} = useAdminUserGroup();
  const {mutate: deleteAdminUser} = useDeleteAdminUser();

  const setSelectedAccesses = React.useCallback(
    (_accessIds, labels) => {
      const newAccesses = [];
      const labelsArray = labels.split(', ');
      _accessIds.forEach((id, index) => {
        newAccesses.push({
          id: id,
          value: labelsArray[index],
        });
      });
      setAccesses(newAccesses);
    },
    [accesses],
  );

  const accessIds = React.useMemo(() => accesses.map((item) => item.id), [accesses]);

  const validatePassword = React.useCallback(
    (inputPassword: string) => {
      setPassword(inputPassword);
      const isPasswordAcceptable = passwordValidator(inputPassword);
      const errorMessage = isPasswordAcceptable ? '' : ValidateMessage.password;

      setErrorMsg((prevState) => ({
        ...prevState,
        password: errorMessage,
      }));
    },
    [password],
  );

  const validateName = React.useCallback(
    (inputName: string) => {
      setName(inputName);
      const errorMessage = !!inputName ? '' : ValidateMessage.name;
      setErrorMsg((prevState) => ({
        ...prevState,
        name: errorMessage,
      }));
    },
    [name],
  );

  const validateEmail = React.useCallback(
    (inputEmail: string) => {
      setEmail(inputEmail);
      const errorMessage = !!inputEmail ? '' : ValidateMessage.email;
      setErrorMsg((prevState) => ({
        ...prevState,
        email: errorMessage,
      }));
    },
    [email],
  );

  const router = useRouter();

  const onUpdateAdminUser = async () => {
    setIsSubmitted(true);
    if (errorMsg.name || errorMsg.email || errorMsg.password) {
      return;
    }
    setAdminUser(
      {
        id: props.adminUser?.id,
        name,
        email,
        password,
        accessIds: accessIds,
      },
      {
        onSuccess: (res: IMutationAdminUser) => {
          close();
          if (res.id) {
            router.navigateByUrl(`/admin-users/${res.id}`);
          }
        },
        onError: async (err: any) => {
          const response = await (err.response && err.response.data);
          if (response && response.statusCode === 400) {
            if (!Array.isArray(response.message)) {
              setApiErrorMsg([response.message]);
            } else if (Array.isArray(response.message) && !!response.message.length) {
              const messageErr = [];
              response.message.forEach((mess) => {
                messageErr.push(...Object.values(mess.constraints));
              });
              setApiErrorMsg(messageErr);
            }
            return;
          }
        },
      },
    );
  };
  const generatePassword = () => {
    const password = passwordGenerator.generate({
      length: MIN_PASSWORD_LENGTH,
      symbols: true,
      numbers: true,
      strict: true,
      uppercase: true,
    });
    setShowPassword(true);
    validatePassword(password);
  };

  const onDeleteAdminUser = (userId: string) => {
    deleteAdminUser(userId, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        close();
        router.navigateByUrl('/admin-users');
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const close = () => {
    setErrorMsg({
      ...ValidateMessage,
    });
    setName('');
    setEmail('');
    setPassword('');
    setApiErrorMsg([]);
    setIsSubmitted(false);
    props.onClose();
  };

  const title = props.adminUser ? 'Edit details' : 'Create user';

  return (
    <>
      <Modal
        isOpen={props.visible}
        onDismiss={close}
        aria-label={title}
        aria-labelledby="createOrUpdateAdminUser"
        aria-describedby="createOrUpdateAdminUser">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Name</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <TextField
                value={name}
                onChange={(e) => validateName(e.target.value)}
                maxLength={128}
                status={isSubmitted && !!errorMsg.name ? 'error' : null}
                helpText={isSubmitted && errorMsg.name}
                placeholder={`Enter full name`}
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Email</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <TextField
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                maxLength={128}
                status={isSubmitted && !!errorMsg.email ? 'error' : null}
                helpText={isSubmitted && errorMsg.email}
                placeholder={`Enter email address`}
                disabled={!!props.adminUser}
                autoComplete="new-password"
              />
            </div>
          </Field>
          {!props.adminUser && (
            <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
              <Label className="pt-2">Password</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-1">
                <TextField
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  maxLength={128}
                  status={isSubmitted && !!errorMsg.password ? 'error' : null}
                  helpText={isSubmitted && errorMsg.password}
                  placeholder={`Enter password`}
                  type={isShowPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="new-password"
                />
              </div>
              <div className="ml-1 p-3 sm:col-span-1">
                <BareButton
                  onClick={generatePassword}
                  className="text-brand-500 font-bold text-xs flex">
                  <SyncIcon className="w-4 h-4" />
                  &nbsp;&nbsp;&nbsp;GENERATE
                </BareButton>
              </div>
            </Field>
          )}
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Access</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <DropdownMultiSelect
                className="min-w-32"
                options={userAccesses}
                values={accessIds}
                onChangeValues={(id, label) => {
                  setSelectedAccesses(id, label);
                }}
              />
            </div>
          </Field>
          {apiErrorMsg.length > 0 && (
            <div className="p-2">
              <Alert variant="error" description="Something is wrong">
                <AlertMessages messages={apiErrorMsg} />
              </Alert>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            {!!props.adminUser ? (
              <span
                style={{color: 'red', cursor: 'pointer'}}
                onClick={() => setVisibleDeleteConfirm(true)}>
                DELETE THIS USER
              </span>
            ) : (
              <div />
            )}
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button variant="primary" onClick={onUpdateAdminUser}>
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete this user?">
            This action cannot be undone and you will not be able to recover any data.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={() => onDeleteAdminUser(props.adminUser?.id)}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
