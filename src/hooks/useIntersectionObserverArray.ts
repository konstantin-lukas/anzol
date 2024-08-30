import {RefObject, useEffect, useRef, useState} from "react";


function useIntersectionObserverArray<T>({
    root = null,
    rootMargin = "0px",
    threshold = 1,
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