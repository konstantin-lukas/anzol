import { useState, useCallback } from 'react';


/**
 * Provides a boolean toggle that does not persist between page reloads.
 *
 * @param [initialValue = false] The initial value of the toggle.
 *
 * @return The current state of the toggle.
 *
 * @example
 * ```ts
 * const DemoUseToggle = () => {
 *     const [state, toggle] = useToggle();
 *     return (
 *         <>
 *             <h1>
 *                 My favorite color is: {state ? "green" : "red"}
 *             </h1>
 *             <button onClick={toggle}>Change Opinion</button>
 *         </>
 *     );
 * };
 * ```
 */
function useToggle(initialValue: boolean = false): [boolean, () => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue(v => !v), []);
    return [value, toggle];
}

export default useToggle;