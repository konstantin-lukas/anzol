import {RefObject, useEffect, useRef, useState} from "react";


/**
 * Provides a hook API that wraps the IntersectionObserver API for observing intersections of multiple elements with a
 * common root. This hook is for use with a single element only. If you have an extremely large number of objects to
 * observe and want to avoid creating an IntersectionObserver for each, or you don't know how many objects you will be
 * observing beforehand, use this. Otherwise, it may be better to use useIntersectionObserver for each component for
 * simplicity and clarity.
 *
 * This hook provides a convenient API for return values. Normally the IntersectionObserver API only returns the
 * entries that changed, so you have to figure out which elements they belong to. However, useIntersectionObserverArray
 * returns an array of the same length as the ref array containing the elements to observe.
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
 * @param alwaysShowLastIntersection - If set to true (default), the returned entries always contain the last
 * intersection change that happened for each element. If set to false, only the recently updated intersections are
 * contained in the return value and the rest is set to null. If you want to test if multiple element are on screen,
 * leave this value as default as this will tell where each element was last seen (on-screen or off-screen).
 *
 * @return An array whose first value is an array ref you need to attach to the elements to observe. When adding
 * elements to the ref make sure to only add them once (avoid using Array.push). The second value is an
 * array of IntersectionObserverEntries as described by the IntersectionObserver API. This value is an empty array on
 * first render but afterward contains one value for each element in the ref. The index of items in the ref corresponds
 * to the index of entries returned. By default, each entry is an IntersectionObserverEntry (i.e. the last one that
 * happened for the element at the given index). When alwaysShowLastIntersection is set to false, only the
 * IntersectionObserverEntries are returned that triggered the change of the return value. The rest is set to null.
 *
 * @example
 * ```ts
 * const DemoUseIntersectionObserverArray = () => {
 *     const [ref, entries] = useIntersectionObserverArray<HTMLDivElement>();
 *     const allInView = useMemo(
 *         () => !entries.some(x => !x?.isIntersecting),
 *         [entries],
 *     );
 *     return (
 *         <>
 *             <div ref={el => {
 *                 if (el) ref.current[0] = el;
 *             }}>Hello, world!</div>
 *             <div ref={el => {
 *                 if (el) ref.current[1] = el;
 *             }}>Hello, world!</div>
 *         </>
 *     );
 * };
 * ```
 */
function useIntersectionObserverArray<T>({
    root = null,
    rootMargin = "0px 0px 0px 0px",
    threshold = 1.0,
    alwaysShowLastIntersection = true,
}: {
    root?: Element | Document | null,
    rootMargin?: string,
    threshold?: number,
    alwaysShowLatestIntersection?: boolean,
} = {}): [RefObject<T[]>, (IntersectionObserverEntry | null)[]] {
    const ref = useRef<T[]>([]);
    const [entries, setEntries] = useState<(IntersectionObserverEntry | null)[]>([]);
    useEffect(() => {
        if (ref.current) {
            const observer = new IntersectionObserver(
                (e) => {
                    setEntries(prevState => {
                        const newEntries = prevState.length === 0 || !alwaysShowLastIntersection
                            ? Array.from({length: ref.current.length}, () => null)
                            : [...prevState];
                        e.forEach((e_) => {
                            const target = e_.target;
                            const index = ref.current.indexOf(target);
                            if (index > -1) {
                                newEntries[index] = e_;
                            }
                        });
                        return newEntries;
                    });
                },
                { root, rootMargin, threshold },
            );
            ref.current.forEach(r => observer.observe(r));
            return () => observer.disconnect();
        }
    }, [ref, root, rootMargin, threshold]);
    return [ref, entries];
}

export default useIntersectionObserverArray;