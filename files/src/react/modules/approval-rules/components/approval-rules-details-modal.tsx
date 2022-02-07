import {
  Alert,
  AlertMessages,
  BareButton,
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
  MultiInputWithSuggestions,
  PlusIcon,
  TextInput,
  titleCase,
  useDebounce,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useRouter} from 'src/react/routing/routing.context';
import {approvalRuleRole} from 'src/shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {
  useGetApprovers,
  useDeleteApprovalRule,
  useSetApprovalRule,
} from '../approval-rules.queries';
import {
  ApprovalRuleStatus,
  EFeatureTypeText,
  EFeature_Type,
  IApprovalRule,
  Mode,
} from '../approval-rules.type';

interface OptFeature {
  value: EFeature_Type;
  label: string;
}

interface OptStatus {
  value: ApprovalRuleStatus;
  label: string;
}

const optFeatures: OptFeature[] = [
  {
    value: EFeature_Type.CARD_CREATE,
    label: EFeatureTypeText[EFeature_Type.CARD_CREATE],
  },
  {
    value: EFeature_Type.CARDTRANSFER_CREATE,
    label: EFeatureTypeText[EFeature_Type.CARDTRANSFER_CREATE],
  },
  {
    value: EFeature_Type.PAYMENT_CREATE,
    label: EFeatureTypeText[EFeature_Type.PAYMENT_CREATE],
  },
  {
    value: EFeature_Type.TRANSFER_CREATE,
    label: EFeatureTypeText[EFeature_Type.TRANSFER_CREATE],
  },
  {
    value: EFeature_Type.ADJUST_CREATE,
    label: EFeatureTypeText[EFeature_Type.ADJUST_CREATE],
  },
  {
    value: EFeature_Type.BULKTRANSFER_CREATE,
    label: EFeatureTypeText[EFeature_Type.BULKTRANSFER_CREATE],
  },
  {
    value: EFeature_Type.BULKMERCHANTADJUSTMENT,
    label: EFeatureTypeText[EFeature_Type.BULKMERCHANTADJUSTMENT],
  },
  {
    value: EFeature_Type.MERCHANTTOPUP_CREATE,
    label: EFeatureTypeText[EFeature_Type.MERCHANTTOPUP_CREATE],
  },
  {
    value: EFeature_Type.BULKMERCHANTTOPUP_CREATE,
    label: EFeatureTypeText[EFeature_Type.BULKMERCHANTTOPUP_CREATE],
  },
  {
    value: EFeature_Type.MERCHANTADJUST_CREATE,
    label: EFeatureTypeText[EFeature_Type.MERCHANTADJUST_CREATE],
  },
  {
    value: EFeature_Type.FLEETCARDREPLACEMENT_CREATE,
    label: EFeatureTypeText[EFeature_Type.FLEETCARDREPLACEMENT_CREATE],
  },
  {
    value: EFeature_Type.PREPAIDFLEETACCOUNT_CREATE,
    label: EFeatureTypeText[EFeature_Type.PREPAIDFLEETACCOUNT_CREATE],
  },
  {
    value: EFeature_Type.POSTPAIDFLEETACCOUNT_CREATE,
    label: EFeatureTypeText[EFeature_Type.POSTPAIDFLEETACCOUNT_CREATE],
  },
  {
    value: EFeature_Type.FLEETCARD_CREATE,
    label: EFeatureTypeText[EFeature_Type.FLEETCARD_CREATE],
  },
  {
    value: EFeature_Type.LOYALTY_ADJUSTMENT,
    label: EFeatureTypeText[EFeature_Type.LOYALTY_ADJUSTMENT],
  },
];

const optStatus: OptStatus[] = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'disabled',
    label: 'Disabled',
  },
];

interface IApprovalRulesDetailsModalProps {
  visible: boolean;
  approvalRule?: IApprovalRule;
  mode: Mode;
  onClose?: () => void;
}
interface Validate {
  feature: string;
  levels: {};
}

