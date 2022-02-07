import {
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  ExternalIcon,
  formatDate,
  IconButton,
  Section,
  SectionHeading,
} from '@setel/portal-ui';
import * as React from 'react';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {adminRiskProfile} from 'src/shared/helpers/roles.type';
import {useGetRiskProfileDetails} from 'src/react/modules/customers/customers.queries';
import {convertToOptions} from 'src/react/modules/ledger/fee-settings/fee-settings.const';
import {CreatingReason} from 'src/react/modules/risk-profile/risk-profile.enum';
import {Link} from 'src/react/routing/link';

interface CustomerRiskProfileParams {
  userId: string;
}

export function CustomerRiskProfile({userId}: CustomerRiskProfileParams) {
  const {data: riskProfileDetails, isLoading} = useGetRiskProfileDetails(userId);

  const checkForOptions = convertToOptions(CreatingReason, {hideOptionAll: true});
  const mapCheckForReason = (value: string) => checkForOptions.find((item) => item.value === value);

  return (
    <HasPermission accessWith={[adminRiskProfile.adminView]}>
      <Section id="customer-risk-profile-details">
        <SectionHeading title="Risk Profile" />
        <Card isLoading={isLoading} className="mb-8">
          <CardHeading title="General" />
          <CardContent>
            <DescList>
              <DescItem
                label="ID Number"
                value={
                  <div className="flex items-center">
                    <span>{riskProfileDetails?.idNumber || '-'}</span>
                    {riskProfileDetails?.idNumber && (
                      <IconButton
                        render={(btnProps) => (
                          <Link
                            {...btnProps}
                            to={`/risk-controls/risk-profiles/details/${riskProfileDetails.id}`}
                          />
                        )}
                        className="pu-p-0 pu-pl-1">
                        <ExternalIcon color="#00b0ff" />
                      </IconButton>
                    )}
                  </div>
                }
              />

              <DescItem
                label="Last check"
                value={
                  (riskProfileDetails?.checkFor &&
                    mapCheckForReason(riskProfileDetails.checkFor)?.label) ||
                  '-'
                }
              />

              <DescItem label="Risk rating" value={riskProfileDetails?.riskRating || '-'} />

              <DescItem
                label="Updated on"
                value={
                  riskProfileDetails?.updatedAt
                    ? formatDate(riskProfileDetails.updatedAt, {formatType: 'dateAndTime'})
                    : '-'
                }
              />
            </DescList>
          </CardContent>
        </Card>
      </Section>
    </HasPermission>
  );
}
