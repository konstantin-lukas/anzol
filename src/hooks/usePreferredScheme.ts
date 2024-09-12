import { useEffect, useState } from "react";

/**
 * @return The user's preferred scheme. Either light or dark. This value can change if the user changes their preferred
 * scheme.
 * @example
 * ```tsx
 * const DemoUsePreferredScheme = () => {
 *     const scheme = usePreferredScheme();
 *     return (
 *         <div style={{
 *             backgroundColor: scheme === "dark" ? "black" : "white",
 *             color: scheme === "dark" ? "white" : "black",
 *         }}>
 *             I change my color. I'm a chameleon.
 *         </div>
 *     );
 * };
 * ```
 */
function usePreferredScheme(): "light" | "dark" {
    const [theme, setTheme] = useState<"light" | "dark">(typeof window === "undefined" ? "light" :
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );
    useEffect(() => {
        if (typeof window === "undefined") return;
        const matchPreferredScheme = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", matchPreferredScheme);
        return () => window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", matchPreferredScheme);
    }, []);
    return theme;
}

export default usePreferredScheme;