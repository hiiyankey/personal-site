"use client";

import React from "react";
import useKeyboardShortcut from "../use-keyboard-shortcut/use-keyboard-shortcut";

// biome-ignore lint/style/noEnum: shh!
enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

const KEY = "mode";

const defaultContextData = {
  dark: false,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: shh!
  toggleDark: () => {},
};

export const ThemeContext = React.createContext(defaultContextData);

const useTheme = () => React.useContext(ThemeContext);

const storage = {
  get: (init?: Theme) => window.localStorage.getItem(KEY) || init,
  set: (value: Theme) => window.localStorage.setItem(KEY, value),
};

const supportsDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches === true;

const useDarkMode = (): [Theme, (theme?: Theme) => void] => {
  const [themeState, setThemeState] = React.useState(Theme.LIGHT);

  const setThemeStateEnhanced = (themeValue?: Theme) => {
    setThemeState((prevState) => {
      const nextState = themeValue
        ? themeValue
        : // biome-ignore lint/style/noNestedTernary: shh!
          prevState === Theme.LIGHT
          ? Theme.DARK
          : Theme.LIGHT;

      document.documentElement.classList.remove(prevState);
      document.documentElement.classList.add(nextState);
      storage.set(nextState);

      return nextState;
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  React.useEffect(() => {
    const storedMode = storage.get();
    if (!storedMode && supportsDarkMode()) {
      return setThemeStateEnhanced(Theme.DARK);
    }

    if (!storedMode || storedMode === themeState) {
      return;
    }

    setThemeStateEnhanced();
  }, [themeState]);

  return [themeState, setThemeStateEnhanced];
};

const ThemeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [themeState, setThemeStateEnhanced] = useDarkMode();
  const toggleDark = React.useCallback(() => {
    setThemeStateEnhanced();
  }, [setThemeStateEnhanced]);

  useKeyboardShortcut("t", toggleDark);

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  React.useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        setThemeStateEnhanced(e.matches ? Theme.DARK : Theme.LIGHT);
      });
  }, [setThemeStateEnhanced, toggleDark]);

  return (
    <ThemeContext.Provider
      value={{
        dark: themeState === Theme.DARK,
        toggleDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
export default useTheme;
