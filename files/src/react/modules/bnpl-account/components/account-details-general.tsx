import {
  Card,
  DescList,
  formatMoney,
  formatDate,
  Badge,
  Button,
  EditIcon,
  Indicator,
  ExternalIcon,
  BareButton,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {adminBnplAccount} from 'src/shared/helpers/roles.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {
  bnplAccountStatusColor,
  bnplPaymentMethodIconMap,
} from 'src/react/modules/bnpl-account/bnpl-account.constant';
import {useBnplAccountDetails} from 'src/react/modules/bnpl-account/bnpl-account.queries';
import {BnplAccountStatus} from 'src/react/modules/bnpl-account/bnpl-account.type';
import {useBnplAccountDetailEditModal} from './modals/account-detail-edit-modal';

export const AccountGeneralDetails = ({id}: {id: string}) => {
  const {data, isFetching} = useBnplAccountDetails(id);
  const bnplAccountDetailEditModal = useBnplAccountDetailEditModal(data);

  const pageContainer = () => {
    if (!data) {
      return <PageContainer />;
    }

    return (
      <PageContainer>
        <Card expandable className="mb-6">
          <Card.Heading title={'General'}>
            {['active', 'frozen'].includes(data.status) && (
              <HasPermission accessWith={[adminBnplAccount.adminCreate]}>
                <Button
                  variant="outline"
                  leftIcon={<EditIcon />}
                  minWidth="none"
                  onClick={bnplAccountDetailEditModal.open}
                  disabled={isFetching}>
                  {bnplAccountDetailEditModal.component}
                  EDIT
                </Button>
              </HasPermission>
            )}
          </Card.Heading>
          <Card.Content>
            <DescList>
              <DescList.Item label="Name" value={data?.name} />
              <DescList.Item
                label="Account status"
                value={
                  <Badge color={bnplAccountStatusColor[data.status]}>
                    {BnplAccountStatus[data.status].toUpperCase()}
                  </Badge>
                }
              />
              <DescList.Item
                label="Setel user ID"
                value={
                  <>
                    <div className="flex flex-row">
                      <div className="mr-1">{data.userId}</div>
                      <BareButton>
                        <ExternalIcon className="text-brand-500" />
                      </BareButton>
                    </div>
                  </>
                }
              />
              <DescList.Item label="BNPL account ID" value={data.id} />
              <DescList.Item label="Credit limit" value={formatMoney(data.creditLimit, 'RM')} />
              <DescList.Item
                label="Available limit"
                value={formatMoney(data.creditBalance, 'RM')}
              />
              <DescList.Item
                label="Activation date"
                value={formatDate(data.activationDate, {
                  format: 'dd MMM yyyy',
                })}
              />
              <DescList.Item
                label="Card linked"
                value={
                  <div className="h-8 flex">
                    {data.cardNumber && (
                      <>
                        <img
                          className="inline h-full w-auto"
                          height="31"
                          src={bnplPaymentMethodIconMap.card_visa}
                        />
                        <div className="flex flex-row items-center mx-2 py-2">
                          <Indicator className="pu-h-2 pu-w-2 ml-1 bg-black" />
                          <Indicator className="pu-h-2 pu-w-2 ml-1 bg-black" />
                          <Indicator className="pu-h-2 pu-w-2 ml-1 bg-black" />
                          <Indicator className="pu-h-2 pu-w-2 ml-1 bg-black" />
                          <div className="ml-1 ">
                            {/* 1234 */}
                            {data.cardNumber}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                }
              />
              <DescList.Item
                label="Amount due this month"
                value={formatMoney(data.amountDueThisMonth, 'RM')}
              />
            </DescList>
          </Card.Content>
        </Card>
      </PageContainer>
    );
  };

  return pageContainer();
};
