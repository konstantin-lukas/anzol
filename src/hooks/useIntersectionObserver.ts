import {RefObject, useEffect, useRef, useState} from "react";


function useIntersectionObserver<T>({
    root = null,
    rootMargin = "0px",
    threshold = 1
} = {}): [RefObject<T>, IntersectionObserverEntry] {
    const ref = useRef<T>(null);
    const [entry, setEntry] = useState<IntersectionObserverEntry>(null);
    useEffect(() => {
        if (ref.current) {
            let observer = new IntersectionObserver(
                (e) => setEntry(e[0]),
                { root, rootMargin, threshold }
            );
            observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, [ref.current, root, rootMargin, threshold]);
    return [ref, entry];
}

export default useIntersectionObserver;