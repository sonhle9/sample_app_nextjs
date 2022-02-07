import * as React from 'react';
import {IDistribution, IVariant} from '../types';
import {PageContainer} from 'src/react/components/page-container';
import {useTargetingOptions, useVariableDetails} from '../variables.queries';
import {VariableEdit} from './variable-edit';
import {VariableHistory} from './variable-history';
import {VariableOptionCreate} from './variable-option-create';
import {VariableOptionDelete} from './variable-option-delete';
import {VariableOptionEdit} from './variable-option-edit';
import {VariableTargetingEdit} from './variable-targeting-edit';
import {
  VariableState,
  variableTypeDisplayNames,
  variableGroupDisplayNames,
  variableTargetingDisplayNames,
  getConstraintValues,
  defaultOptionTooltip,
} from '../const';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardHeading,
  DataTable as Table,
  DataTableCell as Cell,
  DataTableRow as Row,
  DataTableRowGroup as RowGroup,
  DotVerticalIcon,
  DropdownMenu,
  DropdownItem,
  DropdownMenuItems,
  EditIcon,
  Field,
  FieldContainer,
  formatDate,
  Label,
  TextInput,
  TrashIcon,
  MultiInput,
  Tooltip,
  InfoIcon,
} from '@setel/portal-ui';
import {variablesRoles} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {StaticPercentInput} from './percent-input';

export interface IVariableDetailsProps {
  id: string;
}

