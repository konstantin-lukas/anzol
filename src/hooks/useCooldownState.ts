import { useCallback, useState } from "react";

/**
 * This hook wraps the standard useState hook but provides a way to block state updates for a provided amount of time.
 * Further state updates during this cooldown time are discarded.
 * @param initialState - The initialState passed to the useState hook.
 * @param delay - The amount of time in milliseconds to block consecutive state updates.
 * @return An array containing the read-only state (index 0), the setState function (index 1) which enforces the
 * cooldown on updates, and another setState function (index 2) which forces a state update independent of the cooldown.
 * @example
 * ```tsx
 * const Page = () => {
 *     const [state, setState, forceUpdate] = useCooldownState(true, 1000);
 *     return (
 *         <>
 *             <h1>
 *                 My favorite color is: {state ? "green" : "red"}
 *             </h1>
 *             <button onClick={() => setState(!state)}>Change Opinion</button>
 *             <button onClick={() => forceUpdate(!state)}>Change Opinion Immediately</button>
 *         </>
 *     );
 * };
 * ```
 */

function useCooldownState<T>(initialState: T, delay: number): [T, (newValue: T) => void, (newValue: T) => void] {
    const [state, setState] = useState(initialState);
    const [blockUpdate, setBlockUpdate] = useState(false);

    const setStateWrapper = useCallback((newState: T) => {
        if (blockUpdate) return;
        setState(newState);
        setBlockUpdate(true);
        setTimeout(() => setBlockUpdate(false), delay);
    }, [blockUpdate]);

    return [state, setStateWrapper, setState];
}

export default useCooldownState;