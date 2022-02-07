import * as React from 'react';
import * as Yup from 'yup';
import {
  Modal,
  ModalFooter,
  ModalBody,
  Button,
  Fieldset,
  FileSelector,
  FieldContainer,
  FileItem,
  pick,
  titleCase,
} from '@setel/portal-ui';
import {Formik, useField} from 'formik';
import {
  FormikTextField,
  FormikRadioGroup,
  FormikMultiInputField,
} from 'src/react/components/formik';
import {WaitingArea, WaitingAreaStatus, WaitingAreaType} from '../waiting-areas.types';
import {useStation} from '../../stores/stores.queries';
import {useCreateWaitingArea, useUpdateWaitingArea} from '../waiting-areas.queries';
import {getStation} from 'src/react/services/api-stations.service';
import {useRouter} from 'src/react/routing/routing.context';

const formikMetaIndex = 1;
const formikHelperIndex = 2;

type WaitingAreaModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  waitingArea?: WaitingArea;
};

export function WaitingAreaModal({isOpen, onDismiss, waitingArea}: WaitingAreaModalProps) {
  const isEdit = !!waitingArea;
  const {mutateAsync: createWaitingArea, isLoading: isLoadingCreate} = useCreateWaitingArea();
  const {mutateAsync: updateWaitingArea, isLoading: isLoadingUpdate} = useUpdateWaitingArea();
  const [imgFile, setImgFile] = React.useState<File>(null);
  const router = useRouter();
  const isLoading = isLoadingCreate || isLoadingUpdate;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    status: Yup.string().required().oneOf(Object.values(WaitingAreaStatus)),
    latitude: Yup.number().required('Required'),
    longitude: Yup.number().required('Required'),
    ...(isEdit
      ? {}
      : {
          stationId: Yup.string()
            .required('Required')
            .test('isStationValid', 'Station not found', async (stationId = '') => {
              if (!stationId) return true;
              return new Promise((resolve) => {
                getStation(stationId)
                  .then(() => resolve(true))
                  .catch(() => resolve(false));
              });
            }),
          tags: Yup.array().test(
            'isStationValid',
            'Tags need to contain stationId',
            function (list) {
              return list.includes(this?.parent?.stationId);
            },
          ),
        }),
  });

  const initialValues: Pick<
    WaitingArea,
    'name' | 'latitude' | 'longitude' | 'tags' | 'status' | 'image' | 'nameLocale' | 'type'
  > & {stationId?: string} = {
    name: waitingArea?.name ?? '',
    latitude: waitingArea?.latitude ?? 0,
    longitude: waitingArea?.longitude ?? 0,
    status: waitingArea?.status ?? WaitingAreaStatus.OFF,
    tags: waitingArea?.tags ?? [],
    image: waitingArea?.image,
    nameLocale: {
      en: waitingArea?.nameLocale.en ?? '',
      ms: waitingArea?.nameLocale.ms ?? '',
      'zh-Hans': waitingArea?.nameLocale?.['zh-Hans'] ?? '',
      'zh-Hant': waitingArea?.nameLocale?.['zh-Hant'] ?? '',
      ta: waitingArea?.nameLocale.ta ?? '',
    },
    stationId: waitingArea?.tags?.[0] ?? '',
    type: waitingArea?.type ?? WaitingAreaType.OTHER,
  };

  return (
    <Modal
      isOpen={isLoading || isOpen}
      onDismiss={onDismiss}
      header={`${isEdit ? 'Edit' : 'Create new'} waiting area`}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values, {setFieldError}) => {
          const formData = {
            ...pick(values, [
              'name',
              'status',
              'latitude',
              'longitude',
              'tags',
              'nameLocale',
              'type',
            ]),
            image: imgFile || values.image,
          };

          if (isEdit) {
            updateWaitingArea({id: waitingArea?.id, ...formData}, {onSuccess: onDismiss});
          } else {
            createWaitingArea(formData, {
              onSuccess: (item) => router.navigateByUrl(`/waiting-areas/${item.id}`),
              onError: (err: any) => {
                // error if name already exist in the station or place
                if (err?.response?.data?.errorCode === '3707004')
                  setFieldError('name', err?.response?.data?.message);
              },
            });
          }
        }}>
        {({values, handleSubmit, setFieldTouched, setFieldError, setFieldValue}) => (
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Fieldset legend="NAME">
                <FormikTextField
                  fieldName="name"
                  label="English"
                  placeholder="Enter English"
                  data-testid="input-name"
                />
                <FormikTextField
                  fieldName="nameLocale.ms"
                  label="Malay"
                  placeholder="Enter Malay"
                  data-testid="input-nameLocale-ms"
                />
                <FormikTextField
                  fieldName="nameLocale.zh-Hans"
                  label="Chinese (Simplified)"
                  placeholder="Enter Chinese (Simplified)"
                  data-testid="input-nameLocale-zh-Hans"
                />
                <FormikTextField
                  fieldName="nameLocale.zh-Hant"
                  label="Chinese (Traditional)"
                  placeholder="Enter Chinese (Traditional)"
                  data-testid="input-nameLocale-zh-Hant"
                />
                <FormikTextField
                  fieldName="nameLocale.ta"
                  label="Tamil"
                  placeholder="Enter Tamil"
                  data-testid="input-nameLocale-ta"
                />
              </Fieldset>
              <hr className="mb-5" />
              <Fieldset legend="OTHER">
                {!isEdit && <StationIdField />}
                <FormikTextField
                  fieldName="latitude"
                  label="Latitude"
                  placeholder="Enter latitude"
                  data-testid="input-latitude"
                />
                <FormikTextField
                  fieldName="longitude"
                  label="Longitude"
                  placeholder="Enter longitude"
                  data-testid="input-longitude"
                />
                <FormikRadioGroup
                  fieldName="status"
                  label="Status"
                  data-testid="input-status"
                  options={Object.values(WaitingAreaStatus).map((val) => ({
                    label: titleCase(val),
                    value: val,
                  }))}
                />
                <FormikRadioGroup
                  fieldName="type"
                  label="Type"
                  data-testid="input-type"
                  options={Object.values(WaitingAreaType).map((val) => ({
                    label: titleCase(val, {hasUnderscore: true}),
                    value: val,
                  }))}
                />
                <FieldContainer
                  label={'Image (Optional)'}
                  labelAlign={'start'}
                  layout={'horizontal'}>
                  {!imgFile && values.image && (
                    <FileItem
                      imageSrc={values.image}
                      className="mb-2"
                      onRemove={() => setFieldValue('image', '')}
                      fileName={values.image.split('/').pop()}
                    />
                  )}
                  {imgFile && (
                    <FileItem
                      file={imgFile}
                      className="mb-2"
                      onRemove={() => {
                        setImgFile(null);
                        setFieldValue('image', '');
                      }}
                    />
                  )}
                  {!imgFile && !values.image && (
                    <FileSelector
                      className="-mx-1"
                      onFilesSelected={(newFiles: File[]) => {
                        const file = newFiles[0];
                        const fileSizeMb = file.size / 1024 / 1024;
                        if (fileSizeMb > 1) {
                          setFieldError(
                            'image',
                            `File size is too big (${Math.ceil(fileSizeMb * 10) / 10} MB).`,
                          );
                          setFieldValue('image', '', false);
                          setImgFile(null);
                        } else {
                          setFieldError('image', undefined);
                          setFieldValue('image', file.name);
                          setImgFile(file);
                        }
                      }}
                      onBlur={() => setFieldTouched('image', true, false)}
                      fileType="image"
                      description="JPG or PNG up to 10MB"
                      data-testid="file-image"
                    />
                  )}
                </FieldContainer>
                <FormikMultiInputField
                  label="Tags"
                  fieldName="tags"
                  placeholder="i.e RW0000, Mutiara Damansara, Mesra"
                  data-testid="input-tags"
                  onChangeValues={(newTags) => {
                    const stationIdRemoved = !newTags.includes(values.stationId);

                    if (isEdit && stationIdRemoved) return;
                    setFieldValue('tags', newTags);
                  }}
                />
              </Fieldset>
            </ModalBody>
            <ModalFooter className="flex justify-end">
              <Button
                variant="outline"
                disabled={isLoading}
                className="uppercase mr-3"
                onClick={onDismiss}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="uppercase"
                type="submit"
                isLoading={isLoading}
                data-testid="btn-save">
                Save {isEdit && 'Changes'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </Formik>
    </Modal>
  );
}

function StationIdField() {
  const {setValue: setLatitude} = useField('latitude')[formikHelperIndex];
  const {setValue: setLongitude} = useField('longitude')[formikHelperIndex];
  const {setValue: setTags} = useField('tags')[formikHelperIndex];
  const stationId: string = useField('stationId')[formikMetaIndex].value;
  const stationIdError = useField('stationId')[formikMetaIndex].error;

  useStation(stationId, {
    enabled: !stationIdError,
    retry: false,
    onSuccess: (value) => {
      if (value) {
        setLatitude(value.latitude);
        setLongitude(value.longitude);
        setTags([value.id, value.name]);
      }
    },
  });

  return (
    <FormikTextField
      fieldName="stationId"
      label="Station ID"
      placeholder="Enter station ID to retrieve latitude and longitude values"
      layout="horizontal"
      data-testid="input-stationId"
    />
  );
}
