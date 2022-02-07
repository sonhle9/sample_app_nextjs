import {render} from '@testing-library/react';
import * as React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {RoutingContext} from 'src/react/routing/routing.context';
import {AuthContext} from 'src/react/modules/auth';
import {flattenArray} from '@setel/portal-ui';
import {NotificationDisplay} from 'src/react/hooks/use-notification';
import * as roles from 'src/shared/helpers/roles.type';

const allPermissions = flattenArray(
  Object.values(roles).map((roleObjects) => Object.values(roleObjects)),
);

export const renderWithConfig = (
  ui: React.ReactElement,
  {
    url = '',
    navigateByUrl = () => {},
    navigate = () => {},
    permissions = allPermissions,
    roles = [''],
  } = {},
) => {
  const router: any = {
    url,
    navigate,
    navigateByUrl,
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    ...render(
      <RoutingContext.Provider value={router}>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider
            value={{
              permissions,
              roles,
              session: null,
              sessionPayload: null,
            }}>
            {ui}
          </AuthContext.Provider>
        </QueryClientProvider>
        <NotificationDisplay />
      </RoutingContext.Provider>,
    ),
    queryClient,
  };
};

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T] &
  string;

/**
 * WARN: This may make it harder to debug your test.
 *
 * suppress console.error in your test when you testing exceptional edge case, which usually will have helpful error message
 * but make our test log noisy.
 *
 */
export function suppressConsoleLogs<T extends unknown[]>(
  cb: (...args: T) => unknown,
  type: FunctionPropertyNames<typeof global.console> = 'error',
) {
  return (...args: T) => {
    let spy = jest.spyOn(global.console, type).mockImplementation(jest.fn());

    return new Promise<unknown>((resolve, reject) => {
      Promise.resolve(cb(...args)).then(resolve, reject);
    }).finally(() => spy.mockRestore());
  };
}
