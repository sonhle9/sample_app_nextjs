import * as React from 'react';
import {DropdownSelect} from '@setel/portal-ui';

/**
 * Testable dropdown.
 */
export function Dropdown({
  options,
  value,
  onChangeValue,
  'data-testid': testId,
  ...props
}: {
  options: {label: string; value: string}[];
  value: string;
  onChangeValue?: (value: string, label: string) => void;
  'data-testid'?: string;
} & {[x: string]: any}) {
  return (
    <>
      <DropdownSelect {...props} options={options} value={value} onChangeValue={onChangeValue} />
      <select
        className="hidden"
        onChange={(e) =>
          onChangeValue(
            e.target.value,
            options.find((option) => option.value === e.target.value).label,
          )
        }
        data-testid={testId}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
