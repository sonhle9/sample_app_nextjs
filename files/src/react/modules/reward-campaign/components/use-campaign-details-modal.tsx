import * as React from 'react';
import {
  Button,
  Modal,
  titleCase,
  Badge,
  BareButton,
  IconButton,
  MiniDescendingIcon,
  MiniAscendingIcon,
  classes,
  Text,
  Card,
  Field,
  FieldContainer,
  HelpText,
  isString,
  FileSelector,
  FileItem,
  dedupeArray,
  useDebounce,
} from '@setel/portal-ui';
import {
  ICampaign,
  ICampaignCode,
  ICampaignTargeting,
  ICampaignGoal,
  ICampaignGoalCriteria,
  CriteriaType,
  campaignCategories,
  CampaignRestrictionType,
  consequenceExpiryTypeOptions,
  ConsequenceExpiryType,
  ConsequenceType,
  ICampaignConsequence,
  fuelTypes,
  transactionTypeOptions,
  topUpMethodsTypes,
  TopUpMethodsType,
  dependencyActionTypes,
  DependencyActionType,
} from 'src/shared/interfaces/reward.interface';
import {
  FormikDropdownField,
  FormikTextField,
  FormikTextareaField,
  FormikToggleField,
  FormikCheckboxField,
  FormikFieldArray,
  FormikFieldArrayComponentProps,
  FormikDecimalInput,
  FormikDateTimeField,
  FormikMultiSelectField,
  FormikMultiInputField,
  FormikRadioGroup,
} from 'src/react/components/formik';
import {Formik, useField} from 'formik';
import {CopyButton} from 'src/react/components/copy-button';
import * as Yup from 'yup';
import {
  useCampaignEnums,
  useVouchersBatchSearch,
  useCreateCampaign,
  useUpdateCampaign,
} from 'src/react/modules/reward-campaign/reward-campaign.queries';
import {getStation} from 'src/react/services/api-stations.service';
import {
  brazeAssignCampaignWebHookUrl,
  getCampaignByCode,
} from 'src/react/services/api-rewards.service';
import {difference, groupBy, filter, flatten} from 'lodash';
import {csvToJSON} from 'src/shared/helpers/file';
import {PeriodType, IPeriod, periodTypeOptions} from 'src/shared/interfaces/reward.interface';
import {useRouter} from 'src/react/routing/routing.context';
import {MAX_DATE} from 'src/react/modules/reward-campaign/reward-campaign.const';
import {parseISO, isEqual} from 'date-fns';
import {getCustomerType, CustomerType, customerTypeOptions} from './helper';

const formikMetaIndex = 1;
const formikHelperIndex = 2;

const campaignCategoryOptions = campaignCategories.map((value) => ({
  label: titleCase(value),
  value,
}));

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  startDate: Yup.date().required('Required').nullable(),
  period: Yup.object()
    .when(['periodToggle'], {
      is: (periodToggle: string[]) => periodToggle.length > 0,
      then: Yup.object({
        type: Yup.string().required('Required'),
        startEvery: Yup.string().when(['type'], {
          is: (periodType: PeriodType) => periodType === 'day',
          then: Yup.string().required('Required'),
        }),
        endEvery: Yup.string().when(['type'], {
          is: (periodType: PeriodType) => periodType === 'day',
          then: Yup.string().required('Required'),
        }),
      }),
    })
    .nullable(),
  goals: Yup.array(
    Yup.object({
      name: Yup.string().required('Required'),
      consequence: Yup.array(
        Yup.object({
          type: Yup.string().required('Required'),
          value: Yup.number()
            .min(1, 'Should be greater than 0')
            .nullable()
            .when(['type'], {
              is: (type: ConsequenceType) => type === 'voucher',
              then: Yup.number().required('Required'),
            }),
          voucherBatchId: Yup.string().when(['type'], {
            is: (type: ConsequenceType) => type === 'voucher',
            then: Yup.string().required('Required'),
          }),
          expiry: Yup.object({
            type: Yup.string().nullable(),
            value: Yup.string().when(['type'], {
              is: (type: ConsequenceType) => Boolean(type),
              then: Yup.string().required('Required'),
            }),
          }).nullable(),
        }).test(
          'uniqueVoucherBatchId',
          'Must be unique across multiple rewards',
          function (this, consequence) {
            const consequenceArray: ICampaignConsequence[] = this.parent;
            const voucherBatchIds = consequenceArray
              .filter((c) => Boolean(c.voucherBatchId))
              .map((c) => c.voucherBatchId);

            const isUnique = voucherBatchIds.length === new Set(voucherBatchIds).size;
            if (isUnique) return true;

            const groupByIds = groupBy(voucherBatchIds);
            const duplicateIdGroups = filter(groupByIds, (group) => group.length > 1);
            const duplicateIds = flatten(duplicateIdGroups);

            if (duplicateIds.includes(consequence.voucherBatchId)) {
              return this.createError({path: `${this.path}.voucherBatchId`});
            }
          },
        ),
      ).min(1, 'Goal should have at least one reward'),
      criteria: Yup.array(
        Yup.object({
          type: Yup.string().required('Required'),
          operator: Yup.string().required('Required'),
          target: Yup.number().required('Required').min(1, 'Should be greater than 0'),
          description: Yup.string().required('Required'),
          dependency: Yup.object({
            friendThreshold: Yup.number().min(1, 'Should be greater than 0'),
            stations: Yup.string()
              .test('isStationValid', 'Station not found', async (stationId = '') => {
                if (!(stationId ?? '').length) return true; // optional
                return new Promise((resolve) => {
                  getStation(stationId)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
                });
              })
              .nullable(),
          }),
        }),
      )
        .min(1, 'Goal should have at least one criteria')
        .test(
          'multiQuota',
          'Please select voucher as reward to enable multi quota',
          function (this) {
            const goal: ICampaignGoal = this.parent;
            const consequenceArray = goal.consequence as ICampaignConsequence[];
            const criteriaArray = goal.criteria;

            const voucherNotSelected = !consequenceArray.some((c) => c.type === 'voucher');
            const multiQuotaSelected = criteriaArray.filter((c) => c.type === 'quota').length > 1;

            return voucherNotSelected && multiQuotaSelected
              ? this.createError({path: `${this.path}.[0].type`})
              : true;
          },
        ),
    }),
  ).min(1, 'Campaign should have at least one goal'),
});

