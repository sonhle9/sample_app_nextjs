import {
  // Alert,
  Badge,
  // Button,
  Card,
  CardContent,
  // CrossIcon,
  // IconButton,
  Skeleton,
} from '@setel/portal-ui';
import * as React from 'react';
import {convertSnakeCaseToSentence, maskCardNumber} from '../customers.helper';
// import {
//   CardUnlinkResult,
//   // LoyaltyCardUnlinkingModal,
// } from '../../loyalty/components/loyalty-members/loyalty-card-unlinking-modal';
import {Link} from 'src/react/routing/link';
import {DisplayKeyValueInBlock} from './account-info';
// import {
//   useGetCardBalanceByCardNumber,
//   useGetLoyaltyMemberByUserId,
// } from '../../loyalty/loyalty.queries';
import {useGetCardsByUserId} from '../../loyalty/loyalty.queries';
import {loyaltyCardStatusColor} from '../customers.type';
import {CardProvider} from '../../loyalty/loyalty.type';

type LoyaltyInfoProps = {
  customerId: string;
};

// interface DisplayMesraBalanceProps {
//   cardNumber: string;
// }

export const LoyaltyInfo: React.VFC<LoyaltyInfoProps> = ({customerId}) => {
  // const [showUnlinkCardModal, setShowUnlinkCardModal] = React.useState(false);

  // const [unlinkResult, setUnlinkResult] = React.useState<CardUnlinkResult>();

  // const dismissMessage = (
  //   <IconButton
  //     onClick={() => setUnlinkResult(null)}
  //     aria-label="click"
  //     className="text-error-500 px-1.5 py-2">
  //     <CrossIcon className="h-4 w-4" />
  //   </IconButton>
  // );

  const {
    data: cardDetails,
    isLoading: isLoadingCardDetails,
    isSuccess: isSuccessCardDetails,
  } = useGetCardsByUserId(customerId);

  // const {
  //   data: loyaltyMemberDetails,
  //   isFetching: isFetchingLoyaltyMemberDetails,
  // } = useGetLoyaltyMemberByUserId(customerId, {
  //   enabled: true,
  // });

  return (
    <Card className="flex-1 w-full">
      {/* {showUnlinkCardModal && (
        <LoyaltyCardUnlinkingModal
          isOpen={showUnlinkCardModal}
          member={loyaltyMemberDetails}
          onDismiss={() => setShowUnlinkCardModal(false)}
          setUnlinkResult={setUnlinkResult}
        />
      )} */}
      <Card.Heading title="Loyalty info">
        {cardDetails && (
          <Link
            to={
              cardDetails?.provider === CardProvider.SETEL
                ? `/loyalty/members/${cardDetails.id}`
                : `/accounts/loyalty-cards/${cardDetails.id}`
            }>
            <strong className="text-right text-xs text-brand-500">VIEW DETAILS</strong>
          </Link>
        )}
      </Card.Heading>
      <CardContent>
        {/* <Alert
          variant={unlinkResult?.statusCode === 200 ? 'success' : 'error'}
          description={unlinkResult?.message}
          hidden={!unlinkResult}
          action={dismissMessage}
        /> */}
        {isLoadingCardDetails ? (
          <>
            <Skeleton className="mb-2" />
            <Skeleton width="full" height="medium" className="mb-2" />
            <Skeleton width="wide" height="medium" className="mb-2" />
            <Skeleton className="mb-2" />
            <Skeleton width="wide" height="medium" className="mb-2" />
          </>
        ) : isSuccessCardDetails && cardDetails ? (
          <>
            <DisplayKeyValueInBlock
              label="CARD NUMBER"
              value={maskCardNumber(cardDetails?.cardNumber) || '-'}
            />
            <DisplayKeyValueInBlock
              label="STATUS"
              value={
                <Badge
                  color={
                    (cardDetails.status && loyaltyCardStatusColor[cardDetails.status]) || 'grey'
                  }
                  className="uppercase">
                  {convertSnakeCaseToSentence(cardDetails?.status) || '-'}
                </Badge>
              }
            />
            <DisplayKeyValueInBlock
              label="TYPE"
              // value={loyaltyDetails?.type ? convertSnakeCaseToSentence(loyaltyDetails.type) : '-'}
              value={cardDetails?.isPhysicalCard ? 'Physical' : 'Virtual'}
            />
            <DisplayKeyValueInBlock
              label="POINT BALANCE"
              value={
                <>
                  {cardDetails?.pointBalance >= 0
                    ? `${cardDetails?.pointBalance} Mesra points`
                    : '-'}
                </>

                // (
                //   <DisplayMesraBalance cardNumber={loyaltyMemberDetails.cardNumber} />
                // )
              }
            />
            {/* <Button
              variant="outline"
              className="m-2"
              onClick={() => setShowUnlinkCardModal((prev) => !prev)}>
              UNLINK CARD
            </Button> */}
          </>
        ) : (
          <>
            <div className="text-lg text-mediumgrey text-center py-10 w-full">
              Loyalty Card Not Found
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
// function DisplayMesraBalance({cardNumber}: DisplayMesraBalanceProps) {
//   const [hasError, setHasError] = React.useState(false);
//   const {data: mesraCardDetails, isSuccess, isError} = useGetCardBalanceByCardNumber(cardNumber, {
//     enabled: !!cardNumber && hasError === false,
//     onError: () => setHasError(true),
//   });

//   return (
//     <>
//       {mesraCardDetails ? (
//         isSuccess === true ? (
//           mesraCardDetails.pointTotalBalance + ' Mesra points'
//         ) : (
//           '-'
//         )
//       ) : isSuccess === false && isError === true ? (
//         '-'
//       ) : (
//         <Skeleton />
//       )}
//     </>
//   );
// }
