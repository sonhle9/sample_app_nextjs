import * as React from 'react';
import {Button, CardContent, DescItem, DescList, formatDate, EyeShowIcon} from '@setel/portal-ui';
import {CardholderDetails} from '../card.type';
import {useRouter} from 'src/react/routing/routing.context';

export function CardCardholderDetails({
  cardholder,
  className,
}: {
  cardholder: CardholderDetails;
  className: string;
}) {
  const router = useRouter();
  const cls = `card ${className}`;
  return (
    <>
      <div className={cls + ' rounded-lg'}>
        <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
          <div className="flex items-center">Cardholder details</div>
          <Button
            leftIcon={<EyeShowIcon />}
            minWidth="none"
            variant="outline"
            onClick={() => {
              router.navigateByUrl(`/card-issuing/cardholders/${cardholder.id}`);
            }}>
            VIEW DETAILS
          </Button>
        </div>
        <CardContent className="p-7">
          <DescList>
            <DescItem
              labelClassName="text-sm"
              valueClassName="text-sm font-normal"
              label="Full name"
              value={cardholder?.name || '-'}
            />
            <DescItem
              labelClassName="text-sm"
              valueClassName="text-sm font-normal"
              label="Display name"
              value={cardholder?.displayName || '-'}
            />
            <DescItem
              labelClassName="text-sm"
              valueClassName="text-sm font-normal"
              label="Created on"
              value={(cardholder.createdAt && formatDate(cardholder.createdAt)) || '-'}
            />
          </DescList>
        </CardContent>
      </div>
    </>
  );
}
