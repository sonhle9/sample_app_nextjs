import {
  Alert,
  Badge,
  Button,
  Card,
  DescList,
  EditIcon,
  Fieldset,
  JsonPanel,
  Skeleton,
  Timeline,
  titleCase,
  formatDate,
  PlusIcon,
  DataTableRowGroup,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  Text,
  ImageViewer,
  BareButton,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {useSetQueryParams} from 'src/react/routing/routing.context';
import {ITerminalHostTerminalRegistration} from 'src/react/services/api-terminal.type';
import {useMerchantDetails} from '../../merchants/merchants.queries';
import {
  AcquirerTypeBrandIconMapping,
  AcquirerTypePrettyTextMapping,
  CardBrand,
  CardBrandIconMapping,
  CardBrandPrettyTextMapping,
  TerminalHostColorMap,
  TerminalHostEnabledTextMapping,
  TerminalStatusColorMap,
  TerminalStatusTimelineColorMap,
  TerminalStatus,
  SetelTerminalNotificationMessage,
} from '../setel-terminals.const';
import {createMerchantAddress} from '../setel-terminals.helper';
import {useTerminalsDetails, useUpdateTerminal} from '../setel-terminals.queries';
import TerminalEditModal from './edit-terminal-modal';
import AddHostRegModal from './add-host-reg-modal';
import EditHostRegModal from './edit-host-reg-modal';
import TerminalEditPasscodeModal from './edit-passcode-modal';
import TerminalConfigParameter from './terminal-configuration/terminal-configuration-parameter-tabs';
interface ITerminalsDetailsProps {
  serialNum: string;
}

export const TerminalsDetails = (props: ITerminalsDetailsProps) => {
  const {data, isFetching, isLoading, isError, isSuccess} = useTerminalsDetails(props.serialNum);
  const [showTerminalModal, setShowTerminalModal] = React.useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = React.useState(false);
  const [addHostTerminalModal, setAddHostTerminalModal] = React.useState(false);
  const [editHostTerminalModal, setEditHostTerminalModal] = React.useState(false);
  const [hostData, setHostData] = React.useState<ITerminalHostTerminalRegistration | null>(null);
  const {data: merchants, isLoading: merchantDetailsLoading} = useMerchantDetails(
    data?.merchantId,
    {enabled: Boolean(data)},
  );
  const showMessage = useNotification();
  const setQueryParams = useSetQueryParams();
  const updateTerminal = useUpdateTerminal();

  React.useEffect(() => {
    if (isSuccess && data.type && data.terminalId) {
      setQueryParams({terminalType: `${data.type}-${data.terminalId}`}, {merge: true});
    }
  }, [data]);

  if (isError) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }

  const handleUnlock = () => {
    updateTerminal.mutate(
      {serialNum: props.serialNum, request: {shouldResetPasscodeCounter: true}},
      {
        onSuccess: () => {
          showMessage({
            title: SetelTerminalNotificationMessage.TERMINAL_UNLOCK_TITLE,
            description: SetelTerminalNotificationMessage.TERMINAL_UNLOCK_DESCRIPTION,
            variant: 'success',
          });
        },
        onError: () => {
          showMessage({
            title: SetelTerminalNotificationMessage.TERMINAL_UNLOCK_TITLE_ERROR,
            description: SetelTerminalNotificationMessage.TERMINAL_UNLOCK_DESCRIPTION_ERROR,
            variant: 'error',
          });
        },
      },
    );
  };

  return (
    <PageContainer
      heading={!isLoading ? data && `${data.type} - ${data.terminalId}` : <Skeleton />}>
      <Card className="mb-8">
        <Card.Heading title="General">
          {!isLoading && (
            <Button
              data-testid="btn-general-edit"
              variant="outline"
              leftIcon={<EditIcon />}
              minWidth="none"
              onClick={() => setShowTerminalModal(true)}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        <Card.Content>
          <Fieldset legend="HARDWARE">
            <DescList className="py-3" isLoading={isLoading}>
              <DescList.Item label="Terminal ID" value={data && data.terminalId} />
              <DescList.Item
                label="Status"
                value={
                  data && (
                    <Badge rounded="rounded" color={TerminalStatusColorMap[data.status]}>
                      {data.status}
                    </Badge>
                  )
                }
              />
              <DescList.Item label="Type" value={data?.type} />
              <DescList.Item label="Serial number" value={data?.serialNum} />
              <DescList.Item label="Manufacturer" value={data?.manufacturer || '-'} />
              <DescList.Item label="Model" value={data?.modelReference || '-'} />
            </DescList>
          </Fieldset>
          <Fieldset legend="MERCHANT" className="border-t border-gray-200 mt-2 pt-2">
            <DescList className="py-3" isLoading={merchantDetailsLoading}>
              <DescList.Item label="Name" value={merchants?.name} />
              <DescList.Item
                label="Address"
                value={createMerchantAddress(merchants?.contactInfo)}
              />
            </DescList>
          </Fieldset>
          <Fieldset legend="TIMESTAMPS" className="border-t border-gray-200 mt-2 pt-2">
            <Timeline className="py-3">
              {data?.timeline
                .filter((time) => time.status !== TerminalStatus.NEW)
                .map((item, index) => (
                  <Timeline.Item
                    title={titleCase(item.status)}
                    description={formatDate(item.date)}
                    color={TerminalStatusTimelineColorMap[item.status]}
                    key={index}
                  />
                ))}
            </Timeline>
          </Fieldset>
          <Fieldset legend="OTHER" className="border-t border-gray-200 mt-2 pt-2">
            <DescList className="py-3" isLoading={isLoading}>
              <DescList.Item
                label="Last seen"
                value={(data?.metrics?.updatedAt && formatDate(data.metrics.updatedAt)) || '-'}
              />
              <DescList.Item label="Remarks" value={data?.remarks ?? '-'} />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>
      <Card className="mb-8">
        <Card.Heading title="Passcode management">
          {!isLoading && (
            <Button
              data-testid="btn-passcode-management-edit"
              variant="outline"
              leftIcon={<EditIcon />}
              minWidth="none"
              onClick={() => setShowPasscodeModal(true)}>
              EDIT
            </Button>
          )}
        </Card.Heading>
        <Card.Content>
          <Fieldset legend="MERCHANT PASSCODE">
            <div className="flex justify-start">
              <DescList className="py-3" isLoading={isLoading}>
                <DescList.Item
                  label="Passcode status"
                  value={data?.merchantPass.isEnabled ? 'Enabled' : 'Disabled'}
                />
              </DescList>
              <BareButton className="text-brand-500 pl-4" onClick={handleUnlock}>
                UNLOCK
              </BareButton>
            </div>
            <DescList className="py-3" isLoading={isLoading}>
              <DescList.Item
                label="Passcode"
                value={data?.merchantPass.isEnabled ? data.merchantPass.value : '-'}
              />
            </DescList>
          </Fieldset>
          <Fieldset legend="ADMIN PASSCODE" className="border-t border-gray-200 mt-2 pt-2">
            <DescList className="py-3" isLoading={merchantDetailsLoading}>
              <DescList.Item label="Passcode" value={data?.adminPass} />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>
      <Card className="mb-8">
        <Card.Heading title="Terminal monitor" />
        <Card.Content className="pl-14">
          <DescList isLoading={isLoading}>
            <DescList.Item label="Mode" value={data?.metrics?.environment ?? '-'} />
            <DescList.Item
              label="Battery status"
              value={data?.metrics?.battery ? `${data.metrics.battery}%` : '-'}
            />
            <DescList.Item label="CPU" value={data?.metrics?.cpu ? `${data.metrics.cpu}%` : '-'} />
            <DescList.Item label="RAM" value={data?.metrics?.ram ? `${data.metrics.ram}%` : '-'} />
            <DescList.Item
              label="Storage"
              value={
                data?.metrics?.freeStorage && data?.metrics?.totalStorage
                  ? `${(data.metrics.freeStorage / 1000).toFixed(2)} GB / ${(
                      data.metrics.totalStorage / 1000
                    ).toFixed(2)} GB`
                  : '-'
              }
            />
            <DescList.Item label="PCI PTS Version" value={data?.metrics?.pciPtsVersion ?? '-'} />
            <DescList.Item label="SIM Card Details" value="-" />
            <DescList.Item
              label="WIFI/Data"
              value={
                data?.metrics?.wifiDetails.name && data?.metrics?.wifiDetails.ip
                  ? `${data.metrics.wifiDetails.name} - ${data.metrics.wifiDetails.ip}`
                  : '-'
              }
            />
            <DescList.Item
              label="PCI PTS POI Product Type"
              value={data?.metrics?.pciPtsPoiProductType ?? '-'}
            />
            <DescList.Item label="Android Version" value={data?.metrics?.androidVersion ?? '-'} />
            <DescList.Item label="IMEI" value={data?.metrics?.imei ?? '-'} />
            <DescList.Item
              label="Screen Resolution"
              value={
                data?.metrics?.screenWidth && data?.metrics?.screenHeight
                  ? `${data.metrics.screenWidth}px * ${data.metrics.screenHeight}px`
                  : '-'
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card className="my-8">
        <Card.Heading title="TID/MID Configuration">
          {!isLoading && (
            <Button
              data-testid="btn-general-add"
              variant="outline"
              leftIcon={<PlusIcon />}
              minWidth="none"
              onClick={() => setAddHostTerminalModal(true)}>
              ADD
            </Button>
          )}
        </Card.Heading>
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          striped
          data-testid="terminal-host-table">
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/6">Acquirer Type</Td>
              <Td className="w-2/6">Card Type</Td>
              <Td className="w-2/6">MID/TID</Td>
              <Td className="w-1/6">Status</Td>
              <Td className="w-1/6 text-right">Action</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.hostTerminalRegistration
              ? data?.hostTerminalRegistration.map(
                  (host: ITerminalHostTerminalRegistration, index) => (
                    <Tr key={index}>
                      <Td className="w-1/6">
                        <div className="flex justify-start items-center pt-0 pb-4">
                          <ImageViewer
                            className=""
                            src={AcquirerTypeBrandIconMapping[host.acquirerType]}
                          />
                          <Text className="ml-2 my-auto pu-text-black">
                            {AcquirerTypePrettyTextMapping[host.acquirerType]}
                          </Text>
                        </div>
                      </Td>
                      <Td className="w-2/6">
                        {host.cardBrand.map((card: CardBrand, index) => (
                          <div
                            className={`flex justify-start items-center ${
                              index === 0 ? 'pt-0 pb-4' : 'py-4'
                            }`}
                            key={index}>
                            <ImageViewer className="" src={CardBrandIconMapping[card]} />
                            <Text className="ml-2 my-auto pu-text-black">
                              {CardBrandPrettyTextMapping[card]}
                            </Text>
                          </div>
                        ))}
                      </Td>
                      <Td className="w-2/6 relative">
                        <div className="absolute">
                          <Text className="pu-text-black">{host?.merchantId}</Text>
                          <Text className="pu-text-mediumgrey pu-text-xs">{host?.terminalId}</Text>
                        </div>
                      </Td>
                      <Td className="w-1/6 relative">
                        <Badge
                          className="absolute"
                          rounded="rounded"
                          color={
                            host?.isEnabled
                              ? TerminalHostColorMap['ENABLED']
                              : TerminalHostColorMap['DISABLED']
                          }>
                          {host?.isEnabled
                            ? TerminalHostEnabledTextMapping['ENABLED']
                            : TerminalHostEnabledTextMapping['DISABLED']}
                        </Badge>
                      </Td>
                      <Td className="w-1/6 relative">
                        <BareButton
                          className="text-brand-500 absolute"
                          data-testid="btn-general-edit"
                          onClick={() => {
                            setHostData(host);
                            setEditHostTerminalModal(true);
                          }}>
                          EDIT
                        </BareButton>
                      </Td>
                    </Tr>
                  ),
                )
              : null}
          </DataTableRowGroup>
        </Table>
      </Card>
      <TerminalConfigParameter
        terminalMenu={data?.terminalMenu}
        serialNum={data?.serialNum}
        myDebitOptIn={data?.myDebitOptIn}
        allowedEntryModes={data?.allowedEntryModes}
        merchantId={data?.merchantId}
        isLoading={isLoading}
      />

      <JsonPanel defaultOpen allowToggleFormat json={Object.assign({...data})} />
      {showTerminalModal && !isLoading && (
        <TerminalEditModal
          terminal={data}
          visible={showTerminalModal}
          onClose={() => {
            setShowTerminalModal(false);
          }}
          onSuccessUpdate={(title, description) => showMessage({title, description})}
          merchantName={merchants?.name}
          merchantAddress={merchants && createMerchantAddress(merchants.contactInfo)}
        />
      )}
      {showPasscodeModal && !isLoading && (
        <TerminalEditPasscodeModal
          terminal={data}
          visible={showPasscodeModal}
          onClose={() => {
            setShowPasscodeModal(false);
          }}
          onSuccessUpdate={(title) => showMessage({title})}
        />
      )}
      {addHostTerminalModal && !isLoading && (
        <AddHostRegModal
          visible={addHostTerminalModal}
          serialNum={data.serialNum}
          onClose={() => setAddHostTerminalModal(false)}
          onSuccessUpdate={(title) => showMessage({title})}
        />
      )}
      {editHostTerminalModal && !isLoading && (
        <EditHostRegModal
          visible={editHostTerminalModal}
          hostId={hostData._id}
          data={hostData}
          serialNum={data.serialNum}
          onClose={() => setEditHostTerminalModal(false)}
          onSuccessUpdate={(title) => showMessage({title})}
        />
      )}
    </PageContainer>
  );
};
