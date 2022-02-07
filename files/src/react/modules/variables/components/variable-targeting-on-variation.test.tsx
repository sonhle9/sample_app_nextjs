import {getOnVariationLabel} from './variable-targeting-on-variation';

describe('getOnVariationLabel', () => {
  it('formats distributions', () => {
    expect(getOnVariationLabel([])).toEqual('');
    expect(getOnVariationLabel([{variantKey: 'foo', percent: 100}])).toEqual('foo');
    expect(
      getOnVariationLabel([
        {variantKey: 'foo', percent: 50},
        {variantKey: 'bar', percent: 50},
      ]),
    ).toEqual('Percentage rollout');
  });
});