export function useCampaignDetailsModal(campaign?: ICampaign) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const isEdit = !!campaign;

  const updateCampaignMutation = useUpdateCampaign();
  const createCampaignMutation = useCreateCampaign();
  const isLoading = createCampaignMutation.isLoading || updateCampaignMutation.isLoading;

  // large - expensive to construct, wrap in memo
  const initialValues = React.useMemo(
    () => ({
      name: campaign?.name ?? '',
      description: campaign?.description ?? '',
      category: campaign?.category ?? '',
      isActive: campaign?.isActive ? ['true'] : [],
      manualOperation: campaign?.manualOperation ?? false,
      period: campaign?.period ?? ({type: 'day'} as IPeriod),
      periodToggle: campaign?.period ? ['true'] : [],
      type: campaign?.type,
      customerType: getCustomerType(campaign),
      startDate: campaign?.startDate ?? null,
      // if it's a date and not MAX_DATE (represents null in backend)
      endDate:
        campaign?.endDate && !isEqual(parseISO(campaign.endDate), MAX_DATE)
          ? campaign.endDate
          : null,
      rejectProgressAfterCampaignEnd: campaign?.rejectProgressAfterCampaignEnd ? ['true'] : [],
      includePastActions: campaign?.includePastActions ? ['true'] : [],
      multiGrant: campaign?.multiGrant ? ['true'] : [],
      restriction: campaign?.restriction ?? [],
      // props ending with ...Toggle purely UI, skip API
      customerListToggle:
        campaign?.includeList?.length || campaign?.excludeList?.length ? ['true'] : [],
      includeList: campaign?.includeList ?? [],
      excludeList: campaign?.excludeList ?? [],
      codesToggle: campaign?.codes?.length ? ['true'] : [],
      codes:
        campaign?.codes?.map((code) => ({
          ...code,
          // API doesn't return status, needed to filter on submit
          status: 'existing' as ICampaignCode['status'],
        })) ?? [],
      // multi input component only handles string[], so map codes for UI:
      codesAsString: campaign?.codes?.map(({code}) => code) ?? [],
      maxMembersCapToggle: campaign?.maxMembersCap ? ['true'] : [],
      maxMembersCap: campaign?.maxMembersCap,
      disqualifyVoucherBatchesToggle: campaign?.disqualifyVoucherBatches?.length ? ['true'] : [],
      disqualifyVoucherBatches: campaign?.disqualifyVoucherBatches ?? [],
      isGoalSequence: campaign?.goals?.every(({isSequenceGoal}) => isSequenceGoal) ? ['true'] : [],
      goals: campaign?.goals
        ? campaign?.goals.map((goal) => ({
            ...goal,
            consequence: Array.isArray(goal.consequence) ? goal.consequence : [goal.consequence],
            criteria: goal.criteria.map((criteria) => ({
              ...criteria,
              dependency: {
                ...criteria.dependency,
                // GA-978 if enrollment prop exists, set form control to true
                ...('enrollment' in (criteria.dependency ?? {}) ? {enrollment: true} : {}),
                ...((['topup_count', 'topup_total'] as CriteriaType[]).includes(criteria.type)
                  ? {
                      topUpMethods: criteria.dependency?.topUpMethods
                        ? Object.entries(criteria.dependency.topUpMethods)
                            .filter(([_key, value]) => Boolean(value))
                            .map(([key]) => key)
                        : ['debitAndCreditCard'], // default value
                    }
                  : {}), // no change
                ...((['max_reward_total'] as CriteriaType[]).includes(criteria.type)
                  ? {
                      actionType: criteria.dependency?.actionType
                        ? Object.entries(criteria.dependency.actionType)
                            .filter(([_key, value]) => Boolean(value))
                            .map(([key]) => key)
                        : [
                            'fuel_total',
                            'store_order_total',
                            'topup_total',
                            'concierge_order_total',
                          ], // default value,
                    }
                  : {}), // no change
              },
            })),
          }))
        : [],
    }),
    [campaign],
  );

  const header = `${isEdit ? 'Edit' : 'Create'} campaign details`;

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal isOpen={isLoading || isOpen} onDismiss={onClose} header={header} size="large">
        <Formik
          // form too huge for validateOnChange:true, render blocking
          validateOnChange={false}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            const isPerkCategory = values.category === 'perk';

            const allCustomerType = values.customerType === 'all';
            const existingCustomerType = values.customerType === 'existing';
            const hiddenCustomerType = values.customerType === 'hidden';
            const newCustomerType = values.customerType === 'new';

            const customerListToggleOn = values.customerListToggle.length > 0;
            const codesToggleOn = values.codesToggle.length > 0;
            const maxMembersCapToggleOn = values.maxMembersCapToggle.length > 0;
            const disqualifyVoucherBatchesToggleOn =
              values.disqualifyVoucherBatchesToggle.length > 0;
            const periodToggleOn = values.periodToggle.length > 0;

            const perkCategoryWhitelist: CampaignRestrictionType[] = ['birthdayMonth'];
            const allCustomerWhitelist: CampaignRestrictionType[] = ['birthdayMonth'];
            const hiddenCustomerWhitelist: CampaignRestrictionType[] = ['hidden'];

            const newMemberWhitelist: CampaignRestrictionType[] = ['newMember', 'birthdayMonth'];

            const newCustomerWhitelist: CampaignRestrictionType[] = [
              'newMember',
              'memberReferral',
              'withoutPromoCode',
              'birthdayMonth',
            ];

            const existingCustomerWhitelist: CampaignRestrictionType[] = [
              'brazeCustomer',
              'birthdayMonth',
            ];

            const restriction = values.restriction.filter((r) =>
              isPerkCategory
                ? perkCategoryWhitelist.includes(r)
                : (hiddenCustomerType && hiddenCustomerWhitelist.includes(r)) ||
                  (newCustomerType &&
                    (values.restriction.includes('newMember')
                      ? newMemberWhitelist.includes(r)
                      : newCustomerWhitelist.includes(r))) ||
                  (existingCustomerType && existingCustomerWhitelist.includes(r)) ||
                  (allCustomerType && allCustomerWhitelist.includes(r)),
            );

            const newMemberRestriction = restriction.includes('newMember');
            const brazeCustomerRestriction = restriction.includes('brazeCustomer');
            const allowFileTargeting =
              customerListToggleOn && !brazeCustomerRestriction && existingCustomerType;
            const allowManualOperation = allowFileTargeting && values.includeList.length > 0;
            const allowBrazeWebhookMultiGrant = existingCustomerType && brazeCustomerRestriction;

            const submitValues = {
              name: values.name,
              // GA-436 - only submit campaign type to API if truthy:
              ...(values.type ? {type: values.type} : {}),
              description: values.description,
              category: values.category,
              isActive: values.isActive.length > 0,
              startDate: values.startDate,
              endDate: values.endDate,
              rejectProgressAfterCampaignEnd: values.rejectProgressAfterCampaignEnd.length > 0,
              includePastActions: values.includePastActions.length > 0,
              multiGrant: allowBrazeWebhookMultiGrant ? values.multiGrant.length > 0 : false,
              manualOperation: allowManualOperation ? values.manualOperation : false,
              ...(periodToggleOn
                ? {
                    period: {
                      type: values.period.type,
                      ...(values.period.type === 'day'
                        ? {
                            startEvery: +values.period.startEvery,
                            endEvery: +values.period.endEvery,
                          }
                        : {}),
                    },
                  }
                : {}),
              includeList: allowFileTargeting ? values.includeList : [],
              excludeList: allowFileTargeting ? values.excludeList : [],
              codes:
                codesToggleOn && !newMemberRestriction && newCustomerType
                  ? values.codes.filter((code) => code.status !== 'existing')
                  : values.codes.map((code) => ({...code, status: 'deleted'} as ICampaignCode)),
              maxMembersCap:
                maxMembersCapToggleOn && codesToggleOn && !newMemberRestriction && newCustomerType
                  ? values.maxMembersCap
                  : undefined,
              disqualifyVoucherBatches:
                disqualifyVoucherBatchesToggleOn && newCustomerType
                  ? values.disqualifyVoucherBatches
                  : [],
              restriction,
              goals: values.goals.map(
                ({criteria, ...goal}) =>
                  ({
                    ...goal,
                    campaignCategory: values.category,
                    isSequenceGoal: values.isGoalSequence.length > 0,
                    criteria: criteria.map(
                      ({
                        dependency: {topUpMethods, actionType, enrollment, ...restOfDependency},
                        ...restOfCriteria
                      }) =>
                        ({
                          ...restOfCriteria,
                          dependency: {
                            // map form control array back to API object
                            ...(topUpMethods
                              ? {
                                  topUpMethods: topUpMethodsTypes.reduce((methodsObject, type) => {
                                    const methodsArray = topUpMethods as TopUpMethodsType[];
                                    methodsObject[type] = methodsArray.includes(type);
                                    return methodsObject;
                                  }, {}),
                                }
                              : {}),
                            ...(actionType
                              ? {
                                  actionType: dependencyActionTypes.reduce(
                                    (actionTypeObject, type) => {
                                      const actionTypeArray = actionType as DependencyActionType[];
                                      actionTypeObject[type] = actionTypeArray.includes(type);
                                      return actionTypeObject;
                                    },
                                    {},
                                  ),
                                }
                              : {}),
                            // GA-978 enrollment - if selected, save as false, else omit
                            ...(enrollment ? {enrollment: false} : {}),
                            ...restOfDependency,
                          },
                        } as ICampaignGoalCriteria),
                    ),
                  } as ICampaignGoal),
              ),
            } as ICampaign;

            if (isEdit) {
              updateCampaignMutation.mutate(
                {id: campaign._id, campaign: submitValues},
                {onSuccess: () => setIsOpen(false)},
              );
            } else {
              createCampaignMutation.mutate(submitValues, {
                onSuccess: (campaign) => {
                  router.navigateByUrl(`rewards/rewards-campaigns/${campaign._id}`);
                },
              });
            }
          }}>
          {({values, errors, handleSubmit, setFieldValue}) => (
            <>
              <Modal.Body>
                <FormikTextField
                  fieldName="name"
                  label={
                    <>
                      <div>Campaign title</div>
                      <HelpText>(Required)</HelpText>
                    </>
                  }
                  className="w-96"
                />
                <FormikCheckboxField
                  fieldName="isActive"
                  label="Status"
                  options={[{label: 'Active', value: 'true'}]}
                />
                <FormikDropdownField
                  aria-label="category"
                  fieldName="category"
                  label="Category"
                  placeholder="Please select"
                  options={campaignCategoryOptions}
                  className="w-96"
                />
                <FormikTextareaField fieldName="description" label="Description" className="w-96" />
                {values.category !== 'perk' && (
                  <FormikDropdownField
                    fieldName="customerType"
                    label="Targeting"
                    options={customerTypeOptions}
                    className="w-96"
                    onChangeValue={(customerType: CustomerType) => {
                      // unlike other values, 'hidden' restriction has no form control
                      // manually update restriction [] for hidden
                      setFieldValue(
                        'restriction',
                        customerType === 'hidden'
                          ? values.restriction.concat('hidden')
                          : values.restriction.filter((r) => r !== 'hidden'),
                      );
                    }}
                  />
                )}
                {values.customerType === 'existing' && (
                  <ExistingCustomerFields campaign={campaign} />
                )}
                {values.customerType === 'new' && <NewCustomerFields />}
                <FormikDateTimeField
                  data-testid="startDate"
                  label="Start date"
                  fieldName="startDate"
                />
                <FormikDateTimeField label="End date" fieldName="endDate" />
                <FormikCheckboxField
                  fieldName="rejectProgressAfterCampaignEnd"
                  label="All goals expire on campaign end date"
                  options={[
                    {
                      label: 'Enable',
                      value: 'true',
                      disabled: !Boolean(values.endDate),
                    },
                  ]}
                />
                <FormikCheckboxField
                  fieldName="periodToggle"
                  label=""
                  options={[
                    {
                      label: 'Periodic Campaign',
                      value: 'true',
                    },
                  ]}
                />
                {values.periodToggle.length > 0 && (
                  <>
                    <FormikRadioGroup
                      fieldName="period.type"
                      label="Periodic range"
                      options={periodTypeOptions}
                    />
                    {values.period.type === 'day' && (
                      <>
                        <FormikDecimalInput
                          fieldName="period.startEvery"
                          label="Start at"
                          placeholder="15"
                          className="w-11"
                          postFixLabel="of every month"
                          min={1}
                          max={31}
                          decimalPlaces={0}
                        />
                        <FormikDecimalInput
                          fieldName="period.endEvery"
                          label="End at"
                          placeholder="14"
                          className="w-11"
                          postFixLabel="of every month"
                          min={1}
                          max={31}
                          decimalPlaces={0}
                        />
                      </>
                    )}
                  </>
                )}
                <FormikCheckboxField
                  fieldName="restriction"
                  label="Restrictions"
                  options={[
                    {
                      label: 'Available for customer birthday month',
                      value: 'birthdayMonth',
                    },
                  ]}
                />
                <FormikCheckboxField
                  fieldName="includePastActions"
                  label="Include past actions to goals for all users"
                  options={[{label: 'Enable', value: 'true'}]}
                />
                <FormikCheckboxField
                  fieldName="isGoalSequence"
                  label="Goal sequence"
                  options={[{label: 'Enable', value: 'true'}]}
                />
                <Field status={errors.goals ? 'error' : undefined}>
                  <FormikFieldArray
                    label="Goals"
                    arrayName="goals"
                    newItemValue={
                      {
                        name: '',
                        isActive: false,
                        groupGoal: false,
                        multiReward: false,
                        criteria: [],
                        consequence: [],
                      } as ICampaignGoal
                    }
                    renderField={(props) => <FormikFieldArrayGoal {...props} />}
                    addButtonText={() => 'add goal'}
                  />
                  {isString(errors.goals) && <HelpText>{errors.goals}</HelpText>}
                </Field>
              </Modal.Body>
              <Modal.Footer className="flex justify-end">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="uppercase mr-3"
                  onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="uppercase"
                  onClick={() => handleSubmit()}
                  isLoading={isLoading}
                  disabled={isLoading}>
                  Save
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>
    ),
  };
}

