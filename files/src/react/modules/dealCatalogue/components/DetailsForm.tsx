import * as RS from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {forLocale, Locale, LocaleName} from 'src/react/shared/i18n';
import * as Yup from 'yup';
import {InfoLine} from '../../../components/info-line';
import {getFormFieldProps} from '../../../shared/form';
import {DealCatalogueVariant, GeneralDealCataloguePayload} from '../dealCatalogue.type';

export type DetailsFormProps = {
  onDismiss: () => void;
  onSubmit: (payload: GeneralDealCataloguePayload) => Promise<any>;
  onDelete?: () => void;
  isDeleting?: boolean;
  payload?: Partial<GeneralDealCataloguePayload>;
  editMode?: boolean;
  showDeleteDialog?: boolean;
  setShowDeleteDialog?: (visibility: boolean) => void;
};

const REQUIRED_FIELD = 'Required field';

const titleMaxLength = Yup.string().max(200, 'Must be at most 200 characters');
const validationSchema = Yup.object({
  title: Yup.object(
    forLocale((locale) =>
      locale === Locale.ENGLISH ? titleMaxLength.required(REQUIRED_FIELD) : titleMaxLength,
    ),
  ),
  icon: Yup.mixed().required(REQUIRED_FIELD),
});

export const DetailsForm: React.VFC<DetailsFormProps> = ({
  isDeleting,
  payload,
  editMode,
  onSubmit,
  onDismiss,
  onDelete,
  showDeleteDialog,
  setShowDeleteDialog,
}) => {
  const modalCaption = editMode ? 'Edit catalogue' : 'Create catalogue';
  const form = useFormik({
    initialValues: {
      title: forLocale((locale) => payload?.title[locale] || ''),
      variant: payload?.variant || DealCatalogueVariant.REGULAR,
      icon: payload?.icon,
    },
    onSubmit,
    validationSchema,
  });

  const cancelRef = React.useRef(null);

  const iconField = getFormFieldProps({name: 'icon', form});

  return (
    <RS.Modal aria-label={modalCaption} isOpen onDismiss={onDismiss}>
      <form onSubmit={form.handleSubmit}>
        <RS.ModalHeader>{modalCaption}</RS.ModalHeader>
        <RS.Tabs>
          <RS.Tabs.TabList>
            {Object.values(Locale).map((locale) => (
              <RS.Tabs.Tab label={LocaleName[locale]} key={locale} />
            ))}
          </RS.Tabs.TabList>
          <RS.ModalBody className="py-6">
            <RS.Tabs.Panels>
              {Object.values(Locale).map((locale) => (
                <RS.Tabs.Panel key={locale}>
                  <InfoLine valueClassName="pr-48" label="Name">
                    <RS.TextField
                      wrapperClass="mb-0"
                      {...getFormFieldProps({name: `title.${locale}`, form})}
                    />
                  </InfoLine>
                </RS.Tabs.Panel>
              ))}
            </RS.Tabs.Panels>
            <InfoLine
              valueClassName="pr-48 divide-y divide-gray-300"
              tooltip="Display deals catalogue on main page"
              label="Catalogue icon">
              <div className="pb-8">
                <RS.Field className="w-full" status={iconField.status}>
                  <RS.FileSelector
                    onFilesSelected={(files) => {
                      form.setFieldTouched('icon');
                      form.setFieldValue('icon', {file: files[0]}, true);
                    }}
                    fileType="image"
                    description={
                      <span className="flex flex-col">
                        <span>PNG, JPG up to 1MB</span>
                        <span>Recommended ratio 1:1</span>
                      </span>
                    }
                  />
                  {iconField.helpText && <RS.HelpText>{iconField.helpText}</RS.HelpText>}
                </RS.Field>

                {form.values.icon && (
                  <RS.FileItem
                    className="m-2"
                    {...(form.values.icon.url && {fileName: '', imageSrc: form.values.icon.url})}
                    {...(form.values.icon.file && {file: form.values.icon.file})}
                    file={form.values.icon.file}
                    onRemove={() => form.setFieldValue('icon', null, true)}
                  />
                )}
              </div>

              <RS.Checkbox
                wrapperClass="py-8"
                label="Display catalogue on main page"
                checked={form.values.variant === DealCatalogueVariant.HIGHLIGHTED}
                onChangeValue={(checked) => {
                  form.setFieldTouched('variant', true);
                  form.setFieldValue(
                    'variant',
                    checked ? DealCatalogueVariant.HIGHLIGHTED : DealCatalogueVariant.REGULAR,
                    true,
                  );
                }}
              />
            </InfoLine>
          </RS.ModalBody>
        </RS.Tabs>
        <RS.ModalFooter className="flex justify-end items-center space-x-3">
          {payload && (
            <span
              className="text-red-500 cursor-pointer flex-grow font-bold text-xs"
              onClick={() => setShowDeleteDialog(true)}>
              DELETE
            </span>
          )}
          <RS.Button
            className="tracking-wider font-semibold"
            variant="outline"
            onClick={onDismiss}
            isLoading={form.isSubmitting}>
            CANCEL
          </RS.Button>
          <RS.Button
            className="tracking-wider font-semibold"
            type="submit"
            variant="primary"
            isLoading={form.isSubmitting}>
            SAVE
          </RS.Button>
        </RS.ModalFooter>
      </form>
      {showDeleteDialog && (
        <RS.Dialog onDismiss={() => setShowDeleteDialog(false)} leastDestructiveRef={cancelRef}>
          <RS.DialogContent header="Are you sure want to delete deals catalogue?">
            This action cannot be undone and you will not be able to recover any data.
          </RS.DialogContent>
          <RS.DialogFooter>
            <RS.Button
              isLoading={isDeleting}
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              ref={cancelRef}>
              CANCEL
            </RS.Button>
            <RS.Button isLoading={isDeleting} onClick={onDelete} variant="error">
              DELETE
            </RS.Button>
          </RS.DialogFooter>
        </RS.Dialog>
      )}
    </RS.Modal>
  );
};
