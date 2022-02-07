import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {IPaginationResult} from 'src/react/lib/ajax';
import {
  createCustomFieldRule,
  createCustomFieldRuleMulti,
  deleteCustomFieldRule,
  getCustomFieldRuleDetail,
  getCustomFieldRules,
  updateCustomFieldRule,
  indexCustomerCategories,
  getMerchants,
  getCompanies,
} from './custom-field-rules.service';
import {ICustomFieldRule, IMutationCustomFieldRule, ENTITY_NAME} from './custom-field-rules.type';

const CUSTOM_FIELD_RULE = 'custom_field_rules';
const CUSTOM_FIELD_RULE_DETAIL = 'custom_field_rule_detail';
const CUSTOMER_CATEGORY = 'customer_categories';
const MERCHANT = 'MERCHANT';
const COMPANY = 'COMPANY';

type CustomFieldRulesResult = IPaginationResult<ICustomFieldRule>;

export const useCustomFieldRules = <Result = CustomFieldRulesResult>(
  filter: Parameters<typeof getCustomFieldRules>[0],
  options: UseQueryOptions<CustomFieldRulesResult, unknown, Result> = {},
) => {
  return useQuery([CUSTOM_FIELD_RULE, filter], () => getCustomFieldRules(filter), {
    keepPreviousData: true,
    ...options,
  });
};

export const useCustomFieldRuleDetails = (customFieldId: string) =>
  useQuery([CUSTOM_FIELD_RULE_DETAIL, customFieldId], () =>
    getCustomFieldRuleDetail(customFieldId),
  );

export const useSetCustomFieldRule = (currentCusFieldRule?: ICustomFieldRule) => {
  const queryClient = useQueryClient();
  return useMutation(
    (customFieldRule: IMutationCustomFieldRule) => {
      if (currentCusFieldRule) {
        return updateCustomFieldRule(customFieldRule);
      } else {
        if (
          customFieldRule?.entityName === ENTITY_NAME.MERCHANT ||
          customFieldRule?.entityName === ENTITY_NAME.CUSTOMER ||
          customFieldRule?.entityName === ENTITY_NAME.ITEM
        ) {
          return createCustomFieldRuleMulti(customFieldRule);
        } else {
          customFieldRule.entityCategorisationType = undefined;
          customFieldRule.entityCategorisationIds = undefined;
          return createCustomFieldRule(customFieldRule);
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CUSTOM_FIELD_RULE]);
        if (currentCusFieldRule) {
          queryClient.invalidateQueries([CUSTOM_FIELD_RULE_DETAIL, currentCusFieldRule.id]);
        }
      },
    },
  );
};

export const useDeleteCustomFieldRule = () => {
  const queryClient = useQueryClient();
  return useMutation((customFieldId: string) => deleteCustomFieldRule(customFieldId), {
    onSuccess: () => queryClient.invalidateQueries([CUSTOM_FIELD_RULE]),
  });
};

export const useListCustomerCategories = () => useQuery(CUSTOMER_CATEGORY, indexCustomerCategories);
export const useMerchants = (filters: any) => {
  return useQuery([MERCHANT, filters], () => getMerchants(filters), {
    keepPreviousData: true,
  });
};
export const useCompanies = (filters: any) => {
  return useQuery([COMPANY, filters], () => getCompanies(filters), {
    keepPreviousData: true,
  });
};
