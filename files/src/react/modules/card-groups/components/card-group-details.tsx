import {
  Button,
  Card,
  CardContent,
  classes,
  formatDate,
  JsonPanel,
  DescList,
  DescItem,
  EditIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {cardGroupRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetCardGroupDetails} from '../card-group.queries';
import CardGroupModal from './card-group-modal';
interface ICardGroupDetails {
  id: string;
}

const CardGroupDetails: React.VFC<ICardGroupDetails> = (props) => {
  const {data, isError} = useGetCardGroupDetails(props.id);
  const [editModal, setEditModal] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('card-groups');
      return;
    }
  }, [isError]);

  return (
    <>
      <div className="grid gap-4 max-w-6xl mx-auto px-4 pt-4 sm:px-6">
        <div className="flex justify-between mt-3">
          <h1 className={classes.h1}>Card group details</h1>
        </div>
        <Card className="mb-4">
          <div className='class="px-4 py-4 sm:px-7 border-b border-gray-200"'>
            <div className="flex items-center justify-between flex-wrap sm:flex-no-wrap">
              <div className="text-xl leading-6 pr-2 py-2 font-medium text-black">General</div>
              <div className="flex items-center">
                {data && (
                  <HasPermission accessWith={[cardGroupRole.update]}>
                    <Button
                      variant="outline"
                      leftIcon={<EditIcon className="block w-3.5 h-3.5 mr-3" />}
                      minWidth="none"
                      onClick={() => setEditModal(true)}>
                      EDIT
                    </Button>
                  </HasPermission>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-7">
            {data ? (
              <div className="flex flex-col space-y-4">
                <DescList>
                  <DescItem
                    valueClassName="capitalize text-black font-regular"
                    label="Type"
                    value={data?.cardType || '-'}
                  />
                  <DescItem
                    label="Merchant"
                    valueClassName="text-black font-regular"
                    value={data?.merchant?.name || '-'}
                  />
                  <DescItem
                    label="Card groups"
                    valueClassName="text-black font-regular"
                    value={data?.name || '-'}
                  />
                  <DescItem
                    label="Description"
                    valueClassName="text-black font-regular"
                    value={data?.description || '-'}
                  />
                  <DescItem
                    label="Created on"
                    valueClassName="text-black font-regular"
                    value={
                      (data?.createdAt &&
                        formatDate(data.createdAt, {
                          formatType: 'dateAndTime',
                        })) ||
                      '-'
                    }
                  />
                  <DescItem
                    label="Last updated on"
                    value={
                      (data?.updatedAt &&
                        formatDate(data.updatedAt, {
                          formatType: 'dateAndTime',
                        })) ||
                      '-'
                    }
                  />
                </DescList>
              </div>
            ) : (
              <div className="w-full h-40 flex items-center justify-center">...loading</div>
            )}
          </CardContent>
        </Card>
        <JsonPanel allowToggleFormat json={Object.assign({...data})} className="mb-36" />
      </div>

      {editModal && (
        <CardGroupModal
          visible={editModal}
          cardGroup={data}
          onClose={() => {
            setEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default CardGroupDetails;
