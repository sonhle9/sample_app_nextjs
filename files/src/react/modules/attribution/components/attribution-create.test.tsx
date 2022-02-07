import {screen} from '@testing-library/react';
import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {AttributionCreate} from './attribution-create';
import {ATTR_RULE_SOURCE_LABELS, ATTR_RULE_TYPE_LABELS} from '../const';
import {AttributionRuleMetadata} from '../types';
import {environment} from 'src/environments/environment';

describe(`<AttributionCreate />`, () => {
  const fillUpAndSubmitForm = async () => {
    const btnCreate = await screen.findByTestId('btn-create');
    user.click(btnCreate);

    const ddType = await screen.findByTestId('dd-type');
    user.click(ddType);
    user.click(
      screen.getByRole('option', {
        name: ATTR_RULE_TYPE_LABELS.account_registration,
        hidden: true,
      }),
    );

    const ddReferenceSource = await screen.findByTestId('dd-reference-source');
    user.click(ddReferenceSource);
    user.click(
      screen.getByRole('option', {
        name: ATTR_RULE_SOURCE_LABELS.referrer_code,
        hidden: true,
      }),
    );

    const txtReferenceId = await screen.findByTestId('txt-reference-id');
    user.type(txtReferenceId, 'testReferenceId');

    const txtMetadataNetwork = await screen.findByTestId(
      `txt-metadata-${AttributionRuleMetadata.NETWORK}`,
    );
    user.type(txtMetadataNetwork, 'test metadata');
    const txtMetadataChannel = await screen.findByTestId(
      `txt-metadata-${AttributionRuleMetadata.CHANNEL}`,
    );
    user.type(txtMetadataChannel, 'test metadata');
    const txtMetadataCampaign = await screen.findByTestId(
      `txt-metadata-${AttributionRuleMetadata.CAMPAIGN}`,
    );
    user.type(txtMetadataCampaign, 'test metadata');

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);

    const btnConfirmSave = await screen.findByTestId('btn-confirm-save');
    user.click(btnConfirmSave);
  };

  it('submit form with details', async () => {
    server.use(
      rest.post(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules`, (_, res, ctx) => {
        return res(ctx.status(201), ctx.json({}));
      }),
    );

    renderWithConfig(<AttributionCreate />);

    await fillUpAndSubmitForm();
    const successNotification = await screen.findByText('Attribution rule successfully created!');
    expect(successNotification).toBeDefined();
  });

  it(
    'failed submit form with details',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(
          `${environment.attributesApiBaseUrl}/api/attributes/admin/rules`,
          (_, res, ctx) => {
            return res(ctx.status(409), ctx.json({}));
          },
        ),
      );

      renderWithConfig(<AttributionCreate />);

      await fillUpAndSubmitForm();
      const errorNotification = await screen.findByText(
        'Error occured while creating new attribution rule!',
      );
      expect(errorNotification).toBeDefined();
    }),
  );
});
