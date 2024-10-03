import { useEffect, useState } from "react";


/**
 * This hook can be useful when trying to avoid hydration errors by making
 * sure your app initially returns a default state on the first render that matches what was pre-rendered on the server.
 * @return false before mount (including server-side prerendering) and true otherwise.
 *
 *
 * @example
 * ```tsx
 * const DemoUseMounted = () => {
 *     const hasMounted = useMounted();
 *     const [count, setCount] = useState(0);
 *     if (hasMounted) setCount(count => count + 1);
 *     return (
 *         <h1>
 *             {count}
 *         </h1>
 *     );
 * };
 * ```
 */
const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        return () => setHasMounted(false);
    }, []);

    return hasMounted;
};

export default useHasMounted;
