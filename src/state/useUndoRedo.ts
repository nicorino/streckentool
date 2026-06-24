import { useCallback, useState } from "react";

const MAX_HISTORY_LENGTH = 100;

type UndoRedoState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type SetValue<T> = T | ((current: T) => T);

export function useUndoRedo<T>(initialValue: T) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialValue,
    future: [],
  });

  const set = useCallback((nextValue: SetValue<T>) => {
    setState((currentState) => {
      const nextPresent =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(currentState.present)
          : nextValue;

      if (Object.is(nextPresent, currentState.present)) {
        return currentState;
      }

      return {
        past: [
          ...currentState.past.slice(-(MAX_HISTORY_LENGTH - 1)),
          currentState.present,
        ],
        present: nextPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((nextPresent: T) => {
    setState({
      past: [],
      present: nextPresent,
      future: [],
    });
  }, []);

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) {
        return currentState;
      }

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) {
        return currentState;
      }

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    value: state.present,
    set,
    reset,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
