import * as React from 'react';
import {Modal, ModalBody, ModalFooter, TextField, Button, Notification} from '@setel/portal-ui';
import {
  Member,
  MalaysiaStates,
  translateIdType,
  MemberSchema,
  IdType,
} from '../../loyalty-members.type';
import {useUpdateLoyaltyMember} from '../../loyalty.queries';
import {FormikTextField, FormikDropdownField, FormikDaySelector} from 'src/react/components/formik';
import {maskIDNumber} from 'src/shared/helpers/mask-helpers';
import {useNotification} from 'src/react/hooks/use-set-notification';
import {Formik} from 'formik';

export type MemberEditModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member: Partial<Member>;
};

export const MemberEditModal: React.VFC<MemberEditModalProps> = ({isOpen, onDismiss, member}) => {
  const {notificationProps, setShowNotifications} = useNotification();
  const {mutateAsync: mutateUpdateRule, isLoading} = useUpdateLoyaltyMember();

  const handleMemberSubmit = (values) => {
    mutateUpdateRule(values, {
      onSuccess: () => {
        setShowNotifications({
          variant: 'success',
          title: 'Successfully updated member',
        });
        onDismiss();
      },
      onError: () => {
        setShowNotifications({
          variant: 'error',
          title: 'Error while updating members',
        });
      },
    });
  };

  return (
    <>
      <Notification {...notificationProps} />
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        header="Edit member information"
        data-testid="edit-member-modal">
        <Formik
          validationSchema={MemberSchema}
          initialValues={member}
          onSubmit={handleMemberSubmit}>
          {({handleSubmit}) => (
            <>
              <ModalBody>
                <FormikTextField
                  fieldName="name"
                  label="Name"
                  className="w-72"
                  placeholder="-"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  fieldName="mobileNo"
                  label="Phone number"
                  className="w-72"
                  placeholder="-"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  fieldName="email"
                  label="Email"
                  className="w-72"
                  placeholder="-"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  fieldName="address.street"
                  label="Address"
                  className="w-72"
                  placeholder="Insert address"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  fieldName="address.city"
                  label="City"
                  className="w-72"
                  placeholder="Insert city"
                  layout="horizontal-responsive"
                />
                <FormikDropdownField
                  fieldName="address.state"
                  label="State"
                  className="w-72"
                  name="state"
                  options={Object.values(MalaysiaStates).map((opt) => ({
                    label: opt,
                    value: opt as string,
                  }))}
                  placeholder="select"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  fieldName="address.zipcode"
                  label="Zipcode"
                  type="text"
                  className="w-72"
                  placeholder="Insert zipcode"
                  layout="horizontal-responsive"
                />
                <FormikDaySelector
                  fieldName="dateOfBirth"
                  label="Date of birth"
                  emptyValue="Select Date"
                  className="w-72"
                  disableFuture
                  showMonthYearDropdown
                  layout="horizontal-responsive"
                />
                <FormikDropdownField
                  fieldName="idType"
                  label="ID type"
                  options={[
                    {
                      label: translateIdType(IdType.NEW_IC),
                      value: IdType.NEW_IC,
                    },
                    {
                      label: translateIdType(IdType.PASSPORT),
                      value: IdType.PASSPORT,
                    },
                  ]}
                  className="w-72"
                  layout="horizontal-responsive"
                  disabled
                />
                <TextField
                  label="ID number"
                  value={member?.idRef ? `• • • • ${maskIDNumber(member?.idRef)}` : '-'}
                  type="text"
                  className="w-72"
                  layout="horizontal-responsive"
                  disabled
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex">
                  <div className="flex flex-grow justify-end">
                    <Button variant="outline" className="mr-5" onClick={onDismiss}>
                      CANCEL
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleSubmit()}
                      isLoading={isLoading}
                      disabled={isLoading}>
                      SAVE CHANGES
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
