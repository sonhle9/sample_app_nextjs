import {
  Alert,
  AlertMessages,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  Dialog,
  DialogContent,
  DialogFooter,
  DataTable,
  PaginationNavigation,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  Badge,
  usePaginationState,
  Text,
  TextInput,
  DropdownSelectField,
  titleCase,
} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {ColorMap, EStatus} from 'src/app/cards/shared/enums';
import {useGetCards, useUpdateStatusCards} from '../card.queries';
import {ESortBy, FilterBy, ICardsRequest, StatusMap} from '../card.type';

interface IBulkCardStatusModalProps {
  visible: boolean;
  filters: ICardsRequest;
  onClose?: (status?: EStatus) => void;
}

interface Validate {
  cardNumberFrom?: string;
  cardNumberTo?: string;
  cardsStatus?: string;
  rangeCardNumber?: string;
}

function setStatuses(status: EStatus) {
  const result: {
    label: string;
    value: EStatus;
  }[] = [];
  switch (status) {
    case EStatus.ACTIVE:
      StatusMap.forEach((value) => {
        if (value.value === EStatus.FROZEN || value.value === EStatus.CLOSED) {
          result.push(value);
        }
      });
      break;
    case EStatus.PENDING:
      break;
    case EStatus.FROZEN:
      StatusMap.forEach((value) => {
        if (value.value === EStatus.ACTIVE || value.value === EStatus.CLOSED) {
          result.push(value);
        }
      });
      break;
    case EStatus.CLOSED:
      break;
    case EStatus.ISSUED:
      StatusMap.forEach((value) => {
        if (value.value === EStatus.ACTIVE || value.value === EStatus.CLOSED) {
          result.push(value);
        }
      });
      break;
  }
  return result;
}

function validInput(e: string) {
  if (e === 'Backspace' || e === 'Control' || !isNaN(Number(e))) {
    return false;
  }
  return true;
}

