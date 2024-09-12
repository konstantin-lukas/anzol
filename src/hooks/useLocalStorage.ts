import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState, useId } from "react";

export interface LocalStorageOptions {
    /** If there is no value for the specified {@link key}, it automatically set this value on mount. */
    initialValue?: string,
    /** If this is set to true, it sends out a custom event to notify other instances of this
     hook of changes for the specified {@link key} and allows them to update accordingly. This is not intended for global
     state management. For global state management, please use a library like Zustand. */
    propagateChanges?: boolean,
    /** If this parameter is true, the hook listens for changes of the specified {@link key} and
     updates its state accordingly. */
    listenForChanges?: boolean,
}

/**
 * Provides a wrapper around the localStorage API. Additionally, allows you to listen to changes between different
 * instances of this hook. Other than that, it behaves mostly like a regular useState hook.
 * @param key - This is the name of the value to store. Multiple instances with different keys don't affect each other.
 * @param {LocalStorageOptions} options - Provides additional ways to configure the hook.
 * @return An array similar to useState containing the current value behind the localStorage key and a setter method.
 * Calling setState(null) removes the item from localStorage.
 *
 * @example
 * ```tsx
 * function DemoUseLocalStorage() {
 *     const [value, setValue] = useLocalStorage("value");
 *     return <input type="text" value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
 * }
 * ```
 */
function useLocalStorage(key: string, {
    initialValue,
    propagateChanges = false,
    listenForChanges = false,
}: LocalStorageOptions = {}): [string | null, Dispatch<SetStateAction<string | null>>] {

    const [value, setValue] = useState<string | null>(null);
    const [blockUpdates, setBlockUpdates] = useState(true);
    const id = useId();

    useEffect(() => {
        if (typeof window === "undefined") return;
        setValue(() => {
            const storedValue = localStorage.getItem(key);
            if (storedValue) return storedValue;
            const init = initialValue || null;
            if (init) localStorage.setItem(key, init);
            return init;
        });
    }, [key, initialValue]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!blockUpdates) {
            if (value === null)
                localStorage.removeItem(key);
            else
                localStorage.setItem(key, value);
            if (propagateChanges) {
                window.dispatchEvent(new CustomEvent("anzol-local-storage-change", {
                    detail: { key, newValue: value, src: id },
                }));
            }
        } else {
            setBlockUpdates(false);
        }
    }, [value]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setValue(localStorage.getItem(key) || initialValue || null);
        if (listenForChanges) {
            const handleStorageChange = (event: CustomEvent) => {
                if (event.detail.key === key && id !== event.detail.src) {
                    setBlockUpdates(true);
                    setValue(event.detail.newValue);
                }
            };

            window.addEventListener(
                "anzol-local-storage-change" as keyof WindowEventMap,
                handleStorageChange as EventListener,
            );
            return () => window.removeEventListener(
                "anzol-local-storage-change"  as keyof WindowEventMap,
                handleStorageChange as EventListener,
            );
        }
    }, [key, listenForChanges, id]);

    return [value, setValue];
}

export default useLocalStorage;