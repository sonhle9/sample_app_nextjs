import {
  FraudProfilesRestrictionType,
  FraudProfilesStatus,
  IFraudProfiles,
  IFraudProfilesRestriction,
} from 'src/app/api-blacklist-service';
import {useIndexFraudProfiles} from '../customers.queries';
import * as React from 'react';
import {Alert, titleCase} from '@setel/portal-ui';

const FraudProfileAlertVariant = {
  [FraudProfilesStatus.WATCHLISTED]: 'warning',
  [FraudProfilesStatus.BLACKLISTED]: 'error',
} as const;

const FraudProfileRestrictions = {
  [FraudProfilesRestrictionType.USER_CHARGE]: 'Wallet charge',
  [FraudProfilesRestrictionType.USER_TOPUP]: 'Wallet top-up',
  [FraudProfilesRestrictionType.USER_LOGIN]: 'Login',
} as const;

type FraudProfileAlertMessageProps = {
  userId: string;
};

const concatRestrictions = (restrictions: IFraudProfilesRestriction[]) => {
  if (restrictions?.length === 0) return 'None.';
  return restrictions.map((restriction) => FraudProfileRestrictions[restriction.type]).join(', ');
};

const getFraudProfileString = (fraudProfile: IFraudProfiles) => {
  return `${titleCase(fraudProfile.status)}. Restriction: ${concatRestrictions(
    fraudProfile.restrictions,
  )}`;
};

export function FraudProfileAlertMessage({userId}: FraudProfileAlertMessageProps) {
  const {data: fraudProfiles} = useIndexFraudProfiles({targetId: userId}, {retry: 1});
  return (
    <>
      {fraudProfiles &&
        fraudProfiles.items?.length > 0 &&
        fraudProfiles.items[0].status !== FraudProfilesStatus.CLEARED && (
          <Alert
            variant={FraudProfileAlertVariant[fraudProfiles.items[0].status]}
            className="mb-5"
            description={getFraudProfileString(fraudProfiles.items[0])}
            hidden={false}
          />
        )}
    </>
  );
}
