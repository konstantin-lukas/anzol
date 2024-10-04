import { act, renderHook } from "@testing-library/react";
import { useCooldownState } from "../src";

describe("useCooldownState", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("should initialize with the initial state", () => {
        const { result } = renderHook(() => useCooldownState(true, 1000));
        const [state] = result.current;

        expect(state).toBe(true);
    });

    test("should update state when setState is called and block subsequent updates for the cooldown period", () => {
        const { result } = renderHook(() => useCooldownState(true, 1000));

        // Set state to false (should work immediately)
        act(() => {
            result.current[1](false);
        });

        expect(result.current[0]).toBe(false);  // state should change

        // Try to set state again before the cooldown ends (should not work)
        act(() => {
            result.current[1](true);
        });

        expect(result.current[0]).toBe(false);  // state should not change

        // Advance time by 1000ms to simulate cooldown completion
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Try to set state again after cooldown (should work)
        act(() => {
            result.current[1](true);
        });

        expect(result.current[0]).toBe(true);  // state should now change*/
    });

    test("should force update the state using forceUpdate regardless of the cooldown", () => {
        const { result } = renderHook(() => useCooldownState(true, 1000));

        // Set state to false using forceUpdate (should bypass cooldown)
        act(() => {
            result.current[2](false);
        });

        expect(result.current[0]).toBe(false);  // state should change immediately

        // Try to force update again (should work immediately)
        act(() => {
            result.current[2](true);
        });

        expect(result.current[0]).toBe(true);  // state should change immediately
    });
});
