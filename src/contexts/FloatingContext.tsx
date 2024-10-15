import useFloating from "@hooks/useFloating";
import React from "react";

type ContextType = ReturnType<typeof useFloating> | null;

export const FloatingContext = React.createContext<ContextType>(null);
