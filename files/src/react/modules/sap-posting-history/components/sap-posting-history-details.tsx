import {
  Alert,
  Badge,
  Button,
  CardHeading,
  Checkbox,
  CheckboxGroup,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  JsonPanel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  ReloadIcon,
  titleCase,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {
  getSapPostingHistoryDetailsTXT,
  regenerateSapPosting,
} from 'src/react/services/api-ledger.service';
import {ISapPostingHistory} from 'src/react/services/api-ledger.type';
import {
  useSapPostingHistoryDetails,
  useSapPostingHistoryGlPostings,
} from '../sap-posting-history.queries';

interface ISAPPostingHistoryDetailsProps {
  id: string;
}

export const SAPPostingHistoryDetails = (props: ISAPPostingHistoryDetailsProps) => {
  const pagination = usePaginationState();
  const {data} = useSapPostingHistoryDetails(props.id);

  const {data: glPostingData, isLoading} = useSapPostingHistoryGlPostings(props.id, pagination);
  const [showRegenerateModal, setShowRegenerateModal] = React.useState(false);
  const [selectedGlPostingTransactionIds, setSelectedGlPostingTransactionIds] = React.useState([]);
  const [alert, setAlert] = React.useState<{
    show: boolean;
    variant: 'success' | 'info' | 'error' | 'warning';
    description: string;
  }>({show: false, variant: 'success', description: ''});
  const {isCheckAll, toggleCheckAll} = useCheckAll(
    Array.from(new Set(data?.glPostings.map((glPosting) => glPosting.transactionId))),
    selectedGlPostingTransactionIds,
  );
  const {typeOptions} = useDynamicOptions(data);
  const dismissRegenerateModal = () => setShowRegenerateModal(false);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    toggleCheckAll();
    if (event.target.checked) {
      data.glPostings.map((posting) =>
        setSelectedGlPostingTransactionIds((prevState) =>
          Array.from(new Set([posting.transactionId, ...prevState])),
        ),
      );
    } else {
      setSelectedGlPostingTransactionIds([]);
    }
  };

  const regenerateFilter = useFilter(
    {
      transactionType: typeOptions[0].value,
    },
    {
      components: [
        {
          key: 'transactionType',
          type: 'select',
          props: {
            options: typeOptions,
            label: 'Transaction type',
          },
        },
      ],
    },
  );

  const [{values, applied}, {reset}] = regenerateFilter;
  return (
    <PageContainer
      className="space-y-4"
      action={
        <div className="flex flex-row gap-4">
          <Button
            disabled={data && !data.glPostings?.length}
            leftIcon={<DownloadIcon />}
            onClick={async () => {
              const txtData = await getSapPostingHistoryDetailsTXT(props.id);
              downloadFile(txtData, data.fileName);
            }}
            variant="outline">
            DOWNLOAD
          </Button>
          <Button
            disabled={data && !data.glPostings?.length}
            leftIcon={<ReloadIcon />}
            onClick={() => setShowRegenerateModal(true)}
            variant="primary">
            REGENERATE
          </Button>
        </div>
      }
      heading="SAP posting history details">
      {alert.show && <Alert variant={alert.variant} description={alert.description} />}
      <Modal
        isOpen={showRegenerateModal}
        aria-label="Generate sap posting"
        onDismiss={dismissRegenerateModal}>
        <ModalHeader>Regenerate {data ? data.fileName : 'file'}</ModalHeader>
        <ModalBody>
          <FilterControls filter={regenerateFilter} />
          {applied.length > 0 && (
            <Filter onReset={reset}>
              {applied.map((item) => (
                <Badge onDismiss={item.resetValue} key={item.prop}>
                  {item.label}
                </Badge>
              ))}
            </Filter>
          )}
          <br />
          <DataTable isLoading={isLoading}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>
                  <div className="flex">
                    <Checkbox checked={isCheckAll} onChange={handleSelectAll} className="mr-4" />{' '}
                    Transaction type
                  </div>
                </Td>
                <Td>Document type</Td>
                <Td>GL transaction desc</Td>
                <Td>Posting key</Td>
                <Td>GL account</Td>
                <Td>Profit centre code</Td>
                <Td>Cost centre code</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              <CheckboxGroup
                name="Selected GL postings"
                value={selectedGlPostingTransactionIds}
                onChangeValue={setSelectedGlPostingTransactionIds}>
                {data &&
                  data.glPostings?.map((posting) => (
                    <Tr key={posting.id}>
                      <Td>
                        <div className="flex">
                          <Checkbox
                            checked={selectedGlPostingTransactionIds[posting.transactionId]}
                            value={posting.transactionId || ''}
                            className="mr-4"
                          />{' '}
                          {titleCase(posting.transactionType, {hasUnderscore: true})}
                        </div>
                      </Td>
                      <Td>{posting.documentType || 'DA'}</Td>
                      <Td>{posting.GLTransactionDescription}</Td>
                      <Td>{posting.entryType === 'debit' ? 40 : 50}</Td>
                      <Td>{posting.GLAccountNo}</Td>
                      <Td>{posting.profileCenterCode}</Td>
                      <Td>{posting.costCenterCode}</Td>
                    </Tr>
                  ))}
              </CheckboxGroup>
            </DataTableRowGroup>
          </DataTable>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button onClick={dismissRegenerateModal} variant="outline" className="mr-4">
            CANCEL
          </Button>
          <Button
            disabled={!selectedGlPostingTransactionIds.length}
            onClick={async () => {
              try {
                await regenerateSapPosting({
                  id: props.id,
                  transactionIds:
                    isCheckAll && values.transactionType
                      ? undefined
                      : selectedGlPostingTransactionIds,
                  transactionType: isCheckAll ? values.transactionType : '',
                });
                setAlert(() => ({
                  show: true,
                  variant: 'success',
                  description: `${data && data.fileName} has been successfully regenerated.`,
                }));
              } catch (err) {
                setAlert(() => ({
                  show: true,
                  variant: 'error',
                  description: `An error occured: ${err}`,
                }));
              } finally {
                dismissRegenerateModal();
              }
            }}
            variant="primary">
            GENERATE
          </Button>
        </ModalFooter>
      </Modal>
      <DataTable
        heading={<CardHeading title={`${data ? data.fileName : ''}`}></CardHeading>}
        isLoading={isLoading}
        pagination={
          <Pagination
            currentPage={pagination.page}
            pageSize={pagination.perPage}
            lastPage={glPostingData?.pageCount}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
            onGoToLast={() => {}}
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Transaction date</Td>
            <Td>Transaction type</Td>
            <Td>Transaction desc</Td>
            <Td>Entry type</Td>
            <Td>Account no.</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {glPostingData &&
            glPostingData.items.map((posting) => (
              <Tr key={posting.id}>
                <Td>{formatDate(posting.transactionDate, {formatType: 'dateAndTime'})}</Td>
                <Td>{titleCase(posting.transactionType, {hasUnderscore: true})}</Td>
                <Td>{posting.GLTransactionDescription}</Td>
                <Td>{titleCase(posting.entryType, {hasUnderscore: true})}</Td>
                <Td>{posting.GLAccountNo}</Td>
              </Tr>
            ))}
        </DataTableRowGroup>
      </DataTable>
      <JsonPanel defaultOpen allowToggleFormat json={data as any} />
    </PageContainer>
  );
};

const useCheckAll = (allTransactionIds: string[], selectedTransactionIds: string[]) => {
  const [isCheckAll, setIsCheckAll] = React.useState(false);
  const toggleCheckAll = () => setIsCheckAll(!isCheckAll);
  React.useEffect(() => {
    if (allTransactionIds.length && selectedTransactionIds.length) {
      if (selectedTransactionIds.length === allTransactionIds.length) {
        setIsCheckAll(true);
      } else {
        setIsCheckAll(false);
      }
    }
  }, [selectedTransactionIds]);

  return {isCheckAll, toggleCheckAll, setIsCheckAll};
};

const useDynamicOptions = (data: ISapPostingHistory) => {
  const [typeOptions, setTypeOptions] = React.useState<{label: string; value: string}[]>([
    {label: 'All types', value: ''},
  ]);

  React.useEffect(() => {
    if (data) {
      const uniqueTypeOptions = Array.from(
        new Set(data.glPostings.map((posting) => posting.transactionType)),
      );

      setTypeOptions(
        [{label: 'All types', value: ''}].concat(
          uniqueTypeOptions.map((type) => ({
            label: titleCase(type, {hasUnderscore: true}),
            value: type,
          })),
        ),
      );
    }
  }, [data]);

  return {typeOptions};
};
