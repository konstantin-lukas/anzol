import { type RefObject, useEffect, useRef, useState } from "react";

export interface IntersectionObserverOptions {
    /** Read on {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#root mdn web docs}. */
    root?: Element | Document | null,
    /** Read on {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#rootmargin mdn web docs}. */
    rootMargin?: string,
    /** Read on {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#threshold mdn web docs}. */
    threshold?: number | number[],
}

/**
 * Provides a hook API that wraps the IntersectionObserver API. This hook is for use with a single element only. For
 * simplicity this is the recommended approach. If you have an extremely large number of objects to observe and want
 * to avoid creating an IntersectionObserver for each, refer to useIntersectionObserverArray to use a single observer
 * for multiple elements with a common root.
 *
 * @return An array whose first value is a ref you need to attach to the element to observe. The second value is an
 * IntersectionObserverEntry as described by the IntersectionObserver API. This value is initially null but updates
 * every time there is a change in the intersection.
 *
 * @example
 * ```tsx
 * const DemoUseIntersectionObserver = () => {
 *     const [ref, entry] = useIntersectionObserver<HTMLDivElement>();
 *     return (
 *         <>
 *             <h1 style={{color: entry?.isIntersecting ? "green" : "red", position: "fixed", left: 0, top: 0}}>
 *                 The div is {entry?.isIntersecting ? "" : "not"} in view.
 *             </h1>
 *
 *             <div ref={ref} style={{marginTop: "200vh", backgroundColor: "red"}}>
 *                 Hello, world!
 *             </div>
 *         </>
 *     );
 * };
 * ```
 */
function useIntersectionObserver<T extends Element>({
    root = null,
    rootMargin = "0px 0px 0px 0px",
    threshold = 1.0,
}: IntersectionObserverOptions = {}): [RefObject<T>, IntersectionObserverEntry | null] {
    const ref = useRef<T | null>(null);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    useEffect(() => {
        if (ref.current) {
            const observer = new IntersectionObserver(
                (e) => setEntry(e[0]),
                { root, rootMargin, threshold },
            );
            observer.observe(ref.current as T);
            return () => observer.disconnect();
        }
    }, [ref, root, rootMargin, threshold]);
    return [ref, entry];
}

export default useIntersectionObserver;