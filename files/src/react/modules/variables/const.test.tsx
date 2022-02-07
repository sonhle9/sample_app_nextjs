import {
  canRemoveVariant,
  getFullDistributions,
  removeVariant,
  replaceVariant,
  VariableState,
  VariableType,
} from './const';

describe('replaceVariant', () => {
  it('replaces variant', () => {
    const variable = {
      version: 1,
      isArchived: false,
      key: 'test',
      name: 'test',
      group: 'app',
      type: VariableType.Number,
      isToggled: true,
      createdBy: 'test',
      updatedBy: 'test',
      createdAt: 1572355719,
      updatedAt: 1603260224,
      state: VariableState.Created,
      variants: {foo: {key: 'foo', value: 0}, bar: {key: 'bar', value: 1}},
      onVariation: [{variantKey: 'foo', percent: 100}],
      offVariation: 'bar',
      targets: [{priority: 0, constraints: [], distributions: [{variantKey: 'foo', percent: 100}]}],
    };

    expect(replaceVariant(variable, 'foo', {key: 'foo2', value: 0})).toEqual({
      variants: {foo2: {key: 'foo2', value: 0}, bar: {key: 'bar', value: 1}},
      onVariation: [{variantKey: 'foo2', percent: 100}],
      offVariation: 'bar',
      targets: [
        {priority: 0, constraints: [], distributions: [{variantKey: 'foo2', percent: 100}]},
      ],
    });
  });
});

describe('removeVariant', () => {
  const variable = {
    version: 1,
    isArchived: false,
    key: 'test',
    name: 'test',
    group: 'app',
    type: VariableType.Number,
    isToggled: true,
    createdBy: 'test',
    updatedBy: 'test',
    createdAt: 1572355719,
    updatedAt: 1603260224,
    state: VariableState.Created,
    variants: {
      foo: {key: 'foo', value: 0},
      bar: {key: 'bar', value: 1},
      baz: {key: 'baz', value: 2},
    },
    onVariation: [{variantKey: 'foo', percent: 100}],
    offVariation: 'bar',
    targets: [
      {
        priority: 0,
        constraints: [],
        distributions: [
          {variantKey: 'bar', percent: 100},
          {variantKey: 'baz', percent: 0},
        ],
      },
    ],
  };

  it('keeps variant', () => {
    expect(canRemoveVariant(variable, 'foo')).toBeFalsy();
    expect(canRemoveVariant(variable, 'bar')).toBeFalsy();
  });

  it('removes variant', () => {
    expect(canRemoveVariant(variable, 'baz')).toBeTruthy();
    expect(removeVariant(variable, 'baz')).toEqual({
      variants: {
        foo: {key: 'foo', value: 0},
        bar: {key: 'bar', value: 1},
      },
      onVariation: [{variantKey: 'foo', percent: 100}],
      targets: [
        {
          priority: 0,
          constraints: [],
          distributions: [{variantKey: 'bar', percent: 100}],
        },
      ],
    });
  });
});

describe('removeVariant', () => {
  const variable = {
    version: 1,
    isArchived: false,
    key: 'test',
    name: 'test',
    group: 'app',
    type: VariableType.Number,
    isToggled: true,
    createdBy: 'test',
    updatedBy: 'test',
    createdAt: 1572355719,
    updatedAt: 1603260224,
    state: VariableState.Created,
    variants: {
      foo: {key: 'foo', value: 0},
    },
    onVariation: [],
    offVariation: null,
    targets: [],
  };

  it('removes variant from empty onVariation', () => {
    expect(canRemoveVariant(variable, 'foo')).toBeTruthy();
    expect(removeVariant(variable, 'foo')).toEqual({
      variants: {},
      onVariation: [],
      targets: [],
    });
  });
});

describe('getFullDistributions', () => {
  it('fills unset distributions', () => {
    expect(getFullDistributions([{variantKey: 'foo', percent: 100}], ['foo', 'bar'])).toEqual([
      {variantKey: 'foo', percent: 100},
      {variantKey: 'bar', percent: 0},
    ]);
  });
});
