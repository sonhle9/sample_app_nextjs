import * as React from 'react';
import {
  DataTable as Table,
  TextEllipsis,
  Button,
  Modal,
  SearchInput,
  FieldContainer,
  TrashIcon,
  useDebounce,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useAssignMerchantToFeePlan, useSearchMerchantsWithFeePlan} from '../../fee-plans.queries';
import {IMerchantWithFeePlan} from '../../fee-plans.type';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {FeePlansNotificationMessages} from '../../fee-plans.constant';
import {useNotification} from 'src/react/hooks/use-notification';

export const FeePlansModalAssign = ({
  feePlanId,
  setShowModal,
}: {
  feePlanId: string;
  setShowModal: Function;
}) => {
  const showMessage = useNotification();
  const [searchValue, setSearchValue] = React.useState('');
  const search = useDebounce(searchValue);
  const [selectedMerchants, setSelectedMerchants] = React.useState<IMerchantWithFeePlan[]>([]);
  const [paddingRight, setPaddingRight] = React.useState('');
  const {data: merchants, error: searchMerchantError} = useSearchMerchantsWithFeePlan({
    page: 1,
    perPage: 5,
    search,
    excludedFeePlanId: feePlanId,
    excludedMerchantIds: selectedMerchants.map((selectedMerchant) => selectedMerchant.merchantId),
  });
  const {
    mutateAsync: assignMerchantToFeePlan,
    error: assignMerchantError,
    isLoading,
  } = useAssignMerchantToFeePlan();

  const ref = React.useRef(null);

  React.useEffect(() => {
    setPaddingRight(
      ref?.current?.clientHeight < ref?.current?.scrollHeight
        ? 'sm:last:pr-6 pr-6'
        : 'sm:last:pr-8 pr-8',
    );
  });

  const error = searchMerchantError || assignMerchantError;

  const handleAddMerchant = (selectedMerchantId: string) => {
    const selectedMerchant = merchants.find(({merchantId}) => merchantId === selectedMerchantId);

    setSearchValue('');
    setSelectedMerchants([...selectedMerchants, selectedMerchant]);
  };

  const handleRemoveMerchant = (selectedMerchantId: string) => {
    setSelectedMerchants(
      selectedMerchants.filter(({merchantId}) => merchantId !== selectedMerchantId),
    );
  };

  const handleSave = async () => {
    const selectedMerchantIds = selectedMerchants.map(
      (selectedMerchant) => selectedMerchant.merchantId,
    );

    await assignMerchantToFeePlan({feePlanId, merchantIds: selectedMerchantIds});
    setShowModal(false);
    showMessage({
      title: FeePlansNotificationMessages.successTitle,
      description: FeePlansNotificationMessages.assignedFeePlan,
    });
  };

  const isEmpty = selectedMerchants.length === 0;

  return (
    <Modal header="Assign merchant to plan" isOpen={true} onDismiss={() => setShowModal(false)}>
      {error && <QueryErrorAlert error={error as any} />}
      <Modal.Body className="pb-0">
        <div className="-mx-4 md:-mx-6 lg:-mx-8">
          <Table
            heading={
              <FieldContainer label="Search" className="px-8">
                <SearchInput
                  onInputValueChange={setSearchValue}
                  data-testid="merchant-filter"
                  placeholder={'Enter merchant name'}
                  onSelect={handleAddMerchant}
                  results={
                    search !== searchValue
                      ? undefined
                      : merchants?.map((merchant) => ({
                          value: merchant.merchantId,
                          label: merchant.name,
                          description: merchant.feePlanName,
                        }))
                  }
                />
              </FieldContainer>
            }>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="sm:first:pl-8 pl-8">Merchant name</Table.Th>
                <Table.Th className="text-right sm:last:pr-8 pr-8"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            {isEmpty && (
              <EmptyDataTableCaption content="No merchant linked yet." className="py-8" />
            )}
          </Table>
          <div ref={ref} className="max-h-64 overflow-y-auto relative portal-ui-scrollbar">
            <Table striped={false}>
              {!isEmpty && (
                <Table.Tbody>
                  {selectedMerchants.map((selectedMerchant) => (
                    <Table.Tr key={selectedMerchant.merchantId}>
                      <Table.Td className="align-middle sm:first:pl-8 pl-8">
                        <TextEllipsis widthClass="max-w-xs" text={selectedMerchant.name} />
                      </Table.Td>
                      <Table.Td className={`float-right ${paddingRight}`}>
                        <TrashIcon
                          className="w-5 h-5 text-red-500 cursor-pointer"
                          data-id={selectedMerchant.merchantId}
                          onClick={() => handleRemoveMerchant(selectedMerchant.merchantId)}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              )}
            </Table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={() => setShowModal(false)} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          isLoading={isLoading}
          disabled={selectedMerchants.length === 0}>
          SAVE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
