import {Card, DescList, DescItem, Badge, Button, EditIcon} from '@setel/portal-ui';
import * as React from 'react';
import {SmartpayPukalAccountModal} from './smartpay-pukal-account-modal';
import {cardRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {
  useMerchantDetails,
  usePukalAccountDetails,
} from 'src/react/modules/pukal-payment/billing-pukal-account.queries';
import dateFormat from 'date-fns/format';
import {PUKAL_TYPE} from 'src/react/modules/pukal-payment/billing-pukal-payment.constants';

export const SmartpayPukalAccountDetails = (props) => {
  const {data: pukalDetail} = usePukalAccountDetails(props.merchantId);
  const {data: merchant} = useMerchantDetails(props.merchantId);
  const [showEditAccountModal, setShowEditAccountModal] = React.useState(false);
  return (
    <>
      <HasPermission accessWith={[cardRole.read]}>
        <>
          <Card className="mb-6">
            <Card.Heading title={<span className="text-xl">Pukal account</span>}>
              <Button
                leftIcon={<EditIcon />}
                variant="outline"
                onClick={() => {
                  setShowEditAccountModal(true);
                }}>
                EDIT
              </Button>
            </Card.Heading>
            <Card.Content className="p-7">
              <div>
                <DescList className="gap-0">
                  <DescItem
                    label="SmartPay account name"
                    labelClassName="text-sm w-36 mb-5"
                    value={merchant?.smartPayAccountAttributes?.companyOrIndividualName || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="SmartPay account number"
                    value={props.merchantId || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Pukal type"
                    value={PUKAL_TYPE[pukalDetail?.pukalType] || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal capitalize"
                    label="Pukal code"
                    value={pukalDetail?.agCode || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal capitalize"
                    label="Project/Setia"
                    value={pukalDetail?.projectSetia || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal capitalize"
                    label="Activation date"
                    value={
                      pukalDetail?.activationDate
                        ? dateFormat(new Date(pukalDetail?.activationDate), 'd MMM yyyy')
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Termination date"
                    value={
                      pukalDetail?.terminationDate
                        ? dateFormat(new Date(pukalDetail?.terminationDate), 'd MMM yyyy')
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Termination flag"
                    value={
                      pukalDetail?.terminationFlag
                        ? 'Yes'
                        : pukalDetail?.terminationFlag === false
                        ? 'No'
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Check digit indicator"
                    value={
                      pukalDetail?.checkDigitIndicator
                        ? 'Yes'
                        : pukalDetail?.checkDigitIndicator === false
                        ? 'No'
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Warrant department"
                    value={pukalDetail?.warrantDepartment || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Warrant PTJ"
                    value={pukalDetail?.warrantPTJ || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Vote code"
                    value={pukalDetail?.voteCode || '-'}
                  />

                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Charge department"
                    value={pukalDetail?.chargeDepartment || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Charge PTJ"
                    value={pukalDetail?.chargePTJ || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Prg/Act/Amanah"
                    value={pukalDetail?.prgActAmanah || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Sort key"
                    value={pukalDetail?.sortKey || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="AG object code"
                    value={
                      pukalDetail?.agObjectCode ? (
                        <div>
                          {pukalDetail?.agObjectCode?.split(',').map((agObjectCode, i) => (
                            <Badge key={i} color={'grey'} rounded="full" className="uppercase mr-2">
                              {agObjectCode}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Created on"
                    value={
                      pukalDetail?.createdAt
                        ? dateFormat(new Date(pukalDetail?.createdAt), 'd MMM yyyy, hh:mm a')
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Created by"
                    value={pukalDetail?.createdBy || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm w-36 mb-5"
                    valueClassName="text-sm font-normal"
                    label="Updated on"
                    value={
                      pukalDetail?.updatedAt
                        ? dateFormat(new Date(pukalDetail?.updatedAt), 'd MMM yyyy, hh:mm a')
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm w-36"
                    valueClassName="text-sm font-normal"
                    label="Updated by"
                    value={pukalDetail?.updatedBy || '-'}
                  />
                </DescList>
              </div>
            </Card.Content>
          </Card>
        </>
      </HasPermission>
      <SmartpayPukalAccountModal
        showEditModal={showEditAccountModal}
        setShowEditModal={setShowEditAccountModal}
        pukalDetail={pukalDetail}
        merchantId={props.merchantId}
        merchantName={merchant?.smartPayAccountAttributes?.companyOrIndividualName}
      />
    </>
  );
};
