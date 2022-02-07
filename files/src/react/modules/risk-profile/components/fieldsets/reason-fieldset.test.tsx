import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {Formik} from 'formik';

import {ReasonFieldset} from './reason-fieldset';

afterEach(cleanup);

describe(`<ReasonFieldset />`, () => {
  it('should render ReasonFieldset', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <ReasonFieldset checkForOptions={[]} />}
      </Formik>,
    );

    const fieldset = within(screen.getByTestId('reason-fieldset'));

    expect(fieldset.getByTestId('check-for-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-remarks')).toBeDefined();
  });
});
