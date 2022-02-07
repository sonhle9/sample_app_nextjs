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
  titleCase,
  MoneyInput,
  formatMoney,
  SearchableDropdown,
  useDebounce,
} from '@setel/portal-ui';

import * as React from 'react';
import {useSetCards, useGetCardGroups} from '../card.queries';
import {ICard, IndexCard} from '../card.type';
import {EFormFactor, EPhysicalType, ESubtype, EType} from 'src/shared/enums/card.enum';
import {useRouter} from '../../../routing/routing.context';
import {EStatus, Reason} from 'src/app/cards/shared/enums';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import {EMessage} from '../card-message.-validate';
interface ICardModalProps {
  visible: boolean;
  card?: ICard;
  cardId?: string;
  onClose?: () => void;
}

interface Validate {
  reason?: string;
  cardGroup?: string;
  cardLimit?: string;
}

function setStatuses(status: EStatus) {
  const result = [];
  switch (status) {
    case EStatus.ACTIVE:
      Object.values(EStatus).forEach((value) => {
        if (value !== EStatus.PENDING && value !== EStatus.ISSUED) {
          result.push(value);
        }
      });
      break;
    case EStatus.PENDING:
      Object.values(EStatus).forEach((value) => {
        if (value !== EStatus.FROZEN && value !== EStatus.ISSUED) {
          result.push(value);
        }
      });
      break;
    case EStatus.FROZEN:
      Object.values(EStatus).forEach((value) => {
        if (value !== EStatus.PENDING && value !== EStatus.ISSUED) {
          result.push(value);
        }
      });
      break;
    case EStatus.CLOSED:
      break;
    case EStatus.ISSUED:
      Object.values(EStatus).forEach((value) => {
        if (value !== EStatus.PENDING && value !== EStatus.FROZEN) {
          result.push(value);
        }
      });
      break;
  }
  return result;
}

export const CardEditModal = (props: ICardModalProps) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [status, setStatus] = React.useState(props.card.status);
  const [reason, setReason] = React.useState(
    (props.card.reason &&
      (Object.values(Reason).includes(props.card.reason as Reason)
        ? props.card.reason
        : Reason.Others)) ||
      null,
  );
  const [remark, setRemark] = React.useState(props.card.remark || '');
  const [searchCardGroup, setSearchCardGroup] = React.useState('');
  const search = useDebounce(searchCardGroup);
  const [cardGroup, setCardGroup] = React.useState(props.card.cardGroup?.name || '');
  const {data: cardGroupsList} = useGetCardGroups({
    search: search,
  });
  const [err, setErr] = React.useState(false);
  const {mutate: setCard} = useSetCards(props.card as unknown as IndexCard);
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const listStatus = setStatuses(props.card.status);
  const [validate, setValidate] = React.useState<Validate>({
    reason: '',
    cardGroup: '',
    cardLimit: '',
  });
  const [cardLimit, setCardLimit] = React.useState(
    formatMoney(props.card.maximumBalance).toString() || '',
  );
  const validator = () => {
    const validates: Validate = {};
    if (!cardGroup) {
      validates['cardGroup'] = 'This is required field';
    }
    if (
      (status === EStatus.FROZEN || status === EStatus.CLOSED) &&
      (!reason || reason === 'none')
    ) {
      validates['reason'] = 'This is required field';
    }
    if (!cardLimit) {
      validates['cardLimit'] = 'This is required field';
    } else if (Number(cardLimit) === 0) {
      validates['cardLimit'] = EMessage.AMOUNT_GREATER_0;
    }

    setLoading(true);
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };
  const save = async () => {
    if (loading) {
      setLoading(false);
      if (validator()) {
        const newCardGroup = cardGroupsList?.items.find((cGroup) =>
          cGroup.name === cardGroup ? cGroup.id : cGroup.id === cardGroup ? cGroup.id : '',
        )?.id;
        setCard(
          {
            id: props.card.id,
            status: status as EStatus,
            ...(reason && reason !== 'none' && {reason: reason as Reason}),
            remark: remark.trim(),
            formFactor: props.card.formFactor.toString() as EFormFactor,
            ...(props.card.physicalType && {
              physicalType: props.card.physicalType as EPhysicalType,
            }),
            type: props.card.type as EType,
            subtype: props.card.subtype as ESubtype,
            cardGroup: newCardGroup?.toString(),
            name: props.card.name,
            ...(props.card.displayName && {
              displayName: props.card.displayName,
            }),
            ...(cardLimit && {
              maximumBalance: Number(cardLimit) || props.card.maximumBalance,
            }),
          },
          {
            onSuccess: (res: any) => {
              if (res) {
                setLoading(true);
                close();
                router.navigateByUrl(`/card-issuing/cards/${props.card.id}`);
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

  const close = () => {
    setErrorMsg('');
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label={'update'}>
        <ModalHeader>Edit details</ModalHeader>
        {err && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages messages={[errorMsg]} />
          </Alert>
        )}
        <ModalBody>
          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start pt-3">
            <Label className="pt-2">Status</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5">
              <DropdownSelect
                className="w-64 capitalize"
                name="targetType"
                options={
                  listStatus.map((value) => ({
                    value,
                    label: titleCase(value),
                  })) || []
                }
                value={status}
                onChangeValue={(value) => {
                  setStatus(value as EStatus);
                  setValidate({});
                }}
                placeholder="Please select"
              />
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
            <Label className="pt-2">Reason</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2 mb-5 text-black">
              <DropdownSelect
                className="w-64"
                name="targetType"
                options={Object.values(Reason)
                  .filter((newReason) => newReason !== Reason.Chip)
                  .map((value) => ({
                    value,
                    label: titleCase(value),
                  }))}
                onChangeValue={(value) => {
                  setReason(value as Reason);
                  setValidate({});
                }}
                value={reason}
                placeholder="Please select"
              />
              {validate?.reason && <p className="text-red-500 text-sm">{validate.reason}</p>}
            </div>
          </Field>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-5">
            <Label className="pt-2">Remarks</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                maxLength={500}
                placeholder="Please enter your remarks"
              />
            </div>
          </Field>

          <HasPermission accessWith={[cardRole.update_limit]}>
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start">
              <Label className="w-20 pt-1">Card limit (Wallet size)</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-3">
                <MoneyInput
                  className="w-64 capitalize"
                  value={cardLimit}
                  onChangeValue={(value) => {
                    setCardLimit(value);
                    setValidate({});
                  }}
                />
                {validate?.cardLimit && (
                  <p className="text-red-500 text-sm">{validate.cardLimit}</p>
                )}
              </div>
            </Field>
          </HasPermission>

          <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start pb-3">
            <Label className="pt-6">Card groups</Label>
            <div className="pt-3 sm:mt-0 sm:col-span-2">
              <SearchableDropdown
                onInputValueChange={setSearchCardGroup}
                onChangeValue={setCardGroup}
                className="w-64"
                name="targetType"
                value={cardGroup}
                options={
                  search !== searchCardGroup
                    ? undefined
                    : cardGroupsList &&
                      cardGroupsList?.items?.map((cGroup) => ({
                        value: cGroup.id,
                        label: cGroup.name,
                      }))
                }
                placeholder="Please select"
              />
              {validate?.cardGroup && <p className="text-red-500 text-sm">{validate.cardGroup}</p>}
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
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
