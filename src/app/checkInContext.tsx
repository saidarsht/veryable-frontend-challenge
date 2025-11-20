"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import type { CheckInState } from "./types";

interface CheckInContextValue {
  state: CheckInState;
  checkIn: (opId: number, operatorId: number, code: string, expectedCode: string) => boolean;
  checkOut: (opId: number, operatorId: number, code: string, expectedCode: string) => boolean;
}

const CheckInContext = createContext<CheckInContextValue | undefined>(undefined);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckInState>({});

  const checkIn = (opId: number, operatorId: number, code: string, expectedCode: string): boolean => {
    if (code.trim() !== expectedCode.trim()) {
      return false;
    }

    setState((prev) => ({
      ...prev,
      [opId]: {
        ...(prev[opId] || {}),
        [operatorId]: {
          checkedInAt: new Date().toISOString(),
        },
      },
    }));

    return true;
  };

  const checkOut = (opId: number, operatorId: number, code: string, expectedCode: string): boolean => {
    if (code.trim() !== expectedCode.trim()) {
      return false;
    }

    setState((prev) => ({
      ...prev,
      [opId]: {
        ...(prev[opId] || {}),
        [operatorId]: {
          ...(prev[opId]?.[operatorId] || {}),
          checkedOutAt: new Date().toISOString(),
        },
      },
    }));

    return true;
  };

  return (
    <CheckInContext.Provider value={{ state, checkIn, checkOut }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error("useCheckIn must be used within CheckInProvider");
  }
  return ctx;
}

