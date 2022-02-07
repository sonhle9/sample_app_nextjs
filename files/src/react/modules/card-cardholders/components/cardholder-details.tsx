import * as React from 'react';
import {
  Card,
  CardContent,
  Label,
  JsonPanel,
  CardHeading,
  formatDate,
  Badge,
  Button,
  EditIcon,
  EyeShowIcon,
  titleCase,
  TimelineItem,
  IndicatorProps,
  Timeline,
} from '@setel/portal-ui';
import {useGetCardholderDetails} from '../cardholder.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {ColorMap, EStatus, Types} from 'src/app/cards/shared/enums';
import {ButtonModalCardholder, ID_TYPE} from '../cardholder.type';
import {CardholderEditModal} from './cardholder-edit-modal';
import {countryOptions} from '../../merchants/merchant.const';
import {HasPermission} from '../../auth/HasPermission';
import {cardHolderRole} from 'src/shared/helpers/roles.type';
import {environment} from 'src/environments/environment';
import {EType} from 'src/shared/enums/card.enum';
interface ICardholderDetails {
  id: string;
}

const colorByStatus: Record<string, IndicatorProps['color']> = {
  [EStatus.ACTIVE]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.FROZEN]: 'error',
  [EStatus.CLOSED]: 'error',
  [EStatus.ISSUED]: 'success',
};

