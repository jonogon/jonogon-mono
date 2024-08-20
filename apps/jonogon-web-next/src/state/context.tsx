import {
  createContext,
  useContext,
  type PropsWithChildren,
  useMemo,
} from "react";

import type { TState } from "./state.mjs";
import { action } from "mobx";
type UpdateFunction = (store: TState) => void;

export type TActionFactory = (store: TState) => (...args: any[]) => any;

export const storeContext = createContext<{
  store: TState;
  actionMap: WeakMap<
    (store: TState) => (...args: any[]) => any,
    (...args: any[]) => any
  >;
} | null>(null);

export type TStoreProviderProps = PropsWithChildren<{
  store: TState;
}>;

export function StoreProvider({ store, children }: TStoreProviderProps) {
  const value = useMemo(() => {
    return {
      store: store,
      actionMap: new WeakMap(),
    };
  }, [store]);

  return (
    <storeContext.Provider value={value}>{children}</storeContext.Provider>
  );
}

export function useStore(): TState {
  const contextValue = useContext(storeContext);

  if (!contextValue) {
    throw new Error("must be called within a state context provider subtree");
  }

  return contextValue.store;
}

export function useStoreSetter() {
  const store = useStore();

  const setStore = (updateFunction: UpdateFunction) => {
    updateFunction(store);
  };

  useAction(() => setStore);

  return setStore;
}

export function useAction<FACTORY extends TActionFactory>(
  factory: FACTORY
): ReturnType<FACTORY> {
  const contextValue = useContext(storeContext);

  if (!contextValue) {
    throw new Error("must be called within a state context provider subtree");
  }

  if (!contextValue.actionMap.has(factory)) {
    contextValue.actionMap.set(factory, action(factory(contextValue.store)));
  }

  return contextValue.actionMap.get(factory) as ReturnType<FACTORY>;
}
