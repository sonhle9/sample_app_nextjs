import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelectField,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInputWithSuggestions,
  SearchableDropdownField,
  useDebounce,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {MerchantLink} from '../merchant-links.type';
import {MerchantLinkEnterpriseOptions} from '../merchant-links.constant';
import {useSearchMerchant, useSearchMerchantByEnterprise} from '../../merchants/merchants.queries';
import {
  useCreateMerchantLink,
  useDeleteMerchantLink,
  useUpdateMerchantLink,
} from '../merchant-links.queries';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useRouter} from '../../../routing/routing.context';
import {useNotification} from '../../../hooks/use-notification';

type MerchantLinkModalProps = {
  link?: MerchantLink;
  onDismiss: () => void;
  onDone?: (newLinkId?: string) => void;
};

export const MerchantLinkModal = (props: MerchantLinkModalProps) => {
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const [searchMerchantName, setSearchMerchantName] = React.useState(
    props.link ? props.link.merchantName : '',
  );
  const [searchMerchantToLink, setSearchMerchantToLink] = React.useState('');
  const cancelRef = React.useRef(null);
  const route = useRouter();
  const [linkedMerchantIds, setLinkedMerchantIds] = React.useState([]);

  const {
    mutate: createMerchantLink,
    error: createError,
    isLoading: createLoading,
  } = useCreateMerchantLink();
  const {
    mutate: updateMerchantLink,
    error: updateError,
    isLoading: updateLoading,
  } = useUpdateMerchantLink(props.link?.id || undefined);
  const {
    mutate: deleteMerchantLink,
    error: deleteError,
    isLoading: deleteLoading,
  } = useDeleteMerchantLink(props.link?.id || undefined);

  const isLoading = createLoading || updateLoading;
  const error = createError || updateError;

  const showNotify = useNotification();

  const onDelete = () => {
    deleteMerchantLink(null, {
      onSuccess: () => {
        showNotify({
          title: 'Success!',
          variant: 'success',
          description: 'You have successfully deleted your merchant link',
        });
        route.navigateByUrl(`/merchant-links`);
      },
    });
  };

  const title = !!props.link ? 'Edit details' : 'Create new merchant link';

  const {values, touched, handleSubmit, setFieldValue, errors, handleBlur} =
    useFormik<MerchantLinkValues>({
      initialValues: {
        enterpriseToLink: props.link?.enterpriseToLink || '',
        merchantToLink:
          props.link?.linkedMerchants
            .filter((li) => li.merchantId !== props.link?.merchantId)
            .map((lm) => lm.merchantName) || [],
        merchantName: props.link?.merchantId || '',
      },
      validationSchema,
      onSubmit: () => {
        if (props.link) {
          updateMerchantLink(
            {
              merchantId: values.merchantName,
              enterpriseToLink: values.enterpriseToLink,
              linkedMerchants: linkedMerchantIds,
            },
            {
              onSuccess: (newLink) => {
                route.navigateByUrl(`/merchant-links/${newLink.id}`);
                props.onDone(newLink.id);
              },
            },
          );
        } else {
          createMerchantLink(
            {
              merchantId: values.merchantName,
              enterpriseToLink: values.enterpriseToLink,
              linkedMerchants: linkedMerchantIds,
            },
            {
              onSuccess: () => props.onDone(),
            },
          );
        }
      },
    });

  const searchMerchantNameDebounce = useDebounce(searchMerchantName);
  const searchMerchantToLinkDebounce = useDebounce(searchMerchantToLink);
  const enterpriseDebounce = useDebounce(values.enterpriseToLink);

  const {data: merchantNameOpts} = useSearchMerchant(searchMerchantNameDebounce);
  const {data: merchantToLinkOpts} = useSearchMerchantByEnterprise(
    searchMerchantToLinkDebounce,
    enterpriseDebounce,
  );
  const {data: allMerchantToLinkOpts} = useSearchMerchantByEnterprise('', enterpriseDebounce);

  React.useEffect(() => {
    if (allMerchantToLinkOpts) {
      const mToLink = values.merchantToLink.map((l) =>
        allMerchantToLinkOpts?.find((v) => v.label === l),
      );
      setLinkedMerchantIds(mToLink.map((l) => l.value));
    }
  }, [values.merchantToLink.join(), JSON.stringify(allMerchantToLinkOpts)]);

  return (
    <>
      <Modal isOpen onDismiss={props.onDismiss} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {error && <QueryErrorAlert error={error as any} />}
            <SearchableDropdownField
              className={error ? 'mt-2' : ''}
              label={'Merchant name'}
              name={'merchantName'}
              value={values.merchantName}
              onBlur={handleBlur}
              onInputValueChange={(v) => setSearchMerchantName(v)}
              onChangeValue={(v) => setFieldValue('merchantName', v)}
              status={touched.merchantName && errors.merchantName ? 'error' : undefined}
              helpText={touched.merchantName ? errors.merchantName : null}
              layout={'horizontal-responsive'}
              placeholder={`Select merchant`}
              options={merchantNameOpts}
            />
            <DropdownSelectField
              layout={'horizontal-responsive'}
              label={'Enterprise to link'}
              name={'enterpriseToLink'}
              value={values.enterpriseToLink}
              onBlur={handleBlur}
              onChangeValue={(v) => {
                setFieldValue('enterpriseToLink', v);
                setFieldValue('merchantToLink', []);
              }}
              status={touched.enterpriseToLink && errors.enterpriseToLink ? 'error' : undefined}
              helpText={touched.enterpriseToLink ? errors.enterpriseToLink : null}
              placeholder={'Please select'}
              options={MerchantLinkEnterpriseOptions}
            />
            <FieldContainer
              layout={'horizontal-responsive'}
              status={touched.merchantToLink && errors.merchantToLink ? 'error' : undefined}
              helpText={touched.merchantToLink ? errors.merchantToLink : null}
              label={'Merchant to link'}>
              <MultiInputWithSuggestions
                allowSelectAll
                name={'merchantToLink'}
                disabled={!values.enterpriseToLink || !values.merchantName}
                values={values.merchantToLink}
                onChangeValues={(v) => {
                  setFieldValue('merchantToLink', v);
                }}
                suggestions={merchantToLinkOpts
                  ?.filter(
                    (opt) =>
                      !values.merchantToLink.includes(opt.label) &&
                      opt.value !== values.merchantName,
                  )
                  .map((opt) => opt.label)}
                onInputValueChange={setSearchMerchantToLink}
                placeholder={'Select merchant to link'}
              />
            </FieldContainer>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {!!props.link ? (
                <span
                  className={'cursor-pointer text-error font-semibold text-xs'}
                  onClick={() => setVisibleDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onDismiss}>
                  CANCEL
                </Button>
                <div style={{width: 12}} />
                <Button isLoading={isLoading} type={'submit'} variant="primary">
                  {props.link ? 'SAVE CHANGES' : 'SAVE'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete merchant link?">
            {deleteError && <QueryErrorAlert error={deleteError as any} />}
            This action cannot be undone and you will not be able to recover any data.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDelete} isLoading={deleteLoading}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

interface MerchantLinkValues {
  merchantName: string;
  enterpriseToLink: string;
  merchantToLink: string[];
}

const validationSchema = Yup.object({
  merchantName: Yup.string().required('This field is required.'),
  enterpriseToLink: Yup.string().required('This field is required.'),
  merchantToLink: Yup.array().of(Yup.string()).required('This field is required.'),
});
