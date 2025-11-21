"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from "react";
import type { CheckInState } from "./types";

const STORAGE_KEY = "veryable-ops-checkins";

type CheckResult = { success: true } | { success: false; error: string };

interface CheckInContextValue {
  state: CheckInState;
  checkIn: (
    opId: number,
    operatorId: number,
    enteredCode: string,
    expectedCode: string
  ) => CheckResult;
  checkOut: (
    opId: number,
    operatorId: number,
    enteredCode: string,
    expectedCode: string
  ) => CheckResult;
}

const CheckInContext = createContext<CheckInContextValue | undefined>(
  undefined
);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckInState>(() => {
    if (typeof window === "undefined") return {};
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const checkIn = useCallback(
    (
      opId: number,
      operatorId: number,
      enteredCode: string,
      expectedCode: string
    ): CheckResult => {
      if (enteredCode.trim() !== expectedCode.trim()) {
        return { success: false, error: "Invalid check-in code." };
      }

      setState((prev) => {
        const opMap = prev[opId] ?? {};
        const existing = opMap[operatorId] ?? {};
        return {
          ...prev,
          [opId]: {
            ...opMap,
            [operatorId]: {
              ...existing,
              checkedInAt: new Date().toISOString(),
            },
          },
        };
      });

      return { success: true };
    },
    []
  );

  const checkOut = useCallback(
    (
      opId: number,
      operatorId: number,
      enteredCode: string,
      expectedCode: string
    ): CheckResult => {
      if (enteredCode.trim() !== expectedCode.trim()) {
        return { success: false, error: "Invalid check-out code." };
      }

      setState((prev) => {
        const opMap = prev[opId] ?? {};
        const existing = opMap[operatorId] ?? {};
        return {
          ...prev,
          [opId]: {
            ...opMap,
            [operatorId]: {
              ...existing,
              checkedOutAt: new Date().toISOString(),
            },
          },
        };
      });

      return { success: true };
    },
    []
  );

  const value = useMemo<CheckInContextValue>(
    () => ({
      state,
      checkIn,
      checkOut,
    }),
    [state, checkIn, checkOut]
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error("useCheckIn must be used within CheckInProvider");
  }
  return ctx;
}
