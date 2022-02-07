export const requiredText = (label: string) => `Please enter ${label}`;
export const requiredOption = (label: string) => `Please select ${label}`;
export const positiveMessage = (label: string) => `${label} must be more than 0.00`;
export const minMessage = (label: string, minValue: number) =>
  `${label} must be greater than or equal to ${minValue}`;

export const maxMessage = (label: string, maxValue: number) =>
  `${label} must be less than or equal to ${maxValue}`;
