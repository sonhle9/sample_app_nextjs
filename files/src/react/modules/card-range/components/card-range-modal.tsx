import {
  Alert,
  AlertMessages,
  Button,
  DropdownSelect,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
  TextInput,
  titleCase,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {EType} from 'src/shared/enums/card.enum';
import {useSetCardRanges} from '../card-range.queries';
import {ICardRange, ICardRangeInput} from '../card-range.type';

interface ICardRangeModalProps {
  visible: boolean;
  cardRange?: ICardRange;
  onClose?: () => void;
}

interface Validate {
  type?: string;
  name?: string;
  nameSymbols?: string;
  startNumber?: string;
  endNumber?: string;
  descriptionSymbols?: string;
}

function validInput(e: string) {
  if (e === 'Backspace' || e === 'Control' || !isNaN(Number(e))) {
    return false;
  }
  return true;
}

const CardRangeModal: React.VFC<ICardRangeModalProps> = (props) => {
  const [errorMsg, setErrorMsg] = React.useState([]);
  const [validate, setValidate] = React.useState<Validate>({
    type: '',
    name: '',
    nameSymbols: '',
    startNumber: '',
    endNumber: '',
    descriptionSymbols: '',
  });
  const validator = () => {
    const validates: Validate = {};
    if (!type) {
      validates['type'] = 'Please select Type';
    }
    if (!name) {
      validates['name'] = 'Please enter a name for the card range';
    }
    let aRegex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
    if (aRegex.test(name)) {
      validates['nameSymbols'] = 'Alphanumeric only';
    }
    if (startNumber.length !== 16) {
      validates['startNumber'] = 'Required to be in 16 digits';
    }
    if (endNumber.length !== 16) {
      validates['endNumber'] = 'Required to be in 16 digits';
    }
    if (aRegex.test(description)) {
      validates['descriptionSymbols'] = 'Alphanumeric only';
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };
  const [type, setType] = React.useState(props.cardRange?.type || null);
  const [name, setCardRangeName] = React.useState(props.cardRange?.name || '');
  const [description, setDescription] = React.useState(props.cardRange?.description || '');
  const [startNumber, setCardRangeStartNumber] = React.useState(props.cardRange?.startNumber || '');
  const [endNumber, setCardRangeEndNumber] = React.useState(props.cardRange?.endNumber || '');
  const [currentNumber, setCardRangeCurrentNumber] = React.useState(
    props.cardRange?.currentNumber || '',
  );
  const Totals =
    parseInt(props.cardRange?.endNumber, 10) > 0
      ? parseInt(props.cardRange?.endNumber, 10) - parseInt(props.cardRange?.startNumber, 10)
      : '-';
  const [total, setCardRangeTotal] = React.useState(props.cardRange ? Totals : '');
  const [isCreating, setIsCreating] = React.useState(false);
  const router = useRouter();
  const {mutate: setCardRange} = useSetCardRanges(props.cardRange || null);
  const onSubmit = () => {
    if (!validator()) {
      return;
    }
    let body = {} as ICardRangeInput;
    if (currentNumber && props.cardRange?.id) {
      body = {
        ...(props.cardRange?.id && {id: props.cardRange.id}),
        endNumber: endNumber.trim(),
        description: description.trim(),
      };
    } else if (!currentNumber && props.cardRange?.id) {
      body = {
        ...(props.cardRange?.id && {id: props.cardRange.id}),
        endNumber: endNumber.trim(),
        startNumber: startNumber.trim(),
        description: description.trim(),
      };
    } else {
      body = {
        ...(props.cardRange?.id && {id: props.cardRange.id}),
        type: type,
        endNumber: endNumber.trim(),
        startNumber: startNumber.trim(),
        name: name.trim(),
        description: description.trim(),
        currentNumber: currentNumber,
      };
    }
    setIsCreating(true);
    setCardRange(body, {
      onSuccess: () => {
        close();
        props.cardRange?.id
          ? router.navigateByUrl(`/card-issuing/card-ranges/${props.cardRange?.id}`)
          : router.navigateByUrl(`/card-issuing/card-ranges`);
      },
      onError: (err: any) => {
        if (err.response.data.statusCode) {
          setErrorMsg([err.response.data.message]);
        }
        setIsCreating(false);
        const response = err.response && err.response.data;
        if (response && response.statusCode) {
          const keyError = Object.keys(response?.response?.errors);
          setErrorMsg(response.response.errors[keyError[0]]);
        }
        setIsCreating(false);
      },
    });
  };

  return (
    <>
      <Modal
        size="standard"
        isOpen={props.visible}
        onDismiss={close}
        aria-label={!!props.cardRange ? 'Edit details' : 'Create card range'}>
        <ModalHeader>{!!props.cardRange ? 'Edit details' : 'Create card range'}</ModalHeader>
        <ModalBody className="space-y-4">
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg} />
            </Alert>
          )}

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mt-2">
            <Label className="pt-2">Type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 ml-1">
              <DropdownSelect
                disabled={!!props.cardRange}
                className={props?.cardRange ? 'w-64 text-gray-500 text-black' : 'w-64 text-black'}
                name="targetType"
                placeholder="Please select"
                options={Object.values(EType).map((value) => ({
                  value,
                  label: titleCase(value),
                }))}
                value={type}
                onChangeValue={(value) => {
                  setValidate({});
                  setType(value);
                }}
              />
              {validate?.type && <p className="text-red-500 text-sm">{validate.type}</p>}
            </div>
          </Field>

          <Field className="grid grid-cols-4 grid-flow-row gap-4">
            <Label className="pt-2">Card range name</Label>
            <div className={'mt-1 sm:mt-0 sm:col-span-3'}>
              <TextInput
                className="placeholder-gray-500 text-black"
                disabled={!!props.cardRange}
                maxLength={20}
                placeholder="Enter card range name"
                value={props.cardRange?.name}
                onChangeValue={(value: string) => {
                  setErrorMsg([]);
                  setValidate({});
                  setCardRangeName(value);
                }}
              />
              {validate?.name && <p className="text-red-500 text-sm">{validate.name}</p>}
              {validate?.nameSymbols && (
                <p className="text-red-500 text-sm">{validate.nameSymbols}</p>
              )}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mt-2 ">
            <Label className="pt-2">Description</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 ml-1">
              <Textarea
                className="placeholder-gray-500 text-black"
                value={description}
                onChangeValue={(e) => {
                  setErrorMsg([]);
                  setValidate({});
                  setDescription(e);
                }}
                maxLength={100}
                placeholder="Enter card range description"
              />
              {validate?.descriptionSymbols && (
                <p className="text-red-500 text-sm">{validate.descriptionSymbols}</p>
              )}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mt-2">
            <Label className="pt-2">Start number</Label>
            <div
              className={
                props?.cardRange
                  ? 'mt-1 sm:mt-0 sm:col-span-2 ml-1 text-black'
                  : 'mt-1 sm:mt-0 sm:col-span-3 ml-1 text-black'
              }>
              <TextInput
                disabled={!!currentNumber && !!props.cardRange}
                className="w-64"
                maxLength={16}
                placeholder="Enter start number "
                value={startNumber}
                onChangeValue={(value: string) => {
                  setErrorMsg([]);
                  setValidate({});
                  if (!validInput(value.trim())) {
                    setCardRangeStartNumber(value.trim());
                  }
                  value.length === 16 && endNumber.length === 16
                    ? setCardRangeTotal(
                        parseInt(endNumber, 10) - parseInt(value, 10) > 0
                          ? parseInt(endNumber, 10) - parseInt(value, 10)
                          : 0,
                      )
                    : null;
                }}
              />
              {validate?.startNumber && (
                <p className="text-red-500 text-sm">{validate.startNumber}</p>
              )}
            </div>
          </Field>

          {!!props.cardRange ? (
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mt-2">
              <Label className="pt-2">Current number</Label>
              <div className={'mt-1 sm:mt-0 sm:col-span-2 ml-1'}>
                <TextInput
                  className="w-64 text-black"
                  disabled={true}
                  maxLength={20}
                  value={currentNumber}
                  onChangeValue={(value: string) => {
                    setErrorMsg([]);
                    setValidate({});
                    setCardRangeCurrentNumber(value);
                  }}
                />
              </div>
            </Field>
          ) : null}

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mt-2">
            <Label className="pt-2">End number</Label>
            <div
              className={
                props?.cardRange
                  ? 'mt-1 sm:mt-0 sm:col-span-2 ml-1 text-gray-500'
                  : 'mt-1 sm:mt-0 sm:col-span-3 ml-1'
              }>
              <TextInput
                className="w-64 text-gray-500 text-black"
                disabled={false}
                maxLength={16}
                placeholder="Enter end number"
                value={endNumber}
                onChangeValue={(value: string) => {
                  setErrorMsg([]);
                  setValidate({});
                  if (!validInput(value.trim())) {
                    setCardRangeEndNumber(value.trim());
                  }
                  value.length === 16 && startNumber.length === 16
                    ? setCardRangeTotal(
                        parseInt(value, 10) > parseInt(startNumber, 10)
                          ? parseInt(value, 10) - parseInt(startNumber, 10)
                          : 0,
                      )
                    : null;
                }}
              />
              {validate?.endNumber && <p className="text-red-500 text-sm">{validate.endNumber}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start pb-1">
            <Label className="pt-2">Total cards</Label>
            <div
              className={
                props?.cardRange
                  ? 'mt-1 sm:mt-0 sm:col-span-2 ml-1 mb-2 text-gray-500 '
                  : 'mt-1 sm:mt-0 sm:col-span-3 mb-2 ml-1'
              }>
              <TextInput
                className="w-64 text-gray-500 text-black"
                disabled={false}
                placeholder="Total no. of cards"
                value={total}
                onChangeValue={(value: string) => {
                  setErrorMsg([]);
                  setValidate({});
                  if (!validInput(value.trim())) {
                    setCardRangeTotal(value);
                  }
                  startNumber
                    ? setCardRangeEndNumber(
                        parseInt(value, 10) > 0
                          ? (parseInt(value, 10) + parseInt(startNumber, 10)).toString()
                          : null,
                      )
                    : null;
                }}
              />
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>

              <Button
                isLoading={isCreating}
                className="ml-4"
                variant="primary"
                onClick={onSubmit}
                disabled={!type && !startNumber && !name && !description && !endNumber}>
                {!!props.cardRange ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CardRangeModal;
