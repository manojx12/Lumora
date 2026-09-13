import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { UIContext, type UIState } from './ui-context';
import { startScroll, stopScroll } from '../lib/scroll';

/** Owns the cross-cutting UI state: intro gate, nav overlay, request modal. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    stopScroll();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    startScroll();
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    stopScroll();
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    startScroll();
  }, []);

  const value = useMemo<UIState>(
    () => ({ ready, setReady, menuOpen, openMenu, closeMenu, modalOpen, openModal, closeModal }),
    [ready, menuOpen, openMenu, closeMenu, modalOpen, openModal, closeModal],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