function ExistingCustomerFields({campaign}: {campaign: ICampaign}) {
  const restriction: CampaignRestrictionType[] = useField('restriction')[formikMetaIndex].value;
  const customerListToggle: string[] = useField('customerListToggle')[formikMetaIndex].value;
  const customerListToggleOn = customerListToggle.length > 0;

  return (
    <>
      <FormikCheckboxField
        fieldName="restriction"
        label="Existing customer options"
        options={[
          {
            label: 'Customers entering Braze Campaign',
            value: 'brazeCustomer',
          },
        ]}
        wrapperClass="mb-0"
      />
      <FormikCheckboxField
        fieldName="customerListToggle"
        label=""
        options={[
          {
            label: 'Import list of customers',
            value: 'true',
            disabled: restriction.includes('brazeCustomer'),
          },
        ]}
      />
      {restriction.includes('brazeCustomer') ? (
        <BrazeCustomer campaign={campaign} />
      ) : (
        customerListToggleOn && <UsersTargeting />
      )}
    </>
  );
}

function BrazeCustomer({campaign}: {campaign: ICampaign}) {
  const brazeWebhookTemplate = JSON.stringify({
    campaignId: campaign?._id,
    userId: '{{${user_id}}}',
    triggeredBy: {name: '{{campaign.${name}}}', type: 'braze'},
  });

  return (
    <>
      <FormikCheckboxField
        fieldName="multiGrant"
        label="Multiple granting via webhook"
        options={[{label: 'Enable', value: 'true'}]}
      />
      <FieldContainer
        label="Campaign Webhook URL"
        labelAlign="start"
        layout="horizontal-responsive">
        <CopyButton
          textToCopy={brazeAssignCampaignWebHookUrl}
          successLeftIcon=""
          className="text-left w-96 h-auto p-3 block break-words">
          {brazeAssignCampaignWebHookUrl}
        </CopyButton>
        <HelpText>Click to copy</HelpText>
      </FieldContainer>
      <FieldContainer
        label="Campaign Webhook template"
        labelAlign="start"
        layout="horizontal-responsive">
        {brazeWebhookTemplate ? (
          <>
            <CopyButton
              textToCopy={brazeWebhookTemplate}
              successLeftIcon=""
              className="text-left w-96 h-auto p-3 block break-words">
              {brazeWebhookTemplate}
            </CopyButton>
            <HelpText>Click to copy</HelpText>
          </>
        ) : (
          'Will be available after save'
        )}
      </FieldContainer>
    </>
  );
}

