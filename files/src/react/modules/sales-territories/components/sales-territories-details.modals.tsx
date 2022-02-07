import {
  Field,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  SearchableDropdown,
  DataTable,
  DataTableRowGroup,
  DataTableRow as Tr,
  DataTableCell as Td,
  ModalFooter,
  Button,
  TrashIcon,
  DataTableCaption,
  DropdownSelect,
  FieldContainer,
  Dialog,
  DialogContent,
  DialogFooter,
  useDebounce,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {
  useAddTerritoryMerchants,
  useGetSalesTerritories,
  useGetNoTerritoryMerchants,
  useTransferTerritoryMerchants,
} from '../sales-territories.queries';
import {SalesTerritoryModalMessage} from '../sales-territories.type';

interface SalesTerritoryAddMerchantModalProps {
  salesTerritoryId: string;
  merchantTypeId: string;
  onClose?: (string) => void;
}

interface SalesTerritoryTransferMerchantModalProps {
  salesTerritoryId: string;
  merchantTypeId: string;
  onClose?: (string) => void;
}

export const SalesTerritoryAddMerchantModal = (props: SalesTerritoryAddMerchantModalProps) => {
  const [merchants, setMerchants] = React.useState([]);
  const [searchMerchants, setSearchMerchants] = React.useState('');
  const debounceSearchMerchants = useDebounce(searchMerchants, 500);

  const {mutate: addTerritoryMerchants, error: submitError} = useAddTerritoryMerchants(
    props.salesTerritoryId,
  );

  const {data: dataMerchants} = useGetNoTerritoryMerchants({
    perPage: 50,
    searchText: debounceSearchMerchants,
    merchantTypeId: props.merchantTypeId,
  });

  const initMerchantOptions = () => {
    const opts = (dataMerchants || []).reduce((arr, obj) => {
      arr.push({
        label: obj.name,
        value: obj.id,
        key: obj.merchantId,
      });
      return arr;
    }, []);

    return opts.filter((option) => {
      return !merchants.find((merchant) => {
        return option.value === merchant.merchantId;
      });
    });
  };
  const [merchantOptions, setMerchantOptions] = React.useState(initMerchantOptions());

  const handleSelect = (id: string, name: string) => {
    setMerchants([
      ...merchants,
      {
        merchantId: id,
        name,
      },
    ]);
    document.getElementById('territory-merchant-search').blur();
  };

  const handleSubmit = () => {
    const merchantIds = merchants.map((merchant) => merchant.merchantId);
    addTerritoryMerchants(merchantIds, {
      onSuccess: () => props.onClose(SalesTerritoryModalMessage.ADD_SUCCESS),
    });
  };

  React.useMemo(() => {
    setMerchantOptions(initMerchantOptions());
  }, [dataMerchants, merchants]);

  const title = 'Add merchants';
  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {submitError && <QueryErrorAlert className="mb-4" error={submitError as any} />}
          <Field>
            <Label>Search</Label>
            <SearchableDropdown
              id="territory-merchant-search"
              value={''}
              onChangeValue={handleSelect}
              onInputValueChange={setSearchMerchants}
              options={merchantOptions}
              placeholder="Search by merchant name"
            />
          </Field>
          <div className="mt-4 my-minus-8 max-h-screen-40 overflow-y-auto relative">
            <DataTable type="secondary">
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="pl-8 sticky top-0">Merchant name</Td>
                  <Td className="text-right pr-8 sticky top-0 z-index-1000">Actions</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {merchants.map((merchant, index) => (
                  <Tr key={index}>
                    <Td className="pl-8 text-sm">{merchant.name}</Td>
                    <Td className="pr-8">
                      <TrashIcon
                        color={'red'}
                        className="w-5 h-5 float-right cursor-pointer"
                        onClick={() =>
                          setMerchants(
                            merchants.filter((m) => m.merchantId !== merchant.merchantId),
                          )
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </DataTableRowGroup>
              {!merchants.length && (
                <DataTableCaption>
                  <div className="py-6">
                    <p className="text-center text-gray-400 text-sm">No merchant linked yet.</p>
                  </div>
                </DataTableCaption>
              )}
            </DataTable>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="text-right space-x-3">
            <Button variant="outline" onClick={props.onClose}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!merchants.length}>
              SAVE
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const SalesTerritoryTransferMerchantModal = (
  props: SalesTerritoryTransferMerchantModalProps,
) => {
  const [newSalesTerritory, setNewSalesTerritory] = React.useState('');
  const [isContinue, setContinue] = React.useState(false);
  const [visibleTransferConfirm, setVisibleTransferConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const {data: salesTerritories} = useGetSalesTerritories({
    page: 1,
    perPage: 300,
    merchantTypeId: props.merchantTypeId,
    sortBy: 'name',
  });
  const territoryOpts = (salesTerritories?.items || []).reduce((arr, obj) => {
    if (obj.id !== props.salesTerritoryId) {
      arr.push({
        label: obj.name,
        value: obj.id,
        key: obj.code,
      });
    }
    return arr;
  }, []);

  const {mutate: transferMerchants, error: submitError} = useTransferTerritoryMerchants(
    props.salesTerritoryId,
  );
  const handleSummit = () => {
    setVisibleTransferConfirm(false);
    transferMerchants(newSalesTerritory, {
      onSuccess: () => {
        props.onClose(SalesTerritoryModalMessage.TRANSFER_SUCCESS);
      },
    });
  };

  const title = 'Transfer merchants';
  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {submitError && <QueryErrorAlert className="mb-4" error={submitError as any} />}
          <FieldContainer
            label={<div className="w-40">Sales territory name</div>}
            layout="horizontal-responsive"
            status={isContinue && !newSalesTerritory ? 'error' : undefined}
            helpText={
              isContinue && !newSalesTerritory ? 'Select the destination territory first' : null
            }
            className="my-4">
            <DropdownSelect
              name="salesTerritory"
              value={newSalesTerritory}
              placeholder="Please select"
              options={territoryOpts}
              onChangeValue={(value) => setNewSalesTerritory(value)}
              className="w-60"
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="text-right space-x-3">
            <Button variant="outline" onClick={props.onClose}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setContinue(true);
                !!newSalesTerritory && setVisibleTransferConfirm(true);
              }}>
              CONTINUE
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      {visibleTransferConfirm && (
        <Dialog onDismiss={() => setVisibleTransferConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Transfer merchants">
            Are you sure to move merchants to following sales territory?
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleTransferConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleSummit}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
