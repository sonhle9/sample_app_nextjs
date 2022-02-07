import * as React from 'react';
import {
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Dialog,
  DialogContent,
  DialogFooter,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
  TrashIcon,
  useDebounce,
} from '@setel/portal-ui';
import {
  useUpdateCompanyIdMerchant,
  useGetListMerchant,
  companyQueryKey,
} from '../companies.queries';
import {useQueryClient} from 'react-query';

interface ICompanyDetailsModalMerchant {
  visible: boolean;
  onClose?: () => void;
  merchants: any;
  idCompany: string;
  nameCompany: string;
  productsCompany: any;
}

interface ICompanyMerchants {
  id: string;
  name: string;
  productOfferings: any;
}

export function CompanyMerchantsDetail(props: ICompanyDetailsModalMerchant) {
  const [textSearchMerchant, setTextSearchMerchant] = React.useState('');
  const [visibleDelete, setVisibleDelete] = React.useState(false);
  const [toggleListMerchant, setToggleListMerchant] = React.useState(false);
  const [nameMerchant, setNameMerchant] = React.useState('');
  const [idMerchant, setIdMerchant] = React.useState(null);
  const [errorMes, setErrorMes] = React.useState('');
  const cancelRef = React.useRef(null);
  const debouncedText = useDebounce(textSearchMerchant);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {data: newMerchants} = useGetListMerchant(textSearchMerchant.toLowerCase());
  const {mutateAsync: addMerchantToCompany} = useUpdateCompanyIdMerchant();

  const queryClient = useQueryClient();

  const visibleMerchants = React.useMemo(
    () => (textSearchMerchant ? newMerchants : []),
    [textSearchMerchant, newMerchants],
  );

  React.useEffect(() => {
    if ((textSearchMerchant || '').length) {
      setToggleListMerchant(true);
    } else {
      setToggleListMerchant(false);
    }
    if (!props.visible) {
      setTextSearchMerchant('');
    }
  }, [debouncedText, newMerchants, props.visible]);

  const openDeleteMerchant = (item: any) => {
    setVisibleDelete(true);
    setNameMerchant(item.name);
    setIdMerchant(item.id);
  };

  const confirmAddMerchant = (merchantId) => {
    addMerchantToCompany({
      merchantId,
      companyId: props.idCompany,
    })
      .then(() => {
        setTextSearchMerchant('');
        setErrorMes('');
        setShowConfirm(false);
      })
      .catch((err) => {
        setShowConfirm(false);
        setErrorMes(err);
      });
  };

  const addMerchant = async (item: ICompanyMerchants) => {
    const productsMerchant = item.productOfferings;
    const productsCompany = props.productsCompany;
    setIdMerchant(item.id);
    let productCompanyKey = '';
    let checkProducts;
    checkProducts = Object.keys(productsMerchant).some((product) => {
      productCompanyKey = product.replaceAll('Enabled', '');
      return productsMerchant[product] && !productsCompany[productCompanyKey];
    });
    if (checkProducts) {
      setShowConfirm(checkProducts);
      return;
    }
    confirmAddMerchant(item.id);
  };

  const confirmDeleteMerchant = () => {
    addMerchantToCompany({
      merchantId: idMerchant,
      companyId: null,
    }).then(() =>
      queryClient.invalidateQueries(`${companyQueryKey.COMPANY_MERCHANTS}_${props.idCompany}`),
    );
    setVisibleDelete(false);
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={props.onClose} aria-label="Edit merchants">
        <ModalHeader>Edit merchants</ModalHeader>
        <ModalBody>
          <div className="flex flex-column" style={{position: 'relative'}}>
            <Field className="w-full">
              <TextField
                label={'Search'}
                placeholder="Search by merchants name, merchants ID"
                value={textSearchMerchant}
                onChangeValue={setTextSearchMerchant}
                className="add-merchant"
                status={!!errorMes ? 'error' : null}
                helpText={errorMes}
              />
            </Field>
            {toggleListMerchant && (
              <div className="card box-merchants">
                {(visibleMerchants || []).length > 0 ? (
                  <>
                    {visibleMerchants.map((item: ICompanyMerchants, i: number) => {
                      return (
                        <Field
                          key={i}
                          className={`item-merchants ${
                            item.name === textSearchMerchant ? 'active' : ''
                          }`}
                          onClick={() => addMerchant(item)}>
                          <div className="relative flex items-center">
                            <strong className="mb-0 px-2" style={{cursor: 'pointer'}}>
                              {item.name}
                            </strong>
                          </div>
                        </Field>
                      );
                    })}
                  </>
                ) : (
                  <Field className="item-merchants">
                    <Label className="text-center mb-0">No results for {textSearchMerchant}</Label>
                  </Field>
                )}
              </div>
            )}
          </div>

          <div className="max-h-screen-40 overflow-y-auto relative">
            {(props.merchants || []).length > 0 ? (
              <DataTable>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Merchant name</Td>
                    <Td className={'text-right'}>Actions</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {(props.merchants || []).map((merchant, index) => (
                    <Tr key={index}>
                      <Td>{merchant.name}</Td>
                      <Td>
                        <TrashIcon
                          color={'red'}
                          className="w-5 h-5 float-right cursor-pointer"
                          onClick={() => openDeleteMerchant(merchant)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </DataTableRowGroup>
              </DataTable>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Label>No merchants added yet</Label>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end">
            <Button variant="outline" onClick={props.onClose}>
              CANCEL
            </Button>
            <div style={{width: 12}} />
            <Button variant="primary" onClick={props.onClose}>
              SAVE
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {visibleDelete && (
        <Dialog onDismiss={() => setVisibleDelete(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Confirm removal">
            Remove {nameMerchant} from {props.nameCompany}?
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVisibleDelete(false)}>
              CANCEL
            </Button>
            <Button variant="error" onClick={confirmDeleteMerchant}>
              REMOVE MERCHANT
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      {showConfirm && (
        <Dialog onDismiss={() => setShowConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Confirm to proceed">
            One or more product might be turned off since those products are turned off at the
            selected company. Continue to proceed?
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={() => confirmAddMerchant(idMerchant)}>
              OK
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
