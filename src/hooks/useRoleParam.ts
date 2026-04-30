import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROLE_IDS, type RoleId } from '../data/projects';

const PARAM = 'role';
const DEFAULT_ROLE: RoleId = 'swe';

function isRoleId(v: string | null): v is RoleId {
  return v !== null && (ROLE_IDS as string[]).includes(v);
}

/**
 * Single source of truth for the active role tab. Backed by the `?role=` URL
 * search param so:
 *   - Selection persists across hero <-> /work navigation
 *   - Browser back/forward preserves the tab
 *   - Deep links like /work?role=aiml land on the right filter
 *
 * Always returns a valid RoleId. Invalid or missing param falls back to 'swe'.
 */
export function useRoleParam(): {
  role: RoleId;
  setRole: (next: RoleId) => void;
} {
  const [params, setParams] = useSearchParams();
  const raw = params.get(PARAM);
  const role: RoleId = isRoleId(raw) ? raw : DEFAULT_ROLE;

  const setRole = useCallback(
    (next: RoleId) => {
      setParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          updated.set(PARAM, next);
          return updated;
        },
        { replace: false },
      );
    },
    [setParams],
  );

  return { role, setRole };
}
