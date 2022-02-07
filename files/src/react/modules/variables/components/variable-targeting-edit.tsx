import * as lodash from 'lodash';
import * as React from 'react';
import {Confirm} from './confirm';
import {Field, FieldArray, Formik} from 'formik';
import {
  ConstraintOperator,
  convertConstraintValue,
  defaultOptionTooltip,
  getConstraintValues,
  getDefaultValue,
  getTargetedUsersByVariant,
  variableTargetingDisplayNames,
  getDefaultOnVariation,
} from '../const';
import {
  IConstraint,
  IDistribution,
  ITarget,
  ITargetingOptions,
  IVariable,
  OperatorValueType,
} from '../types';
import {useUpdateVariable} from '../variables.queries';
import {VariableTargetingOnVariationField} from './variable-targeting-on-variation';
import {
  Alert,
  Badge,
  Button,
  DropdownSelect,
  EditIcon,
  FieldContainer,
  FieldStatus,
  IconButton,
  InfoIcon,
  MinusIcon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInput,
  PlusIcon,
  Textarea,
  TextInput,
  Tooltip,
  TrashIcon,
} from '@setel/portal-ui';
import {VariablePercentageRollout} from './variable-percentage-rollout';

interface IVariableTargetingEdit {
  variable: IVariable;
  targetingOptions: ITargetingOptions;
  operatorsToValueTypeMap: {[key: string]: OperatorValueType};
}