function UsersTargeting() {
  const includeList: ICampaignTargeting[] = useField('includeList')[formikMetaIndex].value;
  const excludeList: ICampaignTargeting[] = useField('excludeList')[formikMetaIndex].value;
  const {setValue: setIncludeList} = useField('includeList')[formikHelperIndex];
  const {setValue: setExcludeList} = useField('excludeList')[formikHelperIndex];
  const {setValue: setManualOperation} = useField('manualOperation')[formikHelperIndex];

  // includeList empty, disallow manual operation, reset to false
  React.useEffect(() => {
    if (includeList.length === 0) setManualOperation(false);
  }, [includeList]);

  return (
    <FieldContainer label="Users targeting" labelAlign="start" layout="horizontal-responsive">
      <Card expandable defaultIsOpen>
        <Card.Heading title="Include List">
          <FormikToggleField
            fieldName="manualOperation"
            toggleLabel="Manual Granting"
            label=""
            layout="vertical"
            wrapperClass="mb-0"
            disabled={includeList.length === 0}
          />
        </Card.Heading>
        <Card.Content>
          <FileSelector
            description="Upload csv with a single column of user ids"
            fileType="csv"
            onFilesSelected={parseCsvAnd(setIncludeList, includeList)}
          />
          <FileList list={includeList} setList={setIncludeList} />
        </Card.Content>
      </Card>
      <Card expandable defaultIsOpen className="mt-4">
        <Card.Heading title="Exclude List" />
        <Card.Content>
          <FileSelector
            description="Upload csv with a single column of user ids"
            fileType="csv"
            onFilesSelected={parseCsvAnd(setExcludeList, excludeList)}
          />
          <FileList list={excludeList} setList={setExcludeList} />
        </Card.Content>
      </Card>
    </FieldContainer>
  );
}

const parseCsvAnd =
  (setList: (newList: ICampaignTargeting[]) => void, oldList: ICampaignTargeting[]) =>
  ([file]) => {
    const reader = new FileReader();
    reader.onload = () => {
      const usersId = csvToJSON(reader.result)
        // extract id from first column [0]
        .map((row) => Object.values(row)[0])
        // drop falsy values like empty rows
        .filter(Boolean) as ICampaignTargeting['usersId'];

      setList(oldList.concat({filename: file.name, usersId}));
    };
    reader.onerror = () => reader.abort();
    reader.readAsText(file);
  };

type FileListProps = {
  list: ICampaignTargeting[];
  setList: (newList: ICampaignTargeting[]) => void;
};

const FileList = ({list, setList}: FileListProps) => (
  <div className="px-1 py-4 space-y-2">
    {list.map((item, index) => (
      // TODO: json preview in angular feat
      // FileItem has no preview callback prop
      // onRemove doesn't return event.preventDefault
      // so can't onClick whole FileItem without affecting onRemove
      <FileItem
        key={index}
        fileName={item.filename}
        compact
        onRemove={() => setList(list.filter((_, i) => i !== index))}
      />
    ))}
  </div>
);

