import * as React from 'react';
import {DescItem, DescList, Button, EditIcon} from '@setel/portal-ui';
import * as RS from '@setel/portal-ui';
import {MerchantUsersDetailModal} from './merchant-users-detail-modal';
import {useUserMerchantDetail} from '../merchant-users.queries';
import {filterMerchantName, getCompanyDetails} from '../merchant-users.service';
import {useHasPermission} from '../../auth/HasPermission';
import {merchantUserRole} from '../../../../shared/helpers/roles.type';
import {ICompany} from '../../company/companies.type';
interface MerchantTypeDetailProps {
  userId: string;
}

export const MerchantUserDetails = (props: MerchantTypeDetailProps) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [company, setCompany] = React.useState<ICompany>(null);
  const {data, isLoading, isError} = useUserMerchantDetail(props.userId);
  const isEdit = useHasPermission([merchantUserRole.modifier]);
  const condition =
    data?.user?.companyId || (data?.merchants.under && data?.merchants.under.length > 0);

  React.useEffect(() => {
    if (data && condition) {
      getCompanyDetails(data?.user?.companyId || data?.merchants?.under[0].companyId).then(
        (com) => {
          setCompany(com);
        },
      );
    } else {
      setCompany(null);
    }
  }, [data]);
  const isShowMerchantUser = !isError && !isLoading && data && data.user && data.merchants;
  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <RS.Text className={RS.classes.h1}>Merchant user details</RS.Text>
          {isEdit && (
            <Button variant="outline" onClick={() => setVisibleModal(true)} leftIcon={<EditIcon />}>
              EDIT
            </Button>
          )}
        </div>
        <>
          {isError && (
            <RS.Alert variant="error" description="Server error! Please try again." accentBorder />
          )}
          {isLoading && <p>Loading...</p>}
          {isShowMerchantUser && (
            <>
              <RS.Card className="mb-8">
                <RS.CardHeading title="General"></RS.CardHeading>
                <RS.CardContent>
                  <DescList>
                    <DescItem label="Name" value={data.user ? data.user.name : '-'} />
                    <DescItem label="Email" value={data.user ? data.user.email : '-'} />
                    <DescItem
                      label="Access level"
                      value={data.user?.companyId ? 'Company' : 'Merchant'}
                    />
                    <DescItem label="Company name" value={company ? company.name : '-'} />
                    <DescItem
                      label="Merchants (under company)"
                      value={
                        data.merchants?.under.length > 0
                          ? filterMerchantName(data.merchants.under)
                          : '-'
                      }
                    />
                    <DescItem
                      label="Merchants (orphan)"
                      value={
                        data.merchants?.orphan.length
                          ? filterMerchantName(data.merchants.orphan)
                          : '-'
                      }
                    />
                    <DescItem
                      label="Created on"
                      value={
                        data &&
                        RS.formatDate(data.user.createdAt, {
                          formatType: 'dateAndTime',
                        })
                      }
                    />
                  </DescList>
                </RS.CardContent>
              </RS.Card>
              {visibleModal && (
                <MerchantUsersDetailModal
                  visible={visibleModal}
                  onClose={() => setVisibleModal(false)}
                  id={props.userId}
                  company={company ? company : null}
                  merchantUser={isShowMerchantUser ? data : null}
                />
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};
