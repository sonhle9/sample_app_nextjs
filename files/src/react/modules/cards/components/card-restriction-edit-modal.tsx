import {
  Tabs,
  MoneyInput,
  Modal,
  Button,
  Alert,
  AlertMessages,
  HelpText,
  formatMoney,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {ICardRestriction, ERestrictionType} from '../card.type';
import {useUpdateCardRestriction} from '../card.queries';
import {EMessage} from '../card-message.-validate';
interface ICardRestrictionEdit {
  belongTo: string;
  cardRestriction?: ICardRestriction;
  onClose?: () => void;
}

interface Validate {
  monthlyAmount?: string;
  singleTransactionLimit?: string;
  dailyAmount?: string;
}

export const CardRestrictionEdit = (props: ICardRestrictionEdit) => {
  const [dailyAmount, setDailyAmount] = useState(
    formatMoney(props?.cardRestriction?.velocity?.dailyLimit?.amount).toString() || '',
  );
  const [monthlyAmount, setMonthlyAmount] = useState(
    formatMoney(props?.cardRestriction?.velocity?.monthlyLimit?.amount).toString() || '',
  );
  const [singleTransactionLimit, setSingleTransactionLimit] = useState(
    formatMoney(props?.cardRestriction?.singleTransactionLimit?.amountTransaction).toString() || '',
  );
  const {mutate: setRestriction} = useUpdateCardRestriction({
    type: ERestrictionType.CARD,
    belongTo: props.belongTo,
  });
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState([]);
  const [validate, setValidate] = React.useState<Validate>({
    monthlyAmount: '',
    singleTransactionLimit: '',
    dailyAmount: '',
  });
  const validator = () => {
    const validates: Validate = {};
    if (
      dailyAmount &&
      (Number(dailyAmount) || props?.cardRestriction?.velocity?.dailyLimit?.amount) === 0
    ) {
      validates['dailyAmount'] = EMessage.MORE_THAN_0;
    }
    if (
      monthlyAmount &&
      (Number(monthlyAmount) || props?.cardRestriction?.velocity?.monthlyLimit?.amount) === 0
    ) {
      validates['monthlyAmount'] = EMessage.MORE_THAN_0;
    }
    if (
      singleTransactionLimit &&
      (Number(singleTransactionLimit) ||
        props?.cardRestriction?.singleTransactionLimit?.amountTransaction) === 0
    ) {
      validates['singleTransactionLimit'] = EMessage.MORE_THAN_0;
    }
    if (
      (Number(dailyAmount) || props?.cardRestriction?.velocity?.dailyLimit?.amount) >
      (Number(monthlyAmount) || props?.cardRestriction?.velocity?.monthlyLimit?.amount)
    ) {
      validates['dailyAmount'] = EMessage.MORE_THAN;
      validates['monthlyAmount'] = EMessage.MORE_THAN;
    }
    if (
      (Number(singleTransactionLimit) ||
        props?.cardRestriction?.singleTransactionLimit?.amountTransaction) >
      (Number(dailyAmount) || props?.cardRestriction?.velocity?.dailyLimit?.amount)
    ) {
      validates['singleTransactionLimit'] = EMessage.MORE_THAN_DAILY_LIMIT;
      validates['dailyAmount'] = EMessage.MORE_THAN_DAILY_LIMIT;
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };
  const save = () => {
    if (props?.cardRestriction) {
      if (!validator()) {
        return;
      }
    }

    setIsCreating(true);
    setRestriction(
      {
        type: ERestrictionType.CARD,
        belongTo: props.belongTo,
        itemAcceptances: [],
        ...(singleTransactionLimit && {
          singleTransactionLimit: {
            ...(singleTransactionLimit && {
              amountTransaction:
                Number(singleTransactionLimit) ||
                props?.cardRestriction?.singleTransactionLimit?.amountTransaction,
            }),
          },
        }),
        velocity: {
          ...(dailyAmount && {
            dailyLimit: {
              ...(dailyAmount && {
                amount: Number(dailyAmount) || props?.cardRestriction?.velocity?.dailyLimit?.amount,
              }),
            },
          }),
          ...(monthlyAmount && {
            monthlyLimit: {
              ...(monthlyAmount && {
                amount:
                  Number(monthlyAmount) || props?.cardRestriction?.velocity?.monthlyLimit?.amount,
              }),
            },
          }),
        },
      },
      {
        onSuccess: () => {
          close();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          const message = response && [response.message];
          if (response && response.statusCode) {
            setErrorMsg(message);
          }
          setIsCreating(false);
        },
      },
    );
  };
  const close = () => {
    return props.onClose();
  };
  return (
    <>
      <Modal.Header className="text-xl font-medium">
        {props?.cardRestriction
          ? 'Edit velocity check restrictions'
          : 'Add velocity check restrictions'}
      </Modal.Header>
      {errorMsg.length > 0 && (
        <Alert variant="error" description="Something is error">
          <AlertMessages messages={errorMsg} />
        </Alert>
      )}
      <Tabs>
        <Tabs.TabList>
          <Tabs.Tab label="Daily limit" />
          <Tabs.Tab label="Monthly limit" />
          <Tabs.Tab label="Others" />
        </Tabs.TabList>
        <Modal.Body>
          <Tabs.Panels>
            <Tabs.Panel>
              <div className="flex">
                <div className="text-mediumgrey text-sm w-32">Max. transaction amount</div>

                <div className="pl-10">
                  {' '}
                  <MoneyInput
                    className="w-44"
                    value={dailyAmount}
                    onChangeValue={(value) => {
                      setValidate({});
                      setDailyAmount(value);
                    }}
                  />
                  {props?.cardRestriction && validate?.dailyAmount && (
                    <HelpText className="text-error-500">{validate.dailyAmount}</HelpText>
                  )}
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel>
              <div className="flex">
                <div className="text-mediumgrey text-sm w-32">Max. transaction amount</div>

                <div className="pl-10">
                  {' '}
                  <MoneyInput
                    className="w-44"
                    value={monthlyAmount}
                    onChangeValue={(value) => {
                      setValidate({});
                      setMonthlyAmount(value);
                    }}
                  />
                  {props?.cardRestriction && validate?.monthlyAmount && (
                    <HelpText className="text-error-500">{validate.monthlyAmount}</HelpText>
                  )}
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel>
              <div className="flex">
                <div className="text-mediumgrey text-sm w-32">Max. amount allowed per trans.</div>

                <div className="pl-10">
                  {' '}
                  <MoneyInput
                    className="w-44"
                    value={singleTransactionLimit}
                    onChangeValue={(value) => {
                      setValidate({});
                      setSingleTransactionLimit(value);
                    }}
                  />
                  {props?.cardRestriction && validate?.singleTransactionLimit && (
                    <HelpText className="text-error-500">
                      {validate.singleTransactionLimit}
                    </HelpText>
                  )}
                </div>
              </div>
            </Tabs.Panel>
          </Tabs.Panels>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center justify-between">
            <span></span>
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                variant="primary"
                isLoading={isCreating}
                onClick={() => {
                  save();
                }}>
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Tabs>
    </>
  );
};

export default CardRestrictionEdit;
