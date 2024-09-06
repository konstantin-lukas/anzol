import { useEffect, useState } from "react";

/**
 * Delays the update of a value until the input has stopped changing for a certain time. This is different
 * from React's built-in useDeferredValue because you can set the delay yourself.
 *
 * @param input The value to defer and output.
 * @param delay The amount of time to wait after input has stopped changing before outputting it.
 *
 * @return The deferred input value.
 *
 * @example
 * ```tsx
 * const DemoUseDefer = () => {
 *     const [value, setValue] = useState("");
 *     const displayValue = useDefer(value, 500);
 *     return (
 *         <div>
 *             <input
 *                 type="text"
 *                 value={value}
 *                 onInput={(e) => setValue((e.target as HTMLInputElement).value)}
 *             />
 *             <ul>
 *                 {displayValue}
 *             </ul>
 *         </div>
 *     );
 * };
 * ```
 */
function useDefer<T>(input: T, delay: number): T {
    const [state, setState] = useState(input);
    const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | undefined>(undefined);
    useEffect(() => {
        if (timeoutState) {
            clearTimeout(timeoutState);
            setTimeoutState(undefined);
        }
        setTimeoutState(setTimeout(() => {
            setState(input);
        }, delay));
    }, [input, delay]);
    return state;
}

export default useDefer;