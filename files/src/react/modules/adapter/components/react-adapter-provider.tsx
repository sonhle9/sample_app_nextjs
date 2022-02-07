import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ErrorFallback} from 'src/react/components/error-fallback';
import {AuthContext} from 'src/react/modules/auth/auth.context';
import {RoutingContext, QueryParamsProvider} from 'src/react/routing/routing.context';
import {ReactAdapterService} from '../react-adapter.service';
import type {ActivatedRoute} from '@angular/router';

export interface IReactAdapterProviderProps {
  children: React.ReactNode;
  adapterService: ReactAdapterService;
  activatedRoute: ActivatedRoute;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

/**
 * Provider to inject requires services for React to works with Angular
 */
export const ReactAdapterProvider = ({
  adapterService,
  activatedRoute,
  children,
}: IReactAdapterProviderProps) => {
  const permissions = adapterService.authService.getRoles();
  const session = adapterService.authService.getSessionData();
  const sessionPayload = adapterService.authService.getSession();
  const roles = adapterService.authService.getRoles();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(err) => adapterService.newRelicErrorHandler.handleError(err)}>
      <QueryClientProvider client={queryClient}>
        <RoutingContext.Provider value={adapterService.router}>
          <AuthContext.Provider
            value={React.useMemo(
              () => ({
                permissions,
                session,
                sessionPayload,
                roles,
              }),
              [permissions, session, sessionPayload, roles],
            )}>
            <QueryParamsProvider activatedRoute={activatedRoute}>
              <div className="font-sans">{children}</div>
            </QueryParamsProvider>
          </AuthContext.Provider>
        </RoutingContext.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
