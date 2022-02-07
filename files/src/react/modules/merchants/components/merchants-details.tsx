import {
  Badge,
  Button,
  Card,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescList,
  EditIcon,
  formatDate,
  formatMoney,
  Modal,
  Text,
  Timeline,
  titleCase,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
} from '@setel/portal-ui';
import {getCountry, getTimezone} from 'countries-and-timezones';
import * as React from 'react';
import {Switch} from 'src/react/components/switch';
import {useNotification} from 'src/react/hooks/use-notification';
import {toFirstUpperCase} from 'src/shared/helpers/common';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {EnterpriseNameEnum} from '../../../../shared/enums/enterprise.enum';
import {EnableTransactionValues, MerchantTypeCodes} from '../../../../shared/enums/merchant.enum';
import {merchantTrans} from '../../../../shared/helpers/pdb.roles.type';
import {useRouter} from '../../../routing/routing.context';
import {HasPermission} from '../../auth/HasPermission';
import {ICustomFieldRule} from '../../custom-field-rules';
import {MerchantsFeePlansPaymentMethod} from '../../fee-plans/components/fee-plans-payment-methods/merchants-fee-plans-payment-method';
import categoryCodeMapping from '../merchant-category-code.json';
import {MerchantStatus, UpdateMerchantMessage} from '../merchant.const';
import {
  capitalizeFirstLetter,
  computeMerchantPrepaidBalance,
  getMerchantStatusBadgeColor,
  getMerchantTimelineColor,
} from '../merchants.lib';
import {useMerchantDetails, useMerchantType, useUpdateProductMerchant} from '../merchants.queries';
import {MerchantGiftsOfferingKey, PRODUCT_OFFERINGS} from '../merchants.type';
import {EditContactInfoForm} from './edit-contact-info-form';
import {EditFinancialForm} from './edit-financial-form';
import {MerchantDetailExternalTopup} from './merchants-detail-external-topup';
import {MerchantsDetailsAdjustment} from './merchants-details-adjustment';
import {UpdateMerchantDetailsForm} from './update-merchant-form';
import {SftpConnection, SftpTargetType} from '../../partner-sftp';

interface IMerchantDetailsProps {
  id: string;
  typeName?: string;
  userEmail?: string;
}