function NewCustomerFields() {
  const restriction: CampaignRestrictionType[] = useField('restriction')[formikMetaIndex].value;
  const codesToggle: string[] = useField('codesToggle')[formikMetaIndex].value;
  const codes: ICampaignCode[] = useField('codes')[formikMetaIndex].value;
  const codesAsString: string[] = useField('codesAsString')[formikMetaIndex].value;
  const maxMembersCapToggle: string[] = useField('maxMembersCapToggle')[formikMetaIndex].value;

  const {setValue: setCodes} = useField('codes')[formikHelperIndex];
  const {setValue: setCodesAsString, setError: setCodesAsStringError} =
    useField('codesAsString')[formikHelperIndex];

  const codesToggleOn = codesToggle.length > 0;
  const maxMembersCapToggleOn = maxMembersCapToggle.length > 0;
  const newMemberSelected = restriction.includes('newMember');

  return (
    <>
      <FormikCheckboxField
        fieldName="restriction"
        label="Specify requirements to be eligible for campaign"
        options={[
          {
            label: 'All new customers',
            value: 'newMember',
          },
          {
            label: 'All new customers with a valid referral code set upon registration',
            value: 'memberReferral',
            disabled: newMemberSelected,
          },
          {
            label: 'All new customers without referral code, campaign code, or voucher code',
            value: 'withoutPromoCode',
            disabled: newMemberSelected,
          },
        ]}
        wrapperClass="mb-0"
      />
      <FormikCheckboxField
        fieldName="codesToggle"
        label=""
        options={[
          {
            label:
              'All new customers with the following code (c- code input) set upon registration',
            value: 'true',
            disabled: newMemberSelected,
          },
        ]}
      />
      {codesToggleOn && !newMemberSelected && (
        <>
          <FormikMultiInputField
            label="Codes"
            fieldName="codesAsString"
            placeholder="Type code and press enter..."
            helpText="Enter code without 'c-'"
            // override onChangeValues for async validation
            onChangeValues={(newCodesAsString) => {
              const oldCodesLength = codesAsString.length;
              const newCodesLength = newCodesAsString.length;
              // deduce if it's add or delete operation by array length change
              const codeWasRemoved = newCodesLength === 0 || newCodesLength < oldCodesLength;

              // delete operation
              if (codeWasRemoved) {
                const [removedCodeString] = difference(codesAsString, newCodesAsString);

                // API deletes objects marked with status 'deleted'
                setCodes(
                  codes.map((code) => ({
                    ...code,
                    status:
                      code.code === removedCodeString
                        ? ('deleted' as ICampaignCode['status'])
                        : code.status,
                  })),
                );
                setCodesAsString(newCodesAsString);
                setCodesAsStringError(undefined);

                return;
              }

              // add operation - do static + async validation
              const codePrefix = 'c-';
              const codeMinLength = 6;
              const codeMaxLength = 9;
              const validCodeRegex = /^[0-9a-zA-Z-]*$/;

              // pop new value - static validate, add prefix if needed
              const codeAdded = newCodesAsString.pop();
              const hasPrefix = codeAdded.indexOf(codePrefix) === 0;
              const code = hasPrefix ? codeAdded : `${codePrefix}${codeAdded}`;

              const errorMessage =
                (codesAsString?.some((existingCode) => existingCode === code) &&
                  `${code} already exists`) ||
                (code.length < codeMinLength &&
                  `Min ${codeMinLength - codePrefix.length} characters`) ||
                (code.length > codeMaxLength &&
                  `Max ${codeMaxLength - codePrefix.length} characters`) ||
                (!validCodeRegex.test(code) &&
                  "Code should contain only numbers, alphabets and '-' symbol");

              if (errorMessage) {
                setCodesAsStringError(errorMessage);
              } else {
                // async validate if code exists in other campaigns
                getCampaignByCode(code)
                  // already exists, invalid
                  .then(() => {
                    setCodesAsStringError(`${code} already exists`);
                  })
                  .catch((error) => {
                    // 404 - code not found (not used), valid to add
                    if (error.response?.status === 404) {
                      setCodes(
                        codes.concat({
                          code,
                          status: 'new',
                        }) as ICampaignCode[],
                      );

                      setCodesAsString(newCodesAsString.concat(code));
                      setCodesAsStringError(undefined);
                    } else {
                      // display other errors
                      setCodesAsStringError(error.message);
                    }
                  });
              }
            }}
          />
          <FormikCheckboxField
            fieldName="maxMembersCapToggle"
            label=""
            options={[
              {
                label: 'Campaign code fully redeemed',
                value: 'true',
              },
            ]}
          />
          {maxMembersCapToggleOn && (
            <FormikDecimalInput
              fieldName="maxMembersCap"
              label="Maximum eligible members"
              className="w-96"
            />
          )}
        </>
      )}
      <DisqualifyCustomerFields />
    </>
  );
}

function DisqualifyCustomerFields() {
  const initialVoucherBatches = useField('disqualifyVoucherBatches')[formikMetaIndex].value;
  const voucherBatchesToggle = useField('disqualifyVoucherBatchesToggle')[formikMetaIndex].value;
  const voucherBatchesToggleOn = voucherBatchesToggle.length > 0;
  const [searchKey, setSearchKey] = React.useState('');
  const debouncedSearchKey = useDebounce(searchKey);
  const {data} = useVouchersBatchSearch({
    enabled: voucherBatchesToggleOn,
    name: debouncedSearchKey,
    ids: initialVoucherBatches,
  });
  const vouchersBatch = data?.items || [];

  return (
    <>
      <FormikCheckboxField
        fieldName="disqualifyVoucherBatchesToggle"
        label="Specify requirements to disqualify customer from receiving campaign"
        options={[
          {
            label: 'Customers registering with a voucher core',
            value: 'true',
          },
        ]}
      />
      {voucherBatchesToggleOn && (
        <FormikMultiSelectField
          fieldName="disqualifyVoucherBatches"
          label="Ineligible vouchers to receive campaign"
          options={vouchersBatch.map(({_id, name}) => ({
            label: name,
            value: _id,
          }))}
          onInputValueChange={setSearchKey}
        />
      )}
    </>
  );
}

