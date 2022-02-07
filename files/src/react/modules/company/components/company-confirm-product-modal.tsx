import * as React from 'react';
import {Button, Modal} from '@setel/portal-ui';

interface ICompanyConfirmProductModal {
  showModal: boolean;
  companyId?: string;
  onClose?: () => void;
  onConfirm: () => void;
}
export const CompanyConfirmProductModal = (props: ICompanyConfirmProductModal) => {
  return (
    <>
      <Modal aria-label="Continue to proceed" isOpen={props.showModal} onDismiss={props.onClose}>
        <Modal.Header>Continue to proceed</Modal.Header>
        <Modal.Body>
          <div>
            There are merchants having this product set to true. Turning off this product at company
            level will bring those merchants not to have that product enabled anymore. Continue to
            proceed?
          </div>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button onClick={props.onClose} variant="outline" className="mr-2">
            CANCEL
          </Button>
          <Button onClick={props.onConfirm} variant="primary">
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
