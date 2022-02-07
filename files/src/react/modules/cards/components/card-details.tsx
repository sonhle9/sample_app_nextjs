import {
  Button,
  classes,
  formatDate,
  Tabs,
  Card,
  Modal,
  DescList,
  DescItem,
  Text,
  Badge,
  formatMoney,
  EditIcon,
  JsonPanel,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {EType, SubtypeMap} from 'src/shared/enums/card.enum';
import {useCardDetails, useGetCardRestriction} from '../card.queries';
import {ColorMap, EStatus, Reason} from 'src/app/cards/shared/enums';
import {CardTimeline} from './card-timeline';
import {CardCardholderDetails} from './card-cardholder-details';
import {CardEditModal} from './card-edit-modal';
import CardRestrictionDetails from './card-restriction-details';
import CardTransferDetails from './card-transfer-details';
import {TabMode, ERestrictionType} from '../card.type';
import CardRestrictionEdit from './card-restriction-edit-modal';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import CardAdjustmentDetails from './card-adjustment-details';

export type CardStatusProps = {
  status: EStatus;
};

interface ICardDetailsProps {
  id: string;
}

export const CardDetails = (props: ICardDetailsProps) => {
  const {data: card, isError: isCardError} = useCardDetails(props.id);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [showEditRestrictionForm, setShowEditRestrictionForm] = React.useState(false);
  const {data: cardRestriction} = useGetCardRestriction(ERestrictionType.CARD, props.id);
  const router = useRouter();
  React.useEffect(() => {
    if (isCardError) {
      router.navigateByUrl('card-issuing/cards');
      return;
    }
  }, [card, isCardError]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <HasPermission accessWith={[cardRole.read]}>
          <>
            <div className="justify-between mt-3">
              <h1 className={classes.h1}>Card details</h1>
            </div>
            <Card className="mb-6">
              <Card.Heading
                title={
                  <span className="text-xl">
                    {card &&
                      (card.type === EType.FLEET
                        ? `${
                            SubtypeMap.find((subtype) => subtype.value === card.subtype)?.label
                          } - ${card.cardNumber}`
                        : `${card.cardNumber}`)}
                  </span>
                }>
                {card?.type === EType.GIFT && (
                  <HasPermission accessWith={[cardRole.update]}>
                    <Button
                      variant="outline"
                      minWidth={'none'}
                      disabled={card?.status === EStatus.CLOSED}
                      onClick={() => {
                        setVisibleModal(true);
                      }}
                      leftIcon={<EditIcon className="block w-3.5 h-3.5 mr-3" />}>
                      EDIT
                    </Button>
                  </HasPermission>
                )}
              </Card.Heading>
              <Card.Content className="p-7">
                <div>
                  <div className="grid grid-cols-7 pb-3">
                    <Text
                      color="lightgrey"
                      className="uppercase font-semibold tracking-widest text-xs w-44">
                      General
                    </Text>
                    <DescList className="col-span-5 pl-5">
                      <DescItem
                        label="Status"
                        labelClassName="text-sm"
                        value={
                          card?.status && (
                            <Badge
                              className="tracking-wider font-semibold uppercase"
                              rounded="rounded"
                              color={ColorMap[card.status]}
                              style={{width: 'fit-content'}}>
                              {card.status}
                            </Badge>
                          )
                        }
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal"
                        label="Reason code"
                        value={
                          (card?.reason &&
                            (Object.values(Reason).includes(card?.reason as Reason)
                              ? titleCase(card?.reason)
                              : Reason.Others)) ||
                          '-'
                        }
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal"
                        label="Remarks"
                        value={card?.remark || '-'}
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal capitalize"
                        label="Type"
                        value={card?.type || '-'}
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal capitalize"
                        label="Form factor"
                        value={card?.formFactor || '-'}
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal capitalize"
                        label="Physical card type"
                        value={card?.physicalType || '-'}
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal"
                        label="Subtype"
                        value={
                          card?.subtype
                            ? SubtypeMap.find((subtype) => subtype.value === card.subtype)?.label
                            : '-'
                        }
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal"
                        label="Card groups"
                        value={card?.cardGroup?.name || '-'}
                      />
                      <DescItem
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal"
                        label="Merchant name"
                        value={card?.merchant?.name || '-'}
                      />
                    </DescList>
                  </div>

                  <div className="divide-y py-2">
                    <div />
                    <div className="text-center py-2 border-gray-200" />
                  </div>

                  <div className="grid grid-cols-7 pb-3">
                    <Text
                      className="uppercase font-semibold tracking-widest text-xs w-44"
                      color="lightgrey">
                      FINANCIAL
                    </Text>

                    <DescList className="col-span-5 pl-5">
                      <DescItem
                        label="Available card balance"
                        value={`RM${formatMoney(card?.cardBalance?.balance) || '0'}`}
                        labelClassName="text-sm w-36"
                        valueClassName="text-sm font-normal capitalize"
                      />
                      <DescItem
                        label="Card limit (Wallet size)"
                        value={`RM${formatMoney(card?.maximumBalance) || '0'}`}
                        labelClassName="text-sm w-24"
                        valueClassName="text-sm font-normal capitalize"
                      />
                    </DescList>
                  </div>

                  <div className="divide-y py-2">
                    <div />
                    <div className="text-center py-2 border-gray-200" />
                  </div>

                  <div className="grid grid-cols-7">
                    <Text
                      className="uppercase font-semibold tracking-widest text-xs w-44"
                      color="lightgrey">
                      OTHERS
                    </Text>
                    <DescList className="col-span-5 pl-5">
                      <DescItem
                        label="Created on"
                        value={card?.createdAt && formatDate(card.createdAt)}
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal capitalize"
                      />
                      <DescItem
                        label="Expires on"
                        value={
                          (card?.expiryDate &&
                            formatDate(card.expiryDate, {
                              format: 'MMM yyyy',
                            })) ||
                          '-'
                        }
                        labelClassName="text-sm"
                        valueClassName="text-sm font-normal capitalize"
                      />
                    </DescList>
                  </div>
                </div>
              </Card.Content>
            </Card>
            {card && card.timeline && <CardTimeline timelines={card.timeline} className="mb-6" />}
            {card?.type === EType.GIFT && (
              <CardAdjustmentDetails
                cardNumber={card.cardNumber}
                cardId={card.id}
                className="mb-6"
              />
            )}
            {card?.type === EType.GIFT && (
              <CardTransferDetails cardNumber={card.cardNumber} cardId={card.id} className="mb-6" />
            )}
            {card && card.cardholder && (
              <CardCardholderDetails cardholder={card.cardholder} className="mb-6" />
            )}
            <HasPermission accessWith={[cardRole.restriction_view]}>
              {card?.type === EType.GIFT && (
                <>
                  <p className="text-mediumgrey text-lg font-medium leading-relaxed">
                    Restrictions
                  </p>
                  <Card className="mb-6">
                    {cardRestriction?.velocity &&
                      Object.keys(cardRestriction?.velocity).length > 0 && (
                        <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
                          <div className="flex items-center">Velocity check restrictions</div>
                          <HasPermission accessWith={[cardRole.restriction_update]}>
                            <Button
                              variant={'outline'}
                              minWidth={'none'}
                              leftIcon={<EditIcon className="block w-3.5 h-3.5 mr-3" />}
                              onClick={() => {
                                setShowEditRestrictionForm(true);
                              }}
                              data-testid="open-modal-velocity">
                              EDIT
                            </Button>
                          </HasPermission>
                        </div>
                      )}

                    <Tabs>
                      <Tabs.TabList>
                        <Tabs.Tab label="Daily limit" />
                        <Tabs.Tab label="Monthly limit" />
                        <Tabs.Tab label="Others" />
                      </Tabs.TabList>
                      <Tabs.Panels>
                        <div className="m-7">
                          <Tabs.Panel>
                            <CardRestrictionDetails
                              card={card}
                              cardID={props.id}
                              mode={TabMode.DAILY_LIMIT}
                              cardRestriction={cardRestriction}
                              className="mb-6"
                            />
                          </Tabs.Panel>
                          <Tabs.Panel>
                            <CardRestrictionDetails
                              card={card}
                              cardID={props.id}
                              mode={TabMode.MONTHLY_LIMIT}
                              cardRestriction={cardRestriction}
                              className="mb-6"
                            />
                          </Tabs.Panel>
                          <Tabs.Panel>
                            <CardRestrictionDetails
                              card={card}
                              cardID={props.id}
                              mode={TabMode.OTHERS}
                              cardRestriction={cardRestriction}
                              className="mb-6"
                            />
                          </Tabs.Panel>
                        </div>
                      </Tabs.Panels>
                    </Tabs>
                  </Card>
                </>
              )}
            </HasPermission>
            <JsonPanel className="mb-36" allowToggleFormat json={Object.assign({...card})} />
          </>
        </HasPermission>
      </div>
      {visibleModal && (
        <CardEditModal
          visible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
          }}
          card={card}
        />
      )}
      <Modal
        isOpen={showEditRestrictionForm}
        onDismiss={() => setShowEditRestrictionForm(false)}
        aria-label="Edit velocity check restrictions"
        showCloseBtn={true}>
        <CardRestrictionEdit
          belongTo={props.id}
          cardRestriction={cardRestriction}
          onClose={() => {
            setShowEditRestrictionForm(false);
          }}
        />
      </Modal>
    </>
  );
};
