import {
  Button,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Toggle,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React from 'react';
import * as Yup from 'yup';
import {DEFAULT_COUNTRY, SYSTEM_WIDE_SCOPE} from '../contants/outage.contants';
import {useUpdateAnnouncement} from '../outage.query';

export interface IOutageAnnouncementEditModalProps {
  onClose: () => void;
  announcement: any;
}

const announcementSchema = Yup.object({
  en: Yup.string().when('status', {
    is: true,
    then: Yup.string().required('Announcement content for English is must'),
  }),
});

export const OutageAnnouncementEditModal = (props: IOutageAnnouncementEditModalProps) => {
  const {mutate: updateAnnouncement} = useUpdateAnnouncement(props.announcement?.id);

  const submitForm = () => {
    const {status, announcementColour, ...announcementTextLocale} = values;
    const data = status
      ? {
          announcementColour,
          announcementTextLocale,
          announcementText: values.en,
          country: DEFAULT_COUNTRY,
          scope: SYSTEM_WIDE_SCOPE,
          startDate: null,
          endDate: null,
          id: props.announcement?.id,
        }
      : {
          country: DEFAULT_COUNTRY,
          scope: SYSTEM_WIDE_SCOPE,
        };
    updateAnnouncement(data, {
      onSuccess: () => {
        props.onClose();
      },
    });
  };

  const {values, errors, setFieldValue, touched, handleBlur, handleSubmit} = useFormik({
    initialValues: {
      status: props.announcement?.en ? true : false,
      announcementColour: props.announcement?.announcementColour ?? '#526173',
      en: props.announcement?.en,
      ms: props.announcement?.ms,
      ta: props.announcement?.ta,
      'zh-Hans': props.announcement?.['zh-Hans'],
      'zh-Hant': props.announcement?.['zh-Hant'],
    },
    validationSchema: announcementSchema,
    onSubmit: submitForm,
  });

  return (
    <Modal isOpen={true} onDismiss={props.onClose} aria-label={'Edit details'}>
      <ModalHeader>Edit announcement</ModalHeader>
      <ModalBody className="space-y-4">
        <FieldContainer className="mt-5" label="Status" layout="horizontal">
          <Toggle on={values.status} onChangeValue={(value) => setFieldValue('status', value)} />
        </FieldContainer>
        {values.status && (
          <>
            <FieldContainer className="mt-5" label="Announcement Color" layout="horizontal">
              <DropdownSelect
                value={values.announcementColour}
                onChangeValue={(value) => setFieldValue('announcementColour', value)}
                options={COLLECTION_COLOR_OPTIONS}
              />
            </FieldContainer>
            <FieldContainer
              status={touched.en && errors.en ? 'error' : null}
              helpText={touched.en && errors.en}
              className="mt-5"
              label="Content-en *"
              layout="horizontal">
              <TextInput
                className="h-11"
                value={values.en}
                onChangeValue={(value) => setFieldValue('en', value)}
                onBlur={handleBlur}
              />
            </FieldContainer>
            <FieldContainer className="mt-5" label="Content-ms" layout="horizontal">
              <TextInput
                className="h-11"
                value={values.ms}
                onChangeValue={(value) => setFieldValue('ms', value)}
              />
            </FieldContainer>
            <FieldContainer className="mt-5" label="Content-zh-Hans" layout="horizontal">
              <TextInput
                className="h-11"
                value={values['zh-Hans']}
                onChangeValue={(value) => setFieldValue('zh-Hans', value)}
              />
            </FieldContainer>
            <FieldContainer className="mt-5" label="Content-zh-Hant" layout="horizontal">
              <TextInput
                className="h-11"
                value={values['zh-Hant']}
                onChangeValue={(value) => setFieldValue('zh-Hant', value)}
              />
            </FieldContainer>
            <FieldContainer className="mt-5" label="Content-ta" layout="horizontal">
              <TextInput
                className="h-11"
                value={values.ta}
                onChangeValue={(value) => setFieldValue('ta', value)}
              />
            </FieldContainer>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={props.onClose}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            data-testid="submit-transfer-to-operating-account">
            SUBMIT
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

const COLLECTION_COLOR_OPTIONS = [
  {
    label: 'Grey',
    value: '#526173',
  },
  {
    label: 'Green',
    value: '#2ECC71',
  },
  {
    label: 'Yellow',
    value: '#FFB53B',
  },
  {
    label: 'Red',
    value: '#FF775F',
  },
];
