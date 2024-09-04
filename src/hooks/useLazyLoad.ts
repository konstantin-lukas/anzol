import { useState } from "react";

export interface LazyLoadState<T> {
    /** Calling this function triggers fetching more items an updating the hook state. */
    loadMore: () => void,
    /** A list of all returned elements. Grows every time {@link loadMore} is called until the max amount of elements
     * has been reached. */
    elements: T[],
    /** Boolean flag that indicates whether all elements have been fetched. Once this flag is true, calling
     * {@link loadMore} will have no effect. */
    reachedEnd: boolean,
    /** Boolean flag that indicates whether the hook is currently fetching more items. Can be used to display a load
     * spinner. Gets set to true when {@link loadMore} is called and set back to false once it has finished executing. */
    isFetching: boolean,
}

export interface LazyLoadOptions {
    /** Allows explicitly setting the expected amount of items on each data fetch. Must be a positive integer. If the
     * batchSize value is set and an amount of items is fetched smaller than this value, the {@link reachedEnd} flag is
     * set to true. */
    batchSize?: number,
}
/**
 * Provides a simple API for fetching data from a resource in batches.
 * @param maxElements - The maximum amount of elements to fetch or a function returning that number. This is needed to
 * decide when the end of the lazy loaded list was reached.
 * @param fetchElements - A function that specifies how to fetch elements. Takes the previous amount of performed
 * fetches as input (starts at 0). This can be used e.g. to specify the offset in an API endpoint. This function also
 * implicitly defines the batch size for each lazy load execution through the amount of elements returned. This amount
 * doesn't necessarily have to be same on each execution, though it is common to do so.
 * @param options - An optional object for providing additional arguments.
 */
function useLazyLoad<T>(
    maxElements: number | (() => number),
    fetchElements: (performedFetches: number) => T[],
    options?: LazyLoadOptions,
): LazyLoadState<T> {
    const [elements, setElements] = useState<T[]>([]);
    return {
        loadMore: () => { /* empty */ },
        elements,
        reachedEnd: false,
        isFetching: false,
    };
}

export default useLazyLoad;