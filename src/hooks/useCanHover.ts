import { useEffect, useState } from 'react';

/**
 * Hover springs only run on devices with a real pointer — on touch there is no
 * hover state to leave, so the animation would stick in its `to` position.
 */
export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return canHover;
}
