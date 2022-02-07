import {
  Button,
  Modal,
  Text,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  TextInput,
  PaginationNavigation,
  FieldContainer,
} from '@setel/portal-ui';
import * as React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {EMessage} from '../../cards/card-message.-validate';

interface IBillingPukalAccountProps {
  id: string;
  showEditAccountModal: boolean;
  setShowEditAccountModal: Function;
}

export const BillingPukalAccountModal = (props: IBillingPukalAccountProps) => {
  let accounts = [{amount: undefined}, {amount: undefined}];
  // let updateList: any = [];

  const getPukalErrorByIndex = (errors, index) => {
    if (errors?.pukalAccounts) {
      if (errors?.pukalAccounts[index]) {
        if (errors?.pukalAccounts[index]?.amount && touched?.pukalAccounts) {
          return errors?.pukalAccounts[index]?.amount;
        }
      }
    }
    return undefined;
  };
  const validationSchema = Yup.object().shape({
    pukalAccounts: Yup.array().of(
      Yup.object().shape({
        amount: Yup.mixed().required(EMessage.REQUIRED_FIELD),
      }),
    ),
  });
  const {values, errors, touched, handleSubmit} = useFormik({
    initialValues: {
      pukalAccounts: accounts,
    },
    validationSchema,
    onSubmit: (value) => {
      console.log(value);
    },
  });

  return (
    <>
      <Modal
        size="large"
        isOpen={props.showEditAccountModal}
        onDismiss={() => props.setShowEditAccountModal(false)}
        header="Edit details">
        <Modal.Body>
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
        </Modal.Body>
        <Table
          pagination={
            <PaginationNavigation
              className="pl-8 absolute"
              total={0}
              currentPage={0}
              perPage={0}
              onChangePage={() => {}}
              onChangePageSize={() => {}}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-80 pl-8">SmartPay account number</Td>
              <Td className="w-64">SmartPay account name</Td>
              <Td className="w-52 text-right">sales amount (RM)</Td>
              <Td className="w-52 text-right">pukal sedut (RM)</Td>
              <Td className="text-right pr-7">payment amount (RM)</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {values.pukalAccounts.map((v, index) => (
              <Tr key={index}>
                <Td className="w-80 pl-8">SmartPay account number</Td>
                <Td className="w-64">SmartPay account name</Td>
                <Td className="w-52 text-right">sales amount (RM)</Td>
                <Td className="w-52 text-right">pukal sedut (RM)</Td>
                <Td className="text-right pr-7">
                  <FieldContainer
                    className="mb-0"
                    status={getPukalErrorByIndex(errors, index) ? 'error' : undefined}
                    helpText={getPukalErrorByIndex(errors, index)}>
                    <TextInput
                      name="remark"
                      value={values.pukalAccounts[index]?.amount}
                      onChangeValue={(value) => {
                        v.amount = value;
                        values.pukalAccounts[index].amount = value;
                        // if (updateList.find(val => val.id === v.id).length > 0) {
                        // }
                      }}
                      maxLength={40}
                    />
                  </FieldContainer>
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        </Table>
        <Modal.Footer className="text-right space-x-3 mt-16">
          <Button onClick={() => props.setShowEditAccountModal(false)} variant="outline">
            CANCEL
          </Button>
          <Button onClick={() => handleSubmit()} variant="primary">
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
