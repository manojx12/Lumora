import { createContext, useContext } from 'react';

export interface UIState {
  /** True once the intro loader has left — every hero reveal is gated on it. */
  ready: boolean;
  setReady: (ready: boolean) => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const UIContext = createContext<UIState | null>(null);

export function useUI(): UIState {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used inside <UIProvider>');
  return context;
}
