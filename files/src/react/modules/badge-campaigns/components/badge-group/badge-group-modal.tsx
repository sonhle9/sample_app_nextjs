import * as React from 'react';
import {Modal, Button, BareButton, Tabs} from '@setel/portal-ui';
import {Formik} from 'formik';
import {FormikTextField, FormikTextareaField, FormikRadioGroup} from 'src/react/components/formik';
import * as Yup from 'yup';
import {IBadgeGroupInDetails} from '../../badge-campaigns.type';
import {
  useCreateBadgeGroup,
  useUpdateBadgeGroup,
  useGetBadgeGroupById,
} from '../../badge-campaigns.queries';
import {LOCALE_TABS} from 'src/react/modules/badge-campaigns/badge-campaigns.const';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {badgeGroupsRoles} from 'src/shared/helpers/roles.type';
import {DeleteBadgeGroupModal} from './delete-badge-group-modal';

const validationSchema = Yup.object().shape({
  name: Yup.object({
    en: Yup.string().required('Required'),
  }),
  status: Yup.string().required('Required'),
  action: Yup.object()
    .shape(
      {
        title: Yup.object().when(['link', 'webLink'], {
          is: (link, webLink) => link || webLink,
          then: Yup.object({
            en: Yup.string().required('Required'),
          }),
        }),
        webLink: Yup.string().when(['title', 'link'], {
          is: (title, link) => title?.en || link,
          then: Yup.string().required('Required'),
        }),
        link: Yup.string().when(['title', 'webLink'], {
          is: (title, webLink) => title?.en || webLink,
          then: Yup.string().required('Required'),
        }),
      },
      // verbose but needed to avoid cyclic dependency https://github.com/jquense/yup/issues/661#issuecomment-543310477
      [
        ['title', 'link'],
        ['title', 'webLink'],
        ['webLink', 'link'],
        ['webLink', 'title'],
        ['link', 'webLink'],
        ['link', 'title'],
      ],
    )
    .nullable(),
});

const statusOptions: Array<{value: IBadgeGroupInDetails['status']; label: string}> = [
  {value: 'VISIBLE', label: 'Visible'},
  {value: 'HIDDEN', label: 'Hidden'},
];

type BadgeGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  badgeGroupId?: string;
};
export const BadgeGroupModal = ({isOpen, onClose, badgeGroupId}: BadgeGroupModalProps) => {
  const createBadgeGroupMutation = useCreateBadgeGroup();
  const updateBadgeGroupMutation = useUpdateBadgeGroup();
  const isLoading = createBadgeGroupMutation.isLoading || updateBadgeGroupMutation.isLoading;
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState(false);
  const getBadgeGroupByIdQuery = useGetBadgeGroupById(badgeGroupId);
  const badgeGroup = getBadgeGroupByIdQuery.data;
  const isEdit = !!badgeGroup;
  const header = `${isEdit ? 'Edit' : 'Create'} badge group`;
  const [tabIndex, setTabIndex] = React.useState(0);
  const tabLocale = LOCALE_TABS[tabIndex].key;

  return (
    <>
      <Modal
        isOpen={isLoading || isOpen}
        onDismiss={onClose}
        header={header}
        initialFocus="content">
        <Formik
          initialValues={badgeGroup ?? {}}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(submitValues: IBadgeGroupInDetails) => {
            const {action} = submitValues;
            const badgeGroup = {
              ...submitValues,
              action: action?.title?.en ? action : null,
            };

            if (isEdit) {
              updateBadgeGroupMutation.mutateAsync(
                {_id: badgeGroupId, ...badgeGroup},
                {onSuccess: onClose},
              );
            } else {
              createBadgeGroupMutation.mutateAsync(badgeGroup, {
                onSuccess: onClose,
              });
            }
          }}>
          {({handleSubmit}) => (
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
                              <FormikTextField
                                fieldName={`name.${locale}`}
                                label="Group name"
                                placeholder="Enter group name"
                              />
                              <FormikRadioGroup
                                fieldName="status"
                                label="Status"
                                options={statusOptions}
                              />
                              <FormikTextareaField
                                fieldName={`description.${locale}`}
                                label="Description"
                                placeholder="Enter description"
                              />
                              <FormikTextField
                                fieldName={`action.title.${locale}`}
                                label="Action title"
                                placeholder="Enter title"
                              />
                              <FormikTextField
                                fieldName="action.webLink"
                                label="URL"
                                placeholder="Insert URL here"
                              />
                              <FormikTextField
                                fieldName="action.link"
                                label="Deeplink"
                                placeholder="Insert link here"
                              />
                            </>
                          )}
                        </Tabs.Panel>
                      ))}
                    </Tabs.Panels>
                  </div>
                </Tabs>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-between">
                  <section>
                    <HasPermission accessWith={[badgeGroupsRoles.delete]}>
                      {isEdit && (
                        <BareButton
                          className="px-4 h-10 uppercase text-error-500"
                          disabled={isLoading}
                          onClick={() => setIsOpenDeleteModal(true)}>
                          Delete
                        </BareButton>
                      )}
                    </HasPermission>
                  </section>
                  <section>
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
                  </section>
                </div>
              </Modal.Footer>
            </>
          )}
        </Formik>
      </Modal>
      <DeleteBadgeGroupModal
        id={badgeGroup?._id}
        isOpen={isOpenDeleteModal}
        onClose={(success) => {
          setIsOpenDeleteModal(false);
          if (success) onClose();
        }}
      />
    </>
  );
};
