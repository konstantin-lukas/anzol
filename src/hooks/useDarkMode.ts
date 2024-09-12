import { useEffect, useState } from "react";
import { usePreferredScheme } from "../index";

export interface DarkModeState {
    /** Sets the current theme to the value passed in as an argument. */
    setTheme: (selectedTheme: "light" | "dark") => void,
    /** Changes theme to dark if it is currently light and vice versa. */
    toggleTheme: () => void,
    /** The currently selected theme. */
    theme: "light" | "dark",
}

/**
 *
 * @param defaultTheme - Set a default theme. This overrides the user's preferred scheme but is overridden by the value
 * saved in local storage if the hook is set to use local storage.
 * @param updateOnPreferredSchemeChange - If set to true, updates the theme when the user's preferred scheme changes
 * @param persistStateInLocalStorage - If set to true, uses the browsers local storage to persist the selected theme
 * between page reloads.
 * @return DarkModeState
 *
 * @example
 * ```tsx
 * const DemoUseDarkMode = () => {
 *     const { theme, setTheme, toggleTheme } = useDarkMode();
 *     return (
 *         <div style={{
 *             backgroundColor: theme === "dark" ? "black" : "white",
 *             color: theme === "dark" ? "white" : "black",
 *         }}>
 *             I change my color. I'm a chameleon.
 *             <button onClick={() => setTheme("light")}>Set to light</button>
 *             <button onClick={() => setTheme("dark")}>Set to dark</button>
 *             <button onClick={() => toggleTheme()}>Toggle theme</button>
 *         </div>
 *     );
 * };
 * ```
 */
function useDarkMode({
    defaultTheme,
    updateOnPreferredSchemeChange = true,
    persistStateInLocalStorage = true,
}: {
    defaultTheme?: "light" | "dark",
    updateOnPreferredSchemeChange?: boolean,
    persistStateInLocalStorage?: boolean,
} = {}): DarkModeState {
    const preferredScheme = usePreferredScheme();
    const [theme, setTheme] = useState(typeof window === "undefined" ? "light" : ((persistStateInLocalStorage
        ? localStorage.getItem("anzol-dark-mode-hook") ?? defaultTheme ?? preferredScheme
        : defaultTheme ?? preferredScheme) as "light" | "dark"),
    );

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (updateOnPreferredSchemeChange) {
            const matchPreferredScheme = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", matchPreferredScheme);
            return () => window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", matchPreferredScheme);
        }
    }, [updateOnPreferredSchemeChange, preferredScheme]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (persistStateInLocalStorage) localStorage.setItem("anzol-dark-mode-hook", theme);
    }, [theme]);

    return {
        setTheme: (selectedTheme: "light" | "dark") => setTheme(selectedTheme),
        toggleTheme: () => setTheme(prevState => prevState === "light" ? "dark" : "light"),
        theme,
    };
}

export default useDarkMode;