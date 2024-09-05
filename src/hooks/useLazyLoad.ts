import { useCallback, useMemo, useRef, useState } from "react";

export interface LazyLoadState<T> {
    /** Calling this function triggers fetching more items an updating the hook state. Calling this function while
     * {@link isFetching} is true, does nothing. */
    loadMore: () => Promise<void>,
    /** A list of all returned elements. Grows every time {@link loadMore} is called until the max amount of elements
     * has been reached. */
    elements: T[],
    /** Boolean flag that indicates whether all elements have been fetched. Once this flag is true, calling
     * {@link loadMore} will have no effect. */
    reachedEnd: boolean,
    /** Boolean flag that indicates whether the hook is currently fetching more items. Can be used to display a load
     * spinner. Gets set to true when {@link loadMore} is called and set back to false once it has finished executing. */
    isFetching: boolean,
    /** Calling this function resets the hook to its initial state. */
    clear: () => void,
}

export interface LazyLoadOptions {
    /** Allows explicitly setting the expected amount of items on each data fetch. Must be a positive integer. If the
     * batchSize value is set and an amount of items is fetched smaller than this value, the {@link reachedEnd} flag is
     * set to true. */
    batchSize?: number,
    /** Allows truncating the results if more results were fetched than allowed. For example, if you specify a max element
     * count of 10, but you fetch in batches of 3, the last fetch will result in 12 elements if this is set to false. If
     * it is set to true, it will only return 10 elements. This is also the default behavior. */
    truncate?: boolean,
    /** If set to false (default), the {@link reachedEnd} will be set to true if the provided fetch function throws an
     * error and the hook will stop fetching more data. */
    continueOnError?: boolean,
}
/**
 * Provides a simple API for fetching data from a resource in batches.
 * @param maxElements - The maximum amount of elements to fetch or a function returning that number. This is needed to
 * decide when the end of the lazy loaded list was reached.
 * @param fetchElements - A function that specifies how to fetch elements. Takes the previous amount of performed
 * fetches as input (starts at 0). This can be used e.g. to specify the offset in an API endpoint. This function also
 * implicitly defines the batch size for each lazy load execution through the amount of elements returned. This amount
 * doesn't necessarily have to be same on each execution, though it is common to do so. Changing this prop will reset
 * the current state returned from the hook. If this function throws an error, the respective fetch attempt is treated
 * as having returned an empty batch.
 * @param options - An optional object for providing additional arguments.
 *
 * @template T - The type of the data in the array returned by {@link fetchElements}.
 *
 * @example
 * ```tsx
 * const DemoUseLazyLoad = () => {
 *     const { loadMore, elements, reachedEnd, isFetching, clear } = useLazyLoad<ReactNode>(35, async (performedFetches) => {
 *         const data = await fetch(`https://api.artic.edu/api/v1/artworks?page=${performedFetches + 1}&limit=10`);
 *         const parsedData = await data.json();
 *         const elements = parsedData?.data ?? [];
 *         return elements.map((e: { title: string, id: number }) => <li key={e.id}>{e.title}</li>);
 *     });
 *     return (
 *         <div>
 *             <button onClick={loadMore} disabled={reachedEnd}>Load more</button>
 *             <button onClick={clear}>Reset</button>
 *             <ul>
 *                 {elements}
 *             </ul>
 *             {isFetching ? <b>LOADING...</b> : ""}
 *             {reachedEnd ? <b>YOU REACHED THE END</b> : ""}
 *         </div>
 *     );
 * };
 * ```
 */
function useLazyLoad<T>(
    maxElements: number | (() => number),
    fetchElements: (performedFetches: number) => Promise<T[]>,
    {
        batchSize = undefined,
        truncate = true,
        continueOnError = false,
    }: LazyLoadOptions = {},
): LazyLoadState<T> {

    const elementLimit = useMemo<number>(() => {
        return (typeof maxElements === "function") ? maxElements() : maxElements;
    }, [maxElements]);

    const fetchCount = useRef(0);

    const [elements, setElements] = useState<T[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);

    const loadMore = useCallback(async () => {
        if (isFetching || reachedEnd) return;
        setIsFetching(true);
        let newElements: T[] = [];
        try {
            newElements = await fetchElements(fetchCount.current);
        } catch {
            setIsFetching(false);
            if (!continueOnError) setReachedEnd(true);
            return;
        }
        setElements(prevState => {
            if (prevState.length + newElements.length >= elementLimit
                || (typeof batchSize !== "undefined" && batchSize > 0 && newElements.length < batchSize)
            ) {
                setReachedEnd(true);
                const diff = (prevState.length + newElements.length) - elementLimit;
                if (truncate && diff > 0) {
                    return [...prevState, ...newElements.slice(0, newElements.length - diff)];
                }
            }
            return [...prevState, ...newElements];
        });
        fetchCount.current += 1;
        setIsFetching(false);
    }, [elementLimit, batchSize, truncate]);

    return {
        loadMore,
        elements,
        reachedEnd,
        isFetching,
        clear: () => {
            setElements([]);
            setIsFetching(false);
            setReachedEnd(false);
            fetchCount.current = 0;
        },
    };
}

export default useLazyLoad;