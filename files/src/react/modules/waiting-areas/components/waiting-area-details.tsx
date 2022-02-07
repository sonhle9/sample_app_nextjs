import {
  Button,
  Card,
  classes,
  Fieldset,
  DescList,
  EditIcon,
  SectionHeading,
  Text,
  Badge,
  ImageThumbnail,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {getWaitingAreaStatusColor} from '../waiting-areas.helper';
import {useWaitingArea} from '../waiting-areas.queries';
import {WaitingAreaModal} from './waiting-area-modal';

type WaitingAreaDetailsProps = {id: string};
export function WaitingAreaDetails({id}: WaitingAreaDetailsProps) {
  const {data: waitingArea, isFetching} = useWaitingArea(id);
  const [isWaitingAreaModalVisible, setIsWaitingAreaModalVisible] = React.useState(false);

  return (
    <div className="mx-auto px-24 py-10">
      <SectionHeading title={<Text className={classes.h1}>Waiting area details</Text>} />

      <Card isLoading={isFetching}>
        <Card.Heading title="General">
          <HasPermission accessWith={[retailRoles.waitingAreaUpdate]}>
            <Button
              variant="outline"
              leftIcon={<EditIcon />}
              minWidth="none"
              onClick={() => setIsWaitingAreaModalVisible(true)}>
              EDIT
            </Button>
            {isWaitingAreaModalVisible && (
              <WaitingAreaModal
                waitingArea={waitingArea}
                isOpen={isWaitingAreaModalVisible}
                onDismiss={() => setIsWaitingAreaModalVisible(false)}
              />
            )}
          </HasPermission>
        </Card.Heading>
        <Card.Content>
          <Fieldset legend="NAME">
            <DescList className="py-3">
              <DescList.Item label="English" value={waitingArea?.name} />
              <DescList.Item label="Malay" value={waitingArea?.nameLocale?.ms} />
              <DescList.Item
                label="Chinese (Simplified)"
                value={waitingArea?.nameLocale?.['zh-Hans']}
              />
              <DescList.Item
                label="Chinese (Traditional)"
                value={waitingArea?.nameLocale?.['zh-Hant']}
              />
              <DescList.Item label="Tamil" value={waitingArea?.nameLocale?.ta} />
            </DescList>
          </Fieldset>
          <hr />
          <Fieldset legend="OTHER">
            <DescList className="py-3">
              <DescList.Item label="Latitude" value={waitingArea?.latitude} />
              <DescList.Item label="Longitude" value={waitingArea?.longitude} />
              <DescList.Item
                label="Type"
                value={titleCase(waitingArea?.type, {hasUnderscore: true})}
              />
              <DescList.Item
                label="Image"
                value={<ImageThumbnail className="my-1" src={waitingArea?.image} />}
              />
              <DescList.Item
                label="Status"
                value={
                  <Badge
                    size="large"
                    rounded="rounded"
                    color={getWaitingAreaStatusColor(waitingArea?.status)}
                    className="uppercase tracking-wider">
                    {waitingArea?.status}
                  </Badge>
                }
              />
              <DescList.Item
                label="Tags"
                value={
                  <div className="flex flex-wrap">
                    {waitingArea?.tags.map((tag) => (
                      <div className="pr-1" key={tag}>
                        <Badge color={'grey'} rounded="full" className="py-1">
                          {tag}
                        </Badge>
                      </div>
                    ))}
                  </div>
                }
              />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>
    </div>
  );
}