export const CardholderDetails: React.VFC<ICardholderDetails> = (props) => {
  const [modalEditCardholder, setModalEditCardholder] = React.useState(false);
  const {data, isError} = useGetCardholderDetails(props.id);
  const router = useRouter();
  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('card-issuing/cardholders');
      return;
    }
  }, [isError]);
  return (
    <>
      <HasPermission accessWith={[cardHolderRole.read]}>
        <div className="grid gap-4 pt-8 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between">
            <h1 className="text-2xl font-medium leading-8">Cardholder details</h1>
          </div>
          <Card className="mb-4">
            <div className='class="px-4 py-4 sm:px-7 border-b border-gray-200"'>
              <div className="flex items-center justify-between flex-wrap sm:flex-no-wrap">
                <div className="text-xl leading-6 pr-2 py-2 font-medium text-black">
                  {data?.name ? data?.name : data?.displayName ? data?.displayName : ''}
                </div>
                <div className="flex items-center">
                  <HasPermission accessWith={[cardHolderRole.update]}>
                    <Button
                      variant="outline"
                      leftIcon={<EditIcon />}
                      minWidth="none"
                      onClick={() => {
                        data?.card?.type === Types.Fleet
                          ? window.open(
                              `${environment.pdbWebDashboardUrl}/card-issuing/cardholders?merchantId=${data?.merchantId}&cardholderId=${data?.id}&editCardholder=true&redirect-from=admin`,
                              '_blank',
                            )
                          : setModalEditCardholder(true);
                      }}>
                      EDIT
                    </Button>
                  </HasPermission>
                </div>
              </div>
            </div>
            <CardContent>
              {data && (
                <>
                  <div className="flex flex-col space-y-4 py-2">
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Name</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.name || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Display name</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.displayName || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Salutation</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.salutation || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>ID type</Label>
                      </div>
                      <div className="flex-1 text-sm">
                        {' '}
                        {data?.idType
                          ? ID_TYPE.find((type) => data?.idType === type?.value)?.label
                          : '-'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>ID number</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.idNumber || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Email</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.email || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Phone number</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.phoneNumber || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Address line 1</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.address1 || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Address line 2</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.address2 || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>City</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.city || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Postcode</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.postcode || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>State</Label>
                      </div>
                      <div className="flex-1 text-sm">{data?.state || '-'}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Country</Label>
                      </div>
                      <div className="flex-1 text-sm">
                        {data?.country
                          ? countryOptions.find((country) => data?.country === country?.value)
                              ?.value +
                            ' - ' +
                            countryOptions.find((country) => data?.country === country?.value)
                              ?.label
                          : '-'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Created on</Label>
                      </div>
                      <div className="flex-1 text-sm">
                        {data?.createdAt ? formatDate(new Date(data?.createdAt)) : '-'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/5">
                        <Label>Last updated on</Label>
                      </div>
                      <div className="flex-1 text-sm">
                        {data?.updatedAt ? formatDate(new Date(data?.updatedAt)) : '-'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="mb-4 hidden">
            <CardHeading title="Timeline"></CardHeading>
            <CardContent>
              <Timeline>
                {data?.card?.timeline?.map((item, index) => (
                  <TimelineItem
                    title={<div className="text-sm"> {titleCase(item.status)} </div>}
                    description={
                      <>
                        <div className="text-xs">{item?.data?.updatedBy || ''}</div>
                        <div className="text-xs">{formatDate(item.date)}</div>
                      </>
                    }
                    color={colorByStatus[item.status] || 'purple'}
                    key={index}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
          {data?.card && (
            <Card className="mb-4">
              <CardHeading title="Card details">
                {data.card.type === EType.FLEET ? (
                  <a
                    target="_blank"
                    href={`${environment.pdbWebDashboardUrl}/card-issuing/cards?merchantId=${data.merchantId}&cardId=${data?.card?.id}&redirect-from=admin`}>
                    <Button variant="outline" leftIcon={<EyeShowIcon />} minWidth="none">
                      <div className="text-xs">VIEW DETAILS</div>
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    leftIcon={<EyeShowIcon />}
                    minWidth="none"
                    onClick={() => {
                      router.navigateByUrl(`/card-issuing/cards/${data?.card?.id}`);
                    }}>
                    <div className="text-xs">VIEW DETAILS</div>
                  </Button>
                )}
              </CardHeading>
              <CardContent>
                <div className="flex flex-col space-y-4 py-2">
                  <div className="flex">
                    <div className="w-1/5">
                      <Label>Card no.</Label>
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="float-left w-16 h-8 pr-4">
                        <img
                          style={{top: -5}}
                          src={`assets/images/logo-card/card-${data?.card?.type}.png`}
                          className="w-11 h-7 relative"
                        />
                      </div>
                      {data?.card?.cardNumber || '-'}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/5">
                      <Label>Status</Label>
                    </div>
                    <div className="flex-1 text-sm">
                      {data?.card?.status ? (
                        <Badge
                          color={ColorMap[data?.card?.status]}
                          rounded="rounded"
                          className="uppercase">
                          {data?.card?.status}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/5">
                      <Label>Created on</Label>
                    </div>
                    <div className="flex-1 text-sm">
                      {data?.card?.createdAt ? formatDate(data?.card?.createdAt) : '-'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="hidden mb-4">
            <CardHeading title="Vehicle details">
              <Button variant="outline" leftIcon={<EyeShowIcon />} minWidth="none">
                <div className="text-xs">VIEW DETAILS</div>
              </Button>
            </CardHeading>
            <CardContent>
              <div className="flex flex-col space-y-4 py-2">
                <div className="flex">
                  <div className="w-1/5">
                    <Label>Vehicle reg. no.</Label>
                  </div>
                  <div className="flex-1 text-sm"></div>
                </div>
                <div className="flex">
                  <div className="w-1/5">
                    <Label>Vehicle details</Label>
                  </div>
                  <div className="flex-1 text-sm"></div>
                </div>
                <div className="flex">
                  <div className="w-1/5">
                    <Label>Created on</Label>
                  </div>
                  <div className="flex-1 text-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          {modalEditCardholder && (
            <CardholderEditModal
              visible={modalEditCardholder}
              mode={ButtonModalCardholder.EDIT}
              cardholder={data}
              onClose={() => {
                setModalEditCardholder(false);
              }}
            />
          )}
          <JsonPanel allowToggleFormat json={Object.assign({...data})} />
        </div>
      </HasPermission>
    </>
  );
};
