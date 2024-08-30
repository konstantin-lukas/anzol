import {RefObject, useEffect, useRef, useState} from "react";
import {IntersectionObserverOptions} from "./useIntersectionObserver";

export type IntersectionObserverArrayOptions = IntersectionObserverOptions & {
    /** If set to true (default), the returned entries always contain the last
     * intersection change that happened for each element. If set to false, only the recently updated intersections are
     * contained in the return value and the rest is set to null. If you want to test if multiple element are on screen,
     * leave this value as default as this will tell where each element was last seen (on-screen or off-screen). */
    alwaysShowLastIntersection?: boolean;
}

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
 * @return An array whose first value is an array ref you need to attach to the elements to observe. When adding
 * elements to the ref make sure to only add them once (avoid using Array.push). The second value is an
 * array of IntersectionObserverEntries as described by the IntersectionObserver API. This value is an empty array on
 * first render but afterward contains one value for each element in the ref. The index of items in the ref corresponds
 * to the index of entries returned. By default, each entry is an IntersectionObserverEntry (i.e. the last one that
 * happened for the element at the given index). When alwaysShowLastIntersection is set to false, only the
 * IntersectionObserverEntries are returned that triggered the change of the return value. The rest is set to null.
 *
 * @example
 * ```tsx
 * const DemoUseIntersectionObserverArray = () => {
 *     const [ref, entries] = useIntersectionObserverArray<HTMLDivElement>();
 *     const allInView = useMemo(
 *         () => entries.length > 0 && entries.every(x => x?.isIntersecting),
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
function useIntersectionObserverArray<T extends Element>({
    root = null,
    rootMargin = "0px 0px 0px 0px",
    threshold = 1.0,
    alwaysShowLastIntersection = true,
}: IntersectionObserverArrayOptions = {}): [RefObject<T[]>, (IntersectionObserverEntry | null)[]] {
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
                            const index = ref.current.indexOf(target as T);
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