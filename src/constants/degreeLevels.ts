export const degreeLevels = ['bachelor', 'masters', 'phd'] as const;

export type DegreeLevel = (typeof degreeLevels)[number];

