import {useEffect, useState} from "react";

/**
 * Delays the update of a value until the input has stopped changing for a certain time. This is different
 * from React's builtin useDeferredValue because you can set the delay yourself.
 *
 * @param input The value to defer and output.
 * @param delay The amount of time to wait after input has stopped changing before outputting it.
 *
 * @return The deferred input value.
 *
 * @example
 * ```ts
 * const Component = () => {
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
const useDefer = (input: any, delay: number) => {
    const [state, setState] = useState(null);
    const [timeoutState, setTimeoutState] = useState<null | NodeJS.Timeout>(null);
    useEffect(() => {
        if (timeoutState) {
            clearTimeout(timeoutState);
            setTimeoutState(null);
        }
        setTimeoutState(setTimeout(() => {
            setState(input);
        }, delay));
    }, [input, delay]);
    return state;
}

export default useDefer;