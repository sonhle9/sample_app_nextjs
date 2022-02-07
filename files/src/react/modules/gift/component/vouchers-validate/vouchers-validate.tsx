import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeading,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  FieldContainer,
  formatDate,
  TextInput,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import * as Yup from 'yup';
import {useValidateVoucher, useVoidVoucher} from '../../voucher-batch.query';

const vouchersValidateSchema = Yup.object({
  code: Yup.string().required('Voucher code is required'),
});

export const VouchersValidate = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [resolvedData, setResolvedData] = useState(null);
  const {mutate: validateVoucher} = useValidateVoucher();
  const {mutate: voidVoucher} = useVoidVoucher();

  const submitForm = async () => {
    validateVoucher(values.code, {
      onSuccess: (res: any) => {
        setResolvedData(res.data);
        setErrorMsg('');
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setErrorMsg(response.message);
      },
    });
  };

  const handleVoidVoucher = async () => {
    voidVoucher(values.code, {
      onSuccess: () => {},
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setErrorMsg(response.message);
      },
    });
  };

  const {values, errors, setFieldValue, touched, handleBlur, handleSubmit} = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: vouchersValidateSchema,
    onSubmit: submitForm,
  });

  return (
    <PageContainer heading="Voucher validations">
      <div className="mb-8">
        <Card>
          <CardHeading title="Voucher code"></CardHeading>
          <CardContent>
            <FieldContainer
              label="Voucher code"
              status={touched.code && errors.code ? 'error' : null}
              helpText={touched.code && errors.code}
              layout="horizontal-responsive">
              {errorMsg && <Alert variant="error" description={errorMsg} />}
              <div className="flex">
                <TextInput
                  name="code"
                  value={values.code}
                  onBlur={handleBlur}
                  onChangeValue={(value) => setFieldValue('code', value)}
                  className="w-1/2 mr-3"
                  maxLength={40}
                />
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                  variant="outline"
                  minWidth="none"
                  data-testid="validate-voucher">
                  VALIDATE VOUCHER
                </Button>
                {resolvedData && (
                  <Button
                    onClick={() => {
                      handleVoidVoucher();
                    }}
                    variant="outline"
                    minWidth="none"
                    className="ml-3"
                    data-testid="validate-voucher">
                    VOID VOUCHER
                  </Button>
                )}
              </div>
            </FieldContainer>
          </CardContent>
        </Card>
      </div>
      {resolvedData && (
        <>
          <div>
            <DataTable heading={<CardHeading title="Voucher info" />}>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>Batch name</Td>
                  <Td>Code</Td>
                  <Td>Status</Td>
                  <Td>Start date</Td>
                  <Td>Redeem type</Td>
                  <Td>Expiry date</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                <Tr>
                  <Td>{resolvedData.batch[0]?.name}</Td>
                  <Td>{resolvedData.code}</Td>
                  <Td>{resolvedData.status}</Td>
                  <Td>{resolvedData.startDate && formatDate(resolvedData.startDate)}</Td>
                  <Td>{resolvedData.redeemType}</Td>
                  <Td>{resolvedData.expiryDate && formatDate(resolvedData.expiryDate)}</Td>
                </Tr>
              </DataTableRowGroup>
            </DataTable>
          </div>
          <div className="mt-8">
            <DataTable heading={<CardHeading title="Voucher rules" />}>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>Name</Td>
                  <Td>Amount</Td>
                  <Td>Tag</Td>
                  <Td>Status</Td>
                  <Td>Expiry Date</Td>
                  <Td>Created Date</Td>
                  <Td>Action</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {resolvedData.rules &&
                  resolvedData.rules.map((rule, index) => (
                    <Tr key={index}>
                      <Td>{rule.name}</Td>
                      <Td>{rule.amount}</Td>
                      <Td>{rule.tag}</Td>
                      <Td>{rule.status}</Td>
                      <Td>{rule.expiryDate && formatDate(rule.expiryDate)}</Td>
                      <Td>{rule.createdAt && formatDate(rule.createdAt)}</Td>
                      <Td>{rule.actions && rule.actions}</Td>
                    </Tr>
                  ))}
              </DataTableRowGroup>
            </DataTable>
          </div>
          <div className="mt-8">
            <DataTable heading={<CardHeading title="Voucher history" />}>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>Status</Td>
                  <Td>Date</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                <Tr>
                  <Td>issued</Td>
                  <Td>{resolvedData.startDate && formatDate(resolvedData.startDate)}</Td>
                </Tr>
                {resolvedData.actions &&
                  resolvedData.actions.map((action, index) => (
                    <Tr key={index}>
                      <Td>{action.type}</Td>
                      <Td>{action.createdAt && formatDate(action.createdAt)}</Td>
                    </Tr>
                  ))}
              </DataTableRowGroup>
            </DataTable>
          </div>
        </>
      )}
    </PageContainer>
  );
};
