import {
  Alert,
  Badge,
  DataTableRowGroup,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  ImageViewer,
  Text,
  Button,
  DataTableCaption,
} from '@setel/portal-ui';
import * as React from 'react';
import {AcquirerStatus, CloseLoopCardAcquirerTypes} from '../terminals.constant';
import {useIndexAcquirers} from '../terminals.queries';
import {IAcquirer} from '../terminals.type';
import cx from 'classnames';
import {getAcquirerDisplay, getCardTypeDisplay} from './helper';
import {ITerminalsDetailsProps} from './terminals-details';

export const TidMidConfiguration = (
  props: ITerminalsDetailsProps & {
    setVisibleModal: (isVisible: boolean) => void;
    setAcquirerId: (id: string) => void;
  },
) => {
  const {data, isError} = useIndexAcquirers(props);
  if (isError || !data) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }

  return TidMidMapping(data, props.setVisibleModal, props.setAcquirerId);
};

const Content = ({children}: any) => <>{children}</>;

const TidMidMapping = (
  acquirers: IAcquirer[],
  setVisibleModal: (isVisible: boolean) => void,
  setAcquirerId: (id: string) => void,
) => {
  return (
    <Content>
      <DataTable>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td className="w-56">ACQUIRER TYPE</Td>
            <Td className="w-56">CARD BRAND</Td>
            <Td className="w-56">MID / TID</Td>
            <Td className="w-56">STATUS</Td>
            <Td className="text-right">ACTION</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {acquirers.map((acquirer: IAcquirer, psIndex: number) => (
            <Tr key={psIndex}>
              <Td className="align-top">
                <Icon
                  props={{
                    ...getAcquirerDisplay(acquirer.acquirerType),
                    className: 'pb-10',
                    imageViewerClassName: 'h-8',
                  }}
                />
              </Td>
              <Td>
                {acquirer &&
                  acquirer.cardBrands.map((item: any, pIndex: number) => (
                    <Icon
                      key={pIndex}
                      props={{
                        ...getCardTypeDisplay(item),
                        className: 'pb-10',
                      }}
                    />
                  ))}
              </Td>
              <Td className="align-top">
                <div className="flex-col justify py-1">
                  <p className="text-base">{acquirer.mid}</p>
                  <p className="text-xs" style={{color: '#788494'}}>
                    {acquirer.tid}
                  </p>
                </div>
              </Td>
              <Td className="align-top pu-py-5 py-5">
                <AcquirerStatusDisplay payment={acquirer} />
              </Td>
              <Td className="text-right">
                {!CloseLoopCardAcquirerTypes.includes(acquirer.acquirerType) && (
                  <Button
                    className="border-none shadow-none"
                    variant="outline"
                    minWidth="none"
                    onClick={() => {
                      setAcquirerId(acquirer.id);
                      setVisibleModal(true);
                    }}>
                    EDIT
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </DataTableRowGroup>
        {!acquirers?.length && (
          <DataTableCaption className="py-24">
            <Text color="lightgrey" className="text-center">
              No items found
            </Text>
          </DataTableCaption>
        )}
      </DataTable>
    </Content>
  );
};

const Icon = ({
  props,
}: {
  props: {title: string; src?: string; className?: string; imageViewerClassName?: string};
}) => {
  return (
    <div className={cx('flex items-center', props.className)}>
      {props.src && (
        <ImageViewer className={cx('w-8 h-8 mr-3', props.imageViewerClassName)} src={props.src} />
      )}
      <Text color="black">{props.title}</Text>
    </div>
  );
};

const AcquirerStatusDisplay = ({payment}: {payment: IAcquirer}) => {
  return (
    <Badge
      color={payment.status === AcquirerStatus.ACTIVE ? 'success' : 'grey'}
      className="uppercase">
      {payment.status === AcquirerStatus.ACTIVE ? 'ENABLED' : 'DISABLED'}
    </Badge>
  );
};
