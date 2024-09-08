import { act, renderHook } from "@testing-library/react";
import { usePreferredScheme } from "../src";


describe("usePreferredScheme", () => {
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
        jest.clearAllMocks();
    });

    test("should change its return value when the user's preferred scheme changes", async () => {
        defineMock(false);
        const { result } = await act(async () => {
            return renderHook(() => usePreferredScheme());
        });
        expect(result.current).toBe("light");
        act(() => triggerChange({ matches: true }));
        expect(result.current).toBe("dark");
        act(() => triggerChange({ matches: false }));
        expect(result.current).toBe("light");
    });

    test("should change use the current preferred scheme by default", async () => {
        defineMock(true);
        const { result } = await act(async () => {
            return renderHook(() => usePreferredScheme());
        });
        expect(result.current).toBe("dark");
    });
});