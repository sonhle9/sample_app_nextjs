import {
  Alert,
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelect,
  FieldContainer,
  Filter,
  FilterControls,
  flattenArray,
  formatDate,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PaginationNavigation,
  Radio,
  RadioGroup,
  SearchTextInput,
  useFilter,
  usePaginationState,
  DataTableCellProps,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getGeneralLedgerExceptionFile} from 'src/react/services/api-ledger.service';
import {
  GeneralLedgerProfileFilterBy,
  GL_PROFILE_FILTER_BY,
  IGeneralLedgerParameter,
  SEARCH_BY,
} from 'src/react/services/api-ledger.type';
import {useGLExceptionRectify, useGLExceptions, useGLParameters} from '../general-ledger.queries';

export const GeneralLedgerRectificationListing = () => {
  const [{values, applied}, {setValue, reset}] = useFilter({
    searchBy: GL_PROFILE_FILTER_BY[0] as GeneralLedgerProfileFilterBy,
    from: '',
    to: '',
  });
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [showRectifyModal, setShowRectifyModal] = React.useState(false);
  const [showErrorDialog, setShowErrorDialog] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState('');
  const [selectedGLCode, setSelectedGLCode] = React.useState('');
  const [selectedGLProfile, setSelectedGLProfile] = React.useState('');
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const cancelErrorDialogRef = React.useRef(null);

  const pagination = usePaginationState();
  const {mutate: rectify, isLoading: isRectifying} = useGLExceptionRectify();
  const {data, isLoading, isError} = useGLExceptions({
    page: pagination.page,
    perPage: pagination.perPage,
    ...values,
  });

  const {
    data: resolvedData,
    isLoading: isGLParamLoading,
    isError: isGLParamError,
  } = useGLParameters({
    searchBy: SEARCH_BY[0],
    searchKey: selectedGLProfile,
    status: '',
  });

  const records = React.useMemo(
    () => (resolvedData ? transformRecord(resolvedData.items, searchKey) : []),
    [resolvedData, searchKey],
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setIsCheckAll(!isCheckAll);
    if (event.target.checked) {
      data.items.map((parameter) =>
        setSelectedRecords((prevState) => [parameter.id, ...prevState]),
      );
    } else {
      setSelectedRecords([]);
    }
  };

  const handleRectify = () => {
    const sel = [];
    selectedRecords.map((id) => {
      const record = data.items.find((item) => item.id === id);

      if (record && sel.indexOf(record.eventData.GLProfile) === -1) {
        sel.push(record.eventData.GLProfile);
      }
    });

    if (sel.length > 1) {
      setShowErrorDialog(true);
    } else {
      const isUndefined = GL_PROFILE_FILTER_BY.indexOf(sel[0].toLowerCase()) === -1;
      setSelectedGLProfile(!isUndefined ? sel[0] : '');
      setShowRectifyModal(true);
    }
  };

  const downloadCsv = async () => {
    const csvData = await getGeneralLedgerExceptionFile(values.searchBy, values.from, values.to);
    downloadFile(
      csvData,
      `gl-rectification-list-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  return (
    <PageContainer
      heading="General ledger posting rectification"
      action={
        <Button disabled={data && !data.items.length} onClick={downloadCsv} variant="primary">
          Download CSV
        </Button>
      }>
      {showErrorDialog && (
        <Dialog
          onDismiss={() => {
            setShowErrorDialog(false);
          }}
          leastDestructiveRef={cancelErrorDialogRef}>
          <DialogContent header="Error">
            Unable to proceed due to the profile for transactions selected are not the same.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="primary"
              onClick={() => {
                setShowErrorDialog(false);
              }}
              ref={cancelErrorDialogRef}>
              OK
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <Modal
        aria-label="Select GL Code"
        isOpen={showRectifyModal}
        onDismiss={() => {
          setShowRectifyModal(false);
        }}>
        <ModalHeader>Select GL Code</ModalHeader>
        <ModalBody>
          <p className="mb-4">GL Profile: {selectedGLProfile}</p>
          <SearchTextInput
            value={searchKey}
            onChangeValue={setSearchKey}
            placeholder="Search GL Code"
            wrapperClass="mb-4"
          />
          {isGLParamError ? (
            <Alert variant="error" className="mb-8" description="Failed to load data" />
          ) : (
            <div className="h-96 overflow-y-auto overflow-x-hidden">
              <DataTable isLoading={isGLParamLoading}>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="w-3/4">General Ledger Code Details</Td>
                    <Td className="w-1/4">Entry Type</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  <RadioGroup
                    value={selectedGLCode}
                    onChangeValue={setSelectedGLCode}
                    name="Select GL Code">
                    {records.map((parameter, id) => (
                      <Tr key={id}>
                        <Td className="w-3/4">
                          <Radio
                            value={`${parameter.id}-${
                              parameter.GLCreditCode ?? parameter.GLDebitCode
                            }`}>
                            {parameter.GLCreditCode ?? parameter.GLDebitCode}-
                            {parameter.transactionType}
                          </Radio>
                        </Td>
                        <Td className="w-1/4">{parameter.type}</Td>
                      </Tr>
                    ))}
                  </RadioGroup>
                </DataTableRowGroup>
              </DataTable>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="text-right">
          <Button
            onClick={() => {
              setShowRectifyModal(false);
            }}
            variant="outline"
            className="mr-4">
            CANCEL
          </Button>
          <Button
            isLoading={isRectifying}
            onClick={() => {
              rectify({ids: selectedRecords, parameterId: selectedGLCode.split('-')[0]});
              setShowRectifyModal(false);
            }}
            variant="primary">
            CONFIRM
          </Button>
        </ModalFooter>
      </Modal>
      <div className="mb-8 space-y-8">
        <FilterControls>
          <FieldContainer label="Filter by" layout="vertical">
            <DropdownSelect
              value={values.searchBy}
              onChangeValue={(val, label) => {
                setIsCheckAll(false);
                setValue('searchBy', val as GeneralLedgerProfileFilterBy, label);
              }}
              options={FILTER_OPTIONS}
            />
          </FieldContainer>
          <FieldContainer label="Date" layout="vertical">
            <DateRangeDropdown
              customRangeFormatType="dateAndTime"
              value={[values.from, values.to]}
              onChangeValue={(value, label) => {
                setIsCheckAll(false);
                setValue('from', value[0], label);
                setValue('to', value[1], label);
              }}
            />
          </FieldContainer>
        </FilterControls>
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          heading={
            <div className="px-7 py-4 flex flex-row justify-between items-center">
              <div className="flex items-center">
                <Checkbox checked={isCheckAll} className="mr-4" onChange={handleSelectAll} />{' '}
                <span className="text-sm">Select All</span>
              </div>
              <Button
                isLoading={isGLParamLoading}
                disabled={selectedRecords.length === 0}
                minWidth="small"
                variant="primary"
                onClick={handleRectify}>
                RECTIFY
              </Button>
            </div>
          }
          isLoading={isLoading}
          pagination={
            data && (
              <PaginationNavigation
                total={data.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Transaction Date</Td>
              <Td>GL Profile</Td>
              <Td>Transaction Type</Td>
              <Td>Reason</Td>
              <Td>Amount</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            <CheckboxGroup
              name="Selected Rectification Records"
              value={selectedRecords}
              onChangeValue={setSelectedRecords}>
              {data &&
                data.items.map((parameter, id) => {
                  const render: DataTableCellProps['render'] = (props) => (
                    <Link to={`/general-ledger-rectification/${parameter.id}`} {...props} />
                  );

                  return (
                    <Tr key={id}>
                      <Td>
                        <div className="flex">
                          <Checkbox
                            checked={selectedRecords[parameter.id]}
                            value={parameter.id || ''}
                            className="mr-4"
                          />{' '}
                          <Link to={`/general-ledger-rectification/${parameter.id}`}>
                            {parameter.eventData.date}
                          </Link>
                        </div>
                      </Td>
                      <Td render={render}>{parameter.eventData.GLProfile}</Td>
                      <Td render={render}>{parameter.eventData.transactionType}</Td>
                      <Td render={render}>{parameter.errorReason}</Td>
                      <Td render={render}>{parameter.eventData.amount}</Td>
                    </Tr>
                  );
                })}
            </CheckboxGroup>
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const transformRecord = (list: IGeneralLedgerParameter[], searchValue: string) => {
  const displayedRecord = flattenArray(
    list.map((item) => [
      {
        id: item.id,
        recordId: `${item.id}-debit`,
        GLProfile: item.GLProfile,
        transactionType: item.transactionType,
        GLDebitCode: item.debit.GLCode,
        type: 'Debit',
      },
      {
        id: item.id,
        recordId: `${item.id}-credit`,
        GLProfile: item.GLProfile,
        transactionType: item.transactionType,
        GLCreditCode: item.credit.GLCode,
        type: 'Credit',
      },
    ]),
  );

  if (!searchValue) {
    return displayedRecord;
  }

  if (searchValue) {
    return displayedRecord.filter(
      (item) => item.GLDebitCode?.includes(searchValue) ?? item.GLCreditCode?.includes(searchValue),
    );
  }

  return displayedRecord;
};

const FILTER_OPTIONS = [
  {
    value: GL_PROFILE_FILTER_BY[0].toString(),
    label: 'All',
  },
  {
    value: GL_PROFILE_FILTER_BY[1].toString(),
    label: 'Loyalty Card',
  },
  {
    value: GL_PROFILE_FILTER_BY[2].toString(),
    label: 'Gift Card',
  },
  {
    value: GL_PROFILE_FILTER_BY[3].toString(),
    label: 'Fleet Card',
  },
  {
    value: GL_PROFILE_FILTER_BY[4].toString(),
    label: 'Undefined',
  },
];
