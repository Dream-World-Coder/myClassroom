import React, { createContext, useContext, useState, useEffect } from "react";

type DarkModeContextType = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: (value: boolean) => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export default function DarkModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const applyDarkMode = (isDark: boolean): void => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("isDarkModeOn");

    const initialDarkMode = savedDarkMode
      ? JSON.parse(savedDarkMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDarkMode(initialDarkMode);
    applyDarkMode(initialDarkMode);
  }, []);

  const toggleDarkMode = (value: boolean): void => {
    setIsDarkMode(value);
    localStorage.setItem("isDarkModeOn", JSON.stringify(value));
    applyDarkMode(value);
  };

  const value = { isDarkMode, setIsDarkMode, toggleDarkMode };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
