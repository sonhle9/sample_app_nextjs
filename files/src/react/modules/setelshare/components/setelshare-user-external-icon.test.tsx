import {cleanup, screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from '../../../lib/test-helper';
import {SetelShareUserExternalIcon} from './setelshare-user-external-icon';

describe(`<SetelShareUserExternalIcon />`, () => {
  afterAll(() => {
    cleanup();
  });

  it('should renders upload modal', async () => {
    renderWithConfig(<SetelShareUserExternalIcon userId="userId" />);
    expect(await screen.findByTestId('setelshare-datail-navigate-to-account-detail')).toBeDefined();
  });
});
