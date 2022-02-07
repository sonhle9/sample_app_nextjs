export enum DealStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  LAUNCHED = 'LAUNCHED',
  STOPPED = 'STOPPED',
  ARCHIVED = 'ARCHIVED',
}

export const StateTransitionFrom: Record<string, DealStatus[]> = {
  [DealStatus.PENDING]: [DealStatus.APPROVED, DealStatus.REJECTED],
  [DealStatus.LAUNCHED]: [DealStatus.REJECTED],
  [DealStatus.REJECTED]: [DealStatus.APPROVED],
  [DealStatus.APPROVED]: [DealStatus.REJECTED],
};

export enum DealPriceUnit {
  POINTS = 'POINTS',
}
