"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HistoryItem } from "@/types";

const MAX_ITEMS = 5;

type HistoryContextValue = {
  items: HistoryItem[];
  push: (item: HistoryItem) => void;
  clear: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const push = useCallback((item: HistoryItem) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      return [item, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<HistoryContextValue>(
    () => ({ items, push, clear }),
    [items, push, clear],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

function useHistoryContext(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistory* deve ser usado dentro de <HistoryProvider>");
  }
  return ctx;
}

export function useHistory() {
  return useHistoryContext().items;
}

export function useHistoryDispatch() {
  return useHistoryContext().push;
}

export function useHistoryClear() {
  return useHistoryContext().clear;
}
