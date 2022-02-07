import {
  Badge,
  BareButton,
  Button,
  Card,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  Dialog,
  DotVerticalIcon,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  formatDate,
  formatMoney,
  IconButton,
  JsonPanel,
  ReloadIcon,
  Skeleton,
} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import * as React from 'react';
import {statusColorMap} from 'src/react/modules/verifications/components/verifications-details';
import {useVerificationDetailByCustomerId} from 'src/react/modules/verifications/verifications.queries';
import {Link} from 'src/react/routing/link';
import {IWalletInfo} from 'src/react/services/api-ops.service';
import {LanguageEnum} from 'src/shared/enums/language.enum';
import {adminAccountRole, adminFraudProfile, customerRole} from 'src/shared/helpers/roles.type';
import {HasPermission, useHasPermission} from '../auth/HasPermission';
import {useCanReadLoyalty} from '../loyalty/custom-hooks/use-check-permissions';
import {useGetCardsByUserId} from '../loyalty/loyalty.queries';
import {FraudProfileAlertMessage} from './components/fraud-profile-alert-message';
import {DeleteDeviceModal, UpdateDeviceModal} from './components/modals/update-device-modal';
import {UpdatePhoneModal} from './components/modals/update-phone-modal';
import {UpdateTagsModal} from './components/modals/update-tags-modal';
import {IdentityTypeMap} from './customers.constant';
import {maskCardNumber} from './customers.helper';
import {
  useCurrentLoyaltyCardActivationLimit,
  useCustomerDetails,
  useGetRefreshWalletBalance,
  useGetUserDevices,
  useGetWalletInfo,
  useResetCardActivationLimit,
  useSmartPayCard,
  useUserAccountSettings,
  useUserIncomingBalance,
} from './customers.queries';
import {IUpdateDeviceData} from './customers.type';
import {useCanReadPaymentTransactions} from './hooks/use-customer-permissions';

interface ICustomerAccountDetails {
  customerID: string;
}

const ReadableLanguage = {
  [LanguageEnum.english]: 'English',
  [LanguageEnum.malaysia]: 'Bahasa Melayu',
  [LanguageEnum.simplifiedChinese]: 'Simplified Chinese',
  [LanguageEnum.traditionalChinese]: 'Traditional Chinese',
  [LanguageEnum.tamil]: 'Tamil',
} as const;

