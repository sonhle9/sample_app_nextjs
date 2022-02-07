import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  classes,
  DescItem,
  DescList,
  EditIcon,
  formatDate,
} from '@setel/portal-ui';
import {MerchantLinkModal} from './merchant-link-modal';
import {useMerchantLinkDetails} from '../merchant-links.queries';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {MerchantLinkEnterpriseOptions} from '../merchant-links.constant';
import {useNotification} from 'src/react/hooks/use-notification';

type MerchantLinkDetailsProps = {
  id: string;
};

export const MerchantLinkDetails = (props: MerchantLinkDetailsProps) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [newLinkId, setNewLinkId] = React.useState(props.id);
  const showNotify = useNotification();
  const {data: link, error, isLoading} = useMerchantLinkDetails(newLinkId);
  return (
    <div className="grid gap-4 pt-10 max-w-6xl mx-auto px-4 sm:px-6  pb-12">
      <div className="flex justify-between">
        <h1 className={classes.h1}>Merchant link details</h1>
      </div>
      <Card>
        <Card.Heading title={'General'}>
          {!error && !isLoading && (
            <Button
              disabled={!!error || isLoading}
              leftIcon={<EditIcon />}
              variant="outline"
              onClick={() => setShowEditModal(true)}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        <Card.Content>
          {error && <QueryErrorAlert error={error as any} />}
          <DescList isLoading={isLoading}>
            <DescItem label={'Merchant name'} value={link?.merchantName} />
            <DescItem
              label={'Linked enterprise'}
              value={
                MerchantLinkEnterpriseOptions.find((ent) => ent.value === link?.enterpriseToLink)
                  ?.label
              }
            />
            <DescItem
              label={'Total linked merchants'}
              value={link?.linkedMerchants.length ? link?.linkedMerchants.length - 1 : ''}
            />
            <DescItem
              label={'Linked merchants'}
              value={link?.linkedMerchants
                .filter((lm) => lm.merchantId !== link?.merchantId)
                .map((linkedMerchant) => (
                  <Badge
                    rounded={'full'}
                    key={linkedMerchant.merchantId}
                    color={'grey'}
                    className={'mr-2 mb-2'}>
                    <span className={'font-normal text-sm text-mediumgrey'}>
                      {linkedMerchant.merchantName}
                    </span>
                  </Badge>
                ))}
            />
            <DescItem
              label={'Last updated on'}
              value={link?.updatedAt ? formatDate(link.updatedAt) : ''}
            />
            <DescItem
              label={'Created on'}
              value={
                link?.attributes?.rootCreatedAt ? formatDate(link.attributes.rootCreatedAt) : ''
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      {showEditModal && (
        <MerchantLinkModal
          link={link}
          onDismiss={() => setShowEditModal(false)}
          onDone={(newLinkId: string) => {
            setShowEditModal(false);
            showNotify({
              variant: 'success',
              title: 'Success!',
              description: 'You have successfully updated your merchant link',
            });
            setNewLinkId(newLinkId);
          }}
        />
      )}
    </div>
  );
};
