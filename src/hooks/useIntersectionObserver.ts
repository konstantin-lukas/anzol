import {RefObject, useEffect, useRef, useState} from "react";


function useIntersectionObserver<T>({
    root = null,
    rootMargin = "0px",
    threshold = 1,
}: {
    root?: Element | Document | null,
    rootMargin?: string,
    threshold?: number,
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