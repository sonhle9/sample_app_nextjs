import * as React from 'react';
import {useRouter} from '../../../routing/routing.context';
import {Badge, Button, classes, DescList, EditIcon} from '@setel/portal-ui';
import {useMerchantTypeDetails} from '../merchant-types.queries';
import {MerchantTypesDetailModal} from './merchant-types-detail-modal';
import {IMerchantType} from '../merchant-types.type';
import {ProductLabels} from '../merchant-types.constant';
import {MerchantTypeListingColumnsDetailModal} from './merchant-types-listing-column-detail-modal';
import {SalesTerritoryListing} from '../../sales-territories/components/sales-territories-listing';

interface MerchantTypeDetailProps {
  id: string;
}

export const MerchantTypeDetails = (props: MerchantTypeDetailProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [visibleListingColumnModal, setVisibleListingColumnModal] = React.useState(false);

  const {data: merchantType, isError: isLoadTypeDetailError} = useMerchantTypeDetails(props.id);
  const router = useRouter();

  React.useEffect(() => {
    if (isLoadTypeDetailError) {
      router.navigateByUrl('/merchant-types').then();
      return;
    }
  }, [isLoadTypeDetailError]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Merchant type details</h1>
        </div>
        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">{merchantType?.name}</div>
            <Button leftIcon={<EditIcon />} variant="outline" onClick={() => setVisibleModal(true)}>
              EDIT
            </Button>
          </div>
          <div className="px-8 py-5">
            <DescList>
              <DescList.Item label="Name" value={merchantType?.name} />
              <DescList.Item label="Code" value={merchantType?.code} />
              <DescList.Item
                label="Status value options"
                value={
                  merchantType?.statusValues?.length > 0
                    ? merchantType.statusValues.map((status) => (
                        <Badge
                          key={status}
                          color={status?.toLowerCase() === 'active' ? 'success' : 'grey'}
                          className={'uppercase mr-3'}>
                          {status}
                        </Badge>
                      ))
                    : '-'
                }
              />
              <DescList.Item
                label="Status default value"
                value={
                  merchantType?.statusDefaultValue ? (
                    <Badge
                      color={
                        merchantType.statusDefaultValue.toLowerCase() === 'active'
                          ? 'success'
                          : 'grey'
                      }
                      className={'uppercase'}>
                      {merchantType.statusDefaultValue}
                    </Badge>
                  ) : (
                    '-'
                  )
                }
              />
              <DescList.Item
                label="Product"
                value={
                  merchantType?.products &&
                  Object.keys(merchantType.products).map((product) => {
                    return (
                      merchantType.products[product] &&
                      ProductLabels[product] && (
                        <Badge
                          rounded={'full'}
                          className={'mr-3 mb-2'}
                          key={product}
                          size="large"
                          weight="normal">
                          {ProductLabels[product]}
                        </Badge>
                      )
                    );
                  })
                }
              />
              <DescList.Item label="Created on" value={merchantType?.createdOn} />
            </DescList>
          </div>
        </div>
      </div>
      <div className="grid gap-4 my-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">Listing columns</div>
            <Button
              leftIcon={<EditIcon />}
              variant="outline"
              onClick={() => setVisibleListingColumnModal(true)}>
              EDIT
            </Button>
          </div>
          <div className="px-8 py-5">
            <DescList>
              {merchantType?.listingConfigurations?.map((listingConfig, index) => (
                <DescList.Item
                  label={`Column ${index + 1}`}
                  key={index}
                  value={listingConfig?.label}
                />
              ))}
            </DescList>
          </div>
        </div>
      </div>
      <SalesTerritoryListing merchantTypeId={props.id} />
      {visibleModal && (
        <MerchantTypesDetailModal
          onClose={() => setVisibleModal(false)}
          merchantType={merchantType as IMerchantType}
        />
      )}
      {visibleListingColumnModal && (
        <MerchantTypeListingColumnsDetailModal
          onClose={() => setVisibleListingColumnModal(false)}
          merchantType={merchantType}
        />
      )}
    </>
  );
};
