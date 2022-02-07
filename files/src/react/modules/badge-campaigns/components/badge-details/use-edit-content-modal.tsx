import * as React from 'react';
import {
  Modal,
  Tabs,
  Button,
  Field,
  Fieldset,
  Text,
  BareButton,
  classes,
  HelpText,
} from '@setel/portal-ui';
import {IBadge, ILocale, I18nString} from 'src/react/modules/badge-campaigns/badge-campaigns.type';
import {LOCALE_TABS} from 'src/react/modules/badge-campaigns/badge-campaigns.const';
import {
  FormikTextField,
  FormikTextareaField,
  FormikFieldArray,
  FormikFieldArrayTextArea,
  FormikFieldArrayComponentProps,
} from 'src/react/components/formik';
import {Formik, useField} from 'formik';
import * as Yup from 'yup';
import {useUpdateBadge} from 'src/react/modules/badge-campaigns/badge-campaigns.queries';

export function useEditContentModal(badge: IBadge) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {mutateAsync: updateBadge, isLoading} = useUpdateBadge();
  const onClose = () => setIsOpen(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const tabLocale = LOCALE_TABS[tabIndex].key;

  // needs `tabLocale` for locale-specific validation
  const validationSchema = Yup.object().shape({
    content: Yup.object().shape({
      action: Yup.object()
        .shape(
          {
            title: Yup.object()
              .when(['link', 'webLink'], (link, webLink, schema: Yup.ObjectSchema) =>
                schema.shape({
                  en: link || webLink ? Yup.string().required('Required') : Yup.string(),
                } as {[key in ILocale]: Yup.StringSchema}),
              )
              .test({
                name: 'actionTitleInEnglishRequired',
                test: function (this, title: {[key in ILocale]}) {
                  const hasTitle = Object.values(title).filter(Boolean).length > 0;
                  const hasEnglishTitle = Boolean(title?.en);
                  const isValid = hasTitle ? hasEnglishTitle : true;
                  return isValid
                    ? true
                    : this.createError({
                        path: `${this.path}.${tabLocale}`,
                        message: tabLocale === 'en' ? 'Required' : 'Required in English',
                      });
                },
              }),

            link: Yup.string().when(['title', 'webLink'], (title: I18nString, webLink) =>
              webLink || title?.en
                ? Yup.string().required(tabLocale === 'en' ? 'Required' : 'Required by English tab')
                : Yup.string(),
            ),
            webLink: Yup.string().when(['title', 'link'], (title: I18nString, link) =>
              link || title?.en
                ? Yup.string().required(tabLocale === 'en' ? 'Required' : 'Required by English tab')
                : Yup.string(),
            ),
          }, // verbose but needed to avoid cyclic dependency https://github.com/jquense/yup/issues/661#issuecomment-543310477
          [
            ['webLink', 'link'],
            ['webLink', 'title'],
            ['link', 'webLink'],
            ['link', 'title'],
          ],
        )
        .nullable(),
      benefits: Yup.object({
        sectionTitle: Yup.object().when(['items'], {
          is: (items) => items?.length > 0,
          then: Yup.object({
            en: Yup.string().required('Field required.'),
          }),
        }),
        items: Yup.array(
          Yup.object({
            title: Yup.object({
              en: Yup.string().required('Field required.'),
            }),
          }),
        ),
      }),
      rewardInfo: Yup.object({
        sectionTitle: Yup.object().when(['items'], {
          is: (items) => items?.length > 0,
          then: Yup.object({
            en: Yup.string().required('Field required.'),
          }),
        }),
        items: Yup.array(
          Yup.object({
            title: Yup.object({
              en: Yup.string().required('Field required.'),
            }),
          }),
        ),
      }),
      badgeEnrollment: Yup.object().when(['category'], {
        is: (category: IBadge['category']) => category === 'ENROLLMENT',
        then: Yup.object({
          sectionTitle: Yup.object({
            en: Yup.string().required('Field required.'),
          }),
          description: Yup.object({
            en: Yup.string().required('Field required.'),
          }),
          action: Yup.object({
            displayText: Yup.object({
              en: Yup.string().required('Field required.'),
            }),
          }),
        }),
      }),
      termsAndConditions: Yup.object({
        sectionTitle: Yup.object().when(['items'], {
          is: (items) => items?.length > 0,
          then: Yup.object({
            en: Yup.string().required('Field required.'),
          }),
        }),
        items: Yup.array(
          Yup.object({
            value: Yup.object({
              en: Yup.string().required('Field required.'),
            }),
          }),
        ),
      }),
    }),
  });

  const initialValues = {
    content: {
      ...badge?.content,
      benefits: badge?.content?.benefits ?? {},
      termsAndConditions: badge?.content?.termsAndConditions ?? {},
      rewardInfo: badge?.content?.rewardInfo ?? {},
      category: badge?.category,
      badgeEnrollment:
        badge?.content?.badgeEnrollment ?? ({} as IBadge['content']['badgeEnrollment']),
    },
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal isOpen={isLoading || isOpen} onDismiss={onClose} header="Content" size="large">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            const {badgeEnrollment, action, ...restOfContent} = values.content;
            const hasActionTitle = Object.values(action?.title ?? {}).filter(Boolean).length > 0;
            const content: IBadge['content'] = {
              ...restOfContent,
              action: hasActionTitle ? action : null,
              badgeEnrollment: badge?.category === 'ENROLLMENT' ? badgeEnrollment : null,
              benefits: restOfContent.benefits?.items?.length ? restOfContent.benefits : null,
              rewardInfo: restOfContent.rewardInfo?.items?.length ? restOfContent.rewardInfo : null,
              termsAndConditions: restOfContent.termsAndConditions?.items?.length
                ? restOfContent.termsAndConditions
                : null,
            };
            updateBadge({id: badge?.id, content}, {onSuccess: onClose});
          }}>
          {({handleSubmit, values}) => (
            <>
              <Modal.Body className="-my-4 -mx-8">
                <Tabs index={tabIndex} onChange={setTabIndex}>
                  <Tabs.TabList>
                    {LOCALE_TABS.map((tab) => (
                      <Tabs.Tab key={tab.key} label={tab.label} />
                    ))}
                  </Tabs.TabList>
                  <div className="py-5 px-4 sm:px-7">
                    <Tabs.Panels>
                      {LOCALE_TABS.map(({key: locale}) => (
                        <Tabs.Panel key={locale}>
                          {tabLocale === locale && (
                            <>
                              <Fieldset legend="GENERALS">
                                <FormikTextField
                                  fieldName={`content.title.${locale}`}
                                  label="Badge name"
                                  placeholder={
                                    badge?.category === 'OPT_IN'
                                      ? 'Setelnators'
                                      : '<sequence>Badge<period>'
                                  }
                                />
                                <FormikTextareaField
                                  fieldName={`content.summary.${locale}`}
                                  label="Campaign description"
                                  placeholder="Register with c-code c-tenx to be eligible for..."
                                />
                                <FormikTextField
                                  fieldName={`content.action.title.${locale}`}
                                  label="Action title"
                                  placeholder="Title"
                                />
                                <FormikTextField
                                  fieldName="content.action.webLink"
                                  label="URL"
                                  placeholder="Insert link here"
                                />
                                <FormikTextField
                                  fieldName="content.action.link"
                                  label="Deeplink"
                                  placeholder="Insert link here"
                                />
                              </Fieldset>
                              {badge?.category === 'OPT_IN' && (
                                <Fieldset
                                  legend="INSTRUCTIONS"
                                  className="border-t border-gray-200 pt-5">
                                  <FormikTextField
                                    fieldName={`content.verification.sectionTitle.${locale}`}
                                    label="Header"
                                    placeholder="Insert header"
                                  />
                                  <FormikTextareaField
                                    fieldName={`content.verification.title.${locale}`}
                                    label="Section description"
                                    placeholder="Insert description"
                                  />
                                  <FormikTextField
                                    fieldName={`content.verification.openButtonText.${locale}`}
                                    label="Verify/CTA Button"
                                    placeholder="Insert text"
                                  />
                                </Fieldset>
                              )}

                              <Fieldset legend="BENEFITS" className="border-t border-gray-200 pt-5">
                                {values.content?.benefits?.items?.length > 0 && (
                                  <FormikTextField
                                    fieldName={`content.benefits.sectionTitle.${locale}`}
                                    label="Title"
                                    placeholder="Title"
                                  />
                                )}
                                <FormikFieldArray
                                  label={values.content?.benefits?.items?.length > 0 ? '' : 'Title'}
                                  arrayName="content.benefits.items"
                                  validateOnChange
                                  newItemValue={{}}
                                  renderField={(props) => (
                                    <FormikFieldArrayBenefit {...props} locale={locale} />
                                  )}
                                  addButtonText={(items) =>
                                    items.length > 0 ? 'add benefit' : 'add benefits'
                                  }
                                />
                              </Fieldset>

                              <Fieldset
                                legend="CAMPAIGN PROGRESS"
                                className="border-t border-gray-200 pt-5">
                                <FormikTextField
                                  fieldName={`content.campaignProgress.sectionTitle.${locale}`}
                                  label="Title"
                                  placeholder="Title"
                                  helpText="Progress is taken from goal description in reward campaigns."
                                />
                              </Fieldset>
                              <Fieldset legend="REWARDS" className="border-t border-gray-200 pt-5">
                                {values.content?.rewardInfo?.items?.length > 0 && (
                                  <FormikTextField
                                    fieldName={`content.rewardInfo.sectionTitle.${locale}`}
                                    label="Title"
                                    placeholder="Title"
                                  />
                                )}
                                <FormikFieldArray
                                  label={
                                    values.content?.rewardInfo?.items?.length > 0 ? '' : 'Title'
                                  }
                                  arrayName="content.rewardInfo.items"
                                  validateOnChange
                                  newItemValue={{}}
                                  renderField={(props) => (
                                    <FormikFieldArrayReward {...props} locale={locale} />
                                  )}
                                  addButtonText={(items) =>
                                    items.length > 0 ? 'add reward' : 'add rewards'
                                  }
                                />
                              </Fieldset>
                              {badge?.category === 'ENROLLMENT' && (
                                <Fieldset
                                  legend="ENROLLMENT"
                                  className="border-t border-gray-200 pt-5">
                                  <FormikTextField
                                    label={
                                      <>
                                        <div>Title</div>
                                        <HelpText>(Required)</HelpText>
                                      </>
                                    }
                                    fieldName={`content.badgeEnrollment.sectionTitle.${locale}`}
                                    placeholder="Title"
                                  />
                                  <FormikTextareaField
                                    fieldName={`content.badgeEnrollment.description.${locale}`}
                                    label={
                                      <>
                                        <div>Description</div>
                                        <HelpText>(Required)</HelpText>
                                      </>
                                    }
                                    placeholder="Description"
                                  />
                                  <FormikTextField
                                    label={
                                      <>
                                        <div>Action title</div>
                                        <HelpText>(Required)</HelpText>
                                      </>
                                    }
                                    fieldName={`content.badgeEnrollment.action.displayText.${locale}`}
                                    placeholder="Title"
                                  />
                                  <FormikTextField
                                    label="URL"
                                    fieldName="content.badgeEnrollment.action.webLink"
                                    placeholder="Insert link"
                                  />
                                  <FormikTextField
                                    label="Deeplink"
                                    fieldName="content.badgeEnrollment.action.deepLink"
                                    placeholder="Insert link"
                                  />
                                </Fieldset>
                              )}
                              <Fieldset
                                legend="TERMS &amp; CONDITIONS"
                                className="border-t border-gray-200 pt-5">
                                {values.content?.termsAndConditions?.items?.length > 0 && (
                                  <FormikTextField
                                    fieldName={`content.termsAndConditions.sectionTitle.${locale}`}
                                    label="Title"
                                    placeholder="Title"
                                  />
                                )}
                                <FormikFieldArray
                                  label={
                                    values.content?.termsAndConditions?.items?.length > 0
                                      ? ''
                                      : 'Title'
                                  }
                                  arrayName="content.termsAndConditions.items"
                                  validateOnChange
                                  newItemValue={{value: {[locale]: ''} as I18nString}}
                                  renderField={(props) => (
                                    <FormikFieldArrayTextArea
                                      {...props}
                                      fieldName={`${props.arrayName}.${props.index}.value.${locale}`}
                                      placeholder="Purchase within 3 days"
                                    />
                                  )}
                                  addButtonText={(items) =>
                                    items.length > 0 ? 'add' : 'add terms & conditions'
                                  }
                                  addButtonClassname={
                                    values.content?.termsAndConditions?.items?.length > 0
                                      ? 'ml-6'
                                      : ''
                                  }
                                />
                              </Fieldset>
                            </>
                          )}
                        </Tabs.Panel>
                      ))}
                    </Tabs.Panels>
                  </div>
                </Tabs>
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

function FormikFieldArrayBenefit({
  index,
  fieldName,
  remove,
  locale,
}: FormikFieldArrayComponentProps & {locale: keyof I18nString}) {
  const [, {touched, error}] = useField(fieldName);
  return (
    <Field status={touched && error ? 'error' : undefined}>
      <section className="border rounded-md p-4">
        <section className="flex items-center justify-between mb-4">
          <Text className={classes.h3}>Benefit {index + 1}</Text>
          <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
            REMOVE
          </BareButton>
        </section>
        <FormikTextField
          label="Title"
          fieldName={`${fieldName}.title.${locale}`}
          placeholder="Insert text"
        />
        <FormikTextField
          label={
            <>
              <div>Subtitle</div>
              <HelpText>(Optional)</HelpText>
            </>
          }
          fieldName={`${fieldName}.subtitle.${locale}`}
          placeholder="Insert text"
        />
      </section>
    </Field>
  );
}

function FormikFieldArrayReward({
  index,
  fieldName,
  remove,
  locale,
}: FormikFieldArrayComponentProps & {locale: keyof I18nString}) {
  const [, {touched, error}] = useField(fieldName);
  return (
    <Field status={touched && error ? 'error' : undefined}>
      <section className="border rounded-md p-4">
        <section className="flex items-center justify-between mb-4">
          <Text className={classes.h3}>Reward {index + 1}</Text>
          <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
            REMOVE
          </BareButton>
        </section>
        <FormikTextField
          label={
            <>
              <div>Name</div>
              <HelpText>(Required)</HelpText>
            </>
          }
          fieldName={`${fieldName}.title.${locale}`}
          placeholder="Reward name"
        />
        <FormikTextField
          label="Description"
          fieldName={`${fieldName}.subtitle.${locale}`}
          placeholder="Description"
          helpText="Max. of 100 characters"
        />
        <FormikTextField
          label="Image URL"
          fieldName={`${fieldName}.imageUrl`}
          placeholder="Image URL"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.LOCKED.title.${locale}`}
          label="Details title"
          placeholder="Title"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.LOCKED.webLink`}
          label="Details URL"
          placeholder="Insert text"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.LOCKED.deepLink`}
          label="Details deeplink"
          placeholder="Insert text"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.UNLOCKED.title.${locale}`}
          label="Redeem title"
          placeholder="Title"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.UNLOCKED.webLink`}
          label="Redeem URL"
          placeholder="Insert text"
        />
        <FormikTextField
          fieldName={`${fieldName}.action.UNLOCKED.deepLink`}
          label="Redeem deeplink"
          placeholder="Insert text"
        />
      </section>
    </Field>
  );
}