export function MerchantDetails(props: IMerchantDetailsProps) {
  const {data: merchant, isError: isMerchantError, isLoading} = useMerchantDetails(props.id);
  const [showEditMerchantForm, setShowEditMerchantForm] = React.useState(false);
  const [showEditFinancialForm, setShowEditFinancialForm] = React.useState(false);
  const [showEditContactInfoForm, setShowEditContactInfoForm] = React.useState(false);

  const isPDB = CURRENT_ENTERPRISE.name === EnterpriseNameEnum.PDB;

  const typeId = merchant && merchant.typeId;
  const {data: merchantType} = useMerchantType(typeId);

  let isTransactionEnabled =
    merchant?.status !== MerchantStatus.DELETED &&
    !(
      merchantType?.code === MerchantTypeCodes.GIFT_CARD_CLIENT &&
      merchant?.status !== EnableTransactionValues.ACTIVE
    );

  const isSmartPayAccount = merchant?.merchantType?.code === 'smartPayAccount';

  const merchantCategoryCode = merchant && merchant.merchantCategoryCode;

  const countryCode = merchant && merchant.countryCode;
  const countryDisplay = React.useMemo(() => {
    if (!countryCode) {
      return '-';
    }
    const country = getCountry(countryCode);
    return country ? country.name : '';
  }, [countryCode]);

  const timezone = merchant && merchant.timezone;
  const timezoneDisplay = React.useMemo(() => {
    if (!timezone) {
      return '-';
    }
    const tzDetails = getTimezone(timezone);

    return tzDetails ? `(${tzDetails.utcOffsetStr}) ${timezone}` : timezone;
  }, [timezone]);

  const {mutate: updateProductMerchant} = useUpdateProductMerchant(props.id);

  const showMessage = useNotification();

  const updateMerchantSwitcher = (product: string, enable: boolean) => {
    updateProductMerchant(
      {
        product,
        enable,
      },
      {
        onSuccess: () => {
          showMessage({
            title: 'Updated',
          });
        },
        onError: (error: any) => {
          showMessage({
            variant: 'error',
            title: 'Failed',
            description: error?.message,
          });
        },
      },
    );
  };

  const categoryCodeDescription = React.useMemo(() => {
    if (!merchantCategoryCode) {
      return '-';
    }

    const mapping = categoryCodeMapping.find((m) => m.code === merchantCategoryCode);

    return mapping ? `${mapping.code} - ${mapping.desc}` : '';
  }, [merchantCategoryCode]);

  const router = useRouter();

  React.useEffect(() => {
    if (isMerchantError) {
      router.navigateByUrl('merchants');
      return;
    }
  }, [merchant, isMerchantError]);

  const rowClasses =
    'table-cell px-4 sm:first:pl-7 sm:last:pr-7 whitespace-no-wrap text-sm font-normal leading-snug';

  const [giftExpanded, setGiftExpanded] = React.useState(false);

  return (
    <>
      <div className="flex justify-between mb-8">
        <h1 className={classes.h1}>{`${props.typeName || 'Merchant'} details`}</h1>
      </div>

      <Card className="mb-8">
        <Card.Heading title={`${props.id} - ${merchant?.name}`}>
          {merchant?.status !== MerchantStatus.DELETED && (
            <Button
              onClick={() => setShowEditMerchantForm(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        {merchant && (
          <Modal
            isOpen={showEditMerchantForm}
            onDismiss={() => setShowEditMerchantForm(false)}
            aria-label="Edit merchant details">
            <Modal.Header>Edit merchant details</Modal.Header>
            <UpdateMerchantDetailsForm
              userEmail={props.userEmail}
              merchantId={props.id}
              onDone={(message) => {
                setShowEditMerchantForm(false);
                message === UpdateMerchantMessage.DELETED
                  ? showMessage({
                      title: 'Success',
                      description: 'Merchant is no longer available for interaction',
                    })
                  : showMessage({
                      title: 'Updated',
                    });
              }}
              onCancel={() => setShowEditMerchantForm(false)}
              merchant={merchant}
            />
          </Modal>
        )}
        <Card.Content>
          <DescList isLoading={isLoading} className={'pt-3'}>
            {merchant?.logoUrl && (
              <DescList.Item
                label="Merchant logo"
                value={<img src={merchant.logoUrl} alt="logo" className="w-16 lg:w-24 h-auto" />}
              />
            )}
            <DescList.Item
              label="Status"
              value={
                merchant?.status ? (
                  <Badge
                    className={'uppercase'}
                    color={getMerchantStatusBadgeColor(merchant.status)}>
                    {merchant.status}
                  </Badge>
                ) : (
                  '-'
                )
              }
            />
            <DescList.Item
              label="Reason code"
              value={merchant?.reason ? titleCase(merchant.reason).replaceAll('_', ' ') : '-'}
            />
            <DescList.Item label="Remark" value={merchant?.remark || '-'} />
            <DescList.Item label="Name" value={merchant?.name} />
            <DescList.Item label="Legal name" value={merchant?.legalName} />
            <DescList.Item label="ID" value={merchant?.merchantId} />
            <DescList.Item label="Type" value={merchant?.merchantType?.name || '-'} />
            <DescList.Item label="Merchant category code" value={categoryCodeDescription} />
            <DescList.Item label={'Site name ID'} value={merchant?.siteNameId || '-'} />
            {merchant?.businessRegistrationNo && (
              <DescList.Item
                label="Business registration number format"
                value={
                  merchant?.businessRegistrationType
                    ? toFirstUpperCase(merchant?.businessRegistrationType)
                    : '-'
                }
              />
            )}
            <DescList.Item
              label="Business registration number"
              value={merchant?.businessRegistrationNo || '-'}
            />
            <DescList.Item label="Sales territory" value={merchant?.saleTerritory?.name || '-'} />
            <DescList.Item label="Country" value={countryDisplay} />
            <DescList.Item label="Timezone" value={timezoneDisplay} />
            <DescList.Item
              label="Created on"
              value={merchant ? formatDate(new Date(merchant.createdAt)) : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card isLoading={isLoading} className="mb-8">
        <Card.Heading title="Financial">
          {merchant?.status !== MerchantStatus.DELETED && (
            <Button
              data-testid={'edit-financial-btn'}
              onClick={() => setShowEditFinancialForm(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        {merchant && (
          <Modal
            isOpen={showEditFinancialForm}
            onDismiss={() => setShowEditFinancialForm(false)}
            aria-label="Edit financial">
            <Modal.Header>Edit financial</Modal.Header>
            <EditFinancialForm
              merchantId={props.id}
              onDone={() => {
                setShowEditFinancialForm(false);
                showMessage({
                  title: 'Updated',
                });
              }}
              onCancel={() => setShowEditFinancialForm(false)}
              merchant={merchant}
            />
          </Modal>
        )}
        <Card.Content>
          <DescList isLoading={isLoading} className={'pt-3'}>
            <DescList.Item
              label="Credit limit"
              value={
                merchant?.creditLimit === undefined ? '-' : `RM${formatMoney(merchant.creditLimit)}`
              }
            />
            <DescList.Item
              label="Prepaid balance"
              value={merchant ? `RM${formatMoney(computeMerchantPrepaidBalance(merchant))}` : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card isLoading={isLoading} className="mb-8">
        <Card.Heading title="Contact info">
          {merchant?.status !== MerchantStatus.DELETED && (
            <Button
              data-testid={'edit-contact-info-btn'}
              onClick={() => setShowEditContactInfoForm(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        {merchant && (
          <Modal
            isOpen={showEditContactInfoForm}
            onDismiss={() => setShowEditContactInfoForm(false)}
            aria-label="Edit contact info">
            <Modal.Header>Edit contact info</Modal.Header>
            <EditContactInfoForm
              merchantId={props.id}
              onDone={() => {
                setShowEditContactInfoForm(false);
                showMessage({
                  title: 'Updated',
                });
              }}
              onCancel={() => setShowEditContactInfoForm(false)}
              merchant={merchant}
            />
          </Modal>
        )}
        <Card.Content>
          <DescList isLoading={isLoading} className={'pt-3'}>
            <DescList.Item
              label="Address line 1"
              value={merchant?.contactInfo?.addressLine1 || '-'}
            />
            <DescList.Item
              label="Address line 2"
              value={merchant?.contactInfo?.addressLine2 || '-'}
            />
            <DescList.Item
              label="Address line 3"
              value={merchant?.contactInfo?.addressLine3 || '-'}
            />
            <DescList.Item
              label="Address line 4"
              value={merchant?.contactInfo?.addressLine4 || '-'}
            />
            <DescList.Item
              label="Address line 5"
              value={merchant?.contactInfo?.addressLine5 || '-'}
            />
            <DescList.Item label="City" value={merchant?.contactInfo?.city || '-'} />
            <DescList.Item label="Postcode" value={merchant?.contactInfo?.postcode || '-'} />
            <DescList.Item
              label="State"
              value={capitalizeFirstLetter(merchant?.contactInfo?.state || '-')}
            />
            <DescList.Item
              label="Country"
              value={titleCase(merchant?.contactInfo?.country || '-')}
            />
            <DescList.Item label="Contact no" value={merchant?.contactInfo?.contactNo || '-'} />
            <DescList.Item label="Email" value={merchant?.contactInfo?.email || '-'} />
            <DescList.Item
              label="Person in charge"
              value={merchant?.contactInfo?.personInCharge || '-'}
            />
            <DescList.Item
              label="PIC contact no."
              value={merchant?.contactInfo?.picContactNo || '-'}
            />
            <DescList.Item
              label="Authorized signatory"
              value={merchant?.contactInfo?.authorizedSignatory || '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      {isPDB && (
        <>
          <HasPermission accessWith={[merchantTrans.view_topup]}>
            <MerchantDetailExternalTopup
              merchantId={props.id}
              merchant={merchant}
              transactionEnabled={isTransactionEnabled}
            />
          </HasPermission>
          <HasPermission accessWith={[merchantTrans.view_adjustment]}>
            <MerchantsDetailsAdjustment
              merchantId={props.id}
              merchant={merchant}
              transactionEnabled={isTransactionEnabled}
            />
          </HasPermission>
        </>
      )}
      <div className="my-8">
        <DataTable heading={<Card.Heading title="Product offerings" />}>
          <DataTableRowGroup>
            {PRODUCT_OFFERINGS.map((item, index) => (
              <Tr key={index}>
                <div className={rowClasses}>
                  {merchant && (
                    <Switch
                      label={
                        item.key === MerchantGiftsOfferingKey.giftsEnabled ? (
                          <ExpandGroup>
                            Gifts{' '}
                            <ExpandButton
                              className={'ml-2'}
                              onClick={() => setGiftExpanded(!giftExpanded)}
                            />
                          </ExpandGroup>
                        ) : (
                          item.label
                        )
                      }
                      on={merchant.productOfferings[item.key]}
                      onChangeValue={(isCheck) => {
                        updateMerchantSwitcher(item.key, isCheck);
                      }}
                      wrapperClass="px-2"
                      disabled={merchant?.status === MerchantStatus.DELETED}
                    />
                  )}
                  {giftExpanded && item.key === MerchantGiftsOfferingKey.giftsEnabled && (
                    <div className={'mx-4 mb-3 border rounded-lg border-gray-200 bg-white'}>
                      <Switch
                        label={'Deals'}
                        wrapperClass="px-4 border-b border-gray-200"
                        on={merchant.productOfferings[MerchantGiftsOfferingKey.giftsDealsEnabled]}
                        onChangeValue={(isCheck) => {
                          updateMerchantSwitcher(
                            MerchantGiftsOfferingKey.giftsDealsEnabled,
                            isCheck,
                          );
                        }}
                        disabled={
                          merchant?.status === MerchantStatus.DELETED ||
                          !merchant.productOfferings[MerchantGiftsOfferingKey.giftsEnabled]
                        }
                      />
                      <Switch
                        label={'Merchant'}
                        wrapperClass="px-4 border-b border-gray-200"
                        on={
                          merchant.productOfferings[MerchantGiftsOfferingKey.giftsMerchantEnabled]
                        }
                        onChangeValue={(isCheck) => {
                          updateMerchantSwitcher(
                            MerchantGiftsOfferingKey.giftsMerchantEnabled,
                            isCheck,
                          );
                        }}
                        disabled={
                          merchant?.status === MerchantStatus.DELETED ||
                          !merchant.productOfferings[MerchantGiftsOfferingKey.giftsEnabled]
                        }
                      />
                      <Switch
                        label={'Top-up'}
                        wrapperClass="px-4"
                        on={merchant.productOfferings[MerchantGiftsOfferingKey.giftsTopupEnabled]}
                        onChangeValue={(isCheck) => {
                          updateMerchantSwitcher(
                            MerchantGiftsOfferingKey.giftsTopupEnabled,
                            isCheck,
                          );
                        }}
                        disabled={
                          merchant?.status === MerchantStatus.DELETED ||
                          !merchant.productOfferings[MerchantGiftsOfferingKey.giftsEnabled]
                        }
                      />
                    </div>
                  )}
                </div>
              </Tr>
            ))}
          </DataTableRowGroup>
        </DataTable>
      </div>
      {merchant && (
        <>
          <MerchantCustomFieldSettings
            merchantId={props.id}
            customFields={merchant.customFields || []}
          />
        </>
      )}

      {props.id && !isSmartPayAccount && <MerchantsFeePlansPaymentMethod merchantId={props.id} />}
      {props.id && <SftpConnection targetId={props.id} targetType={SftpTargetType.MERCHANT} />}
      <Card className={'my-8'}>
        <Card.Heading title={'Timeline'} />
        <Card.Content>
          <Timeline>
            {merchant?.timeline && merchant.timeline.length > 0 ? (
              merchant.timeline.map((timeline, index) => {
                return (
                  <Timeline.Item
                    key={index}
                    title={<span className={'text-sm'}>{titleCase(timeline.status)}</span>}
                    description={
                      <>
                        {timeline.email && (
                          <p className={'text-xs text-black'}>Updated by: {timeline.email}</p>
                        )}
                        <p className={'text-xs'}>{formatDate(timeline.updatedAt)}</p>
                      </>
                    }
                    color={getMerchantTimelineColor(timeline.status)}
                  />
                );
              })
            ) : (
              <div className="py-4">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            )}
          </Timeline>
        </Card.Content>
      </Card>
    </>
  );
}

const MerchantCustomFieldSettings = ({
  customFields = [],
}: {
  merchantId: string;
  customFields?: ICustomFieldRule[];
}) => {
  return (
    <Card className="my-8">
      <Card.Heading title={'Custom fields'} />
      <Text color={'black'} className="px-7 py-6 text-sm text-center">
        Custom fields can be defined for cases such as custom references, account numbers, or any
        other additional information
      </Text>
      <Card.Content className={'px-0 py-0'}>
        <DataTable data-testid="custom-fields">
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className={'pl-7 w-2/4'}>Field name</Td>
              <Td className={'text-right pr-8'}>Value</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {customFields.map((f, index) => (
              <Tr key={index}>
                <Td className={'pl-7 w-2/4'}>{f.fieldLabel}</Td>
                <Td className={'text-right pr-8'}>
                  {Array.isArray(f.value) ? f.value.join(', ') : f.value}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
          {customFields?.length === 0 && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-9 text-sm text-gray-400">
                No data available.
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </Card.Content>
    </Card>
  );
};
