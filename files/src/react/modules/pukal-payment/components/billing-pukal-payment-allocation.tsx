import {
  classes,
  Card,
  DescList,
  DescItem,
  PaginationNavigation,
  Text,
  Button,
  EditIcon,
  Modal,
} from '@setel/portal-ui';
import * as React from 'react';
import {SubtypeMap} from 'src/shared/enums/card.enum';
import {HasPermission} from '../../auth/HasPermission';
import {billingPukalPaymentRole, cardRole} from 'src/shared/helpers/roles.type';
import {
  DataTable as Table,
  DataTableRowGroup as Row,
  DataTableRow as Tr,
  DataTableCell as Td,
} from '@setel/portal-ui';
import {BillingPukalPaymentModal} from './billing-pukal-payment-modal';
import {BillingPukalAccountModal} from './billing-pukal-account-modal';
import {useRouter} from 'src/react/routing/routing.context';

interface ICardDetailsProps {
  id: string;
}

export const BillingPukalPaymentAllocation = (props: ICardDetailsProps) => {
  let card: any = undefined;
  const router = useRouter();
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = React.useState(false);
  const handleCancel = () => {
    router.navigateByUrl('/billing/pukal-payment');
    setShowConfirmCancel(false);
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <HasPermission accessWith={[cardRole.read]}>
          <>
            <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
              <h1 className={classes.h1}>{props.id}Pukal payment allocation</h1>
              <div>
                <Button
                  variant="error-outline"
                  onClick={() => {
                    setShowConfirmCancel(true);
                  }}>
                  CANCEL
                </Button>
                <HasPermission accessWith={[billingPukalPaymentRole.view]}>
                  <Button variant="primary" className="align-bottom ml-3" onClick={() => {}}>
                    SEND FOR APPROVAL
                  </Button>
                </HasPermission>
              </div>
            </div>
            <Card className="mb-6">
              <Card.Heading title={<span className="text-xl">Pukal payment details</span>}>
                <Button
                  leftIcon={<EditIcon />}
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(true);
                  }}>
                  EDIT
                </Button>
              </Card.Heading>
              <Card.Content className="p-7">
                <div>
                  <DescList className="col-span-5">
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Pukal type"
                      value={card?.remark || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="Pukal code"
                      value={card?.type || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="Statement date"
                      value={card?.formFactor || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="Transaction date"
                      value={card?.formFactor || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="GL settlement"
                      value={card?.physicalType || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Transaction code"
                      value={
                        card?.subtype
                          ? SubtypeMap.find((subtype) => subtype.value === card.subtype)?.label
                          : '-'
                      }
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Slip number"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Issuing bank"
                      value={card?.merchant?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Cheque amount"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Cheque number"
                      value={card?.cardGroup?.name || '-'}
                    />
                  </DescList>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Heading title={<span className="text-xl">Pukal accounts</span>}>
                <Button
                  leftIcon={<EditIcon />}
                  variant="outline"
                  onClick={() => {
                    setShowEditAccountModal(true);
                  }}>
                  EDIT
                </Button>
              </Card.Heading>
              <Card.Content>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        total amount
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        cheque amount
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        difference
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                </div>
              </Card.Content>
              <Table
                striped
                pagination={
                  <PaginationNavigation
                    total={0}
                    currentPage={0}
                    perPage={0}
                    onChangePage={() => {}}
                    onChangePageSize={() => {}}
                  />
                }>
                <Row groupType="thead">
                  <Tr>
                    <Td className="w-2/12 pl-7">SmartPay account number</Td>
                    <Td className="w-2/12">SmartPay account name</Td>
                    <Td className="w-2/12 text-right">sales amount (RM)</Td>
                    <Td className="w-3/12 text-right">pukal sedut (RM)</Td>
                    <Td className="w-3/12 text-right pr-7">payment amount (RM)</Td>
                  </Tr>
                </Row>
                <Row></Row>
                {/* {isEmptyBillingInvoiceList && (
                      <EmptyDataTableCaption content="You have no data to be displayed here" />
                    )} */}
              </Table>
            </Card>
          </>
        </HasPermission>
      </div>
      {showConfirmCancel && (
        <Modal
          size={'small'}
          isOpen
          onDismiss={() => setShowConfirmCancel(false)}
          aria-label={'confirm-cancel-approval-period-overrun'}>
          <Modal.Header>Are you sure you want to cancel?</Modal.Header>
          <Modal.Body>This action cannot be undone and all changes will be lost.</Modal.Body>
          <Modal.Footer className={'text-right space-x-3'}>
            <Button variant="outline" onClick={() => setShowConfirmCancel(false)}>
              GO BACK
            </Button>
            <Button variant="primary" onClick={handleCancel}>
              CONFIRM
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <BillingPukalPaymentModal
        id=""
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
      <BillingPukalAccountModal
        id=""
        showEditAccountModal={showEditAccountModal}
        setShowEditAccountModal={setShowEditAccountModal}
      />
    </>
  );
};
