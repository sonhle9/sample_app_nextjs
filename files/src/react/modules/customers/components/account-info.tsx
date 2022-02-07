import {Badge, Card, CardContent, Skeleton} from '@setel/portal-ui';
import * as React from 'react';
import moment from 'moment';
import {useCustomerDetails} from '../customers.queries';
import {Link} from 'src/react/routing/link';
import {IdentityTypeMap} from '../customers.constant';
import {useVerificationDetailByCustomerId} from 'src/react/modules/verifications/verifications.queries';
import {statusColorMap} from 'src/react/modules/verifications/components/verifications-details';
import {VerificationStatusErrorHandler} from 'src/react/modules/customers/customer-account-details';

interface AccountInfoProps {
  customerId: string;
  isLoyaltyInfoCardExist: boolean;
}

interface DisplayKeyValueInBlockProps {
  label: string;
  value: JSX.Element | string;
}

export function AccountInfo({customerId, isLoyaltyInfoCardExist}: AccountInfoProps) {
  const {data: customer, isLoading: isLoadingCustomer} = useCustomerDetails(customerId);
  const {
    data: customerVerification,
    isError,
    error: verificationError,
    isLoading: isLoadingCustomerVerification,
  } = useVerificationDetailByCustomerId(customerId);

  return (
    <Card className="flex-1 w-full mr-2">
      <Card.Heading title="Account info">
        <Link
          className="text-right text-xs text-brand-500"
          to={`/customers/${customerId}?tabIndex=1`}
          data-testid="view-account-details">
          <strong>VIEW DETAILS</strong>
        </Link>
      </Card.Heading>
      {isLoadingCustomer === true ? (
        <CardContent>
          <Skeleton className="mb-2" />
          <Skeleton width="full" height="medium" className="mb-2" />
          <Skeleton width="wide" height="medium" className="mb-2" />
          <Skeleton className="mb-2" />
          <Skeleton width="wide" height="medium" className="mb-2" />
        </CardContent>
      ) : (
        customer && (
          <CardContent>
            <>
              <div className={!isLoyaltyInfoCardExist ? 'flex flex-col xl:flex-row' : ''}>
                <div className={!isLoyaltyInfoCardExist ? 'xl:flex-grow' : ''}>
                  <DisplayKeyValueInBlock
                    label="USER ID"
                    value={(customer && customer.userId) || '-'}
                  />
                  <DisplayKeyValueInBlock
                    label="EMAIL"
                    value={(customer && customer.email) || '-'}
                  />
                  <DisplayKeyValueInBlock
                    label="ID TYPE"
                    value={(customer && IdentityTypeMap[customer.identityType]) || '-'}
                  />
                </div>
                <div className={!isLoyaltyInfoCardExist ? 'xl:flex-grow' : ''}>
                  <DisplayKeyValueInBlock
                    label="ID NUMBER"
                    value={(customer && customer.identityNumber) || '-'}
                  />
                  <DisplayKeyValueInBlock
                    label="PHONE NUMBER"
                    value={(customer && customer.phone) || '-'}
                  />
                  <DisplayKeyValueInBlock
                    label="CREATED ON"
                    value={
                      (customer && moment(customer?.createdAt).format('DD  MMM YYYY, h:mm a')) ||
                      '-'
                    }
                  />
                </div>

                <DisplayKeyValueInBlock
                  label="eKYC status"
                  value={
                    isLoadingCustomerVerification ? (
                      <Skeleton />
                    ) : (
                      <Badge
                        rounded="rounded"
                        color={
                          customerVerification
                            ? statusColorMap[customerVerification?.verificationStatus]
                            : 'grey'
                        }
                        className="uppercase">
                        {customerVerification
                          ? customerVerification?.verificationStatus
                          : isError
                          ? VerificationStatusErrorHandler(verificationError)
                          : 'Not Found'}
                      </Badge>
                    )
                  }
                />
              </div>
            </>
          </CardContent>
        )
      )}
    </Card>
  );
}

export function DisplayKeyValueInBlock({label, value}: DisplayKeyValueInBlockProps) {
  return (
    <div>
      <div className="block leading-4 text-lightgrey mb-1 text-xs font-bold">{label}</div>
      <div className="text-base mb-5 break-words">{value}</div>
    </div>
  );
}