const ApprovalRulesDetailsModal: React.VFC<IApprovalRulesDetailsModalProps> = (props) => {
  const [feature, setFeature] = React.useState<EFeature_Type>(props?.approvalRule?.feature || null);
  const [status, setStatus] = React.useState<ApprovalRuleStatus>(
    (props?.approvalRule?.status as ApprovalRuleStatus) || null,
  );
  const approvalRuleLevels = props?.approvalRule?.levels;
  const approvalRuleLevelsApprover = approvalRuleLevels?.filter((level) => level.approvers.length);
  const oldNumberLevels = approvalRuleLevelsApprover?.map((approval) => approval.level as any);
  const [inputLevel, setInputLevel] = React.useState(approvalRuleLevels ? oldNumberLevels : [1]);
  const approversEmail = props?.approvalRule?.levels.map((approver) =>
    approver?.approvers?.map((item) => item.userEmail),
  );
  const [approvers, setApprovers] = React.useState(approversEmail ? approversEmail : []);
  const [approversSelected, setApproversSelected] = React.useState(
    props.approvalRule?.levels.map((levels) => levels.approvers) || [],
  );
  const [inputApproverValue, setInputApproverValue] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState([]);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const [validate, setValidate] = React.useState<Validate>({
    feature: '',
    levels: {},
  });

  const numberLevels = Array.from({length: 15}, (_, i) => i + 1);

  const cancelRef = React.useRef(null);
  const {mutate: setApprovalRule} = useSetApprovalRule(props.approvalRule);
  const {mutate: deleteApprovalRule} = useDeleteApprovalRule(props.approvalRule);
  const searchKey = useDebounce(inputApproverValue);
  const router = useRouter();

  const {data} = useGetApprovers({
    page: 1,
    perPage: 10,
    userEmail: searchKey,
  });

  const showMessage = useNotification();

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };

  const onUpdateApprovalRule = async () => {
    const approverIds = approversSelected.map((approvers) => approvers.map((item) => item.id));
    if (props.mode === Mode.EDIT_GENERAL || (feature && approverIds.length)) {
      const arrApprover = approverIds.map((item) => item?.length);
      if (props.mode !== Mode.EDIT_GENERAL) {
        const findNull = arrApprover.findIndex((x) => x === 0) + 1;
        const validates: Validate = {
          feature: '',
          levels: {},
        };
        if (!approverIds[0]?.length) {
          validates.levels['level1'] = 'This is required field';
          setValidate(validates);
          return;
        }
        for (let index = findNull; index < 16; index++) {
          if (findNull !== 0 && arrApprover[index] > 0) {
            const validates: Validate = {
              feature: '',
              levels: {},
            };
            validates.levels[`level${findNull}`] = 'This is required field';
            setValidate(validates);
            return;
          }
        }
      }
      setApprovalRule(
        {
          feature,
          levels: numberLevels.map((numberLevel, index) => ({
            level: numberLevel.toString(),
            approvers: approverIds[index]?.length ? approverIds[index] : [],
          })) as any,
          status,
        },
        {
          onSuccess: () => {
            showMessage({
              title: 'Success!',
              description:
                props.mode === Mode.ADD ? 'Create approval rule success' : 'Update success',
            });
            close();
          },
          onError: async (err: any) => {
            const response = await (err.response && err.response.data);
            if (response && response.statusCode === 400) {
              const errors = _.isObject(response?.response?.errors)
                ? response?.response?.errors
                : {};
              const errorKeys = Object.keys(errors);
              const validates = errorKeys.reduce((obj, key) => {
                obj[key] = errors[key][errors[key].length - 1];
                return obj;
              }, {}) as Validate;

              if (errorKeys.length) {
                setValidate((state) => ({...state, ...validates}));
              } else {
                if (!Array.isArray(response.message)) {
                  setErrorMsg([response.message]);
                } else if (Array.isArray(response.message) && !!response.message.length) {
                  const messageErr = [];
                  response.message.forEach((mess) => {
                    messageErr.push(...Object.values(mess.constraints));
                  });
                  setErrorMsg(_.uniq(messageErr));
                }
              }
              return;
            }
          },
        },
      );
    } else {
      const validates: Validate = {
        feature: '',
        levels: {},
      };
      const arrApprover = approverIds.map((approvers) => approvers?.length);
      if (!feature) {
        validates['feature'] = 'This is required field';
        setValidate(validates);
      }
      if (!approverIds[0]?.length) {
        validates.levels['level1'] = 'This is required field';
      }
      const findNull = arrApprover.findIndex((x) => x === 0) + 1;
      for (let index = findNull; index < 16; index++) {
        if (findNull !== 0 && arrApprover[index] > 0) {
          validates.levels[`level${findNull}`] = 'This is required field';
          setValidate(validates);
          return;
        }
      }
    }
  };

  const onDeleteCompany = () => {
    deleteApprovalRule(props.approvalRule.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        close();
        router.navigateByUrl('approvals/approval-rules');
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setVisibleDeleteConfirm(false);
        setErrorMsg([response.message]);
      },
    });
  };

  const checkEmail = (email) => {
    const isEmail = !approvers.some((approver) => approver.includes(email));
    return isEmail;
  };

  return (
    <>
      <Modal
        aria-label="create approval rule"
        size="standard"
        isOpen={props.visible}
        onDismiss={() => close()}>
        <ModalHeader>
          {!!props.approvalRule ? 'Edit details' : 'Create new approval rules'}
        </ModalHeader>
        <ModalBody className="space-y-4">
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg.map((messageError) => titleCase(messageError))} />
            </Alert>
          )}
          {props.mode === Mode.EDIT_GENERAL && (
            <Field className="grid grid-cols-5 grid-flow-row gap-4">
              <Label className="flex items-center">Rule ID</Label>
              <div className="col-span-2">
                <TextInput
                  disabled
                  value={props.approvalRule.id}
                  placeholder="Rule ID"
                  className="w-60"
                />
              </div>
            </Field>
          )}
          {props.mode !== Mode.EDIT_APPROVER && (
            <Field className="grid grid-cols-5 grid-flow-row gap-4">
              <Label className="flex items-center">Feature name</Label>
              <div className="col-span-4">
                <DropdownSelect
                  name="feature"
                  value={feature}
                  className="placeholder-gray-500 text-gray-400"
                  placeholder="Select feature name"
                  options={optFeatures as any}
                  onChangeValue={(value) => {
                    setFeature(value);
                    setErrorMsg([]);
                    setValidate((state) => ({...state, feature: ''}));
                  }}
                />
                {validate?.feature && <p className="text-red-500">{validate.feature}</p>}
              </div>
            </Field>
          )}

          {props.mode !== Mode.EDIT_GENERAL && (
            <>
              {props.mode === Mode.EDIT_APPROVER && (
                <Field className="grid grid-cols-5 grid-flow-row gap-4">
                  <Label className="flex items-center">Rule ID</Label>
                  <div className="col-span-4">
                    <Label className="text-black">{props?.approvalRule?.id}</Label>
                    {validate?.feature && <p className="text-red-500">{validate.feature}</p>}
                  </div>
                </Field>
              )}
              {inputLevel.map(
                (numberLevel, index) =>
                  index < 15 && (
                    <>
                      <Field key={index} className="grid grid-cols-5 grid-flow-row gap-4">
                        <Label className="pt-2 w-6/12">Level {numberLevel}</Label>
                        <div className="col-span-4">
                          <MultiInputWithSuggestions
                            className="placeholder-gray-400"
                            disabled={approvers[index - 1]?.length || index === 0 ? false : true}
                            badgeColor="grey"
                            name="emails"
                            validateBeforeAdd={(value: string) =>
                              !!(data || []).find((item) => item.userEmail === value)
                            }
                            autoComplete="off"
                            values={approvers[index] || []}
                            onChangeValues={(values) => {
                              const newApprover = [...approvers];
                              newApprover[index] = values;
                              setApprovers(newApprover);
                              setErrorMsg([]);
                              setValidate((state) => ({...state, levels: {level1: ''}}));
                              const newApproversSelected = (data || []).filter((item) =>
                                values.includes(item.userEmail),
                              );
                              const currentSelected = _.unionBy(
                                approversSelected[index],
                                newApproversSelected,
                                'id',
                              ).filter((item) => values.includes(item.userEmail));
                              const newApproverSelected = [...approversSelected];
                              newApproverSelected[index] = currentSelected;
                              setApproversSelected(newApproverSelected);
                            }}
                            suggestions={
                              data &&
                              data.map((obj) => obj.userEmail).filter((email) => checkEmail(email))
                            }
                            placeholder="Enter approvers"
                            onInputValueChange={setInputApproverValue}
                          />
                          {validate?.levels[`level${index + 1}`] && (
                            <p className="text-red-500">{validate.levels[`level${index + 1}`]}</p>
                          )}
                        </div>
                      </Field>
                    </>
                  ),
              )}
              {inputLevel.length < numberLevels.length && (
                <BareButton
                  className="text-brand-500 w-32 text-left"
                  onClick={() => setInputLevel((e) => e.concat(inputLevel.length + 1))}>
                  <PlusIcon className="w-4 h-4 mb-1 inline-block" /> <span>ADD LEVEL</span>
                </BareButton>
              )}
            </>
          )}

          {props.mode === Mode.EDIT_GENERAL && (
            <Field className="grid grid-cols-5 grid-flow-row gap-4">
              <Label className="flex items-center">Status</Label>
              <div className="col-span-2">
                <DropdownSelect
                  name="status"
                  className="w-60"
                  value={status}
                  options={optStatus as any}
                  onChangeValue={(value) => {
                    setStatus(value);
                    setErrorMsg([]);
                  }}
                  placeholder="Please select"
                />
              </div>
            </Field>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <div>
              {props.mode === Mode.EDIT_GENERAL ? (
                <HasPermission accessWith={[approvalRuleRole.delete]}>
                  <span
                    style={{color: 'red', cursor: 'pointer'}}
                    onClick={() => setVisibleDeleteConfirm(true)}>
                    DELETE
                  </span>
                </HasPermission>
              ) : (
                <div />
              )}
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={() => close()}>
                CANCEL
              </Button>
              <Button className="ml-4" variant="primary" onClick={onUpdateApprovalRule}>
                {!!props.approvalRule ? 'SAVE CHANGES' : 'SAVE'}
                {/* SAVE CHANGES */}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete this approval rule?">
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

export default ApprovalRulesDetailsModal;