export const BulkCardStatusModal = (props: IBulkCardStatusModalProps) => {
  const [validate, setValidate] = React.useState<Validate>({
    cardNumberFrom: '',
    cardNumberTo: '',
  });

  const close = () => {
    setErrorMsg([]);
    props.onClose(cardsStatus);
  };
  const [errorMsg, setErrorMsg] = React.useState([]);

  const cancelRef = React.useRef(null);
  const [visibleUpdateConfirm, setVisibleUpdateConfirm] = React.useState(false);
  const [cardNumberFrom, setCardNumberFrom] = React.useState(null);
  const [cardNumberTo, setCardNumberTo] = React.useState(null);
  const [cardsStatus, setCardsStatus] = React.useState<EStatus>(null);
  const statusQuery: EStatus = props.filters.status || null;
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {mutate: updateStatusCards} = useUpdateStatusCards();
  const sort = ESortBy.CARD_NUMBER;
  const {data} = useGetCards({
    page,
    perPage,
    ...(props.filters.status && {status: statusQuery}),
    ...(props.filters.dateFrom && {dateFrom: props.filters.dateFrom}),
    ...(props.filters.dateTo && {dateTo: props.filters.dateTo}),
    ...(props.filters.filterBy && {filterBy: props.filters.filterBy}),
    ...(props.filters?.values &&
    props.filters.filterBy &&
    props.filters.filterBy === FilterBy.merchant
      ? {values: props.filters.values}
      : props.filters.filterBy !== FilterBy.cardGroup
      ? {values: props.filters.values}
      : props.filters?.values && props.filters.values[0] !== '' && {values: props.filters.values}),
    ...(cardNumberFrom && {cardNumberFrom: cardNumberFrom}),
    ...(cardNumberTo && {cardNumberTo: cardNumberTo}),
    sort,
  });

  const statusFilter = setStatuses(statusQuery);

  const validator = () => {
    const validates: Validate = {};
    if (cardNumberTo && !cardNumberFrom) {
      validates['cardNumberFrom'] = 'Please enter your starting card number';
    }
    if (cardNumberFrom && !cardNumberTo) {
      validates['cardNumberTo'] = 'Please enter your ending card number';
    }
    if (!cardsStatus) {
      validates['cardsStatus'] = 'Please select card status';
    }
    if (cardNumberFrom && cardNumberTo && cardNumberFrom > cardNumberTo) {
      validates['rangeCardNumber'] = 'Start card number cannot be greater than end card number';
    }
    setValidate(validates);
    return Object.keys(validates).length === 0;
  };
  const onSubmit = () => {
    if (!validator()) {
      return;
    }
    setVisibleUpdateConfirm(true);
  };

  const update = () => {
    updateStatusCards(
      {
        filterValues: {
          ...(props.filters.status && {status: statusQuery || props.filters.status}),
          ...(props.filters.dateFrom && {dateFrom: props.filters.dateFrom}),
          ...(props.filters.dateTo && {dateTo: props.filters.dateTo}),
          ...(props.filters.filterBy && {filterBy: props.filters.filterBy}),
          ...(props.filters.values &&
          props.filters.filterBy &&
          props.filters.filterBy === FilterBy.merchant
            ? {values: props.filters.values}
            : props.filters.filterBy !== FilterBy.cardGroup
            ? {values: props.filters.values}
            : props.filters.values[0] !== '' && {values: props.filters.values}),
          ...(cardNumberFrom && {cardNumberFrom: cardNumberFrom}),
          ...(cardNumberTo && {cardNumberTo: cardNumberTo}),
        },
        status: cardsStatus,
      },
      {
        onSuccess: () => {
          setVisibleUpdateConfirm(false);
          close();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          if (response && response.statusCode) {
            setErrorMsg([response.message]);
          }
        },
      },
    );
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label="Bulk card status update">
        <ModalHeader>Bulk card status update</ModalHeader>
        {errorMsg.length > 0 && (
          <Alert variant="error" description="Something is wrong">
            <AlertMessages messages={errorMsg.map((messageError) => titleCase(messageError))} />
          </Alert>
        )}
        <div className="flex px-4 md:px-6 lg:px-8 pt-7">
          <Text
            className={cx(
              'flex items-center text-sm w-3/12',
              validate?.cardNumberFrom?.length > 0 || validate?.cardNumberTo?.length > 0
                ? 'pb-6'
                : '',
            )}>
            Card number range
          </Text>
          <div className="w-4/12">
            <TextInput
              placeholder="Start card number"
              value={cardNumberFrom || ''}
              min={0}
              onChangeValue={(value) => {
                setValidate({});
                setPage(1);
                if (!validInput(value.trim())) {
                  setCardNumberFrom(value.trim());
                }
              }}
            />
            {validate.cardNumberFrom && (
              <span className="text-xs text-red-500">{validate.cardNumberFrom}</span>
            )}
          </div>
          <div
            className={cx(
              'flex items-center mx-3',
              validate?.cardNumberFrom?.length > 0 || validate?.cardNumberTo?.length > 0
                ? 'pb-6'
                : '',
            )}>
            —
          </div>
          <div className="w-4/12">
            <TextInput
              placeholder="End card number"
              value={cardNumberTo || ''}
              min={0}
              onChangeValue={(value) => {
                setValidate({});
                setPage(1);
                if (!validInput(value.trim())) {
                  setCardNumberTo(value.trim());
                }
              }}
            />
            {validate.cardNumberTo && (
              <span className="text-xs text-red-500">{validate.cardNumberTo}</span>
            )}
          </div>
        </div>
        {validate.rangeCardNumber && (
          <div className="px-8 grid grid-cols-12">
            <span className="text-xs text-red-500 col-start-4 col-span-5 pt-1">
              {validate.rangeCardNumber}
            </span>
          </div>
        )}
        <div className="flex px-4 md:px-6 lg:px-8 pt-1">
          <Text
            className={cx(
              'flex items-center text-sm w-3/12',
              validate.cardsStatus ? ' mb-5' : ' ',
            )}>
            Update card status
          </Text>
          <div className="w-4/12 pt-3 mb-5">
            <DropdownSelectField<EStatus | ''>
              wrapperClass="sm:grid-cols-2 lg:grid-cols-6 mb-0"
              value={cardsStatus || ''}
              onChangeValue={(status: EStatus) => {
                setValidate({});
                setCardsStatus(status);
              }}
              placeholder="Please select"
              options={statusFilter as any}
            />
            {validate.cardsStatus && (
              <span className="text-xs text-red-500">{validate.cardsStatus}</span>
            )}
          </div>
        </div>
        {data?.items && (
          <DataTable
            striped
            pagination={
              <PaginationNavigation
                total={data.total}
                currentPage={data.page}
                perPage={data.perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
                className="mr-7"
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td className="pl-7 w-2/5">Card Number</Td>
                <Td>Status</Td>
                <Td>Merchant name</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data.items.length > 0 &&
                data.items.map((card, index) => (
                  <Tr key={index}>
                    <Td className="h-8 pt-2 pb-2 pl-7 w-4/12">
                      {card.type && (
                        <div className="float-left w-16 h-8 pr-4">
                          <img
                            style={{top: -5}}
                            src={`assets/images/logo-card/card-${card.type}.png`}
                            className="w-full h-8 relative"
                          />
                        </div>
                      )}
                      {card.cardNumber && card.cardNumber}
                    </Td>

                    <Td className="break-all">
                      {card.status && (
                        <Badge
                          className="tracking-wider font-semibold uppercase"
                          rounded="rounded"
                          color={ColorMap[card.status]}
                          style={{width: 'fit-content'}}>
                          {card && card.status}
                        </Badge>
                      )}
                    </Td>
                    <Td className="break-all">{card?.merchant?.name}</Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
          </DataTable>
        )}
        <ModalFooter>
          <div className="flex items-center justify-between">
            <div />
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>

              <Button
                className="ml-4"
                variant="primary"
                onClick={onSubmit}
                // disabled={!cardsStatus || cardsStatus === statusQuery}
              >
                APPLY
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleUpdateConfirm && (
        <Dialog
          className="mt-48"
          onDismiss={() => setVisibleUpdateConfirm(false)}
          leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to update the card status?">
            <span className="text-black">
              {`This action shall update the current system status of ${data.total} cards to `}{' '}
            </span>
            <span className="capitalize text-black">{cardsStatus}.</span>
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleUpdateConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={update}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
