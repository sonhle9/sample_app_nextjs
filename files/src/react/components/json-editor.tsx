import {JsonViewer, Textarea, Field} from '@setel/portal-ui';
import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from './error-fallback';

export interface JsonEditorProps {
  json: object;
  onChange: (value: object) => void;
  onValidityChange: (isValid: boolean) => void;
}

export const JsonEditor = (props: JsonEditorProps) => {
  const [jsonString, setJsonString] = React.useState('');
  const prevValue = React.useRef(jsonString);

  React.useEffect(() => {
    try {
      const providedString = JSON.stringify(props.json, null, 2);
      const stringVal = JSON.stringify(props.json);
      if (stringVal !== prevValue.current) {
        setJsonString(providedString);
      }
    } catch (err) {}
  }, [props.json]);

  const parsedValue = React.useMemo(() => {
    if (jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (err) {}
    }
    return null;
  }, [jsonString]);

  React.useEffect(() => {
    if (parsedValue) {
      const newValueStr = JSON.stringify(parsedValue);
      if (newValueStr !== prevValue.current) {
        props.onChange(parsedValue);
        props.onValidityChange(true);
        prevValue.current = newValueStr;
      }
    } else {
      props.onValidityChange(false);
    }
  }, [parsedValue]);

  return (
    <Field status={!parsedValue ? 'error' : undefined}>
      <div className="grid gap-5 lg:grid-cols-2">
        <Textarea value={jsonString} onChangeValue={setJsonString} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <JsonViewer json={props.json as any} />
        </ErrorBoundary>
      </div>
    </Field>
  );
};
