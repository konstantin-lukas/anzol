import { act, renderHook } from "@testing-library/react";
import { useDarkMode } from "../src";


describe("useDarkMode", () => {
    let triggerChange: (e: { matches: boolean }) => void;
    const defineMock = (defTheme: boolean) => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
                matches: defTheme,
                addEventListener: (_: string, callback: (e: { matches: boolean }) => void) => {
                    triggerChange = callback;
                },
                removeEventListener: jest.fn(),
            })),
        });
    };

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("should use the current preferred scheme (light) by default", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({ SSR: false }));
        });
        expect(result.current.theme).toBe("light");
    });

    test("should use the current preferred scheme (dark) by default", async () => {
        defineMock(true);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({ SSR: false }));
        });
        expect(result.current.theme).toBe("dark");
    });

    test("should ignore the preferred theme if a value exists in local storage", async () => {
        localStorage.setItem("anzol-dark-mode-hook", "light");
        defineMock(true);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode());
        });
        expect(result.current.theme).toBe("light");
    });

    test("should ignore the preferred theme if a value exists in local storage unless configured otherwise", async () => {
        localStorage.setItem("anzol-dark-mode-hook", "light");
        defineMock(true);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                persistStateInLocalStorage: false,
                SSR: false,
            }));
        });
        expect(result.current.theme).toBe("dark");
    });

    test("should ignore the value stored in local storage and used a specified default if configured to do so", async () => {
        localStorage.setItem("anzol-dark-mode-hook", "light");
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({ persistStateInLocalStorage: false, defaultTheme: "dark" }));
        });
        expect(result.current.theme).toBe("dark");
    });

    test("should ignore the selected default theme if a value exists in local storage", async () => {
        localStorage.setItem("anzol-dark-mode-hook", "light");
        defineMock(true);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({ defaultTheme: "dark" }));
        });
        expect(result.current.theme).toBe("light");
    });

    test("should update its state when the preferred scheme changes", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({ SSR: false }));
        });
        expect(result.current.theme).toBe("light");
        act(() => triggerChange({ matches: true }));
        expect(result.current.theme).toBe("dark");
        act(() => triggerChange({ matches: false }));
        expect(result.current.theme).toBe("light");
    });

    test("should not update its state when the preferred scheme changes if configured to do so", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                updateOnPreferredSchemeChange: false,
                SSR: false,
            }));
        });
        expect(result.current.theme).toBe("light");
        act(() => triggerChange({ matches: true }));
        expect(result.current.theme).toBe("light");
        act(() => triggerChange({ matches: false }));
        expect(result.current.theme).toBe("light");
    });

    test("should allow setting the theme", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                updateOnPreferredSchemeChange: false,
                SSR: false,
            }));
        });
        expect(result.current.theme).toBe("light");
        for (let i = 0; i < 2; i++) {
            act(() => result.current.setTheme("dark"));
            expect(result.current.theme).toBe("dark");
        }
        for (let i = 0; i < 2; i++) {
            act(() => result.current.setTheme("light"));
            expect(result.current.theme).toBe("light");
        }
    });

    test("should allow toggling the theme", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                updateOnPreferredSchemeChange: false,
                SSR: false,
            }));
        });
        expect(result.current.theme).toBe("light");
        for (let i = 0; i < 5; i++) {
            act(() => result.current.toggleTheme());
            expect(result.current.theme).toBe(i % 2 === 0 ? "dark" : "light");
        }
    });

    test("should support SSR", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                updateOnPreferredSchemeChange: true,
            }));
        });
        expect(result.current.theme).toBe(null);
        act(() => triggerChange({ matches: true }));
        expect(result.current.theme).toBe("dark");
        act(() => triggerChange({ matches: false }));
        expect(result.current.theme).toBe("light");
    });

    test("should support SSR without listening to preferred scheme changes", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                updateOnPreferredSchemeChange: false,
            }));
        });
        expect(result.current.theme).toBe(null);
        act(() => triggerChange({ matches: true }));
        expect(result.current.theme).toBe(null);
        act(() => triggerChange({ matches: false }));
        expect(result.current.theme).toBe(null);
    });

    test("should support SSR even without using local storage", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => useDarkMode({
                persistStateInLocalStorage: false,
            }));
        });
        expect(result.current.theme).toBe(null);
        act(() => triggerChange({ matches: true }));
        expect(result.current.theme).toBe("dark");
        act(() => triggerChange({ matches: false }));
        expect(result.current.theme).toBe("light");
    });
});