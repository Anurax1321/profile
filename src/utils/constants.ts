export type Theme = 'minimal' | 'matrix' | 'cyberpunk' | 'got';

// Only cyberpunk is active while we perfect it. Re-add the others when ready.
export const THEMES: Theme[] = ['cyberpunk'];
// export const THEMES: Theme[] = ['minimal', 'matrix', 'cyberpunk', 'got'];

export const THEME_LABELS: Record<Theme, string> = {
  minimal: 'Minimal',
  matrix: 'Matrix',
  cyberpunk: 'Cyberpunk',
  got: 'Game of Thrones',
};
