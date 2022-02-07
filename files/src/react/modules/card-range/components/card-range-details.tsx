import {
  classes,
  Button,
  Card,
  formatDate,
  CardContent,
  CardHeading,
  DescList,
  DescItem,
  EditIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {cardRangeRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetCardRangeDetails} from '../card-range.queries';
import CardRangeModal from './card-range-modal';

interface ICardRangeDetails {
  id: string;
}

export const CardRangeDetails: React.VFC<ICardRangeDetails> = (props) => {
  const {data, isError} = useGetCardRangeDetails(props.id);
  const router = useRouter();
  const [editModal, setEditModal] = React.useState(false);
  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl(`/card-issuing/card-ranges`);
      return;
    }
  }, [isError]);

  return (
    <>
      <div className="grid gap-4 max-w-6xl mx-auto px-4 pt-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Card range details</h1>
        </div>
        <Card className="mb-6">
          <CardHeading title="General" className="text-xl">
            {data && (
              <HasPermission accessWith={[cardRangeRole.update]}>
                <Button
                  variant="outline"
                  minWidth="none"
                  leftIcon={<EditIcon className="block w-3.5 h-3.5 mr-3" />}
                  onClick={() => setEditModal(true)}>
                  EDIT
                </Button>
              </HasPermission>
            )}
          </CardHeading>
          <CardContent className="p-7">
            {data ? (
              <div className="flex flex-col space-y-4">
                <DescList>
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium capitalize"
                    label="Type"
                    value={data?.type || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Card range name"
                    value={data?.name || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium w-7/12"
                    label="Description"
                    value={data?.description || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Start number"
                    value={data?.startNumber || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Current number"
                    value={data?.currentNumber || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="End number"
                    value={data?.endNumber || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Total cards"
                    value={
                      parseInt(data.endNumber, 10) > 0
                        ? parseInt(data.endNumber, 10) - parseInt(data.startNumber, 10)
                        : '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Created on"
                    value={
                      (data?.createdAt &&
                        formatDate(data.createdAt, {
                          formatType: 'dateAndTime',
                        })) ||
                      '-'
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium"
                    label="Updated on"
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
      </div>

      {editModal && (
        <CardRangeModal
          visible={editModal}
          cardRange={data}
          onClose={() => {
            setEditModal(false);
          }}
        />
      )}
    </>
  );
};
