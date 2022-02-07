import {
  Button,
  Modal,
  DropdownSelect,
  Stepper,
  Fieldset,
  FieldContainer,
  DateTimeInput,
  MoneyInput,
  TextInput,
  Textarea,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  SearchableDropdown,
  IconButton,
  PlusIcon,
  TrashIcon,
  Label,
  formatMoney,
  Alert,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useGetCards} from '../../cards/card.queries';
import {FilterBy} from '../../cards/card.type';
import {ETRANSACTION_TYPE} from '../emum';
import {EType, ESubtype, SubtypeManual, EManualTransactionType} from 'src/shared/enums/card.enum';
import {useGetLoyaltyCategories} from '../transaction.queries';
import {EMessage} from '../../cards/card-message.-validate';
interface ITransactionManualCreateModalProps {
  visible: boolean;
  onClose?: () => void;
  onCreateTransaction?: (transactions) => void;
  onUpdateTransaction?: (transactions) => void;
  initialData?: any;
  isEditor?: boolean;
  newTransactions?: any[];
  indexEditor?: number;
  step?: number;
}

export const TransactionManualCreateModal: React.VFC<ITransactionManualCreateModalProps> = (
  props,
) => {
  const close = () => {
    props.onClose();
  };
  const {data: loyaltyCategories} = useGetLoyaltyCategories();
  const [step, setStep] = React.useState(props.step || 0);
  const [transactionDateTime, setTransactionDateTime] = React.useState(
    props.initialData?.transactionDateTime || undefined,
  );
  const [transactionType, setTransactionType] = React.useState(
    props.initialData?.isoTransactionType || undefined,
  );
  const [transactionSubtype, setTransactionSubtype] = React.useState(
    props.initialData?.subtype || undefined,
  );
  const [transactionSubtypeOptions, setTransactionSubtypeOptions] = React.useState(
    props.initialData?.subtype === 'MANUAL_TOPUP' ? SubtypeManual.topup : SubtypeManual.charge,
  );
  const [cardNumber, setSearchCardNumber] = React.useState(
    props.initialData?.cardData?.cardNumber || '',
  );
  const [approvalCode, setApprovalCode] = React.useState(props.initialData?.approvalCode || '');
  const [referenceNumber, setReferenceNumber] = React.useState(
    props.initialData?.referenceNumber || '',
  );
  const [authorisedCard, setAuthorisedCard] = React.useState(
    props.initialData?.cardData?.authorisedCard || '',
  );
  const [authorisedCardDisable, setAuthorisedCardDisable] = React.useState(
    props.initialData?.authorisedCard || true,
  );
  const [merchant, setMerchant] = React.useState(undefined);
  const [items, setItems] = React.useState<any[]>(props.initialData?.products?.items || []);
  const [remark, setRemark] = React.useState(props.initialData?.remark || []);
  const [unitPrice, setPrice] = React.useState(undefined);
  const [categoryCode, setCategory] = React.useState(undefined);
  const [quantity, setQuantity] = React.useState(undefined);
  const [mileage, setMileage] = React.useState(
    props.initialData?.driverInfo?.autoMeterMileageReading || undefined,
  );
  const [transactionAmount, setTransactionAmount] = React.useState(
    props.initialData?.transactionAmount || convertToSensitiveNumber(0),
  );

  const [approvalCodeError, setApprovalCodeError] = React.useState(undefined);
  const [referenceNumberError, setReferenceNumberError] = React.useState(undefined);

  React.useEffect(() => {}, [unitPrice, quantity, authorisedCard]);
  const {data: cardList} = useGetCards({
    filterBy: FilterBy.cardNumber,
    type: EType.FLEET,
    ...(cardNumber && {values: [cardNumber]}),
  });
  React.useEffect(() => {
    setTransactionSubtypeOptions(SubtypeManual.topup);
    if (transactionType == TransactionType[0].value) {
      setTransactionSubtypeOptions(SubtypeManual.charge);
    }
  }, [transactionType]);

  React.useEffect(() => {
    setMerchant(undefined);
    setAuthorisedCardDisable(true);
    if (cardList && cardList.total === 1) {
      setMerchant(cardList.items[0]);
      if (['vehicle', 'dual'].includes(cardList.items[0].subtype)) {
        setAuthorisedCardDisable(false);
      }
    } else {
      setAuthorisedCard('');
    }
  }, [cardList]);

  const {data: cardListDriver} = useGetCards({
    filterBy: FilterBy.cardNumber,
    type: EType.FLEET,
    ...(authorisedCard && {
      values: [authorisedCard],
      merchantId: merchant?.merchant.id,
      subtype: ESubtype.DRIVER,
    }),
  });

  React.useEffect(() => {
    setFieldValue('products', {items});
  }, [items, categoryCode]);
  const TransactionType = [
    {
      label: 'Charge',
      value: 'charge',
    },
    {
      label: 'Top up',
      value: 'topup',
    },
  ];
  const validationSchema1 = Yup.object({
    isoTransactionType: Yup.mixed().required(EMessage.REQUIRED_FIELD).oneOf(EManualTransactionType),
    subtype: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionDateTime: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionAmount: Yup.number()
      .required(EMessage.REQUIRED_FIELD)
      .moreThan(0, EMessage.MORE_THAN_0),
    cardData: Yup.object({
      cardNumber: Yup.string()
        .required(EMessage.REQUIRED_FIELD)
        .when('$cardNumber', {
          is: () => {
            return merchant?.subtype === ESubtype.DRIVER; //if true => then validate Invalid card type.
          },
          then: Yup.string().email('Invalid card type.'),
        }),
    }),
  });

  const validationSchema3 = Yup.object({
    isoTransactionType: Yup.mixed().required(EMessage.REQUIRED_FIELD).oneOf(EManualTransactionType),
    subtype: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionDateTime: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionAmount: Yup.number()
      .required(EMessage.REQUIRED_FIELD)
      .moreThan(0, EMessage.MORE_THAN_0),
    cardData: Yup.object({
      cardNumber: Yup.string()
        .required(EMessage.REQUIRED_FIELD)
        .when('$cardNumber', {
          is: () => {
            return merchant?.subtype === ESubtype.DRIVER;
          },
          then: Yup.string().email('Invalid card type.'),
        }),
      authorisedCard: Yup.number().required(EMessage.REQUIRED_FIELD),
    }),
  });

  const validationSchema2 = Yup.object({
    isoTransactionType: Yup.mixed().required(EMessage.REQUIRED_FIELD).oneOf(EManualTransactionType),
    subtype: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionDateTime: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionAmount: Yup.number()
      .required(EMessage.REQUIRED_FIELD)
      .moreThan(0, EMessage.MORE_THAN_0),
    cardData: Yup.object({
      cardNumber: Yup.string()
        .required(EMessage.REQUIRED_FIELD)
        .when('$cardNumber', {
          is: () => {
            return merchant?.subtype === ESubtype.DRIVER;
          },
          then: Yup.string().email('Invalid card type.'),
        }),
    }),
    products: Yup.object().when('isoTransactionType', {
      is: ETRANSACTION_TYPE.CHARGE,
      then: Yup.object({
        items: Yup.array().required(EMessage.REQUIRED_FIELD),
      }),
    }),
  });
  const validationSchema4 = Yup.object({
    isoTransactionType: Yup.mixed().required(EMessage.REQUIRED_FIELD).oneOf(EManualTransactionType),
    subtype: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionDateTime: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionAmount: Yup.number()
      .required(EMessage.REQUIRED_FIELD)
      .moreThan(0, EMessage.MORE_THAN_0),
    cardData: Yup.object({
      cardNumber: Yup.string()
        .required(EMessage.REQUIRED_FIELD)
        .when('$cardNumber', {
          is: () => {
            return merchant?.subtype === ESubtype.DRIVER;
          },
          then: Yup.string().email('Invalid card type.'),
        }),
      authorisedCard: Yup.number().required(EMessage.REQUIRED_FIELD),
    }),
    products: Yup.object().when('isoTransactionType', {
      is: ETRANSACTION_TYPE.CHARGE,
      then: Yup.object({
        items: Yup.array().required(EMessage.REQUIRED_FIELD),
      }),
    }),
  });
  const getErrorCardNumber = (e: any, t: any) => {
    return e.cardData?.cardNumber && t.cardData?.cardNumber ? e.cardData?.cardNumber : undefined;
  };
  const getErrorItems = (e: any, t: any) => {
    return e.products?.items && t.products?.items ? e.products?.items : undefined;
  };
  const getErrorCardAuthorize = (e: any, t: any) => {
    return e.cardData?.authorisedCard && t.cardData?.authorisedCard && !authorisedCardDisable
      ? e.cardData?.authorisedCard
      : undefined;
  };

  const getStatus = (e: any, t: any) => {
    if (Object.keys(t).length === 0 && step === 0) {
      return null;
    }
    if (!authorisedCardDisable && authorisedCard.trim().length == 0) {
      return false;
    }
    if (Object.keys(e).length === 1 && step === 2 && e.products) {
      return true;
    }

    return Object.keys(e).length === 0 ? true : false;
  };

  const validationSchema = React.useMemo(() => {
    if (transactionType == ETRANSACTION_TYPE.CHARGE) {
      setItems(
        items.filter((item) => {
          if (
            item.categoryCode == '' ||
            item.unitPrice == undefined ||
            item.quantity == undefined
          ) {
            return false;
          }
          return true;
        }),
      );
    }
    if (!authorisedCardDisable) {
      switch (step) {
        case 0:
          return validationSchema3;
        case 2:
          return validationSchema4;
      }
    }
    switch (step) {
      case 0:
        return validationSchema1;
      case 2:
        return validationSchema2;
    }
  }, [
    step,
    cardNumber,
    authorisedCard,
    merchant?.subtype === ESubtype.VEHICLE,
    merchant?.subtype === ESubtype.DRIVER,
  ]);
  const isDoneGeneral = React.useMemo(() => {
    return step === 2;
  }, [step]);

  const {errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      isoTransactionType: props.initialData?.isoTransactionType || '',
      subtype: props.initialData?.subtype || '',
      transactionDateTime: props.initialData?.transactionDateTime || undefined,
      transactionAmount: props.initialData?.transactionAmount || undefined,
      approvalCode: props.initialData?.approvalCode || '',
      referenceNumber: props.initialData?.referenceNumber || '',
      remark: props.initialData?.remark || '',
      products: props.initialData?.products || {
        items: [],
      },
      transactionSource: props.initialData?.transactionSource || 'ipt_opt',
      driverInfo: props.initialData?.driverInfo || {
        autoMeterMileageReading: '',
        cardPan: cardList?.total === 1 ? authorisedCard : '',
      },
      cardData: props.initialData?.cardData || {
        cardNumber: '',
        authorisedCard: cardList?.total === 1 ? authorisedCard : '',
      },
    },
    validationSchema,
    onSubmit: (values, actions) => {
      if (approvalCodeError || referenceNumberError) {
        return;
      }
      if (isDoneGeneral) {
        values.driverInfo.cardPan = values.cardData.authorisedCard;
        values.products.items = values.products.items.filter((item) => {
          if (
            item.categoryCode == '' ||
            item.unitPrice == undefined ||
            item.quantity == undefined
          ) {
            return false;
          }
          return true;
        });
        if (
          (transactionType === ETRANSACTION_TYPE.CHARGE &&
            totalAmountCategory === Number(transactionAmount)) ||
          transactionType === ETRANSACTION_TYPE.TOPUP
        ) {
          if (props.isEditor) {
            props.onUpdateTransaction(values);
          } else {
            props.onCreateTransaction(values);
          }
          close();
        }
      } else {
        setStep((state) => state + 1);
        actions.setTouched({});
        actions.setSubmitting(false);
      }
    },
  });

  const totalAmountCategory = items.reduce((total, item) => {
    if (item.unitPrice) {
      return (total += item.unitPrice * item?.quantity || 0);
    }
    return total;
  }, 0);

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} header="Create manual transaction">
        <Modal.Body>
          <Stepper activeIndex={step} onChange={setStep} className="-mx-2 -mt-4">
            <Stepper.Step
              label="Transaction details"
              status={
                getStatus(errors, touched) == null
                  ? undefined
                  : getStatus(errors, touched) == true
                  ? 'done'
                  : 'error'
              }
            />
            <Stepper.Step
              label="Others"
              status={
                approvalCodeError || referenceNumberError
                  ? 'error'
                  : step > 1 && !approvalCodeError && !referenceNumberError
                  ? 'done'
                  : undefined
              }
            />
            <Stepper.Step label="Add items" />
          </Stepper>
          {step === 0 && (
            <>
              <Fieldset legend="TRANSACTION DETAILS">
                <div className="ml-12">
                  <FieldContainer
                    label="Transaction type"
                    status={
                      errors.isoTransactionType && touched.isoTransactionType ? 'error' : undefined
                    }
                    helpText={
                      errors.isoTransactionType && touched.isoTransactionType
                        ? errors.isoTransactionType
                        : undefined
                    }
                    layout="horizontal-responsive">
                    <DropdownSelect
                      value={transactionType}
                      options={TransactionType}
                      placeholder="Select transaction type"
                      className={transactionType ? 'w-60' : 'w-60 text-gray-400'}
                      onChangeValue={(value) => {
                        setFieldValue('isoTransactionType', value);
                        setTransactionType(value);

                        setFieldValue('subtype', undefined);
                        setTransactionSubtype(undefined);
                      }}
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Transaction subtype"
                    status={errors.subtype && touched.subtype ? 'error' : undefined}
                    helpText={errors.subtype && touched.subtype ? errors.subtype : undefined}
                    layout="horizontal-responsive">
                    <DropdownSelect
                      value={transactionSubtype}
                      options={transactionSubtypeOptions}
                      placeholder="Select transaction subtype"
                      className={transactionSubtype ? 'w-60' : 'w-60 text-gray-400'}
                      onChangeValue={(value) => {
                        setFieldValue('subtype', value);
                        setTransactionSubtype(value);
                      }}
                      disabled={transactionType ? false : true}
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Transaction date & time"
                    status={
                      errors.transactionDateTime && touched.transactionDateTime
                        ? 'error'
                        : undefined
                    }
                    helpText={
                      errors.transactionDateTime && touched.transactionDateTime
                        ? errors.transactionDateTime
                        : undefined
                    }
                    layout="horizontal-responsive">
                    <DateTimeInput
                      value={transactionDateTime}
                      onChangeValue={(value) => {
                        setTransactionDateTime(value);
                        setFieldValue('transactionDateTime', value);
                      }}
                      includeSeconds
                      placeholder="Select date"
                      maxDate={new Date()}
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Transaction amount"
                    status={
                      errors.transactionAmount && touched.transactionAmount ? 'error' : undefined
                    }
                    helpText={
                      touched.transactionAmount && errors.transactionAmount
                        ? errors.transactionAmount
                        : undefined
                    }
                    layout="horizontal-responsive">
                    <MoneyInput
                      value={transactionAmount || '0.00'}
                      onChangeValue={(value) => {
                        setTransactionAmount(value);
                        setFieldValue('transactionAmount', value);
                      }}
                      className="w-60"
                    />
                  </FieldContainer>
                </div>
              </Fieldset>
              <Fieldset legend="CARD DETAILS" borderTop>
                <div className="ml-12">
                  <FieldContainer
                    label="Card number"
                    status={getErrorCardNumber(errors, touched) ? 'error' : undefined}
                    helpText={getErrorCardNumber(errors, touched)}
                    layout="horizontal-responsive">
                    <SearchableDropdown
                      placeholder="Enter card number"
                      value={cardNumber}
                      onChange={(e) => {
                        setSearchCardNumber(e.target.value);
                        setFieldValue('cardData.cardNumber', e.target.value);
                        setFieldValue('cardData.authorisedCard', '');
                        setAuthorisedCard('');
                      }}
                      onChangeValue={(value) => {
                        if (cardList && cardList.items.find((card) => value == card.cardNumber)) {
                          setSearchCardNumber(value);
                          if (authorisedCard) {
                            setAuthorisedCard('');
                          }
                          setFieldValue('cardData.cardNumber', value);
                          setFieldValue('cardData.authorisedCard', '');
                        } else {
                          setSearchCardNumber('');
                          if (authorisedCard) {
                            setAuthorisedCard('');
                          }
                          setFieldValue('cardData.cardNumber', '');
                          setFieldValue('cardData.authorisedCard', '');
                        }
                      }}
                      options={
                        (cardList &&
                          cardList.items.map((card) => ({
                            value: card.cardNumber,
                            label: card.cardNumber,
                          }))) ||
                        []
                      }
                      wrapperClass="w-60 col-span-2"
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Authorised card number"
                    layout="horizontal-responsive"
                    status={getErrorCardAuthorize(errors, touched) ? 'error' : undefined}
                    helpText={getErrorCardAuthorize(errors, touched)}>
                    <SearchableDropdown
                      value={authorisedCard}
                      wrapperClass="w-60"
                      onChange={(e) => {
                        setAuthorisedCard(e.target.value);
                        setFieldValue('cardData.authorisedCard', e.target.value);
                      }}
                      onChangeValue={(value) => {
                        setAuthorisedCard(value);
                        if (
                          cardListDriver &&
                          cardListDriver.items.find((card) => value === card.cardNumber)
                        ) {
                          setFieldValue('cardData.authorisedCard', value);
                        } else {
                          setAuthorisedCard('');
                          setFieldValue('cardData.authorisedCard', '');
                        }
                      }}
                      options={
                        (cardListDriver &&
                          cardListDriver.items.map((card) => ({
                            value: card.cardNumber,
                            label: card.cardNumber,
                          }))) ||
                        []
                      }
                      disabled={authorisedCardDisable}
                    />
                  </FieldContainer>
                  <FieldContainer label="Name" layout="horizontal-responsive">
                    <TextInput
                      value={merchant?.cardholder?.displayName}
                      className="w-60"
                      disabled
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="Smartpay account's merchant name"
                    layout="horizontal-responsive">
                    <TextInput value={merchant?.merchant?.name} className="w-60" disabled />
                  </FieldContainer>
                  <FieldContainer
                    label="Smartpay account's merchant ID"
                    layout="horizontal-responsive">
                    <TextInput value={merchant?.merchantId} className="w-60" disabled />
                  </FieldContainer>
                </div>
              </Fieldset>
            </>
          )}
          {step === 1 && (
            <>
              <FieldContainer label="Mileage reading" layout="horizontal-responsive">
                <TextInput
                  value={mileage ? mileage : ''}
                  className="w-60"
                  onChangeValue={(e) => {
                    if (e.match(/^[0-9]*$/)) {
                      setMileage(e);
                      setFieldValue('driverInfo', {
                        autoMeterMileageReading: e,
                      });
                    }
                  }}
                  placeholder="Enter mileage reading"
                />
              </FieldContainer>
              <FieldContainer
                label="Approval code"
                layout="horizontal-responsive"
                status={approvalCodeError ? 'error' : undefined}
                helpText={approvalCodeError}>
                <TextInput
                  value={approvalCode}
                  className="w-60"
                  placeholder="Enter approval code"
                  onChangeValue={(e) => {
                    if (e.length <= 8 && e.match(/^[0-9]*$/)) {
                      if (e && e.length !== 8) {
                        setApprovalCodeError('Required to be in 8 digits');
                      } else {
                        setApprovalCodeError(undefined);
                      }
                      setFieldValue('approvalCode', parseFloat(e));
                      setApprovalCode(e);
                    }
                  }}
                />
              </FieldContainer>
              <FieldContainer
                label="Reference number"
                layout="horizontal-responsive"
                status={referenceNumberError ? 'error' : undefined}
                helpText={referenceNumberError}>
                <TextInput
                  value={referenceNumber}
                  className="w-60"
                  placeholder="Enter reference number"
                  onChangeValue={(e) => {
                    if (e.length <= 12 && e.match(/^[0-9]*$/)) {
                      if (e && e.length !== 12) {
                        setReferenceNumberError('Required to be in 12 digits');
                      } else {
                        setReferenceNumberError(undefined);
                      }
                      setFieldValue('referenceNumber', e);
                      setReferenceNumber(e);
                    }
                  }}
                />
              </FieldContainer>
              <FieldContainer className="flex">
                <Label className="w-3/12">Remarks</Label>
                <Textarea
                  className="w-8/12 ml-2"
                  value={remark}
                  placeholder="Enter remark"
                  onChangeValue={(e) => {
                    setFieldValue('remark', e);
                    setRemark(e);
                  }}
                />
              </FieldContainer>
            </>
          )}
        </Modal.Body>
        {step === 2 && (
          <>
            <div className="mx-7 mb-3">
              {totalAmountCategory !== 0 &&
                transactionType === ETRANSACTION_TYPE.CHARGE &&
                totalAmountCategory !== Number(transactionAmount) && (
                  <Alert
                    variant="error"
                    description="Total amount does not match the transaction amount in Step 1. Ensure item quantity
                and unit price are entered correctly."
                  />
                )}
            </div>
            <div className="max-height-table overflow-y-auto" data-react-setel-scrollbar>
              <Table type="secondary">
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="w-4/12 pl-8 sticky top-0 z-10">Loyalty category</Td>
                    <Td className="w-3/12 sticky top-0">unit price (RM)</Td>
                    <Td className="text-right w-2/12 sticky top-0">Quantity</Td>
                    <Td className="text-right w-2/12 sticky top-0">Amount (rm)</Td>
                    <Td className="text-right w-1/12 sticky top-0 z-10"></Td>
                  </Tr>
                </DataTableRowGroup>
                {items.length === 0 &&
                  (!props.initialData?.products?.items ||
                    props.initialData?.products?.items?.length == 0) && (
                    <DataTableCaption>
                      <div className="text-center">
                        <p className="text-center text-sm mb-3 mt-3">
                          You have not added any items yet.
                        </p>
                        <p className="text-red-400">{getErrorItems(errors, touched)}</p>
                        <Button
                          variant="outline"
                          leftIcon={<PlusIcon />}
                          minWidth="none"
                          className="mb-4"
                          onClick={() => {
                            setItems((state) => {
                              const newState = [...state];
                              newState.push({
                                categoryCode: '',
                                unitPrice: 0,
                                quantity: 0,
                                amount: undefined,
                              });
                              return newState;
                            });
                          }}>
                          ADD ITEM
                        </Button>
                      </div>
                    </DataTableCaption>
                  )}
                <Table.Tbody groupType="tbody">
                  {items.map((v, index) => (
                    <Tr key={index}>
                      <Td className={items.length > 10 ? 'w-4/12 pl-8' : 'w-4/12 pl-8 absolute'}>
                        <DropdownSelect
                          className="-mb-4"
                          placeholder="Please select"
                          value={v.categoryCode}
                          options={loyaltyCategories.map((item) => ({
                            value: item.categoryCode,
                            label: item.categoryName,
                          }))}
                          onChangeValue={(value) => {
                            setCategory(value);
                            v.categoryCode = value;
                          }}
                        />
                      </Td>
                      <Td className="w-3/12">
                        <FieldContainer
                          status={
                            totalAmountCategory !== 0 &&
                            totalAmountCategory !== Number(transactionAmount) &&
                            transactionType === ETRANSACTION_TYPE.CHARGE
                              ? 'error'
                              : undefined
                          }
                          className="p-0 m-0">
                          <MoneyInput
                            className="text-right"
                            value={v.unitPrice || '0.00'}
                            placeholder="0.00"
                            onChangeValue={(e) => {
                              setPrice(e);
                              v.unitPrice = e;
                              v.totalAmount = v.unitPrice * v.quantity;
                            }}
                          />
                        </FieldContainer>
                      </Td>
                      <Td className="text-right w-2/12">
                        <FieldContainer
                          status={
                            totalAmountCategory !== 0 &&
                            totalAmountCategory !== Number(transactionAmount) &&
                            transactionType === ETRANSACTION_TYPE.CHARGE
                              ? 'error'
                              : undefined
                          }
                          className="p-0 m-0">
                          <TextInput
                            type="number"
                            value={v.quantity || '0'}
                            placeholder="0"
                            onChangeValue={(e) => {
                              if (Number(e) > 0) {
                                setQuantity(e);
                                v.quantity = parseFloat(e);
                                v.totalAmount = v.unitPrice * v.quantity;
                              } else {
                                setQuantity(0);
                                v.quantity = 0;
                                v.totalAmount = 0;
                              }
                            }}
                          />
                        </FieldContainer>
                      </Td>
                      <Td className="text-right w-2/12">
                        <MoneyInput
                          className="text-right"
                          placeholder="0.00"
                          value={formatMoney(v.unitPrice * v.quantity) || '0.00'}
                          disabled
                        />
                      </Td>
                      <Td className="text-right w-1/12">
                        <IconButton>
                          <TrashIcon
                            className="w-5 h-5 text-red-500"
                            onClick={() => {
                              setItems((state) => {
                                const newState = [...state];
                                newState.splice(index, 1);
                                return newState;
                              });
                            }}
                          />
                        </IconButton>
                      </Td>
                    </Tr>
                  ))}
                  {items.length > 0 && items.length <= 10 && (
                    <>
                      <tr>
                        <td colSpan={4}>
                          <div className="flex justify-between mt-2 ml-5">
                            <p className="text-sm font-bold ml-3">Total amount (RM)</p>
                            <p className="text-sm font-bold mr-4">
                              {totalAmountCategory !== 0
                                ? formatMoney(totalAmountCategory)
                                : '0.00'}{' '}
                              / {transactionAmount && formatMoney(transactionAmount)}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5}>
                          <div className="divide-y pt-2 mt-1">
                            <div />
                            <div className="text-center border-gray-200" />
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            {items.length > 0 && (
              <>
                {items.length > 10 && (
                  <>
                    <div className="flex justify-between pr-1 mt-2">
                      <p className="text-sm font-bold md:ml-8">Total amount (RM)</p>
                      <p className="text-sm font-bold md:mr-24 w-2-12">
                        {totalAmountCategory !== 0 ? formatMoney(totalAmountCategory) : '0.00'} /{' '}
                        {transactionAmount && formatMoney(transactionAmount)}
                      </p>
                    </div>
                    <div className="divide-y pt-2 mt-1">
                      <div />
                      <div className="text-center border-gray-200" />
                    </div>
                  </>
                )}
                <Button
                  variant="outline"
                  className="border-0 pl-7 mt-1"
                  leftIcon={<PlusIcon />}
                  onClick={() => {
                    setItems((state) => {
                      const newState = [...state];
                      newState.push({
                        categoryCode: '',
                        unitPrice: 0,
                        quantity: 0,
                        amount: undefined,
                      });
                      return newState;
                    });
                    setFieldValue('products.items', items);
                  }}>
                  ADD ITEM
                </Button>
              </>
            )}
          </>
        )}

        <Modal.Footer className="text-right space-x-3">
          <Button onClick={close} variant="outline">
            CANCEL
          </Button>
          <Button onClick={() => handleSubmit()} variant="primary">
            {isDoneGeneral ? 'SAVE' : 'CONTINUE'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
