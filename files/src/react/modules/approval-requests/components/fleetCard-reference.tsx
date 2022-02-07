import {
  Card,
  CardHeading,
  CardContent,
  DescList,
  DescItem,
  Fieldset,
  titleCase,
  Badge,
  formatDate,
  Toggle,
  Label,
  ExternalIcon,
  BareButton,
} from '@setel/portal-ui';
import * as React from 'react';
import {useCardDetails} from '../../cards/card.queries';
import {EApprovalRequestsStatus} from '../approval-requests.enum';
import {useUpdateRawRequest} from '../approval-requests.queries';
import {IApprovalRequests} from '../approval-requests.type';
import {environment} from 'src/environments/environment';
import {ColorMap} from 'src/app/cards/shared/enums';
import {FleetPlan} from '../../cards/card.type';

interface IFleetCardReference {
  approvalRequest: IApprovalRequests;
  isApprover: boolean;
  isAccess: boolean;
}

const FleetCardReference: React.VFC<IFleetCardReference> = (props: IFleetCardReference) => {
  const {data: card} = useCardDetails(props.approvalRequest.rawRequest.cardId);
  const {mutate: updateRawRequest} = useUpdateRawRequest(props.approvalRequest.id);
  const {data: cardReplacedWith} = useCardDetails(
    props.approvalRequest.rawRequest?.cardReplacedWith,
  );
  const [cardReplacementFee, setCardReplacementFee] = React.useState(false);
  return (
    <Card className="mb-4">
      <CardHeading title="Reference"></CardHeading>
      <CardContent>
        <Fieldset legend={<span className="w-10 block">MERCHANT DETAILS</span>}>
          <DescList className="px-8 pt-2 py-7">
            <DescItem label="Merchant ID" value={card?.merchantId || '-'} />
            <DescItem label="Merchant name" value={card?.merchant?.name || '-'} />
          </DescList>
        </Fieldset>
        <Fieldset legend="EXISTING" borderTop>
          <DescList className="px-8 pt-2 py-7">
            <DescItem
              label="Card details"
              value={
                card?.type && (
                  <>
                    <div className="float-left w-14 h-7 pr-4">
                      <img
                        style={{top: -5}}
                        src={`assets/images/logo-card/card-${
                          (card?.merchant?.smartPayAccountAttributes?.fleetPlan ||
                            card?.merchant?.fleetPlan) === FleetPlan.POSTPAID
                            ? FleetPlan.POSTPAID
                            : FleetPlan.PREPAID
                        }.png`}
                        className="w-full h-7 relative"
                      />
                    </div>
                    <div className="inline-block">
                      <div>
                        {card?.cardNumber} · Expires on:
                        {(card?.expiryDate &&
                          formatDate(card.expiryDate, {
                            format: ' MMM yyyy',
                          })) ||
                          '-'}
                        <BareButton
                          className="text-brand-500 pl-2 pb-2"
                          onClick={() => {
                            card &&
                              window.open(
                                `${environment.pdbWebDashboardUrl}/card-issuing/cards?merchantId=${card?.merchantId}&cardId=${card.id}&redirect-from=admin`,
                                '_blank',
                              );
                          }}>
                          <ExternalIcon className="w-4 h-4 mb-1 inline-block" />
                        </BareButton>
                      </div>
                    </div>
                  </>
                )
              }
            />
            <DescItem
              label="Card status"
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
              label="Reason code"
              value={titleCase(props.approvalRequest.rawRequest?.reason || '')}
            />
            <DescItem label="Remarks" value={props.approvalRequest?.rawRequest?.remark || '-'} />
          </DescList>
        </Fieldset>

        {props.approvalRequest.status === EApprovalRequestsStatus.APPROVED && (
          <Fieldset legend="REPLACEMENT" borderTop>
            <DescList className="px-8 pt-2 py-7">
              <DescItem
                label="Replacing"
                value={
                  cardReplacedWith?.type && (
                    <>
                      <div className="float-left w-14 h-7 pr-4">
                        <img
                          style={{top: -5}}
                          src={`assets/images/logo-card/card-${
                            (cardReplacedWith?.merchant?.smartPayAccountAttributes?.fleetPlan ||
                              cardReplacedWith?.merchant?.fleetPlan) === FleetPlan.POSTPAID
                              ? FleetPlan.POSTPAID
                              : FleetPlan.PREPAID
                          }.png`}
                          className="w-full h-7 relative"
                        />
                      </div>{' '}
                      <div className="inline-block">
                        <div>
                          {cardReplacedWith?.cardNumber} · Expires on:
                          {(cardReplacedWith?.expiryDate &&
                            formatDate(cardReplacedWith.expiryDate, {
                              format: ' MMM yyyy',
                            })) ||
                            '-'}
                          <BareButton
                            className="text-brand-500 pl-2 pb-2"
                            onClick={() => {
                              cardReplacedWith &&
                                window.open(
                                  `${environment.pdbWebDashboardUrl}/card-issuing/cards?merchantId=${cardReplacedWith?.merchantId}&cardId=${cardReplacedWith.id}&redirect-from=admin`,
                                  '_blank',
                                );
                            }}>
                            <ExternalIcon className="w-4 h-4 mb-1 inline-block" />
                          </BareButton>
                        </div>
                      </div>
                    </>
                  )
                }
              />
              <DescItem
                label="Card status"
                value={
                  cardReplacedWith?.status && (
                    <Badge
                      className="tracking-wider font-semibold uppercase"
                      rounded="rounded"
                      color={ColorMap[cardReplacedWith.status]}
                      style={{width: 'fit-content'}}>
                      {cardReplacedWith.status}
                    </Badge>
                  )
                }
              />
            </DescList>
          </Fieldset>
        )}
        <Fieldset legend="OTHERS" borderTop>
          <DescList className="px-8 py-2">
            <DescItem
              label="Replacement fee"
              value={
                <div className="flex items-center">
                  <Toggle
                    on={cardReplacementFee}
                    disabled={props.isApprover !== true || props.isAccess !== true}
                    onChangeValue={(value) => {
                      setCardReplacementFee(value);
                      updateRawRequest({
                        id: props.approvalRequest.id,
                        rawRequest: {cardReplacementFee: value},
                      });
                    }}
                  />
                  <Label size="normal" className="mb-0 pl-3 text-black">
                    Required
                  </Label>
                </div>
              }
            />
          </DescList>
        </Fieldset>
      </CardContent>
    </Card>
  );
};

export default FleetCardReference;
