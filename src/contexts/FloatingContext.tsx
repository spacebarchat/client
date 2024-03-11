import React from "react";
import useFloating from "../hooks/useFloating";

type ContextType = ReturnType<typeof useFloating> | null;

export const FloatingContext = React.createContext<ContextType>(null);
