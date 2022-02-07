import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {Formik} from 'formik';
import {renderWithConfig} from 'src/react/lib/test-helper';

import {UpdateTagsModal} from './update-tags-modal';
import {IUserProfile} from '../../../../services/api-accounts.service';

afterEach(cleanup);

describe(`<UpdateTagsModal />`, () => {
  it('should render UpdateTagsModal', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <UpdateTagsModal
            customerId="customerId"
            data={
              {
                tags: ['testing'],
              } as IUserProfile
            }
            onDismiss={() => {}}
          />
        )}
      </Formik>,
    );

    const modal = within(screen.getByTestId('customer-update-tags-modal'));

    const tagsMultiInput = modal.getByTestId('customer-tags-multi-input');

    expect(tagsMultiInput).toBeDefined();

    expect((modal.getByTestId('submit-btn') as HTMLButtonElement).disabled).toBeFalsy();
  });
});
