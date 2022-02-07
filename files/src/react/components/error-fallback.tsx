import {Alert, Button} from '@setel/portal-ui';
import * as React from 'react';
import {FallbackProps} from 'react-error-boundary';

export const ErrorFallback = (props: FallbackProps) => (
  <Alert variant="error">
    <p>Something went wrong</p>
    {props.error && <pre>{props.error.message}</pre>}
    <div>
      <Button onClick={props.resetErrorBoundary}>Try again</Button>
    </div>
  </Alert>
);