function FormikFieldArrayGoal({
  index,
  remove,
  move,
  fieldName,
  arrayName,
}: FormikFieldArrayComponentProps) {
  const goals: ICampaignGoal[] = useField(`${arrayName}`)[formikMetaIndex].value;
  const goal: ICampaignGoal = useField(`${fieldName}`)[formikMetaIndex].value;
  const [, {error: criteriaError}] = useField(`${fieldName}.criteria`);
  const [, {error: consequenceError}] = useField(`${fieldName}.consequence`);
  const {groupGoal, criteria, consequence} = goal;

  const {setValue: setMultiReward} = useField(`${fieldName}.multiReward`)[formikHelperIndex];
  const {setValue: setGroupGoal} = useField(`${fieldName}.groupGoal`)[formikHelperIndex];
  const {setValue: setGoalIsActive} = useField(`${fieldName}.isActive`)[formikHelperIndex];

  const consequenceArray = goal.consequence as ICampaignConsequence[];
  const enableMultiReward = !groupGoal && consequenceArray.some(({type}) => type === 'percent');

  const onChangeConsequenceType = (type: ConsequenceType) => {
    const toTrue = consequenceArray.length === 1 && type === 'loyaltyPointsPercent';
    setMultiReward(toTrue);
    // groupGoal & multiReward are either-or toggles, only 1 can be true
    if (toTrue) setGroupGoal(false);
  };

  const quotaExceeded = React.useMemo(
    () => criteria.filter((c) => c.type === 'quota').some((c) => c.current >= c.target),
    [criteria],
  );

  const groupGoalCompleted = React.useMemo(
    () => groupGoal && criteria.every((c) => c.current !== 0 && c.current >= c.target),
    [groupGoal, criteria],
  );

  React.useEffect(() => {
    if (groupGoalCompleted || quotaExceeded) setGoalIsActive(false);
  }, [groupGoalCompleted, quotaExceeded]);

  return (
    <Card expandable defaultIsOpen={!Boolean(goal.name)}>
      <Card.Heading title={goal.name}>
        <section className="flex items-center space-x-1">
          <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
            REMOVE
          </BareButton>
          {index !== 0 && (
            <IconButton onClick={() => move(index, index - 1)}>
              <MiniDescendingIcon className="w-5 h-5 text-brand-500" />
            </IconButton>
          )}
          {index !== goals.length - 1 && (
            <IconButton onClick={() => move(index, index + 1)}>
              <MiniAscendingIcon className="w-5 h-5 text-brand-500" />
            </IconButton>
          )}
        </section>
      </Card.Heading>
      <Card.Content>
        <FormikTextField
          label="Goal title *"
          fieldName={`${fieldName}.name`}
          placeholder="Insert text"
        />
        <FormikTextareaField
          label="Goal description"
          fieldName={`${fieldName}.description`}
          placeholder="Insert text"
        />
        <section className="grid grid-cols-3">
          <FormikToggleField
            toggleLabel="Multi reward"
            fieldName={`${fieldName}.multiReward`}
            label=""
            layout="vertical"
            disabled={!enableMultiReward}
          />
          <FormikToggleField
            toggleLabel="Group goal"
            fieldName={`${fieldName}.groupGoal`}
            label=""
            layout="vertical"
            disabled={goal.multiReward}
          />
          <FormikToggleField
            toggleLabel={
              <Badge rounded="rounded" color={goal.isActive ? 'success' : 'grey'}>
                {goal.isActive ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
            }
            fieldName={`${fieldName}.isActive`}
            label=""
            layout="vertical"
            disabled={quotaExceeded || groupGoalCompleted}
            helpText={[
              quotaExceeded && 'Quota exceeded',
              groupGoalCompleted && 'Group goal completed',
            ]
              .filter(Boolean)
              .join('. ')}
          />
        </section>
        <Card expandable defaultIsOpen>
          <Card.Heading title="Rewards" />
          <Card.Content>
            <Field status={consequenceError ? 'error' : undefined}>
              <FormikFieldArray
                label=""
                layout="vertical"
                arrayName={`${fieldName}.consequence`}
                newItemValue={{} as ICampaignConsequence}
                renderField={(props) => (
                  <FormikFieldArrayReward
                    {...props}
                    criteria={criteria}
                    onChangeConsequenceType={onChangeConsequenceType}
                  />
                )}
                addButtonText={() => 'add reward'}
              />
              {isString(consequenceError) && <HelpText>{consequenceError}</HelpText>}
            </Field>
          </Card.Content>
        </Card>
        <Card expandable defaultIsOpen className="mt-5">
          <Card.Heading title="Criteria" />
          <Card.Content>
            <Field status={criteriaError ? 'error' : undefined}>
              <FormikFieldArray
                label=""
                layout="vertical"
                arrayName={`${fieldName}.criteria`}
                newItemValue={{} as ICampaignGoalCriteria}
                renderField={(props) => (
                  <FormikFieldArrayCriteria {...props} consequence={consequence as []} />
                )}
                addButtonText={() => 'add criteria'}
              />
              {isString(criteriaError) && <HelpText>{criteriaError}</HelpText>}
            </Field>
          </Card.Content>
        </Card>
      </Card.Content>
    </Card>
  );
}
const percentVisibleCriteria: CriteriaType[] = ['fuel_total', 'topup_total'];
const loyaltyPointsPercentVisibleCriteria: CriteriaType[] = ['max_reward_total'];

function FormikFieldArrayReward({
  index,
  remove,
  fieldName,
  arrayName,
  criteria,
  onChangeConsequenceType,
}: FormikFieldArrayComponentProps & {
  onChangeConsequenceType?: (type: ConsequenceType) => void;
  criteria: ICampaignGoalCriteria[];
}) {
  const {data: enums} = useCampaignEnums();
  const consequences: ICampaignConsequence[] = useField(arrayName)[formikMetaIndex].value;
  const consequenceType: ConsequenceType = useField(`${fieldName}.type`)[formikMetaIndex].value;
  const expiryType: ConsequenceExpiryType = useField(`${fieldName}.expiry.type`)[formikMetaIndex]
    .value;

  const {setValue: setConsequenceType} = useField(`${fieldName}.type`)[formikHelperIndex];
  const {setValue: setExpiry} = useField(`${fieldName}.expiry`)[formikHelperIndex];
  const {setValue: setExpiryValue} = useField(`${fieldName}.expiry.value`)[formikHelperIndex];
  const {setValue: setVoucherBatchId} = useField(`${fieldName}.voucherBatchId`)[formikHelperIndex];

  const consequenceTypeSelected = (type: ConsequenceType) =>
    consequences.some((c) => c.type === type);
  const percentConsequenceSelected = consequenceTypeSelected('percent');
  const campaignConsequenceSelected = consequenceType === 'campaign';
  const cashbackConsequenceSelected = consequenceTypeSelected('cashback');
  const noneConsequenceSelected = consequenceTypeSelected('none');
  const voucherConsequenceSelected = consequenceTypeSelected('voucher');

  // expensive - only populate with criteria types selected
  const criteriaTypeOptions = React.useMemo(
    () =>
      Object.entries(enums?.criteria ?? {})
        .map(([value, label]) => ({value: value as CriteriaType, label}))
        .filter((option) => criteria.map((c) => c.type).includes(option.value)),
    [enums, criteria],
  );

  // expensive - show percent options if certain criteria selected
  const allowedConsequenceTypeOptions = React.useMemo(
    () =>
      Object.entries(enums?.consequence ?? {})
        .map(([value, label]) => ({
          label,
          value: value as ConsequenceType,
        }))
        .filter((option) =>
          (['percent', 'loyaltyPointsPercent'] as ConsequenceType[]).includes(option.value)
            ? (option.value === 'percent' &&
                criteria
                  .map(({type}) => type)
                  .find((type) => percentVisibleCriteria.includes(type))) ||
              (option.value === 'loyaltyPointsPercent' &&
                criteria
                  .map(({type}) => type)
                  .find((type) => loyaltyPointsPercentVisibleCriteria.includes(type)))
            : true,
        ),
    [enums, criteria],
  );

  const onChangeExpiryType = (type: ConsequenceExpiryType) => {
    if (Boolean(type)) setExpiryValue(undefined);
    else setExpiry(null);
  };

  // if selected consequence no longer in options, reset value
  React.useEffect(() => {
    if (!consequenceType) return;
    if (allowedConsequenceTypeOptions.length === 0) return;

    const foundInAllowedOptions = Boolean(
      allowedConsequenceTypeOptions.find((option) => option.value === consequenceType),
    );

    if (!foundInAllowedOptions) setConsequenceType(undefined);
  }, [allowedConsequenceTypeOptions, consequenceType]);

  React.useEffect(() => {
    if (consequenceType !== 'voucher') setVoucherBatchId(undefined);
  }, [consequenceType]);

  const gridColumnClassname =
    percentConsequenceSelected || voucherConsequenceSelected ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <section className="border rounded-md p-4">
      <section className="flex items-center justify-between mb-4">
        <Text className={classes.h4}>Reward {index + 1}</Text>
        <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
          REMOVE
        </BareButton>
      </section>
      <section className={`grid gap-x-5 ${gridColumnClassname}`}>
        <FormikDropdownField
          aria-label="reward type"
          label="Type *"
          fieldName={`${fieldName}.type`}
          layout="vertical"
          options={allowedConsequenceTypeOptions}
          onChangeValue={onChangeConsequenceType}
        />
        {campaignConsequenceSelected && (
          <FormikTextField
            fieldName={`${fieldName}.campaignId`}
            label="Campaign id"
            layout="vertical"
          />
        )}
        {!campaignConsequenceSelected && !noneConsequenceSelected && (
          <FormikDecimalInput fieldName={`${fieldName}.value`} label="Value" layout="vertical" />
        )}
        {consequenceType === 'voucher' && (
          <FormikTextField
            fieldName={`${fieldName}.voucherBatchId`}
            label="Voucher batch id"
            layout="vertical"
          />
        )}
        {percentConsequenceSelected && (
          <FormikDropdownField
            label="Calculate from *"
            fieldName={`${fieldName}.from`}
            placeholder="Please select"
            layout="vertical"
            options={criteriaTypeOptions}
          />
        )}
      </section>
      <section className={`grid gap-5 ${gridColumnClassname}`}>
        {cashbackConsequenceSelected && (
          <FormikDropdownField
            label="Expiry"
            fieldName={`${fieldName}.expiry.type`}
            layout="vertical"
            placeholder="No expiry"
            options={consequenceExpiryTypeOptions}
            onChangeValue={onChangeExpiryType}
          />
        )}
        {expiryType === 'duration' && (
          <FormikDecimalInput
            fieldName={`${fieldName}.expiry.value`}
            label="Days *"
            layout="vertical"
          />
        )}
        {expiryType === 'date' && (
          <FormikDateTimeField
            label="Expiry date"
            layout="vertical"
            fieldName={`${fieldName}.expiry.value`}
            wrapperClass="col-span-full col-start-2"
          />
        )}
      </section>
    </section>
  );
}