export function CustomerAccountDetails({customerID}: ICustomerAccountDetails) {
  const ableToEditPhone = useHasPermission([adminAccountRole.adminEditPhone]);
  const {data: customerDetails, isLoading: isLoadingCustomerDetails} =
    useCustomerDetails(customerID);

  const {data: userAccountSettings, isLoading: isLoadingUserAccountSettings} =
    useUserAccountSettings(customerID);

  const {data: userWalletInfo, isLoading: isLoadingUserWalletInfo} = useGetWalletInfo(customerID);
  const {
    data: customerVerification,
    isLoading: isLoadingCustomerVerification,
    isError,
    error: verificationError,
  } = useVerificationDetailByCustomerId(customerID);

  const [isUpdateTagsModalOpen, showUpdateTagsModal] = React.useState(false);
  const [isUpdatePhoneModalOpen, showUpdatePhoneModal] = React.useState(false);

  return (
    <>
      <HasPermission accessWith={[adminFraudProfile.adminView]}>
        <FraudProfileAlertMessage userId={customerID} />
      </HasPermission>
      {customerDetails &&
        ((isUpdateTagsModalOpen && (
          <UpdateTagsModal
            onDismiss={() => showUpdateTagsModal(false)}
            data={customerDetails}
            customerId={customerID}
          />
        )) ||
          (isUpdatePhoneModalOpen && (
            <UpdatePhoneModal
              onDismiss={() => showUpdatePhoneModal(false)}
              data={customerDetails}
              customerId={customerID}
            />
          )))}

      <Card className="mb-8" data-testid="account-card">
        <Card.Heading title={customerDetails && customerDetails.fullName}>
          <DropdownMenu label="ACTION" data-testid="customer-action-dropdown" variant="outline">
            <DropdownMenuItems>
              <DropdownItem
                data-testid="customer-update-tags-menu"
                onSelect={() => {
                  showUpdateTagsModal(true);
                }}>
                Edit tag
              </DropdownItem>
              <DropdownItem
                data-testid="customer-update-phone-menu"
                disabled={!ableToEditPhone}
                onSelect={() => {
                  showUpdatePhoneModal(true);
                }}>
                Change phone number
              </DropdownItem>
            </DropdownMenuItems>
          </DropdownMenu>
        </Card.Heading>
        <Card.Content className="flex" data-testid="card-content">
          <div className="w-36">
            <strong className="text-xs text-lightgrey">USER PROFILE</strong>
          </div>
          <div>
            <DescList isLoading={isLoadingCustomerDetails} data-testid="desc-list">
              <DescItem label="Name" value={customerDetails && customerDetails.fullName} />
              <DescItem
                labelClassName="self-center"
                label="Phone Number"
                value={customerDetails?.phone || '-'}
              />
              <DescItem label="Email" value={customerDetails && customerDetails.email} />
              <DescItem
                label="ID Type"
                value={customerDetails && (IdentityTypeMap[customerDetails.identityType] ?? '-')}
              />
              <DescItem
                label="ID Number"
                value={customerDetails && (customerDetails.identityNumber ?? '-')}
              />
              <DescItem
                label="Language"
                value={customerDetails && (ReadableLanguage[customerDetails.language] ?? '-')}
              />
              <DescItem
                label="Created on"
                value={
                  customerDetails &&
                  formatDate(customerDetails.createdAt, {formatType: 'dateAndTime'})
                }
              />
              <DescItem
                label="Internal user"
                value={customerDetails && (customerDetails.internal ? 'Enabled' : 'Disabled')}
              />
              <DescItem
                label="eKYC status"
                value={
                  isLoadingCustomerVerification ? (
                    <Skeleton />
                  ) : (
                    <Badge
                      data-testid="ekyc-details-status"
                      rounded="rounded"
                      color={
                        customerVerification
                          ? statusColorMap[customerVerification?.verificationStatus]
                          : 'grey'
                      }
                      className={`uppercase`}>
                      {customerVerification
                        ? customerVerification?.verificationStatus
                        : isError
                        ? VerificationStatusErrorHandler(verificationError)
                        : 'Not Found'}
                    </Badge>
                  )
                }
              />
            </DescList>
          </div>
        </Card.Content>
        <hr />

        <PaymentInfo
          userId={customerID}
          isLoadingUserWalletInfo={isLoadingUserWalletInfo}
          userWalletInfo={userWalletInfo}
        />

        <FleetInfo userId={customerID} />

        <Loyalty userId={customerID} />

        <Card.Content className="flex">
          <div className="w-36">
            <strong className="text-xs text-lightgrey">PREFERENCES</strong>
          </div>
          <div>
            <DescList isLoading={isLoadingUserAccountSettings}>
              <DescItem
                label="Fuel"
                value={
                  userAccountSettings &&
                  (userAccountSettings.pinPreferences?.fuelPurchase ? 'Enabled' : 'Disabled')
                }
              />
              <DescItem
                label="Store"
                value={
                  userAccountSettings &&
                  (userAccountSettings.pinPreferences?.storePurchase ? 'Enabled' : 'Disabled')
                }
              />
            </DescList>
          </div>
        </Card.Content>

        <hr />

        <Card.Content className="flex">
          <div className="w-36">
            <strong className="text-xs text-lightgrey">OTHERS</strong>
          </div>
          <div>
            <DescList>
              <DescItem
                label="Tags"
                value={
                  customerDetails && (
                    <>
                      {customerDetails.tags.map((tag, index) => (
                        <Badge className="text-sm mx-1 mb-1" rounded="full" key={index}>
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )
                }
              />
            </DescList>
          </div>
        </Card.Content>
      </Card>

      <HasPermission accessWith={[customerRole.editDevice, adminAccountRole.adminRead]}>
        <DeviceList userId={customerID} />
      </HasPermission>

      <JsonPanel
        allowToggleFormat
        json={Object.assign({
          ...customerDetails,
          ...{walletInfo: userWalletInfo},
          ...{accountSettings: userAccountSettings},
        })}
      />
    </>
  );
}

function PaymentInfo({
  userWalletInfo,
  isLoadingUserWalletInfo,
  userId,
}: {
  userWalletInfo: IWalletInfo;
  isLoadingUserWalletInfo: boolean;
  userId: string;
}) {
  const {data: refreshWalletBalance, refetch: refetchRefreshWalletBalance} =
    useGetRefreshWalletBalance(userId, {enabled: false});

  const canReadIncomingBalance = useCanReadPaymentTransactions();

  const {data: userIncomingBalance} = useUserIncomingBalance(userId, {
    retry: (retryCount, err) => {
      const error = err as AxiosError;
      return retryCount < 3 && error?.response?.status !== 404;
    },
    enabled: canReadIncomingBalance,
  });

  return (
    <>
      <Card.Content className="flex">
        <div className="w-36">
          <strong className="text-xs text-lightgrey">PAYMENT</strong>
        </div>
        <div>
          <DescList isLoading={isLoadingUserWalletInfo}>
            <DescItem
              label="Wallet Balance"
              value={
                <>
                  {
                    <div className="h-8 flex">
                      <img
                        src="/assets/icons/icon-72x72.png"
                        className="inline h-full w-auto px-3 py-1 border-gray-200 bg-white border"
                      />
                      <div className="flex flex-row mx-2 py-2">
                        Setel Wallet
                        {userWalletInfo && (
                          <>
                            <div className="font-extrabold items-center justify-center flex ">
                              &nbsp;&nbsp;.&nbsp;&nbsp;
                            </div>
                            {`RM${
                              typeof (refreshWalletBalance?.balance ?? userWalletInfo?.balance) ===
                              'number'
                                ? formatMoney(
                                    refreshWalletBalance?.balance ?? userWalletInfo?.balance,
                                  )
                                : '0.00'
                            }`}
                          </>
                        )}
                      </div>
                      <IconButton onClick={() => refetchRefreshWalletBalance()}>
                        <ReloadIcon className="text-brand-500 w-5 h-5" />
                      </IconButton>
                    </div>
                  }
                </>
              }
            />
            <DescItem label="Payment method" value={userWalletInfo ? 'Setel wallet' : '-'} />
            <DescItem
              label="Wallet limit"
              value={userWalletInfo?.limit ? `RM${formatMoney(userWalletInfo?.limit)}` : '-'}
            />
            {canReadIncomingBalance && (
              <DescItem
                label="Incoming balance"
                value={userIncomingBalance ? `RM${formatMoney(userIncomingBalance)}` : 'RM0.00'}
              />
            )}
          </DescList>
        </div>
      </Card.Content>
      <hr />
    </>
  );
}

function FleetInfo({userId}: {userId: string}) {
  const {data: userSmartPayCard, isLoading} = useSmartPayCard(userId, {
    retry: (retryCount, err: AxiosError) => err?.response?.status !== 404 && retryCount < 3,
  });

  return (
    <>
      <Card.Content className="flex" data-testid="fleet-info">
        <div className="w-36">
          <strong className="text-xs text-lightgrey">FLEET</strong>
        </div>
        <div>
          <DescList isLoading={isLoading}>
            <DescItem
              label="Wallet Balance"
              value={
                <>
                  {userSmartPayCard ? (
                    <div className="h-8 flex">
                      {' '}
                      <img src="/assets/images/logo-card/card-fleet.png" className="flex h-8" />
                      <div className="flex flex-row ml-2 py-2">
                        {maskCardNumber(userSmartPayCard[0].cardNumber)}
                        <div className="font-extrabold items-center justify-center flex">
                          &nbsp;&nbsp;.&nbsp;&nbsp;
                        </div>

                        <div data-testid="smartpay-balance">
                          {userSmartPayCard[0]?.balance
                            ? 'RM' + formatMoney(userSmartPayCard[0].balance)
                            : 'RM0.00'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    '-'
                  )}
                </>
              }
            />
            <DescItem label="Payment method" value={userSmartPayCard ? 'Smartpay' : '-'} />
          </DescList>
        </div>
      </Card.Content>
      <hr />
    </>
  );
}

function DeviceList({userId}: {userId: string}) {
  const [isDeviceListOpen, setIsDeviceListOpen] = React.useState(false);
  const [showUpdateDeviceModal, setShowUpdateDeviceModal] = React.useState(false);
  const [showDeleteDeviceModal, setShowDeleteDeviceModal] = React.useState(false);
  const {data: customerDevicesPaginatedResult, isLoading: isLoadingDevicesData} = useGetUserDevices(
    userId,
    {
      enabled: isDeviceListOpen,
      retry: (retryCount, err) => {
        const error = err as AxiosError;
        return retryCount < 3 && error?.response?.status !== 404;
      },
    },
  );
  const [selectedDeviceData, setSelectedDeviceData] = React.useState<IUpdateDeviceData>();
  React.useEffect(() => {
    switch (selectedDeviceData?.updateOrDelete) {
      case 'update':
        setShowUpdateDeviceModal(true);
        break;
      case 'delete':
        setShowDeleteDeviceModal(true);
        break;
      default:
        break;
    }
  }, [selectedDeviceData]);

  return (
    <>
      <UpdateDeviceModal
        isOpen={showUpdateDeviceModal}
        onClose={() => setShowUpdateDeviceModal(false)}
        deviceData={selectedDeviceData}
      />
      <DeleteDeviceModal
        isOpen={showDeleteDeviceModal}
        onClose={() => setShowDeleteDeviceModal(false)}
        deviceId={selectedDeviceData?.deviceId}
        id={selectedDeviceData?.id}
      />
      <Card
        className="mb-8"
        data-testid="device-list-card"
        expandable
        isOpen={isDeviceListOpen}
        onToggleOpen={() => setIsDeviceListOpen((prev) => !prev)}>
        <Card.Heading title="Device list"></Card.Heading>
        <Table isLoading={isLoadingDevicesData} skeletonRowNum={2}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>DEVICE ID</Td>
              <Td>STATUS</Td>
              <Td>USER ID</Td>
              <Td>CREATED AT</Td>
              <Td className="text-right">ACTION</Td>
            </Tr>
          </DataTableRowGroup>
          {customerDevicesPaginatedResult && customerDevicesPaginatedResult.data.length === 0 ? (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">
                  You have no data to be displayed here
                </p>
              </div>
            </DataTableCaption>
          ) : (
            customerDevicesPaginatedResult &&
            customerDevicesPaginatedResult.data.map((device) => (
              <DataTableRowGroup key={device.id}>
                <Td>
                  <Link to={`/risk-controls/account-devices/${device.id}`}>{device.deviceId}</Link>
                </Td>
                <Td>
                  <Badge data-testid="device-status" color={device.isBlocked ? 'grey' : 'success'}>
                    {device.isBlocked ? 'BLACKLISTED' : 'ACTIVE'}
                  </Badge>
                </Td>
                <Td>{device.userId}</Td>
                <Td>{formatDate(device.createdAt, {formatType: 'dateAndTime'})}</Td>

                <Td className="text-right">
                  <HasPermission accessWith={[customerRole.editDevice]}>
                    <DropdownMenu
                      variant="icon"
                      label={
                        <>
                          <DotVerticalIcon
                            data-testid="action-icon"
                            className="w-5 h-5 text-gray-500"
                          />
                        </>
                      }>
                      <DropdownMenu.Items className="min-w-32">
                        <DropdownMenu.Item
                          onSelect={() => {
                            setSelectedDeviceData({
                              id: device.id,
                              deviceId: device.deviceId,
                              updateOrDelete: 'delete',
                            });
                          }}>
                          Unlink
                        </DropdownMenu.Item>
                        {
                          <DropdownMenu.Item
                            onSelect={() => {
                              setSelectedDeviceData({
                                isBlocked: device.isBlocked,
                                deviceId: device.deviceId,
                                updateOrDelete: 'update',
                              });
                            }}>
                            {device.isBlocked ? 'Reactivate' : 'Blacklist'}
                          </DropdownMenu.Item>
                        }
                      </DropdownMenu.Items>
                    </DropdownMenu>
                  </HasPermission>
                </Td>
              </DataTableRowGroup>
            ))
          )}
        </Table>
      </Card>
    </>
  );
}

function Loyalty({userId}: {userId: string}) {
  // const {
  //   data: loyaltyMemberDetails,
  //   isFetching: isFetchingLoyaltyMemberDetails,
  // } = useGetLoyaltyMemberByUserId(userId, {
  //   retry: (_, err: AxiosError) => err?.response?.status !== 404,
  // });

  const userHasPermission = useCanReadLoyalty();

  const {data: loyaltyDetails, isLoading: isLoadingLoyaltyDetails} =
    userHasPermission && useGetCardsByUserId(userId);
  const cancelRef = React.useRef(null);

  const [isResetActivationCountDialogOpen, setResetActiviationCountDialogOpen] =
    React.useState(false);

  const {data: cardActivationLimit} = useCurrentLoyaltyCardActivationLimit(userId, {
    enabled: useHasPermission([customerRole.edit]),
  });

  const {mutate: resetCardActivationLimit, isLoading: isResetingCardActivationLimit} =
    useResetCardActivationLimit();

  return (
    <>
      {isResetActivationCountDialogOpen && (
        <Dialog
          onDismiss={() => setResetActiviationCountDialogOpen(false)}
          leastDestructiveRef={cancelRef}>
          <Dialog.Content header="Confirm reset loyalty card activation count?">
            This action cannot be undone and you will not be able to recover any data.
          </Dialog.Content>
          <Dialog.Footer>
            <Button
              ref={cancelRef}
              onClick={() => setResetActiviationCountDialogOpen(false)}
              variant="outline">
              CANCEL
            </Button>
            <Button
              variant="error"
              isLoading={isResetingCardActivationLimit}
              onClick={() =>
                resetCardActivationLimit(userId, {
                  onSuccess: () => setResetActiviationCountDialogOpen(false),
                })
              }>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
      {userHasPermission && (
        <Card.Content className="flex">
          <div className="w-36">
            <strong className="text-xs text-lightgrey">LOYALTY</strong>
          </div>
          <div>
            <DescList isLoading={isLoadingLoyaltyDetails}>
              <DescItem
                label="Loyalty point balance"
                value={
                  loyaltyDetails ? (
                    <div className="h-8 flex">
                      <Link
                        to={
                          loyaltyDetails?.provider === 'SETEL'
                            ? `/loyalty/members/${loyaltyDetails.id}`
                            : `/accounts/loyalty-cards/${loyaltyDetails.id}`
                        }>
                        <img className="h-8" src="/assets/images/logo-card/card-loyalty.png" />
                      </Link>
                      <Link
                        className="flex flex-row ml-2 py-2"
                        to={
                          loyaltyDetails?.provider === 'SETEL'
                            ? `/loyalty/members/${loyaltyDetails.id}`
                            : `/accounts/loyalty-cards/${loyaltyDetails.id}`
                        }>
                        <>{loyaltyDetails && maskCardNumber(loyaltyDetails.cardNumber)}</>
                        <div className="font-extrabold items-center justify-center flex">
                          &nbsp;&nbsp;.&nbsp;&nbsp;
                        </div>
                        <>{`${loyaltyDetails.pointBalance} pts`}</>
                        {/* <DisplayMesraBalance cardNumber={loyaltyMemberDetails.cardNumber} /> */}
                      </Link>
                    </div>
                  ) : isLoadingLoyaltyDetails ? (
                    <Skeleton />
                  ) : (
                    <div className="text-gray-500 text-xl">Loyalty Card Not Found</div>
                  )
                }
              />
              <DescItem
                label="Loyalty card activation count"
                value={
                  cardActivationLimit?.retryCount ? (
                    <>
                      {cardActivationLimit?.retryCount}
                      <BareButton
                        onClick={() => setResetActiviationCountDialogOpen(true)}
                        className="text-brand-500 inline ml-4">
                        RESET
                      </BareButton>
                    </>
                  ) : (
                    0
                  )
                }
              />
            </DescList>
          </div>
        </Card.Content>
      )}
      <hr />
    </>
  );
}

// function DisplayMesraBalance({cardNumber}: {cardNumber: string}) {
//   const {data: mesraBalance} = useGetCardBalanceByCardNumber(cardNumber);
//   return (
//     <>
//       {mesraBalance && (
//         <div className="text-lightgrey text-xs">{`${mesraBalance.pointTotalBalance} pts`}</div>
//       )}
//     </>
//   );
// }

export function VerificationStatusErrorHandler(error: AxiosError | unknown) {
  switch (error['request']['status']) {
    case 403:
      return 'UNAUTHORIZED';
    case 404:
      return 'NOT FOUND';
    default:
      return 'Error';
  }
}
