import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {useVariableDetails} from '../../variables/variables.queries';
import {SupportOutageVariantEnum, SUPPORT_OUTAGE_VARIABLE_KEY} from '../contants/outage.contants';
import {isChatOutageOn} from '../outage.helper';
import {OutageChatSupportModal} from './outage-chat-support-modal';

export const OutageChatSupport = () => {
  const {
    data: chatVariables,
    isLoading,
    isError,
  } = useVariableDetails(SUPPORT_OUTAGE_VARIABLE_KEY, {
    retry: (retryCount, err) => {
      return err?.response?.status !== 404 && retryCount < 3;
    },
  });

  const [showOutageChatModal, setShowOutageChatModal] = React.useState(false);

  return (
    <>
      <div className="mb-8">
        <Card>
          <CardHeading title="Maintenance override: Live chat">
            <Button
              onClick={() => setShowOutageChatModal(true)}
              variant="outline"
              minWidth="none"
              leftIcon={<EditIcon />}
              data-testid="edit-chat-button">
              EDIT
            </Button>
          </CardHeading>
          <CardContent>
            {isError ? (
              <p>Variable not created</p>
            ) : (
              <DescList className="grid-cols-2" isLoading={isLoading}>
                <DescItem
                  labelClassName="sm:text-black"
                  valueClassName="text-right font-medium"
                  label="Live chat"
                  value={
                    chatVariables &&
                    (isChatOutageOn(chatVariables.offVariation as SupportOutageVariantEnum)
                      ? 'ON'
                      : 'OFF')
                  }
                />
              </DescList>
            )}
          </CardContent>
        </Card>
      </div>
      {chatVariables && showOutageChatModal && (
        <OutageChatSupportModal
          chatVariable={chatVariables}
          onClose={() => setShowOutageChatModal(false)}
        />
      )}
    </>
  );
};
