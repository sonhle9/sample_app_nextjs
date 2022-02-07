import * as React from 'react';
import {DescItem, Skeleton, SkeletonProps} from '@setel/portal-ui';

interface SkeletonDescItemProps extends SkeletonProps {
  label: String;
  value: React.ReactNode;
  isLoading: Boolean;
  emptyValue?: String;
}

interface SkeletonContentProps extends SkeletonProps {
  content: React.ReactNode;
  isLoading: Boolean;
  emptyValue?: String;
}

export const SkeletonContent = ({
  isLoading,
  content,
  emptyValue = '-',
  ...props
}: SkeletonContentProps) => <>{isLoading ? <Skeleton {...props} /> : content || emptyValue}</>;

export const SkeletonDescItem = ({
  label,
  isLoading,
  value,
  emptyValue = '-',
  ...props
}: SkeletonDescItemProps) => (
  <DescItem label={label} value={isLoading ? <Skeleton {...props} /> : value || emptyValue} />
);
