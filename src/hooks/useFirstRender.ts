import { useRef } from 'react';


/**
 * @return true on first render; false otherwise.
 *
 * @example
 * ```tsx
 * const DemoUseFirstRender = () => {
 *     const isFirstRender = useFirstRender();
 *     const [count, setCount] = useState(0);
 *     if (isFirstRender) setCount(count => count + 1);
 *     return (
 *         <h1>
 *             {count}
 *         </h1>
 *     );
 * };
 * ```
 */
function useFirstRender() {
    const isFirstRender = useRef(true);

    if (isFirstRender.current) {
        isFirstRender.current = false;
        return true;
    }

    return false;
}

export default useFirstRender;
