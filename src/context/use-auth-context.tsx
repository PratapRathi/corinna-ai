"use client"
import React, { useState } from "react";

type InitialValuesProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const initialValue: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
};

const AuthContext = React.createContext<InitialValuesProps>(initialValue);

const { Provider } = AuthContext;

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialValue.currentStep);

  const values = {
    currentStep,
    setCurrentStep,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useAuthContextHook = () => {
    const state = React.useContext(AuthContext);
    return state;
}