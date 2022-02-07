import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownSelectField,
  Badge,
  Button,
  TextField,
  TextareaField,
  MultiInputWithSuggestions as Miws,
  Notification,
  useTransientState,
  useDebounce,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {
  useCreatePointRule,
  useDeletePointRule,
  useUpdatePointRule,
} from '../../point-rules.queries';
import {PointRuleField} from '../point-rule-field';
import {DateTimeField} from '../date-time-field';
import {
  PointRules,
  OperationType,
  Target,
  Sources,
  SourcesType,
  TargetType,
  Statuses,
} from '../../point-rules.type';
import {useRouter} from 'src/react/routing/routing.context';
import {getNameFromEnum} from 'src/react/lib/get-name-from-enum';
import {useGenerateCardGroups} from '../../custom-hooks/use-list-card-groups';
import {useGenerateLoyaltyCategories} from '../../custom-hooks/use-list-loyalty-categories';

export type PointRuleCreateEditModalProps = {
  isOpen: boolean;
  rule?: Partial<PointRules> | null;
  onDismiss: () => void;
  availablePriorities?: number[];
};

export type PointRuleDeleteModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  closeModal: () => void;
  operationType: OperationType;
  ruleId?: string;
  priority?: number;
};

type ruleAction = {type: 'reset'} | {type: 'update'; rule?: Partial<PointRules> | null};

const ruleReducer = (state: Partial<PointRules>, action: ruleAction): Partial<PointRules> => {
  switch (action.type) {
    case 'reset':
      return {};
    case 'update':
      return {
        ...state,
        ...action.rule,
      };
    default:
      return state;
  }
};

