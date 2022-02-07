import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Alert,
  AlertMessages,
  titleCase,
  Field,
  Label,
  SearchableDropdown,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {useGetMerchantsManual} from '../../cards/card.queries';
import {Merchant} from '../../merchants/merchants.type';
import {useGetTerminalsByMerchant} from '../../terminals/terminals.queries';

interface ITransactionManualMerchantModalProps {
  visible: boolean;
  terminal: string;
  merchant: Merchant;
  onClose?: () => void;
}

export const TransactionManualMerchantModal: React.VFC<ITransactionManualMerchantModalProps> = (
  props,
) => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState([]);
  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };
  const [name, setName] = React.useState<string>(props?.merchant?.name);
  const {data: merchants} = useGetMerchantsManual({name});
  const [merchant, setMerchant] = React.useState<string>(props?.merchant?.merchantId || '');
  const [terminal, setTerminal] = React.useState<string>(props?.terminal || '');
  const {data: terminals} = useGetTerminalsByMerchant({
    merchantId: merchant,
    terminalId: terminal,
  });
  return (
    <>
      <Modal
        size="small"
        isOpen={props.visible}
        onDismiss={close}
        aria-label="Create manual transaction">
        <ModalHeader>Create manual transaction</ModalHeader>
        <ModalBody>
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg.map((messageError) => titleCase(messageError))} />
            </Alert>
          )}

          <Field className="grid grid-cols-3 grid-flow-row gap-3 mb-5">
            <Label className="flex items-center">Merchant</Label>
            <div className="col-span-2">
              <SearchableDropdown
                placeholder="Enter merchant name"
                onChange={(e) => setName(e.target.value)}
                value={merchant}
                onChangeValue={(value) => {
                  setMerchant(value);
                  setTerminal(undefined);
                }}
                options={merchants}
                wrapperClass="col-span-2"
              />
            </div>
          </Field>

          <Field className="grid grid-cols-3 grid-flow-row gap-3">
            <Label className="flex items-center">Terminal ID</Label>
            <div className="col-span-2">
              <SearchableDropdown
                value={terminal}
                onChangeValue={(value) => setTerminal(value)}
                onChange={(e) => setTerminal(e.target.value)}
                options={terminals || []}
                placeholder="Select terminal ID"
                disabled={!merchant}
              />
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-between">
            <span></span>
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                variant="primary"
                disabled={merchant && terminal ? false : true}
                onClick={() => {
                  close();
                  router.navigateByUrl(
                    `/card-issuing/settlement-batch?merchant=${merchant}&terminal=${terminal}`,
                  );
                }}>
                CONTINUE
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
