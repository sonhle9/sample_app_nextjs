import {
  Alert,
  Badge,
  Button,
  Card,
  DescList,
  classes,
  EditIcon,
  PlusIcon,
  formatDate,
  JsonPanel,
  Skeleton,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {TerminalStatusColorMap} from '../terminals.constant';
import {useTerminalsDetails} from '../terminals.queries';
import {TerminalsModal} from './terminals-modal';
import {TidMidConfiguration} from './mid-tid-mapping';
import {AcquirerModal, EditAcquirerModal} from './mid-tid-configuration-modal';
import {AuthContext} from '../../auth/auth.context';
import {legacyTerminalRoles} from 'src/shared/helpers/roles.type';

export interface ITerminalsDetailsProps {
  terminalId: string;
  merchantId: string;
}

export const TerminalsDetails = (props: ITerminalsDetailsProps) => {
  const {data, isLoading, isError} = useTerminalsDetails(props);
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [visibleUpdateAcquirerModal, setVisibleUpdateAcquirerModal] =
    React.useState<boolean>(false);
  const [visibleAddAcquirerModal, setVisibleAddAcquirerModal] = React.useState<boolean>(false);
  const [acquirerId, setAcquirerId] = React.useState('');
  const showMessage = useNotification();
  const {permissions} = React.useContext(AuthContext);

  if (isError) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex">
          <h1 className={classes.h1}>
            {!isLoading ? (
              data && `${data.terminal.type} - ${data.terminal.terminalId}`
            ) : (
              <Skeleton />
            )}
          </h1>
        </div>
        <Card>
          <Card.Heading title="General">
            {!isLoading && (
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                minWidth="none"
                onClick={() => setVisibleModal(true)}>
                EDIT
              </Button>
            )}
          </Card.Heading>
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item label="Terminal ID" value={data && data.terminal.terminalId} />
              <DescList.Item
                label="Status"
                value={
                  data && (
                    <Badge rounded="rounded" color={TerminalStatusColorMap[data.terminal.status]}>
                      {data.terminal.status}
                    </Badge>
                  )
                }
              />
              <DescList.Item label="Type" value={data && data.terminal.type} />
              <DescList.Item label="Serial number" value={data && data.terminal.serialNumber} />
              <DescList.Item label="Model" value={data && data.terminal.modelTerminal} />
              <DescList.Item label="Merchant" value={data && data.terminal.merchant.name} />
              <DescList.Item
                label="Deployment date"
                value={data && formatDate(data.terminal.deploymentDate, {formatType: 'dateOnly'})}
              />
              <DescList.Item
                label="Remarks"
                valueClassName="whitespace-pre-line"
                value={data && (data.terminal.remarks || '-')}
              />
            </DescList>
          </Card.Content>
        </Card>
        {permissions.includes(legacyTerminalRoles.view_tid_mid) && (
          <Card>
            <Card.Heading title="TID/MID Configuration">
              {!isLoading && (
                <Button
                  variant="outline"
                  leftIcon={<PlusIcon />}
                  minWidth="none"
                  onClick={() => setVisibleAddAcquirerModal(true)}>
                  ADD
                </Button>
              )}
            </Card.Heading>
            <TidMidConfiguration
              terminalId={props.terminalId}
              merchantId={props.merchantId}
              setVisibleModal={setVisibleUpdateAcquirerModal}
              setAcquirerId={setAcquirerId}
            />
          </Card>
        )}
        <Card>
          <Card.Heading title="Replacement" />
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item
                label="Old terminal ID"
                value={data && ((data.replacement && data.replacement.oldTerminalId) || '-')}
              />
              <DescList.Item
                label="Replaced terminal ID"
                value={data && ((data.replacement && data.replacement.replacedTerminalId) || '-')}
              />
              <DescList.Item
                label="Reason"
                value={data && ((data.replacement && data.replacement.reason) || '-')}
              />
              <DescList.Item
                label="Replaced date"
                value={
                  data &&
                  ((data.replacement &&
                    formatDate(data.replacement.replacementDate, {
                      formatType: 'dateOnly',
                    })) ||
                    '-')
                }
              />
              <DescList.Item
                label="Last batch ID"
                value={data && ((data.replacement && data.replacement.lastBatchId) || '-')}
              />
              <DescList.Item
                label="Last settle transaction ID"
                value={
                  data && ((data.replacement && data.replacement.settlementTransactionId) || '-')
                }
              />
              <DescList.Item
                label="Settlement range"
                value={data && ((data.replacement && data.replacement.settlementRange) || '-')}
              />
            </DescList>
          </Card.Content>
        </Card>
        <JsonPanel defaultOpen allowToggleFormat json={Object.assign({...data})} />
        {visibleModal && (
          <TerminalsModal
            terminal={data.terminal}
            visible={visibleModal}
            onClose={() => {
              setVisibleModal(false);
            }}
            onSuccessUpdate={(title) => showMessage({title})}
          />
        )}
        {visibleUpdateAcquirerModal && (
          <EditAcquirerModal
            acquirerId={acquirerId}
            terminal={data?.terminal}
            visible={visibleUpdateAcquirerModal}
            onClose={() => {
              setVisibleUpdateAcquirerModal(false);
            }}
            onSuccessUpdate={(title) => showMessage({title})}
          />
        )}
        {visibleAddAcquirerModal && (
          <AcquirerModal
            terminal={data?.terminal}
            visible={visibleAddAcquirerModal}
            onClose={() => {
              setVisibleAddAcquirerModal(false);
            }}
            onSuccessCreate={(title) => showMessage({title})}
          />
        )}
      </div>
    </>
  );
};
