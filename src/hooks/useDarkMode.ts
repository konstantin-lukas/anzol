import { useEffect, useState } from "react";
import usePreferredScheme from "./usePreferredScheme";

export interface DarkModeState {
    /** Sets the current theme to the value passed in as an argument. */
    setTheme: (selectedTheme: "light" | "dark") => void,
    /** Changes theme to dark if it is currently light and vice versa. */
    toggleTheme: () => void,
    /** The currently selected theme or null on the first render when using SSR. */
    theme: "light" | "dark" | null,
}

export interface DarkModeOptions {
    /** Set a default theme. This overrides the user's preferred scheme but is overridden by the value
     * saved in local storage if the hook is set to use local storage. */
    defaultTheme?: "light" | "dark",
    /** If set to true, updates the theme when the user's preferred scheme changes */
    updateOnPreferredSchemeChange?: boolean,
    /** If set to true, uses the browsers local storage to persist the selected theme
     * between page reloads. */
    persistStateInLocalStorage?: boolean,
    /** This parameter which is true by default determines if the hook should take the necessary steps to avoid
     * hydration errors when using SSR. This results in the initial state being null on the first render even if there
     * is a value in local storage. On consecutive renders the correct value will be returned. Note that components
     * with "use client" in Next.js are still pre-rendered on the server. Only set this variable to false, if you are
     * rendering on the client only. What this will do, it will return the correct value from local storage on the first
     * render. This can lead to hydration errors when using SSR because local storage doesn't exist on the server. */
    SSR?: boolean,
}

/**
 * Allows you to control the user's preferred scheme manually.
 * @return DarkModeState
 *
 * @example
 * ```tsx
 * const Page = () => {
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
    SSR = true,
}: DarkModeOptions = {}): DarkModeState {
    const preferredScheme = usePreferredScheme(SSR);
    const [theme, setTheme] = useState<"light" | "dark" | null>(() => {
        if (SSR || typeof localStorage === "undefined") return null;
        return (persistStateInLocalStorage
            ? localStorage.getItem("anzol-dark-mode-hook")
                ?? defaultTheme
                ?? preferredScheme
            : defaultTheme
                ?? preferredScheme
        ) as "light" | "dark";
    });

    useEffect(() => {
        if (SSR) {
            setTheme(((persistStateInLocalStorage
                ? localStorage.getItem("anzol-dark-mode-hook") ?? defaultTheme ?? preferredScheme
                : defaultTheme ?? preferredScheme) as "light" | "dark"));
        }
    }, []);

    useEffect(() => {
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

    return {
        setTheme: (selectedTheme: "light" | "dark") => {
            setTheme(selectedTheme);
            if (persistStateInLocalStorage) localStorage.setItem("anzol-dark-mode-hook", selectedTheme);
        },
        toggleTheme: () => setTheme(prevState => {
            const nextState = prevState === "light" ? "dark" : "light";
            if (persistStateInLocalStorage) localStorage.setItem("anzol-dark-mode-hook", nextState);
            return nextState;
        }),
        theme,
    };
}

export default useDarkMode;