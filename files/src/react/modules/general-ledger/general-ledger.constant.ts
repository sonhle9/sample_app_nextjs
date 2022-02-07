export const GL_PROFILE_OPTIONS = ['GIFT_CARD', 'LOYALTY_CARD', 'FLEET_CARD'] as const;

export type glProfile = typeof GL_PROFILE_OPTIONS[number];
