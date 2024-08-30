import {RefObject, useEffect, useRef, useState} from "react";


/**
 * Provides a hook API that wraps the IntersectionObserver API. This hook is for use with a single element only. For
 * simplicity this is the recommended approach. If you have an extremely large number of objects to observe and want
 * to avoid creating an IntersectionObserver for each, refer to useIntersectionObserverArray to use a single observer
 * for multiple elements with a common root.
 *
 * @param root - An Element or Document object which is an ancestor of the intended target, whose bounding rectangle
 * will be considered the viewport. Any part of the target not visible in the visible area of the root is not considered
 * visible. Default is null. Setting the root to null, makes the hook observe intersections with the viewport.
 * @param rootMargin - A string which specifies a set of offsets to add to the root's bounding_box when
 * calculating intersections, effectively shrinking or growing the root for calculation purposes. The syntax is
 * approximately the same as that for the CSS margin property; see The intersection root and root margin  for more
 * information on how the margin works and the syntax. The default is "0px 0px 0px 0px".
 * @param threshold - Either a single number or an array of numbers between 0.0 and 1.0, specifying a ratio of
 * intersection area to total bounding box area for the observed target. A value of 0.0 means that even a single visible
 * pixel counts as the target being visible. 1.0 means that the entire target element is visible. See Thresholds  for a
 * more in-depth description of how thresholds are used. The default is a threshold of 0.0.
 *
 * @return An array whose first value is a ref you need to attach to the element to observe. The second value is an
 * IntersectionObserverEntry as described by the IntersectionObserver API. This value is initially null but updates
 * every time there is a change in the intersection.
 *
 * @example
 * ```ts
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
function useIntersectionObserver<T>({
    root = null,
    rootMargin = "0px 0px 0px 0px",
    threshold = 1.0,
}: {
    root?: Element | Document | null,
    rootMargin?: string,
    threshold?: number | number[],
} = {}): [RefObject<T>, IntersectionObserverEntry | null] {
    const ref = useRef<T>(null);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    useEffect(() => {
        if (ref.current) {
            const observer = new IntersectionObserver(
                (e) => setEntry(e[0]),
                { root, rootMargin, threshold },
            );
            observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, [ref, root, rootMargin, threshold]);
    return [ref, entry];
}

export default useIntersectionObserver;