import { useEffect, useState } from "react";

/**
 * @param SSR - This parameter which is true by default determines if the hook should take the necessary steps to avoid
 * hydration errors when using SSR. This results in the initial state being null on the first render even if there
 * is a value in local storage. On consecutive renders the correct value will be returned. Note that components
 * with "use client" in Next.js are still pre-rendered on the server. Only set this variable to false, if you are
 * rendering on the client only. What this will do, it will return the correct value from local storage on the first
 * render. This can lead to hydration errors when using SSR because local storage doesn't exist on the server.
 * @return The user's preferred scheme. Either light or dark. This value can change if the user changes their preferred
 * scheme. Is only null on the first render when using {@link SSR}.
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
function usePreferredScheme(SSR= true): "light" | "dark" | null {
    const [theme, setTheme] = useState<"light" | "dark" | null>(() => {
        if (SSR || typeof window === "undefined") return null;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        if (SSR) {
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light");
        }
    }, []);

    useEffect(() => {
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