export function VariableTargetingEdit({
  variable,
  targetingOptions,
  operatorsToValueTypeMap,
}: IVariableTargetingEdit) {
  const {mutate: updateVariable} = useUpdateVariable();
  const [showEditor, setShowEditor] = React.useState(false);
  const [isCancelOpen, toggleCancel] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="uppercase"
        leftIcon={<EditIcon />}
        onClick={() => setShowEditor(true)}
        data-testid="btn-edit">
        Edit
      </Button>
      <Modal
        isOpen={showEditor}
        onDismiss={() => toggleCancel(true)}
        aria-label="Edit targeting"
        data-testid="editor">
        <ModalHeader>Edit targeting</ModalHeader>
        <Formik<{
          isToggled: boolean;
          onVariation?: IDistribution[];
          offVariation?: string;
          targetedUsersByVariant: {variantKey: string; userIds: string[]}[];
          targets: ITarget[];
          comment?: string;
        }>
          initialValues={{
            isToggled: variable.isToggled,
            onVariation: variable.onVariation,
            offVariation: variable.offVariation,
            targetedUsersByVariant: getTargetedUsersByVariant(variable),
            targets: variable.targets,
          }}
          validate={(values) => {
            const errors: Map<string, string> = new Map();
            values.targets.map((target, indexTarget) => {
              target.constraints.map((constraint, indexConstraint) => {
                if (!constraint.value || Object.keys(constraint.value).length === 0) {
                  errors.set(
                    `targets.${indexTarget}.constraints.${indexConstraint}.value`,
                    'Required',
                  );
                }
              });
            });

            if (
              lodash.sum(values.onVariation.map((distribution) => distribution.percent)) !== 100
            ) {
              errors.set('onVariation', 'Total needs to be 100%');
            }

            values.targets.map((target, indexTarget) => {
              if (
                lodash.sum(target.distributions.map((distribution) => distribution.percent)) !== 100
              ) {
                errors.set(`targets.${indexTarget}.distributions`, 'Total needs to be 100%');
              }
            });

            if (errors.size > 0) {
              return Object.fromEntries(errors);
            }
          }}
          validateOnMount
          onSubmit={(values, actions) => {
            updateVariable(
              {
                key: variable.key,
                variable: {
                  isToggled: values.isToggled,
                  onVariation: values.onVariation,
                  offVariation: values.offVariation,
                  targets: values.targets,
                  comment: values.comment,
                },
              },
              {
                onSuccess: () => {
                  actions.setSubmitting(false);
                  setShowEditor(false);
                },
                onError: (e) => {
                  console.error(e);
                },
              },
            );
          }}>
          {({
            values,
            isSubmitting,
            handleSubmit,
            errors,
            touched,
            dirty,
            isValid,
            setFieldValue,
          }) => {
            const getHelpProps = (name: string) =>
              errors[name]
                ? {status: touched[name] ? ('error' as FieldStatus) : null, helpText: errors[name]}
                : {helpText: ' '};

            // Only enable last btn
            const shouldEnableAddingConstraint = (index, currentLength) => {
              return index === currentLength - 1;
            };

            // Only disable first
            const shouldDisableRemovingConstraint = (currentLength) => {
              return currentLength === 1;
            };
            return (
              <>
                <ModalBody>
                  {values.isToggled && values.targets.length === 0 && (
                    <Alert
                      className="mb-6"
                      variant="info"
                      description="Add targeting rule to set more granular and finely detailed targeting"
                    />
                  )}
                  <div className="grid grid-cols-4 mb-6">
                    <div className="my-auto">
                      <p className="text-gray-600 text-sm">Targeting</p>
                    </div>
                    <FieldContainer className="pu-mb-0">
                      <Field name="isToggled">
                        {({field}) => (
                          <DropdownSelect
                            className="text-lightgrey"
                            options={Array.from(variableTargetingDisplayNames.values())}
                            value={variableTargetingDisplayNames.get(field.value)}
                            onChangeValue={(newValue) =>
                              field.onChange({
                                target: {
                                  name: field.name,
                                  value: new Map(
                                    Array.from(variableTargetingDisplayNames.entries()).map(
                                      ([k, v]) => [v, k],
                                    ),
                                  ).get(newValue),
                                },
                              })
                            }
                          />
                        )}
                      </Field>
                    </FieldContainer>
                  </div>
                  {values.isToggled && (
                    <>
                      <div className="mb-6">
                        <FieldArray
                          name="targets"
                          render={(arrayHelperTargets) => (
                            <div>
                              {values.targets.map((target, indexTarget) => (
                                <div key={indexTarget} className="border border-gray-100 mb-6">
                                  <div className="m-4">
                                    <div className="flex">
                                      <p color="black" className="font-medium">
                                        Rule {indexTarget + 1}
                                      </p>
                                      <IconButton
                                        className="ml-auto"
                                        onClick={() => {
                                          return arrayHelperTargets.remove(
                                            values.targets.indexOf(target),
                                          );
                                        }}>
                                        <TrashIcon className="pu-text-error rounded w-6 h-6" />
                                      </IconButton>
                                    </div>
                                    <FieldArray
                                      name={`targets.${indexTarget}.constraints`}
                                      render={(arrayHelperConstraints) => (
                                        <div className="mt-4">
                                          {target.constraints.map((constraint, indexConstraint) => (
                                            <div key={indexConstraint}>
                                              <div className="flex mb-6">
                                                {indexConstraint === 0 ? (
                                                  <Badge color="grey" className="uppercase">
                                                    if
                                                  </Badge>
                                                ) : (
                                                  <Badge color="grey" className="uppercase -mt-3">
                                                    and
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="grid grid-cols-10 -mt-3">
                                                <FieldContainer
                                                  className="col-span-3 mr-2"
                                                  label="Attribute">
                                                  <Field
                                                    name={`targets.${indexTarget}.constraints.${indexConstraint}.property`}>
                                                    {({field}) => (
                                                      <DropdownSelect
                                                        className="text-lightgrey"
                                                        options={targetingOptions.properties.map(
                                                          (op) => ({
                                                            label: op.value,
                                                            value: op.key,
                                                          }),
                                                        )}
                                                        value={constraint.property}
                                                        onChangeValue={(newValue) => {
                                                          field.onChange({
                                                            target: {
                                                              name: field.name,
                                                              value: newValue,
                                                            },
                                                          });
                                                        }}
                                                      />
                                                    )}
                                                  </Field>
                                                </FieldContainer>
                                                <FieldContainer
                                                  className="col-span-3 mx-2"
                                                  label="Operator">
                                                  <Field
                                                    name={`targets.${indexTarget}.constraints.${indexConstraint}.operator`}>
                                                    {({field}) => (
                                                      <DropdownSelect
                                                        className="text-lightgrey"
                                                        options={targetingOptions.operators.map(
                                                          (op) => ({
                                                            label: op.value,
                                                            value: op.key,
                                                          }),
                                                        )}
                                                        value={constraint.operator}
                                                        onChangeValue={(newValue) => {
                                                          const value = getDefaultValue(
                                                            operatorsToValueTypeMap[newValue],
                                                          );
                                                          setFieldValue(
                                                            `targets.${indexTarget}.constraints.${indexConstraint}.value`,
                                                            value,
                                                          );
                                                          field.onChange({
                                                            target: {
                                                              name: field.name,
                                                              value: newValue,
                                                            },
                                                          });
                                                        }}
                                                      />
                                                    )}
                                                  </Field>
                                                </FieldContainer>
                                                <FieldContainer
                                                  className="col-span-3 mb-0 mx-2"
                                                  label={
                                                    <>
                                                      Value
                                                      <Tooltip
                                                        label={
                                                          <>
                                                            {operatorsToValueTypeMap[
                                                              constraint.operator
                                                            ] === 'object' ? (
                                                              <span>
                                                                Selected operator accepts multiple
                                                                values.
                                                                <br />
                                                                Hit tab or comma to add value
                                                              </span>
                                                            ) : (
                                                              <span>
                                                                Selected operator accepts single
                                                                value
                                                              </span>
                                                            )}
                                                          </>
                                                        }>
                                                        <InfoIcon className="w-4 h-4 ml-2 inline-block text-lightgrey" />
                                                      </Tooltip>
                                                    </>
                                                  }
                                                  {...getHelpProps(
                                                    `targets.${indexTarget}.constraints.${indexConstraint}.value`,
                                                  )}>
                                                  {operatorsToValueTypeMap[constraint.operator] ===
                                                  'object' ? (
                                                    <Field
                                                      name={`targets.${indexTarget}.constraints.${indexConstraint}.value`}>
                                                      {({field}) => (
                                                        <MultiInput
                                                          className="text-lightgrey"
                                                          values={getConstraintValues(
                                                            constraint.value,
                                                            operatorsToValueTypeMap[
                                                              constraint.operator
                                                            ],
                                                          )}
                                                          onChangeValues={(newValue) => {
                                                            const valueType =
                                                              operatorsToValueTypeMap[
                                                                constraint.operator
                                                              ];
                                                            field.onChange({
                                                              target: {
                                                                name: field.name,
                                                                value: convertConstraintValue(
                                                                  newValue,
                                                                  valueType,
                                                                ),
                                                              },
                                                            });
                                                          }}
                                                          badgeColor="grey"
                                                        />
                                                      )}
                                                    </Field>
                                                  ) : (
                                                    <Field
                                                      name={`targets.${indexTarget}.constraints.${indexConstraint}.value`}>
                                                      {({field}) => (
                                                        <TextInput
                                                          className="text-lightgrey"
                                                          value={constraint.value}
                                                          onChangeValue={(newValue) => {
                                                            field.onChange({
                                                              target: {
                                                                name: field.name,
                                                                value: newValue,
                                                              },
                                                            });
                                                          }}
                                                        />
                                                      )}
                                                    </Field>
                                                  )}
                                                </FieldContainer>
                                                <div className="my-auto">
                                                  <div className="grid grid-cols-2">
                                                    <IconButton
                                                      disabled={
                                                        !shouldEnableAddingConstraint(
                                                          indexConstraint,
                                                          target.constraints.length,
                                                        )
                                                      }
                                                      onClick={() => {
                                                        const newConstraint: IConstraint = {
                                                          property:
                                                            targetingOptions.properties[0].key,
                                                          operator: ConstraintOperator.Equal,
                                                          value: '',
                                                        };
                                                        arrayHelperConstraints.push(newConstraint);
                                                      }}>
                                                      <PlusIcon
                                                        className={`text-white rounded p-1 ${
                                                          shouldEnableAddingConstraint(
                                                            indexConstraint,
                                                            target.constraints.length,
                                                          )
                                                            ? 'pu-bg-brand-500'
                                                            : 'pu-bg-gray-300'
                                                        }`}
                                                      />
                                                    </IconButton>
                                                    <IconButton
                                                      className="text-white"
                                                      disabled={shouldDisableRemovingConstraint(
                                                        target.constraints.length,
                                                      )}
                                                      onClick={() =>
                                                        arrayHelperConstraints.remove(
                                                          target.constraints.indexOf(constraint),
                                                        )
                                                      }>
                                                      <MinusIcon
                                                        className={`text-white rounded p-1 ${
                                                          shouldDisableRemovingConstraint(
                                                            target.constraints.length,
                                                          )
                                                            ? 'pu-bg-gray-300'
                                                            : 'pu-bg-red-500'
                                                        }`}
                                                      />
                                                    </IconButton>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    />
                                    <div className="mt-3">
                                      <FieldContainer className="grid grid-cols-4">
                                        <div className="my-auto">
                                          <p className="text-gray-600 text-sm">
                                            Variable option name
                                          </p>
                                        </div>
                                        <Field
                                          className="text-lightgrey"
                                          name={`targets.${indexTarget}.distributions`}
                                          component={VariableTargetingOnVariationField}
                                          variantKeys={Object.keys(variable.variants)}
                                        />
                                      </FieldContainer>
                                    </div>
                                    {target.distributions.length > 1 && (
                                      <div className="grid grid-cols-4">
                                        <div className="col-span-2">
                                          <VariablePercentageRollout
                                            name={`targets.${indexTarget}.distributions`}
                                            variantKeys={Object.keys(variable.variants)}
                                            errors={errors}
                                            touched={touched}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <a
                                href="#"
                                className="inline uppercase text-brand-500 font-semibold text-xs mr-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const target: ITarget = {
                                    description: '',
                                    priority: values.targets.length + 1,
                                    constraints: [
                                      {
                                        property: targetingOptions.properties[0].key,
                                        operator: ConstraintOperator.Equal,
                                        value: '',
                                      },
                                    ],
                                    distributions: [
                                      {
                                        percent: 100,
                                        variantKey: Object.keys(variable.variants)[0],
                                      },
                                    ],
                                  };
                                  arrayHelperTargets.push(target);
                                }}>
                                + Add Targeting rule
                              </a>
                            </div>
                          )}
                        />
                      </div>
                    </>
                  )}
                  <hr />
                  <div className="grid grid-cols-4 mt-6 mb-1.5">
                    <div className="my-auto">
                      <p className="text-gray-600 text-sm">
                        <>
                          {values.isToggled ? (
                            <>
                              Default variable <br /> options
                              <span className="-m-1">
                                <Tooltip
                                  label={
                                    <>
                                      <span className="text-left whitespace-pre-line">
                                        {defaultOptionTooltip()}
                                      </span>
                                    </>
                                  }>
                                  <InfoIcon className="w-4 h-4 ml-2 inline-block text-lightgrey" />
                                </Tooltip>
                              </span>
                            </>
                          ) : (
                            <>Serve all users</>
                          )}
                        </>
                      </p>
                    </div>
                    <div className="my-auto">
                      <FieldContainer>
                        <div>
                          {values.isToggled ? (
                            <div className="flex-1">
                              <FieldContainer>
                                <Field
                                  name="onVariation"
                                  className="text-lightgrey"
                                  placeholder="Select variable options"
                                  component={VariableTargetingOnVariationField}
                                  variantKeys={Object.keys(variable.variants)}
                                  setFieldValue={setFieldValue}
                                  data-testid="input-onVariation"
                                />
                              </FieldContainer>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <FieldContainer className="-mb-5">
                                <Field name="offVariation">
                                  {({field}) => (
                                    <DropdownSelect
                                      placeholder="Select variable options"
                                      options={Object.keys(variable.variants)}
                                      value={field.value}
                                      onChangeValue={async (newValue) => {
                                        await setFieldValue(
                                          'onVariation',
                                          getDefaultOnVariation(variable),
                                        );
                                        return field.onChange({
                                          target: {name: field.name, value: newValue},
                                        });
                                      }}
                                    />
                                  )}
                                </Field>
                              </FieldContainer>
                            </div>
                          )}
                        </div>
                      </FieldContainer>
                    </div>
                  </div>
                  {values.isToggled && values.onVariation?.length > 1 && (
                    <div className="grid grid-cols-4" data-testid="percentage-rollout">
                      <div className="col-span-2">
                        <VariablePercentageRollout
                          name="onVariation"
                          variantKeys={Object.keys(variable.variants)}
                          data-testid="input-onVariation"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <div className="flex gap-3 justify-end">
                    <Confirm
                      header="Are you sure you want to leave this page?"
                      caption="If you leave this page, all unsaved changes will be lost."
                      cancel="Cancel"
                      confirm="Leave"
                      onConfirm={() => setShowEditor(false)}>
                      {(onTrigger) => (
                        <Button
                          variant="outline"
                          className="uppercase"
                          disabled={isSubmitting}
                          onClick={() => onTrigger()}
                          data-testid="btn-cancel">
                          Cancel
                        </Button>
                      )}
                    </Confirm>
                    <Confirm
                      header="Do you want to save this targeting?"
                      caption={
                        <>
                          <div className="mb-6">
                            You are about to save changes to variable <i>{variable.key}</i>. Click
                            save to proceed.
                          </div>
                          <Field
                            as={Textarea}
                            name="comment"
                            placeholder="Leave a comment… (optional)"
                          />
                        </>
                      }
                      cancel="Cancel"
                      confirm="Save"
                      onConfirm={() => handleSubmit()}>
                      {(onTrigger) => (
                        <Button
                          variant="primary"
                          className="uppercase"
                          disabled={!(dirty && isValid)}
                          isLoading={isSubmitting}
                          onClick={() => onTrigger()}
                          data-testid="btn-save">
                          Save changes
                        </Button>
                      )}
                    </Confirm>
                  </div>
                </ModalFooter>

                <Confirm
                  header="Are you sure you want to leave this page?"
                  caption="If you leave this page, all unsaved changes will be lost."
                  cancel="Cancel"
                  confirm="Leave"
                  open={isCancelOpen}
                  onConfirm={() => {
                    toggleCancel(false);
                    setShowEditor(false);
                  }}
                  onCancel={() => {
                    toggleCancel(false);
                  }}>
                  {(_) => <></>}
                </Confirm>
              </>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
}