export function VariableDetails({id}: IVariableDetailsProps) {
  const {data: variable, isLoading, isError} = useVariableDetails(id);
  const {data: targetingOptions, isLoading: isTargetingOptionsLoading} = useTargetingOptions();
  const [operatorsToValueTypeMap, setOperatorsToValueTypeMap] = React.useState({});

  React.useEffect(() => {
    if (targetingOptions) {
      setOperatorsToValueTypeMap(
        targetingOptions.operators.reduce((obj, op) => {
          obj[op.key] = op.valueType;
          return obj;
        }, {}),
      );
    }
  }, [targetingOptions]);

  if (isLoading || isTargetingOptionsLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error.</p>;
  }

  const fields: Map<string, JSX.Element> = new Map([
    ['Group', <>{variableGroupDisplayNames.get(variable.group) || variable.group}</>],
    ['Variable key', <>{variable.key}</>],
    ['Variable name', <span data-testid="variable-name">{variable.name}</span>],
    ['Variable description', <>{variable.description}</>],
    ['Type', <>{variableTypeDisplayNames.get(variable.type) || variable.type}</>],
    [
      'Tags',
      <div className="flex flex-wrap">
        {(variable.tags || []).map((tag) => (
          <Badge color="grey" key={tag.key}>
            {tag.value}
          </Badge>
        ))}
      </div>,
    ],
    [
      'Created on',
      <>{formatDate(new Date(variable.createdAt * 1000), {formatType: 'dateAndTime'})}</>,
    ],
    [
      'Updated on',
      <>{formatDate(new Date(variable.updatedAt * 1000), {formatType: 'dateAndTime'})}</>,
    ],
  ]);

  const variants = new Map(Object.entries(variable.variants || {}));

  const percentageRolloutGrid = (distribution: IDistribution) => {
    return (
      <>
        <div key={distribution.variantKey} className="grid grid-cols-4 mt-5">
          <div className="my-auto">
            <p className="text-gray-600 text-sm">{distribution.variantKey}</p>
          </div>
          <StaticPercentInput className="bg-white" value={distribution.percent} />
        </div>
      </>
    );
  };

  return (
    <PageContainer heading="Variable details" className="space-y-4" data-testid="page">
      <Card>
        <CardHeading title="General">
          <HasPermission accessWith={[variablesRoles.update]}>
            <VariableEdit id={id} variable={variable} />
          </HasPermission>
        </CardHeading>
        <CardContent>
          <div className="py-4">
            {variable.state === VariableState.Ready && (
              <Alert
                variant="success"
                description="The current setup is ready to serve the variable to users."
              />
            )}
            {variable.state === VariableState.Created && (
              <Alert
                variant="warning"
                description="The setup is incomplete. Please setup the variable option and targeting to start serving the variable to users."
              />
            )}
          </div>

          {Array.from(fields.entries()).map(([key, value]) => (
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start mb-3" key={key}>
              <Label>{key}</Label>
              <div className="col-span-2 text-sm">{value}</div>
            </Field>
          ))}
        </CardContent>
      </Card>

      <Table
        heading={
          <>
            <CardHeading title="Variable options">
              {variants.size > 0 && (
                <HasPermission accessWith={[variablesRoles.update]}>
                  <VariableOptionCreate variable={variable} />
                </HasPermission>
              )}
            </CardHeading>
            {variants.size === 0 && (
              <CardContent>
                <div className="text-center" data-testid="no-variable-option">
                  <p className="py-2">You have not added any variable option yet.</p>
                  <p className="py-2">
                    <HasPermission accessWith={[variablesRoles.update]}>
                      <VariableOptionCreate variable={variable} />
                    </HasPermission>
                  </p>
                </div>
              </CardContent>
            )}
          </>
        }>
        {variants.size > 0 && (
          <>
            <RowGroup groupType="thead">
              <Row>
                <Cell>Variable option name</Cell>
                <Cell>Variable option description</Cell>
                <Cell>Variable option value</Cell>
                <Cell>{}</Cell>
              </Row>
            </RowGroup>
            <RowGroup>
              {Array.from(variants.entries()).map(([key, variant]) => (
                <Row key={key} data-testid="variable-option">
                  <Cell>{key}</Cell>
                  <Cell>{variant.description}</Cell>
                  <Cell>{formatVariantValue(variant)}</Cell>
                  <Cell className="text-right">
                    <HasPermission accessWith={[variablesRoles.update]}>
                      <DropdownMenu
                        variant="icon"
                        label={<DotVerticalIcon className="w-5 h-5 text-gray-500" />}>
                        <DropdownMenuItems className="min-w-32">
                          <HasPermission accessWith={[variablesRoles.update]}>
                            <VariableOptionEdit variable={variable} variantKey={key}>
                              {(onTrigger) => (
                                <DropdownItem onSelect={() => onTrigger()}>
                                  <EditIcon className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownItem>
                              )}
                            </VariableOptionEdit>
                          </HasPermission>
                          <VariableOptionDelete variable={variable} variantKey={key}>
                            {(onTrigger) => (
                              <DropdownItem onSelect={() => onTrigger()}>
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownItem>
                            )}
                          </VariableOptionDelete>
                        </DropdownMenuItems>
                      </DropdownMenu>
                    </HasPermission>
                  </Cell>
                </Row>
              ))}
            </RowGroup>
          </>
        )}
      </Table>

      <Table
        heading={
          <>
            <CardHeading title="Targeting">
              {variants.size > 0 && (
                <HasPermission accessWith={[variablesRoles.update]}>
                  <VariableTargetingEdit
                    variable={variable}
                    targetingOptions={targetingOptions}
                    operatorsToValueTypeMap={operatorsToValueTypeMap}
                  />
                </HasPermission>
              )}
            </CardHeading>
            <CardContent>
              {variants.size > 0 ? (
                <>
                  <div>
                    <div>
                      <Field className="grid grid-cols-4 items-start mb-3">
                        <Label className="my-auto">Targeting</Label>
                        <div className="text-sm">
                          <TextInput
                            className="bg-white"
                            value={variableTargetingDisplayNames.get(variable.isToggled)}
                            disabled
                          />
                        </div>
                      </Field>
                    </div>
                    {variable.isToggled && (
                      <div>
                        {variable.targets.map((target, indexTarget) => (
                          <div key={indexTarget} className="border border-gray-100 mb-6">
                            <div className="m-4">
                              <div>
                                <p color="black" className="font-medium">
                                  Rule {indexTarget + 1}
                                </p>
                              </div>
                              <div className="mt-4">
                                {target.constraints.map((constraint, indexConstraint) => (
                                  <div key={indexConstraint}>
                                    <div className="flex mb-6">
                                      {indexConstraint === 0 ? (
                                        <Badge color="grey" className="uppercase">
                                          if
                                        </Badge>
                                      ) : (
                                        <Badge color="grey" className="uppercase">
                                          and
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-3 -mt-3">
                                      <FieldContainer className="mr-2" label="Attribute">
                                        <Field>
                                          <TextInput
                                            disabled
                                            className="text-lightgrey bg-white"
                                            value={
                                              targetingOptions.properties.find(
                                                (op) => op.key === constraint.property,
                                              ).value
                                            }
                                          />
                                        </Field>
                                      </FieldContainer>
                                      <FieldContainer className="mr-2" label="Operator">
                                        <Field>
                                          <TextInput
                                            disabled
                                            className="text-lightgrey bg-white"
                                            value={
                                              targetingOptions.operators.find(
                                                (op) => op.key === constraint.operator,
                                              ).value
                                            }
                                          />
                                        </Field>
                                      </FieldContainer>
                                      <FieldContainer className="mb-0 mx-2" label="value">
                                        {operatorsToValueTypeMap[constraint.operator] ===
                                        'object' ? (
                                          <Field>
                                            <MultiInput
                                              disabled
                                              className="text-lightgrey bg-white"
                                              includeDraft
                                              values={getConstraintValues(
                                                constraint.value,
                                                operatorsToValueTypeMap[constraint.operator],
                                              )}
                                              badgeColor="grey"
                                            />
                                          </Field>
                                        ) : (
                                          <Field>
                                            <TextInput
                                              disabled
                                              className="text-lightgrey bg-white"
                                              value={constraint.value}
                                            />
                                          </Field>
                                        )}
                                      </FieldContainer>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 grid grid-cols-4">
                                <div className="my-auto">
                                  <p className="text-gray-600 text-sm">Variable option name</p>
                                </div>
                                <TextInput
                                  className="bg-white"
                                  disabled
                                  value={`${
                                    target.distributions.length === 1
                                      ? target.distributions[0].variantKey
                                      : 'Percentage rollout'
                                  }`}
                                />
                              </div>
                              {target.distributions.length > 1 &&
                                target.distributions.map((distribution) =>
                                  percentageRolloutGrid(distribution),
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <div className="grid grid-cols-4 mt-6">
                        {variable.isToggled && (
                          <div className="col-span-4">
                            <p className="font-medium mt-6">
                              Default variable option
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
                            </p>
                          </div>
                        )}
                        <div className="my-auto">
                          <p className="text-gray-600 text-sm">
                            <>
                              {variable.isToggled ? (
                                <>Variable option name</>
                              ) : (
                                <>Serve all users</>
                              )}
                            </>
                          </p>
                        </div>
                        <div>
                          {variable.isToggled ? (
                            <div>
                              <TextInput
                                disabled
                                className="bg-white my-auto"
                                value={`${
                                  variable.onVariation.length === 1
                                    ? variable.onVariation[0].variantKey
                                    : 'Percentage rollout'
                                }`}
                              />
                            </div>
                          ) : (
                            <div>
                              <TextInput
                                disabled
                                className="bg-white my-auto"
                                value={variable.offVariation}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {variable.isToggled &&
                        variable.onVariation?.length > 1 &&
                        variable.onVariation.map((distribution) =>
                          percentageRolloutGrid(distribution),
                        )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center">You have not setup targeting yet.</p>
              )}
            </CardContent>
          </>
        }></Table>

      <VariableHistory id={id} />
    </PageContainer>
  );
}

function formatVariantValue(variant: IVariant): string {
  return JSON.stringify(variant.value, undefined, 2);
}
