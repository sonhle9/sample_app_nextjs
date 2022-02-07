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
  SearchableDropdown,
  Textarea,
  TextInput,
  titleCase,
  FieldContainer,
} from '@setel/portal-ui';
import _, {isEmpty} from 'lodash';
import * as React from 'react';
import {Levels, Types} from 'src/app/cards/shared/enums';
import {useRouter} from 'src/react/routing/routing.context';
import {EType} from 'src/shared/enums/card.enum';
import {useGetMerchants} from '../../cards/card.queries';
import {useSetCardGroups} from '../card-group.queries';
import {ICardGroup} from '../card-group.type';

interface ICardGroupModalProps {
  visible: boolean;
  cardGroup?: ICardGroup;
  onClose?: () => void;
}

interface Validate {
  type?: string;
  name?: string;
  merchant?: string;
  description?: string;
}

const CardGroupModal: React.VFC<ICardGroupModalProps> = (props) => {
  const [errorMsg, setErrorMsg] = React.useState([]);
  const [validate, setValidate] = React.useState<Validate>({
    type: '',
    name: '',
    merchant: '',
    description: '',
  });
  const validator = () => {
    const validates: Validate = {};
    if (!props.cardGroup?.name && !type) {
      validates['type'] = 'This is required field';
    }
    if (!name) {
      validates['name'] = 'Please enter a name for the card groups';
    } else if (!name.match('^[a-zA-Z0-9 ]*$')) {
      validates['name'] = 'Alphanumeric only';
    } else if (isEmpty(name.trim())) {
      validates['name'] = 'Please enter a name for the card groups';
    }
    if (type === Types.Fleet && !merchant) {
      validates['merchant'] = 'This is required field';
    }
    if (!description.match('^[a-zA-Z0-9 ]*$')) {
      validates['description'] = 'Alphanumeric only';
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };

  const [type, setType] = React.useState(props.cardGroup?.cardType || null);
  const [merchant, setMerchant] = React.useState(props.cardGroup?.merchantId || null);
  const [name, setCardGroupName] = React.useState(props.cardGroup?.name || '');
  const [description, setDescription] = React.useState(props.cardGroup?.description || '');
  const [merchantSearch, setMerchantSearch] = React.useState('');
  const {data: merchantList} = useGetMerchants({name: merchantSearch});
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);
  const {mutate: setCardGroup} = useSetCardGroups(props.cardGroup || null);
  const onSubmit = () => {
    if (!validator()) {
      return;
    }
    setIsCreating(true);
    setCardGroup(
      {
        ...(props.cardGroup?.id && {id: props.cardGroup.id}),
        cardType: type,
        merchantId: merchant,
        name: name.trim(),
        description: description.trim(),
        level: merchant ? Levels.MERCHANT : Levels.ENTERPRISE,
      },
      {
        onSuccess: () => {
          close();
          props.cardGroup?.id
            ? router.navigateByUrl(`/card-issuing/card-groups/${props.cardGroup?.id}`)
            : router.navigateByUrl(`/card-issuing/card-groups`);
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          if (response && response.statusCode === 403) {
            setErrorMsg([response.message]);
          }
          if (response && response.statusCode !== 404) {
            const keyError = Object.keys(response?.response?.errors);
            setErrorMsg(response.response.errors[keyError[0]]);
          } else if (response.message) {
            setErrorMsg([response.message]);
          }
          setIsCreating(false);
        },
      },
    );
  };

  const title = props.cardGroup ? 'Edit details' : 'Create new card group';

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close}>
        <ModalHeader>
          <span className="leading-6 text-black">{title} </span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg.map((messageError) => titleCase(messageError))} />
            </Alert>
          )}

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start pt-2.5">
            <Label className="pt-2">Type</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 ml-1">
              <DropdownSelect
                disabled={!!props?.cardGroup}
                className={props?.cardGroup ? 'w-64 text-gray-500' : 'w-64'}
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
          {type && type === Types.Fleet && (
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
              <Label className="pt-2">Merchant</Label>
              <div
                className={
                  props?.cardGroup
                    ? 'mt-1 sm:mt-0 sm:col-span-3 ml-1 text-gray-500'
                    : 'mt-1 sm:mt-0 sm:col-span-3 ml-1'
                }>
                <FieldContainer
                  status={validate?.merchant ? 'error' : undefined}
                  className={
                    props?.cardGroup
                      ? 'mt-1 sm:mt-0 sm:col-span-3 mb-0 text-gray-500'
                      : 'mt-1 sm:mt-0 sm:col-span-3 mb-0'
                  }>
                  <SearchableDropdown
                    className="placeholder-gray-500"
                    disabled={!!props.cardGroup}
                    placeholder="Please select"
                    wrapperClass="w-9/12"
                    value={merchant || ''}
                    onChangeValue={setMerchant}
                    onChange={(value) => {
                      setValidate({});
                      setMerchantSearch(value.target.value);
                    }}
                    options={
                      merchantList &&
                      merchantList.map((merchant) => ({
                        value: merchant.value,
                        description: `Merchant ID: ${merchant.value}`,
                        label: merchant.label,
                      }))
                    }
                  />
                  {validate?.merchant && (
                    <p className="text-red-500 text-sm">{validate.merchant}</p>
                  )}
                </FieldContainer>
              </div>
            </Field>
          )}

          <Field className="grid grid-cols-4 grid-flow-row gap-4">
            <Label className="pt-2">Card groups</Label>
            <FieldContainer
              status={validate?.name ? 'error' : undefined}
              className={
                props?.cardGroup
                  ? 'mt-1 sm:mt-0 sm:col-span-3 mb-0 text-gray-500'
                  : 'mt-1 sm:mt-0 sm:col-span-3 mb-0'
              }>
              <TextInput
                className="placeholder-gray-500"
                disabled={!!props.cardGroup}
                maxLength={20}
                placeholder="Enter card group name"
                value={name}
                onChangeValue={(value: string) => {
                  // if (!value.match('^[a-zA-Z0-9 ]*$')) {
                  //   return;
                  // }
                  setErrorMsg([]);
                  setValidate({});
                  setCardGroupName(value);
                }}
              />
              {validate?.name && <p className="text-red-500 text-sm">{validate.name}</p>}
            </FieldContainer>
          </Field>

          <Field className="grid grid-cols-4 grid-flow-row gap-4 pb-1">
            <Label>Description</Label>
            <FieldContainer
              status={validate?.description ? 'error' : undefined}
              className={
                props?.cardGroup
                  ? 'mt-1 sm:mt-0 sm:col-span-3 mb-0 text-gray-500'
                  : 'mt-1 sm:mt-0 sm:col-span-3 mb-0'
              }>
              <div className="mt-1 sm:mt-0 sm:col-span-3 mb-2">
                <Textarea
                  className="placeholder-gray-500"
                  value={description}
                  onChangeValue={(e) => {
                    // if (!e.match('^[a-zA-Z0-9 ]*$')) {
                    //   return;
                    // }
                    setErrorMsg([]);
                    setValidate({});
                    setDescription(e);
                  }}
                  maxLength={50}
                  placeholder="Enter card group description"
                />
                {validate?.description && (
                  <p className="text-red-500 text-sm">{validate.description}</p>
                )}
              </div>
            </FieldContainer>
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
                disabled={!type && !merchant && !name && !description}>
                {!!props.cardGroup ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CardGroupModal;
