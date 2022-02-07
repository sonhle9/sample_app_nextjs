import * as React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Field,
  Label,
  DropdownSelect,
  Alert,
  AlertMessages,
  TextInput,
  isEmail,
  isNumber,
} from '@setel/portal-ui';
import {
  ButtonModalCardholder,
  ICardholder,
  ID_TYPE,
  Salutations,
  EMessage,
  MalaysiaStates,
  countryOptions,
  validateIdNumber,
} from '../cardholder.type';
import {useCardholderUpdate} from '../cardholder.queries';
import {useRouter} from '../../../routing/routing.context';
import {isEmpty} from 'lodash';
interface ICardholderProps {
  visible: boolean;
  onClose?: () => void;
  mode: ButtonModalCardholder;
  cardholder?: ICardholder;
}

interface Validate {
  email?: string;
  name?: string;
  displayName?: string;
  idType?: string;
  idNumber?: string;
  phoneNumber?: string;
  salutation?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
}

export const CardholderEditModal = (props: ICardholderProps) => {
  const [name, setName] = React.useState(props?.cardholder?.name || '');
  const [displayName, setDisplayName] = React.useState(props?.cardholder?.displayName || '');
  const [salutation, setSalutation] = React.useState(props?.cardholder?.salutation || '');
  const [idType, setIdType] = React.useState<string>(props?.cardholder?.idType || '');
  const [idNumber, setIdNumber] = React.useState(props?.cardholder?.idNumber || '');
  const [phoneNumber, setPhoneNumber] = React.useState(props?.cardholder?.phoneNumber || '');
  const [email, setEmail] = React.useState(props?.cardholder?.email || '');
  const [addressOne, setAddressOne] = React.useState(props?.cardholder?.address1 || '');
  const [addressTwo, setAddressTwo] = React.useState(props?.cardholder?.address2 || '');
  const [postcode, setPostcode] = React.useState(props?.cardholder?.postcode || '');
  const [country, setCountry] = React.useState(props?.cardholder?.country || '');
  const [state, setState] = React.useState(props?.cardholder?.state);
  const [city, setCity] = React.useState(props?.cardholder?.city || '');
  const [loading, setLoading] = React.useState(true);
  const {mutate: setCardholder} = useCardholderUpdate(props.cardholder);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [validate, setValidate] = React.useState<Validate>({
    email: '',
    name: '',
    displayName: '',
    idNumber: '',
  });
  const [err, setErr] = React.useState(false);
  const router = useRouter();
  const validator = () => {
    const validates: Validate = {};
    if (!name) {
      validates['name'] = EMessage.REQUIRED_FIELD;
    } else if (isEmpty(name.trim())) {
      validates['name'] = EMessage.NOT_EMPTY;
    }
    if (email) {
      if (!isEmail(email)) {
        validates['email'] = EMessage.INVALID_MAIL;
      }
    }
    if (idNumber) {
      if (idType === validateIdNumber.NRIC && !isNumber(Number(idNumber))) {
        validates['idNumber'] = EMessage.IS_NUMBER;
      }
      if (idType === validateIdNumber.NRIC && idNumber.length > 12) {
        validates['idNumber'] = EMessage.INVALID_ID_NUMBER;
      }
      if (idType === validateIdNumber.NRIC && idNumber.length < 12) {
        validates['idNumber'] = EMessage.INVALID_ID_NUMBER;
      }
    }
    setLoading(true);
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };
  const closeModal = () => {
    return props.onClose();
  };
  const save = () => {
    if (loading) {
      setLoading(false);
      if (validator()) {
        setCardholder(
          {
            id: props.cardholder.id,
            ...{name: name},
            ...{displayName: displayName},
            ...(salutation && {salutation: salutation}),
            ...(idType && {idType: idType}),
            ...{idNumber: idNumber},
            ...{email: email},
            ...{phoneNumber: phoneNumber},
            ...{address1: addressOne},
            ...{address2: addressTwo},
            ...{city: city},
            ...{postcode: postcode},
            ...(state && {state: state}),
            ...{country: country},
          },
          {
            onSuccess: (res: any) => {
              if (res) {
                setLoading(true);
                closeModal();
                router.navigateByUrl(`/card-issuing/cardholders/${props.cardholder.id}`);
              }
            },
            onError: async (res: any) => {
              setLoading(true);
              const response = await (res.response && res.response.data);
              if (!response.response) {
                setErrorMsg(response.message);
                setErr(true);
              }
              const keyError = Object.keys(response.response.errors);
              setErrorMsg(response.response.errors[keyError[0]]);
              setErr(true);
            },
          },
        );
      }
    }
  };
  return (
    <>
      <Modal isOpen={props.visible} onDismiss={closeModal} aria-label={'update'}>
        <ModalHeader>
          <span>{props.mode}</span> details
        </ModalHeader>
        {err && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages messages={[errorMsg]} />
          </Alert>
        )}
        <ModalBody className="py-7">
          <Field
            className={
              validate?.name
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Name</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidate({});
                }}
                placeholder="Please enter your name"
              />
              {validate?.name && <p className="text-red-500 text-sm">{validate.name}</p>}
            </div>
          </Field>
          <Field
            className={
              validate?.displayName
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Display name</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Please enter your display name"
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start h-14">
            <Label className="pt-2">Salutation</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <DropdownSelect
                className="w-72"
                value={salutation}
                onChangeValue={(value) => setSalutation(value)}
                options={Salutations}
                placeholder="Please select"
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start h-14">
            <Label className="pt-2">ID type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <DropdownSelect
                className="w-72"
                value={idType}
                onChangeValue={(value) => setIdType(value)}
                options={ID_TYPE}
                placeholder="Please select"
              />
            </div>
          </Field>
          <Field
            className={
              validate?.idNumber
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">ID number</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <TextInput
                value={idNumber}
                maxLength={idType === validateIdNumber.NRIC && 12}
                onChange={(e) => {
                  if (!e.target.value.match('^[a-zA-Z0-9 ]*$')) {
                    return;
                  }
                  setIdNumber(e.target.value);
                  setValidate({});
                }}
                placeholder="Enter NRIC/Passport number"
              />
              {validate?.idNumber && <p className="text-red-500 text-sm">{validate.idNumber}</p>}
            </div>
          </Field>
          <Field
            className={
              validate?.email
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Email</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidate({});
                }}
                placeholder="Enter email address"
              />
              {validate?.email && <p className="text-red-500 text-sm">{validate.email}</p>}
            </div>
          </Field>
          <Field
            className={
              validate?.phoneNumber
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Phone number</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <TextInput
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone no."
              />
            </div>
          </Field>
          <Field
            className={
              validate?.address1
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Address line 1</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                value={addressOne}
                onChange={(e) => setAddressOne(e.target.value)}
                placeholder="Enter your address line 1"
              />
            </div>
          </Field>
          <Field
            className={
              validate?.address2
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Address line 2</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                value={addressTwo}
                onChange={(e) => setAddressTwo(e.target.value)}
                placeholder="Enter your address line 2"
              />
            </div>
          </Field>
          <Field
            className={
              validate?.city
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">City</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <TextInput
                className="w-72"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>
          </Field>
          <Field
            className={
              validate?.postcode
                ? 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start'
                : 'sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-4'
            }>
            <Label className="pt-2">Postcode</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <TextInput
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter postcode"
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start h-14">
            <Label className="pt-2">State</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <DropdownSelect
                className="placeholder-black"
                placeholder="Select state"
                value={state}
                onChangeValue={(value) => {
                  setState(value);
                }}
                options={Object.values(MalaysiaStates).map((opt) => ({
                  label: opt,
                  value: opt as string,
                }))}
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Country</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black w-72">
              <DropdownSelect
                className="placeholder-black"
                placeholder="Select country"
                value={country}
                onChangeValue={(value) => {
                  setCountry(value);
                }}
                options={countryOptions}
              />
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <span></span>
            <div className="flex items-center">
              <Button variant="outline" onClick={closeModal}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                variant="primary"
                onClick={() => {
                  save();
                }}>
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
