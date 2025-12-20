import React, { createContext, useContext, useState } from "react";

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
  loading: boolean;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

let requestCount = 0; // 👈 IMPORTANT for parallel APIs

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    requestCount += 1;
    if (requestCount === 1) {
      setLoading(true);
    }
  };

  const hideLoader = () => {
    requestCount = Math.max(requestCount - 1, 0);
    if (requestCount === 0) {
      setLoading(false);
    }
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, loading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return context;
};
