import {screen} from '@testing-library/react';
import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {AttributionEdit} from './attribution-edit';
import {
  AttributionRuleMetadata,
  AttributionRuleReferenceSource,
  AttributionRuleType,
} from '../types';
import {environment} from 'src/environments/environment';

const SAMPLE_RULE = {
  id: 'abcdef123456',
  type: AttributionRuleType.ACCOUNT_REGISTRATION,
  referenceSource: AttributionRuleReferenceSource.REWARD_CAMPAIGN,
  referenceId: 'refIdAbc123',
  metadata: [
    {key: AttributionRuleMetadata.NETWORK, value: 'test network'},
    {key: AttributionRuleMetadata.CHANNEL, value: 'test channel'},
    {key: AttributionRuleMetadata.CAMPAIGN, value: 'test campaign'},
  ],
  createdAt: '2020-09-28T05:50:42.094Z',
  updatedAt: '2020-09-28T05:50:42.094Z',
};

describe(`<AttributionEdit />`, () => {
  const deleteRule = async () => {
    const btnEdit = await screen.findByTestId('btn-edit');
    user.click(btnEdit);

    const btnDelete = await screen.findByTestId('btn-delete');
    user.click(btnDelete);

    const btnConfirmDelete = await screen.findByTestId('btn-confirm-delete');
    user.click(btnConfirmDelete);
  };

  const fillUpAndSubmitForm = async () => {
    const btnEdit = await screen.findByTestId('btn-edit');
    user.click(btnEdit);

    const ddType = await screen.findByTestId('dd-type');
    user.click(ddType);
    user.click(screen.getAllByRole('option', {hidden: true})[0]);

    const ddReferenceSource = await screen.findByTestId('dd-reference-source');
    user.click(ddReferenceSource);
    user.click(screen.getByRole('option', {name: 'Referrer code', hidden: true}));

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
      rest.put(
        `${environment.attributesApiBaseUrl}/api/attributes/admin/rules/:id`,
        (_, res, ctx) => {
          return res(ctx.status(201), ctx.json(SAMPLE_RULE));
        },
      ),
    );

    renderWithConfig(<AttributionEdit attributeRule={SAMPLE_RULE} />);

    await fillUpAndSubmitForm();
    const successNotification = await screen.findByText('Attribution rule successfully updated!');
    expect(successNotification).toBeDefined();
  });

  it(
    'unsuccessfully submit form with details',
    suppressConsoleLogs(async () => {
      server.use(
        rest.put(
          `${environment.attributesApiBaseUrl}/api/attributes/admin/rules/:id`,
          (_, res, ctx) => {
            return res(ctx.status(409), ctx.json({}));
          },
        ),
      );

      renderWithConfig(<AttributionEdit attributeRule={SAMPLE_RULE} />);

      await fillUpAndSubmitForm();
      const errorNotification = await screen.findByText(
        'Error occured while updating attribution rule!',
      );
      expect(errorNotification).toBeDefined();
    }),
  );

  it('delete reference id', async () => {
    server.use(
      rest.delete(
        `${environment.attributesApiBaseUrl}/api/attributes/admin/rules/:id`,
        (_, res, ctx) => {
          return res(ctx.status(201), ctx.json(true));
        },
      ),
    );

    renderWithConfig(<AttributionEdit attributeRule={SAMPLE_RULE} />);

    await deleteRule();

    const successNotification = await screen.findByText('Attribution rule successfully deleted!');
    expect(successNotification).toBeDefined();
  });

  it(
    'unsuccessfully delete reference id',
    suppressConsoleLogs(async () => {
      server.use(
        rest.delete(
          `${environment.attributesApiBaseUrl}/api/attributes/admin/rules/:id`,
          (_, res, ctx) => {
            return res(ctx.status(409), ctx.json({}));
          },
        ),
      );

      renderWithConfig(<AttributionEdit attributeRule={SAMPLE_RULE} />);

      await deleteRule();
      const errorNotification = await screen.findByText(
        'Error occured while deleting attribution rule!',
      );
      expect(errorNotification).toBeDefined();
    }),
  );
});
