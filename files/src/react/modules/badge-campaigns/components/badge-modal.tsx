import * as React from 'react';
import {Modal, ModalFooter, ModalBody, Button, pick, useDebounce} from '@setel/portal-ui';
import {Formik} from 'formik';
import {
  FormikDaySelector,
  FormikDecimalInput,
  FormikDropdownField,
  FormikTextField,
  FormikRadioGroup,
  FormikSearchableDropdown,
  FormikToggleField,
} from 'src/react/components/formik';
import * as Yup from 'yup';
import {IBadge, IBadgeCategory, IBadgeProgression} from '../badge-campaigns.type';
import {periodTypeOptions} from 'src/shared/interfaces/reward.interface';
import {useCreateBadge, useUpdateBadge, useBadgeGroupSearch} from '../badge-campaigns.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {isBefore, parseISO, startOfToday} from 'date-fns';

const targetedOrEnrollmentCategory: IBadgeCategory[] = ['TARGETED', 'ENROLLMENT'];

type BadgeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  badge?: IBadge;
};
export function BadgeModal({isOpen, onClose, badge}: BadgeModalProps) {
  const [badgeGroup, setBadgeGroup] = React.useState('');
  const debouncedBadgeGroup = useDebounce(badgeGroup);
  const badgeGroupSearchQuery = useBadgeGroupSearch({name: debouncedBadgeGroup, enabled: isOpen});
  const badgeGroups = badgeGroupSearchQuery?.data?.items || [];

  const router = useRouter();
  const {mutateAsync: createBadge, isLoading: isLoadingCreate} = useCreateBadge();
  const {mutateAsync: updateBadge, isLoading: isLoadingUpdate} = useUpdateBadge();
  const isLoading = isLoadingCreate || isLoadingUpdate;
  const isEdit = !!badge;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    group: Yup.object({_id: Yup.string().required('Required')}),
    startDate: Yup.string().required('Required'),
    ...(isEdit
      ? {}
      : {
          category: Yup.string().required('Required'),
          periodType: Yup.string().required('Required'),
          startEvery: Yup.string().when(['category', 'progressionType', 'periodType'], {
            is: (
              category: IBadgeCategory,
              progressionType: IBadgeProgression,
              periodType: IBadge['period']['type'],
            ) =>
              targetedOrEnrollmentCategory.includes(category) &&
              progressionType === 'Periodic Badge' &&
              periodType === 'day',
            then: Yup.string().required('Required'),
          }),
          endEvery: Yup.string().when(['category', 'progressionType', 'periodType'], {
            is: (
              category: IBadgeCategory,
              progressionType: IBadgeProgression,
              periodType: IBadge['period']['type'],
            ) =>
              targetedOrEnrollmentCategory.includes(category) &&
              progressionType === 'Periodic Badge' &&
              periodType === 'day',
            then: Yup.string().required('Required'),
          }),
          recurringMaxLimit: Yup.number()
            .when(['category', 'progressionType'], {
              is: (category: IBadgeCategory, progressionType: IBadgeProgression) =>
                targetedOrEnrollmentCategory.includes(category) &&
                progressionType === 'Recurring Badge',
              then: Yup.number()
                .min(1, 'Badge limit must be greater than or equal to 1')
                .required('Required'),
            })
            .when(['category', 'progressionType'], {
              is: (category: IBadgeCategory, progressionType: IBadgeProgression) =>
                targetedOrEnrollmentCategory.includes(category) &&
                progressionType === 'Periodic Badge',
              then: Yup.number()
                .min(0, 'Badge limit must be greater than or equal to 0')
                .required('Required'),
            }),
        }),
  });

  // flatten period object for cross field validation
  const initialValues: Pick<
    IBadge,
    | 'name'
    | 'group'
    | 'category'
    | 'startDate'
    | 'progressionType'
    | 'recurringMaxLimit'
    | 'hidePreviousVirtualPeriod'
    | 'hideVirtual'
  > & {
    periodType: IBadge['period']['type'];
    startEvery: IBadge['period']['startEvery'];
    endEvery: IBadge['period']['endEvery'];
  } = {
    name: badge?.name ?? '',
    group: badge?.group,
    category: badge?.category ?? 'OPT_IN',
    startDate: badge?.startDate ?? '',
    hideVirtual: badge?.hideVirtual,
    progressionType: badge?.progressionType ?? 'Single Badge',
    recurringMaxLimit: badge?.recurringMaxLimit,
    hidePreviousVirtualPeriod: badge?.hidePreviousVirtualPeriod,
    periodType: badge?.period?.type ?? 'day',
    startEvery: badge?.period?.startEvery,
    endEvery: badge?.period?.endEvery,
  };

  return (
    <Modal
      isOpen={isLoading || isOpen}
      onDismiss={onClose}
      header={`${isEdit ? 'Edit' : 'Create new'} badge`}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const categoryIsTargetedOrEnrollment = targetedOrEnrollmentCategory.includes(
            values.category,
          );

          if (isEdit) {
            updateBadge(
              {
                id: badge?.id,
                name: values.name,
                tags: [values.name],
                group: values.group,
                hideVirtual: values.hideVirtual,
                startDate: values.startDate,
                hidePreviousVirtualPeriod: values.hidePreviousVirtualPeriod,
              },
              {onSuccess: onClose},
            );
          } else {
            const formData = {
              ...pick(values, ['name', 'group', 'category', 'startDate']),
              tags: [values.name],
              hideVirtual: values.hideVirtual,
              ...(categoryIsTargetedOrEnrollment && values.progressionType === 'Single Badge'
                ? {createNewOnUnlock: false, recurringMaxLimit: 0}
                : {}),
              ...(categoryIsTargetedOrEnrollment && values.progressionType === 'Series Badge'
                ? {createNewOnUnlock: true, recurringMaxLimit: 0}
                : {}),
              ...(categoryIsTargetedOrEnrollment && values.progressionType === 'Recurring Badge'
                ? {createNewOnUnlock: true, recurringMaxLimit: +values.recurringMaxLimit}
                : {}),
              ...(categoryIsTargetedOrEnrollment && values.progressionType === 'Periodic Badge'
                ? {
                    createNewOnUnlock: true,
                    recurringMaxLimit: +values.recurringMaxLimit,
                    period: {
                      type: values.periodType,
                      ...(values.periodType === 'day'
                        ? {
                            startEvery: +values.startEvery,
                            endEvery: +values.endEvery,
                          }
                        : {}),
                    },
                    hidePreviousVirtualPeriod: values.hidePreviousVirtualPeriod,
                  }
                : {}),
            };
            createBadge(formData, {
              onSuccess: (item) => router.navigateByUrl(`/gamification/badge-details/${item.id}`),
            });
          }
        }}>
        {({values, handleSubmit}) => (
          <>
            <ModalBody>
              <FormikTextField fieldName="name" label="Badge label" className="w-60" />
              <FormikSearchableDropdown
                fieldName="group._id"
                initialLabel={values.group?.name?.en}
                label="Badge group"
                placeholder="Search"
                noResultText="No results found. Type to search."
                onInputValueChange={setBadgeGroup}
                options={
                  badgeGroup === debouncedBadgeGroup &&
                  badgeGroups.map(({id, name}) => ({label: name, value: id}))
                }
                wrapperClass="w-60"
                // GA-1042 - If start date has passed, field cannot be updated.
                disabled={isBefore(parseISO(values.startDate), startOfToday())}
              />
              <FormikDropdownField
                fieldName="category"
                label="Badge category"
                placeholder="Please select"
                options={
                  [
                    {label: 'Opt-in badge', value: 'OPT_IN'},
                    {label: 'Enrollment', value: 'ENROLLMENT'},
                    {label: 'Targeted', value: 'TARGETED'},
                  ] as Array<{label: string; value: IBadgeCategory}>
                }
                className="w-60"
                disabled={isEdit}
              />
              {targetedOrEnrollmentCategory.includes(values.category) && (
                <>
                  <FormikDropdownField
                    fieldName="progressionType"
                    label="Badge progression"
                    placeholder="Please select"
                    options={
                      [
                        {label: 'Single Badge', value: 'Single Badge'},
                        {label: 'Series badge', value: 'Series Badge'},
                        {label: 'Recurring badge', value: 'Recurring Badge'},
                        {label: 'Periodic badge', value: 'Periodic Badge'},
                      ] as Array<{label: IBadgeProgression; value: IBadgeProgression}>
                    }
                    className="w-60"
                    disabled={isEdit}
                  />
                </>
              )}
              <FormikToggleField fieldName="hideVirtual" label="Hide badge from Gallery" />
              {targetedOrEnrollmentCategory.includes(values.category) && (
                <>
                  {(values.progressionType === 'Recurring Badge' ||
                    values.progressionType === 'Periodic Badge') && (
                    <FormikDecimalInput
                      fieldName="recurringMaxLimit"
                      label="Badge limit"
                      placeholder="3"
                      className="w-11"
                      decimalPlaces={0}
                      disabled={isEdit}
                    />
                  )}

                  {values.progressionType === 'Periodic Badge' && (
                    <>
                      <FormikToggleField
                        fieldName="hidePreviousVirtualPeriod"
                        label="Hide previous badges"
                      />
                      <FormikRadioGroup
                        fieldName="periodType"
                        label="Badge range"
                        options={periodTypeOptions.map((option) => ({
                          ...option,
                          disabled: isEdit,
                        }))}
                      />
                    </>
                  )}
                </>
              )}
              <FormikDaySelector
                fieldName="startDate"
                label="Start date"
                placeholder="Select date"
                minDate={startOfToday()}
                // GA-1042 - If start date has passed, field cannot be updated.
                disabled={isBefore(parseISO(values.startDate), startOfToday())}
              />
              {targetedOrEnrollmentCategory.includes(values.category) &&
                values.progressionType === 'Periodic Badge' &&
                values.periodType === 'day' && (
                  <>
                    <FormikDecimalInput
                      fieldName="startEvery"
                      label="Start at"
                      placeholder="15"
                      className="w-11"
                      postFixLabel="of every month"
                      min={1}
                      max={31}
                      decimalPlaces={0}
                      disabled={isEdit}
                    />
                    <FormikDecimalInput
                      fieldName="endEvery"
                      label="End at"
                      placeholder="14"
                      className="w-11"
                      postFixLabel="of every month"
                      min={1}
                      max={31}
                      decimalPlaces={0}
                      disabled={isEdit}
                    />
                  </>
                )}
            </ModalBody>
            <ModalFooter className="flex justify-end">
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
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}
