import {
  Alert,
  AlertMessages,
  Button,
  DescItem,
  DescList,
  DropdownSelect,
  Field,
  formatDate,
  formatMoney,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  SearchableDropdown,
  TextField,
  TextInput,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {useGetCardGroups, useGetCardRanges, useGetMerchants, useSetCards} from '../card.queries';
import {EditMode, ICard} from '../card.type';
import {EFormFactor, EPhysicalType, ESubtype, EType} from 'src/shared/enums/card.enum';
import {useRouter} from '../../../routing/routing.context';

interface ICardModalProps {
  visible: boolean;
  mode: EditMode;
  card?: ICard;
  cardId?: string;
  onClose?: () => void;
}

interface Validate {
  type?: string;
  formFactor?: string;
  physicalType?: string;
  subtype?: string;
  merchant?: string;
  cardRange?: string;
  cardGroup?: string;
  displayName?: string;
  name?: string;
  numberOfCard?: string;
  transferAmount?: string;
}

export const CardModal = (props: ICardModalProps) => {
  const [errorMsg, setErrorMsg] = React.useState('');

  const [type, setType] = React.useState(EType.GIFT);
  const [formFactor, setFormFactor] = React.useState(
    props.mode === EditMode.EDIT ? props.card.formFactor.toString() : EFormFactor.PHYSICAL,
  );
  const [physicalType, setPhysicalType] = React.useState(
    props.mode === EditMode.EDIT
      ? props.card.physicalType.toString()
      : type === EType.GIFT
      ? EPhysicalType.MAGSTRIPE
      : null,
  );
  const [subtype, setSubtype] = React.useState(
    props.mode === EditMode.EDIT ? props.card.subtype.toString() : null,
  );

  const [merchant, setMerchant] = React.useState('');
  const [merchantSearch, setMerchantSearch] = React.useState('');
  const [cardRange, setCardRange] = React.useState('');
  const [cardGroup, setCardGroup] = React.useState('');
  const [numberOfCard, setNumberOfCard] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [name, setName] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState('');
  const {data: merchantList} = useGetMerchants({name: merchantSearch});
  const {data: cardRangesList} = useGetCardRanges({type: type});
  const {data: cardGroupsList} = useGetCardGroups({
    cardType: type,
  });

  const [err, setErr] = React.useState(false);
  const {mutate: setBulkCard} = useSetCards(null);
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);
  const [confirmCreateCard, setConfirmCreateCard] = React.useState(false);

  const [validate, setValidate] = React.useState<Validate>({
    type: '',
    formFactor: '',
    physicalType: '',
    subtype: '',
    merchant: '',
    cardRange: '',
    cardGroup: '',
    displayName: '',
    name: '',
    numberOfCard: '',
    transferAmount: '',
  });

  const validator = () => {
    const validates: Validate = {};
    if (!type) {
      validates['type'] = 'This is field required';
    }
    if (type === EType.FLEET) {
      setPhysicalType(EPhysicalType.CHIP);
      if (!subtype) {
        validates['subtype'] = 'This is field required';
      }
      if (!merchant) {
        validates['merchant'] = 'This is field required';
      }
    }
    if (type === EType.LOYALTY) {
      if (!cardGroup) {
        validates['cardGroup'] = 'This is field required';
      }
    }
    if (type === EType.GIFT) {
      if (!merchant) {
        validates['merchant'] = 'This is field required';
      }
      if (!cardGroup) {
        validates['cardGroup'] = 'This is field required';
      }
      if (!name || name === '') {
        validates['name'] = 'This is field required';
      }
    }
    if (!cardRange) {
      validates['cardRange'] = 'This is field required';
    }
    if (Number(numberOfCard) === 0) {
      validates['numberOfCard'] = 'This is field required and more than 0';
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };

  const save = async () => {
    if (validator()) {
      setConfirmCreateCard(true);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setBulkCard(
      {
        formFactor: formFactor as EFormFactor,
        ...(physicalType && {physicalType: physicalType as EPhysicalType}),
        type: type as EType,
        subtype: subtype as ESubtype,
        merchant: merchant,
        merchantId: merchant,
        numberOfCards: Number(numberOfCard),
        cardGroup: cardGroup,
        ...(displayName && {displayName: displayName.trim()}),
        name: name.trim(),
        cardRange: cardRange,
        preload: Number(transferAmount),
      },
      {
        onSuccess: () => {
          close();
          router.navigateByUrl(`/card-issuing/cards`);
        },
        onError: (res: any) => {
          const response = res.response && res.response.data;
          if (!response.response) {
            setErrorMsg(response.message);
            setErr(true);
          } else {
            const keyError = Object.keys(response?.response?.errors);
            setErrorMsg(response.response.errors[keyError[0]]);
            setErr(true);
          }

          setIsCreating(false);
          setConfirmCreateCard(false);
        },
      },
    );
  };

  const close = () => {
    setErrorMsg('');
    props.onClose();
  };

  const changeFormFactor = (e) => {
    if (e !== EFormFactor.PHYSICAL) {
      setPhysicalType('');
    }
  };

  const changeType = (e) => {
    setCardRange('');
    if (e !== EType.FLEET) {
      setSubtype('');
      setMerchant('');
    }
    if (e !== EType.GIFT) {
      setTransferAmount('');
    }
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label={'update'}>
        <ModalHeader>
          <span className="capitalize">{props.mode}</span> card
        </ModalHeader>
        {err && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages
              messages={
                Array.isArray(errorMsg)
                  ? errorMsg.map((messageError) => titleCase(messageError))
                  : [errorMsg].map((messageError) => titleCase(messageError))
              }
            />
          </Alert>
        )}
        <ModalBody>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Form factor</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64 capitalize"
                disabled={true}
                name="targetType"
                placeholder="Please select"
                options={Object.values(EFormFactor).map((value) => ({
                  value,
                  label: titleCase(value),
                }))}
                onChangeValue={(value) => {
                  changeFormFactor(value);
                  setFormFactor(value);
                }}
                value={formFactor || ''}
              />
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Physical card type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64 capitalize"
                name="targetType"
                disabled={formFactor !== EFormFactor.PHYSICAL}
                placeholder="Please select"
                options={Object.values(EPhysicalType)
                  .filter((pType) => {
                    if (type === EType.FLEET) {
                      return pType !== EPhysicalType.SCRATCH;
                    }
                    if (type === EType.LOYALTY) {
                      return pType !== EPhysicalType.SCRATCH;
                    }
                    return true;
                  })
                  .map((value) => ({
                    value,
                    label: titleCase(value),
                  }))}
                onChangeValue={(value) => {
                  setValidate({});
                  setPhysicalType(value);
                }}
                value={physicalType || ''}
              />
              {validate?.physicalType && (
                <p className="text-red-500 text-sm">{validate.physicalType}</p>
              )}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64 capitalize"
                name="targetType"
                placeholder="Please select"
                options={
                  Object.values(EType).map((value) => ({
                    value,
                    label: titleCase(value),
                  })) as any
                }
                onChangeValue={(value) => {
                  setValidate({});
                  changeType(value);
                  setType(value as EType);
                  if (value === EType.GIFT || value === EType.LOYALTY) {
                    setPhysicalType(EPhysicalType.MAGSTRIPE);
                  } else {
                    setPhysicalType(EPhysicalType.CHIP);
                  }
                }}
                disabled={true}
                value={type || ''}
              />
              {validate?.type && <p className="text-red-500 text-sm">{validate.type}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Subtype</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64"
                name="targetType"
                disabled={type !== EType.FLEET}
                placeholder="Please select"
                options={Object.values(ESubtype).map((value) => ({
                  value,
                  label: titleCase(value),
                }))}
                onChangeValue={(value) => {
                  setValidate({});
                  setSubtype(value);
                }}
                value={subtype || ''}
              />
              {validate?.subtype && <p className="text-red-500 text-sm">{validate.subtype}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Merchant</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 w-64 mb-5">
              <SearchableDropdown
                placeholder="Please select"
                wrapperClass="w-64"
                value={merchant}
                onChangeValue={(value: string) => {
                  setValidate({});
                  setMerchant(value);
                }}
                onChange={(value) => {
                  setValidate({});
                  setMerchantSearch(value.target.value);
                }}
                options={merchantList || []}
              />
              {validate?.merchant && <p className="text-red-500 text-sm">{validate.merchant}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Card range</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64 "
                name="targetType"
                placeholder="Please select"
                value={cardRange}
                options={
                  (cardRangesList &&
                    cardRangesList.map((cRange) => ({
                      value: cRange.id,
                      label: cRange.name,
                    }))) ||
                  []
                }
                onChangeValue={(value: string) => {
                  setValidate({});
                  setCardRange(value);
                }}
              />
              {validate?.cardRange && <p className="text-red-500 text-sm">{validate.cardRange}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Card groups</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64"
                name="targetType"
                placeholder="Please select"
                value={cardGroup}
                options={
                  (cardGroupsList &&
                    cardGroupsList.items.map((cGroup) => ({
                      value: cGroup.id,
                      label: cGroup.name,
                    }))) ||
                  []
                }
                onChangeValue={(value) => {
                  setValidate({});
                  setCardGroup(value);
                }}
              />
              {validate?.cardGroup && <p className="text-red-500 text-sm">{validate.cardGroup}</p>}
            </div>
          </Field>
          {type === EType.GIFT && (
            <>
              <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
                <Label className="pt-2">Cardholder name</Label>
                <div className="mt-1 sm:mt-0 sm:col-span-3 mb-5">
                  <TextInput
                    maxLength={25}
                    placeholder="Enter cardholder name"
                    className="w-10/12"
                    value={name}
                    onChangeValue={(value: string) => {
                      setValidate({});
                      setName(value);
                    }}
                  />
                  {validate?.name && <p className="text-red-500 text-sm">{validate.name}</p>}
                </div>
              </Field>

              <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
                <Label className="pt-2">Cardholder display name</Label>
                <div className="mt-1 sm:mt-0 sm:col-span-3 mb-5">
                  <TextInput
                    maxLength={25}
                    placeholder="Enter cardholder display name"
                    className="w-10/12"
                    value={displayName}
                    onChangeValue={(value: string) => {
                      setValidate({});
                      setDisplayName(value);
                    }}
                  />
                </div>
              </Field>
            </>
          )}
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">No. of cards</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <TextField
                placeholder="Enter no. of cards"
                type="number"
                value={numberOfCard}
                onKeyDown={(e) => {
                  if (e.key === '-') {
                    e.preventDefault();
                  }
                }}
                onChangeValue={(value) => {
                  setValidate({});
                  setNumberOfCard(value);
                }}
                wrapperClass="w-64 mb-0"
                min={1}
              />
              {validate?.numberOfCard && (
                <p className="text-red-500 text-sm">{validate.numberOfCard}</p>
              )}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2 sm:col-span-1">Transfer amount</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <MoneyInput
                onChangeValue={(v) => {
                  setValidate({});
                  setTransferAmount(v);
                }}
                value={transferAmount || '0.00'}
                placeholder="0.00"
                className="w-64"
                disabled={type !== EType.GIFT}
              />
              {validate?.transferAmount && (
                <p className="text-red-500 text-sm">{validate.transferAmount}</p>
              )}
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <span></span>
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                variant="primary"
                onClick={() => {
                  save();
                }}>
                {props.mode === 'create' ? 'SAVE' : 'SAVE CHANGES'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {confirmCreateCard && (
        <Modal
          isOpen
          size="standard"
          aria-label="Card creation confirmation"
          onDismiss={() => setConfirmCreateCard(false)}>
          <ModalHeader>Card creation confirmation</ModalHeader>
          <ModalBody>
            <DescList>
              <DescItem
                label="Total affected cards"
                labelClassName="text-sm"
                value={numberOfCard}
                valueClassName="text-sm font-normal"
              />
              <DescItem
                label="Total transfer amount"
                labelClassName="text-sm"
                value={`RM ${formatMoney(Number(transferAmount) * Number(numberOfCard))}`}
                valueClassName="text-sm font-normal"
              />
              <DescItem
                label="Created on"
                labelClassName="text-sm"
                value={formatDate(new Date(), {
                  formatType: 'dateAndTime',
                })}
                valueClassName="text-sm font-normal"
              />
            </DescList>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setConfirmCreateCard(false)}>
                  CANCEL
                </Button>
                <Button variant="primary" isLoading={isCreating} onClick={handleCreate}>
                  SEND FOR APPROVAL
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}
      {/* <Notification
        isShow={on}
        variant="error"
        title="Error!"
        description={errorMsg}
      ></Notification> */}
    </>
  );
};