const staticCriteria: CriteriaType[] = [
  'create_wallet',
  'set_loyalty_card',
  'set_auto_topup',
  'activate_point_redemption',
  'none',
  'e_kyc_completion',
  'cardterus_linked',
  'create_circle_group',
  'create_or_join_circle_group',
  'join_circle_group',
];

const lteCriteria: CriteriaType[] = ['max_reward_amount', 'quota', 'max_reward_total'];

const gteCriteria: CriteriaType[] = [
  'fuel_total',
  'fuel_count',
  'topup_total',
  'topup_count',
  'redeem_points_count',
  'redeem_points_total',
  'deal_redemption_total',
  'cardterus_transaction_total',
  'cardterus_transaction_count',
  'circle_member_count',
];

const equalCriteria: CriteriaType[] = ['friend', 'remaining_time'];

const operatorDisabledCriteria = [
  ...staticCriteria,
  ...equalCriteria,
  ...lteCriteria,
  ...gteCriteria,
] as const;

function FormikFieldArrayCriteria({
  index,
  remove,
  fieldName,
  arrayName,
  consequence,
}: FormikFieldArrayComponentProps & {
  consequence: ICampaignConsequence[];
}) {
  const {data: enums} = useCampaignEnums();
  const criteriaArray: ICampaignGoalCriteria[] = useField(arrayName)[formikMetaIndex].value;
  const criteria: ICampaignGoalCriteria = useField(fieldName)[formikMetaIndex].value;
  const criteriaVoucherBatchId = criteria.dependency?.voucherBatchId;
  const rejectProgressAfterCampaignEnd: [] = useField('rejectProgressAfterCampaignEnd')[
    formikMetaIndex
  ].value;

  const {setValue: setCriteria} = useField(fieldName)[formikHelperIndex];
  const {setValue: setCriteriaType} = useField(`${fieldName}.type`)[formikHelperIndex];
  const {setValue: setCriteriaVoucherBatchId} = useField(`${fieldName}.dependency.voucherBatchId`)[
    formikHelperIndex
  ];

  const voucherConsequenceSelected = consequence.some((c) => c.type === 'voucher');

  const criteriaVoucherBatchIdsUsed = React.useMemo(
    () => criteriaArray.map((c) => c.dependency?.voucherBatchId).filter(Boolean),
    [criteriaArray],
  );

  // fill ids from rewards, limit selection
  const consequenceVoucherBatchIdsAsOptions = React.useMemo(
    () =>
      dedupeArray(
        consequence
          .filter(
            (c) =>
              c.type === 'voucher' &&
              c.voucherBatchId &&
              (c.voucherBatchId === criteriaVoucherBatchId ||
                !criteriaVoucherBatchIdsUsed.includes(c.voucherBatchId)),
          )
          .map(({voucherBatchId}) => ({
            label: voucherBatchId,
            value: voucherBatchId,
          })),
        'value',
      ),
    [consequence, criteriaVoucherBatchId, criteriaVoucherBatchIdsUsed],
  );

  // reset voucher batch id if removed from rewards
  React.useEffect(() => {
    const voucherBatchIdRemoved = !consequenceVoucherBatchIdsAsOptions.some(
      (o) => o.value === criteriaVoucherBatchId,
    );
    if (voucherBatchIdRemoved) setCriteriaVoucherBatchId(undefined);
  }, [consequenceVoucherBatchIdsAsOptions]);

  // reset voucher batch id if criteria type no longer quota
  React.useEffect(() => {
    if (criteria.type !== 'quota') setCriteriaVoucherBatchId(undefined);
  }, [criteria]);

  const onCriteriaTypeChange = (type: ICampaignGoalCriteria['type']) => {
    setCriteria({
      ...criteria,
      type,
      target: staticCriteria.includes(type) ? 1 : criteria.target,
      operator:
        ([...staticCriteria, ...equalCriteria].includes(type) && 'equal') ||
        (lteCriteria.includes(type) && 'lte') ||
        (gteCriteria.includes(type) && 'gte') ||
        criteria.operator,
      transactionTypes:
        (['hybrid'] as CriteriaType[]).includes(type) === false ? [] : criteria.transactionTypes,
      dependency: {
        ...criteria.dependency,
        topUpMethods: (['topup_count', 'topup_total'] as CriteriaType[]).includes(type)
          ? ['debitAndCreditCard']
          : undefined,
        fuelType: (['fuel_total', 'fuel_count'] as CriteriaType[]).includes(type) ? [] : undefined,
        actionType: (['max_reward_total'] as CriteriaType[]).includes(type)
          ? ['fuel_total', 'store_order_total', 'topup_total', 'concierge_order_total']
          : undefined,
      },
    });
  };

  // expensive - only rebuild on change
  const criteriaTypeOptions = React.useMemo(
    () =>
      Object.entries(enums?.criteria ?? {})
        .map(([value, label]) => ({
          value: value as CriteriaType,
          label,
        }))
        .filter((option) =>
          // GA-1083 - filter out remaining time if toggle true
          rejectProgressAfterCampaignEnd.length > 0 && option.value === 'remaining_time'
            ? false
            : // allow multiple quota if reward voucher selected
              (voucherConsequenceSelected && option.value === 'quota') ||
              // if criteria already selected, exclude from remaining options:
              option.value === criteria.type ||
              !criteriaArray.map((d) => d.type).includes(option.value),
        ),
    [enums, criteriaArray, criteria, voucherConsequenceSelected, rejectProgressAfterCampaignEnd],
  );

  React.useEffect(() => {
    if (!criteria?.type) return;
    if (criteriaTypeOptions.length === 0) return;

    const foundInAllowedOptions = Boolean(
      criteriaTypeOptions.find((option) => option.value === criteria.type),
    );
    if (!foundInAllowedOptions) setCriteriaType(undefined);
  }, [criteriaTypeOptions, criteria]);

  return (
    <section className="border rounded-md p-4">
      <section className="flex items-center justify-between mb-4">
        <Text className={classes.h4}>Criteria {index + 1}</Text>
        <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
          REMOVE
        </BareButton>
      </section>
      <section className="grid grid-cols-2 gap-x-5">
        <FormikDropdownField
          aria-label="criteria type"
          label="Type *"
          fieldName={`${fieldName}.type`}
          placeholder="Please select"
          layout="vertical"
          options={criteriaTypeOptions}
          onChangeValue={onCriteriaTypeChange}
        />
        <FormikTextareaField
          fieldName={`${fieldName}.description`}
          label="Description *"
          layout="vertical"
        />
        <FormikDropdownField
          label="Operator"
          fieldName={`${fieldName}.operator`}
          placeholder="Please select"
          layout="vertical"
          options={Object.entries(enums?.operator ?? {})?.map(([value, label]) => ({
            value,
            label,
          }))}
          disabled={operatorDisabledCriteria.includes(criteria.type)}
        />
        <FormikDecimalInput
          label="Target *"
          fieldName={`${fieldName}.target`}
          layout="vertical"
          disabled={staticCriteria.includes(criteria.type)}
        />
        {(['hybrid'] as CriteriaType[]).includes(criteria.type) && (
          <FormikMultiSelectField
            label="Transaction Types"
            fieldName={`${fieldName}.transactionTypes`}
            options={transactionTypeOptions}
            layout="vertical"
          />
        )}
        {(['friend'] as CriteriaType[]).includes(criteria.type) && (
          <FormikDecimalInput
            label="Friend should fueling"
            fieldName={`${fieldName}.dependency.friendThreshold`}
            layout="vertical"
          />
        )}
        {(['fuel_total', 'fuel_count'] as CriteriaType[]).includes(criteria.type) && (
          <>
            <FormikTextField
              label="Station ID"
              fieldName={`${fieldName}.dependency.stations`}
              layout="vertical"
            />
            <FormikMultiSelectField
              label="Fuel Type"
              fieldName={`${fieldName}.dependency.fuelType`}
              options={fuelTypes.map(({value, label}) => ({value, label}))}
              layout="vertical"
            />
          </>
        )}
        <FormikToggleField
          label="Enrollment"
          fieldName={`${fieldName}.dependency.enrollment`}
          layout="vertical"
        />
        {voucherConsequenceSelected && criteria.type === 'quota' && (
          <FormikDropdownField
            label="Voucher batch id"
            fieldName={`${fieldName}.dependency.voucherBatchId`}
            placeholder="Please select"
            layout="vertical"
            options={consequenceVoucherBatchIdsAsOptions}
            disabled={!consequenceVoucherBatchIdsAsOptions.length}
          />
        )}
        {(
          [
            'fuel_total',
            'fuel_count',
            'hybrid',
            'topup_total',
            'deal_redemption_total',
            'cardterus_transaction_total',
          ] as CriteriaType[]
        ).includes(criteria.type) && (
          <FormikToggleField
            label="Single transaction"
            fieldName={`${fieldName}.dependency.singleTransaction`}
            layout="vertical"
          />
        )}

        {(['max_reward_total'] as CriteriaType[]).includes(criteria.type) && (
          <FormikCheckboxField
            label="Action Types"
            fieldName={`${fieldName}.dependency.actionType`}
            layout="vertical"
            options={[
              {label: 'Petrol Purchase Amount', value: 'fuel_total'},
              {label: 'In-store Purchase Amount', value: 'store_order_total'},
              {label: 'Top-up Amount', value: 'topup_total'},
              {label: 'Deliver2me Purchase Amount', value: 'concierge_order_total'},
            ]}
          />
        )}
        {(['topup_count', 'topup_total'] as CriteriaType[]).includes(criteria.type) && (
          <FormikCheckboxField
            label="Top-up Methods"
            fieldName={`${fieldName}.dependency.topUpMethods`}
            layout="vertical"
            options={[
              {label: 'Debit & Credit Cards', value: 'debitAndCreditCard'},
              {label: 'Registration voucher', value: 'registrationVoucher'},
              {label: 'Top-up Voucher', value: 'topupVoucher'},
            ]}
          />
        )}
      </section>
    </section>
  );
}