export const PointRuleDeleteModal: React.VFC<PointRuleDeleteModalProps> = ({
  isOpen,
  onDismiss,
  closeModal,
  priority,
  ruleId,
  operationType,
}) => {
  const router = useRouter();
  const {mutateAsync: mutateDeleteRule, isLoading, isError, error} = useDeletePointRule(ruleId);
  const [showNotification, setShowNotification] = useTransientState(false);

  const handleDeleteRule = async () => {
    const res = await mutateDeleteRule();
    if (res) {
      setShowNotification(true);
      onDismiss();
    }
    router.navigateByUrl(
      `/loyalty/point-${
        operationType === OperationType.REDEMPTION ? 'redemption' : 'earning'
      }-rules`,
    );
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant="success"
        title="Successfully deleted point rule"
      />
      <Modal isOpen={isOpen} onDismiss={closeModal} aria-label="Delete Rule">
        <ModalHeader>Confirm deletion</ModalHeader>
        <ModalBody>
          {isError && (
            <div className="pb-4">
              <QueryErrorAlert
                error={(error as any) || null}
                description="Error while deleting rule"
              />
            </div>
          )}
          Delete priority {priority}? It will be removed from your loyalty point{' '}
          {operationType === OperationType.EARN ? 'earning' : 'redemption'} rules list
        </ModalBody>
        <ModalFooter className="text-right">
          <Button variant="outline" className="rounded mr-5" onClick={closeModal}>
            CANCEL
          </Button>
          <Button variant="error" onClick={handleDeleteRule} isLoading={isLoading}>
            DELETE
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const PointRuleCreateEditModal: React.VFC<PointRuleCreateEditModalProps> = ({
  isOpen,
  onDismiss,
  rule,
  availablePriorities,
}) => {
  const [ruleState, dispatchRule] = React.useReducer(ruleReducer, {});
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [searchCardInput, setSearchCardInput] = React.useState('');
  const [searchItemInput, setSearchItemInput] = React.useState('');
  const [showNotification, setShowNotification] = useTransientState(false);
  const searchCardText = useDebounce(searchCardInput);

  const {
    mutateAsync: mutateCreateRule,
    isError: createRuleIsError,
    isLoading: createRuleLoading,
    error: createRuleError,
    reset: createRuleReset,
  } = useCreatePointRule();

  const {
    mutateAsync: mutateUpdateRule,
    isError: updateRuleIsError,
    isLoading: updateRuleLoading,
    error: updateRuleError,
    reset: updateRuleReset,
  } = useUpdatePointRule();

  const {
    searchResult: cardGroupOptions,
    inclusiveFiltered: selectedCardGroups,
    lookUpName,
  } = useGenerateCardGroups({
    enabled: Boolean(rule.operationType === OperationType.EARN),
    cardGroupIdFilters: ruleState.cardCategory,
    params: {search: searchCardText},
    searchValue: searchCardInput.trim(),
  });

  const {searchResult: loyaltyCategoryOptions} = useGenerateLoyaltyCategories({
    searchValue: searchItemInput.trim(),
  });

  React.useEffect(() => {
    dispatchRule({type: 'update', rule: {...rule}});
  }, [isOpen]);

  const handleRuleUpdates = (e: any) => {
    if (e.target.name === 'ratio' && e.target.value < 0) {
      dispatchRule({type: 'update', rule: {ratio: e.target.value * -1}});
    } else {
      dispatchRule({type: 'update', rule: {[e.target.name]: e.target.value}});
    }
  };

  const handleDismiss = () => {
    dispatchRule({type: 'reset'});
    createRuleReset();
    updateRuleReset();
    setShowDeleteModal(false);
    onDismiss();
  };

  const handleCreateUpdateRule = async () => {
    const res = ruleState.id
      ? await mutateUpdateRule(ruleState as PointRules)
      : await mutateCreateRule(ruleState as PointRules);
    if (res) {
      setShowNotification(true);
      handleDismiss();
    }
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant="success"
        title="Successfully updated/created point rule"
      />
      <PointRuleDeleteModal
        isOpen={showDeleteModal}
        onDismiss={handleDismiss}
        closeModal={() => setShowDeleteModal(false)}
        ruleId={ruleState?.id}
        priority={ruleState?.priority}
        operationType={ruleState?.operationType}
      />
      <Modal
        isOpen={isOpen}
        onDismiss={handleDismiss}
        aria-label={ruleState?.id ? 'Update Loyalty Rule' : 'Create Loyalty Rule'}
        data-testid="create-update-modal">
        <ModalHeader>
          {ruleState.id
            ? `Edit point ${
                ruleState.operationType === OperationType.EARN ? 'earning' : 'redemption'
              } rule details`
            : `Create loyalty point ${
                ruleState.operationType === OperationType.EARN ? 'earning' : 'redemption'
              } rule`}
        </ModalHeader>
        <ModalBody data-testid="create-update-fields">
          {(createRuleIsError || updateRuleIsError) && (
            <div className="pb-4 col-span-3">
              <QueryErrorAlert
                error={(createRuleError as any) || (updateRuleError as any) || null}
                description="Error while creating rule"
              />
            </div>
          )}
          <PointRuleField name="Status">
            {ruleState.id && (
              <Badge
                color={ruleState.status === Statuses.DISABLED ? 'grey' : 'turquoise'}
                className="uppercase my-2">
                {ruleState?.status}
              </Badge>
            )}
          </PointRuleField>
          {ruleState.id ? (
            <PointRuleField name="Priority">{ruleState.priority}</PointRuleField>
          ) : (
            <DropdownSelectField
              label="Priority"
              className="w-72"
              name="priority"
              value={ruleState.priority}
              options={availablePriorities || []}
              onChangeValue={(value) =>
                dispatchRule({
                  type: 'update',
                  rule: {
                    priority: value,
                  },
                })
              }
              placeholder="Select"
              layout="horizontal-responsive"
            />
          )}
          {ruleState.operationType === OperationType.EARN && (
            <>
              <TextField
                label="Name"
                placeholder="Insert your rule name"
                value={ruleState?.title}
                type="text"
                step="any"
                className="w-72"
                name="title"
                onChange={(e) => handleRuleUpdates(e)}
                layout="horizontal-responsive"
              />
              <PointRuleField name="Card groups">
                <Miws
                  className="w-full"
                  badgeColor="grey"
                  suggestions={cardGroupOptions}
                  onChangeValues={(value) => {
                    handleRuleUpdates({
                      target: {
                        name: 'cardCategory',
                        value: value.map((cardGroupName) => lookUpName[cardGroupName]),
                      },
                    });
                  }}
                  values={selectedCardGroups || []}
                  onInputValueChange={setSearchCardInput}
                  placeholder={ruleState.cardCategory?.length ? '' : 'Please select'}
                  allowSelectAll
                  selectAllLabel="Select all card groups"
                />
              </PointRuleField>
              <PointRuleField name="Loyalty categories">
                <Miws
                  className="w-full"
                  badgeColor="grey"
                  suggestions={loyaltyCategoryOptions}
                  onChangeValues={(value) => {
                    handleRuleUpdates({
                      target: {
                        name: 'loyaltyCategory',
                        value,
                      },
                    });
                  }}
                  values={ruleState.loyaltyCategory || []}
                  onInputValueChange={setSearchItemInput}
                  placeholder={ruleState.loyaltyCategory?.length ? '' : 'Please select'}
                  allowSelectAll
                  selectAllLabel="Select all loyalty categories"
                />
              </PointRuleField>
              <DropdownSelectField
                label="Source type"
                className="w-72"
                name="sourceType"
                value={ruleState.sourceType}
                onChangeValue={(value) =>
                  dispatchRule({
                    type: 'update',
                    rule: {
                      sourceType: value,
                    },
                  })
                }
                options={
                  Object.values(SourcesType).map((value) => ({
                    value,
                    label: getNameFromEnum(value, SourcesType),
                  })) as any
                }
                placeholder="Please select"
                layout="horizontal-responsive"
              />
            </>
          )}

          <DropdownSelectField
            label="Source"
            className="w-72"
            name="source"
            value={ruleState.source}
            onChangeValue={(value) =>
              dispatchRule({
                type: 'update',
                rule: {
                  source: value,
                },
              })
            }
            options={
              Object.values(Sources).map((value) => ({
                value,
                label: getNameFromEnum(value, Sources, value === Sources.MYR),
              })) as any
            }
            placeholder="Please select"
            data-testid="source-select"
            layout="horizontal-responsive"
          />
          <DropdownSelectField
            label="Target type"
            className="w-72"
            name="targetType"
            value={ruleState.targetType}
            onChangeValue={(value) =>
              dispatchRule({
                type: 'update',
                rule: {
                  targetType: value,
                },
              })
            }
            options={
              Object.values(TargetType).map((value) => ({
                value,
                label: getNameFromEnum(value, TargetType),
              })) as any
            }
            placeholder="Please select"
            layout="horizontal-responsive"
          />
          <DropdownSelectField
            label="Target"
            className="w-72"
            name="target"
            value={ruleState.target}
            onChangeValue={(value) =>
              dispatchRule({
                type: 'update',
                rule: {
                  target: value,
                },
              })
            }
            options={
              Object.values(Target).map((value) => ({
                value,
                label: getNameFromEnum(value, Target, value === Target.MYR),
              })) as any
            }
            placeholder="Please select"
            layout="horizontal-responsive"
          />
          <TextField
            label="Rate"
            placeholder="Eg. 0.001"
            value={ruleState?.ratio}
            type="number"
            step="any"
            className="w-72"
            name="ratio"
            onChange={(e) => handleRuleUpdates(e)}
            min="0"
            layout="horizontal-responsive"
          />
          <DateTimeField
            label="Start date"
            value={ruleState?.startAt ? new Date(ruleState.startAt) : undefined}
            onChangeValue={(newDate) => {
              handleRuleUpdates({
                target: {name: 'startAt', value: newDate},
              });
            }}
          />
          <DateTimeField
            label="End date"
            value={ruleState?.expireAt ? new Date(ruleState.expireAt) : undefined}
            onChangeValue={(newDate) => {
              handleRuleUpdates({
                target: {name: 'expireAt', value: newDate},
              });
            }}
          />
          <TextareaField
            label="Remarks"
            name="remarks"
            value={ruleState?.remarks}
            onChange={(e) => handleRuleUpdates(e)}
            placeholder="Put your notes here"
            layout="horizontal-responsive"
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex">
            {ruleState?.id ? (
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="bg-gray-50 hover:bg-gray-50 shadow-none border-none">
                <span className="text-red-500">DELETE</span>
              </Button>
            ) : null}
            <div className="flex flex-grow justify-end">
              <Button variant="outline" className="mr-5" onClick={handleDismiss}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateUpdateRule}
                isLoading={createRuleLoading || updateRuleLoading}>
                {ruleState?.id ? 'SAVE CHANGES' : 'APPLY'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
