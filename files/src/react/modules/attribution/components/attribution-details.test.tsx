import {screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ATTRIBUTE_RULES} from 'src/react/services/mocks/api-attributes.service.mock';
import {ATTR_RULE_TYPE_LABELS} from '../const';
import {AttributionRuleType} from '../types';
import {AttributionDetails} from './attribution-details';

describe(`<AttributionDetails />`, () => {
  it('render with details', async () => {
    const attributionDetails = ATTRIBUTE_RULES[0];

    renderWithConfig(<AttributionDetails id={attributionDetails.id} />);

    const referenceId = await screen.findByText(attributionDetails.referenceId);
    expect(referenceId).toBeDefined();

    const typeLabel = ATTR_RULE_TYPE_LABELS[AttributionRuleType.ACCOUNT_REGISTRATION];

    expect(await screen.findByText(typeLabel)).toBeDefined();
  });
});
