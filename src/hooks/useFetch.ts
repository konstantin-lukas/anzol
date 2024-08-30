import {useEffect, useState} from "react";

export type FetchResult = {
    /** The response to the fetch request. Type depends on selected parseType. Is undefined if fetch was unsuccessful. */
    data: any,
    /** Indicates if the fetch is still ongoing (i.e. has not finished). Wait for this to be true before reading other
     * fields. Is useful to display a spinner while waiting for results. */
    loading: boolean,
    /** Indicates whether the response was successful (status in the range 200-299) or not. */
    ok: boolean,
    /** The HTTP status code. Is undefined before first fetch has completed. */
    status: number | undefined
};

export type FetchOptions = {
    /** How to parse the result (determines type of returned data). Set to "response" if you
     * don't want to extract the data automatically and receive the response object instead. */
    parseType?: "json" | "html" | "xml" | "text" | "svg" | "response",
    /** The options passed to the fetch function. Note: custom signals will be overwritten internally. */
    requestOptions?: RequestInit,
    /** Discards all responses except the last one made. This prevents
     * flickering of data in the UI and ensures only the correct data is displayed. Only turn this off if you're really
     * sure you want to. */
    discardStaleRequests?: boolean,
    /** A callback function that takes the number of attempted retries and returns the amount of seconds to wait before
     * attempting to fetch again. A common retry method would return 2^(attempt). If set to undefined, does not attempt
     * to re-fetch on failure. If the function returns undefined, it stops the hook from re-fetching again until an
     * input parameter to the hook changes and resets the internal retry counter.*/
    retryTimeout?: (attempt: number) => number | undefined,
};

/**
 * Fetches the provided URL and optionally parses the response. Aborts requests when a new request is
 * started before the previous has finished to prevent flickering of stale responses by default.
 *
 * @param url - The resource to fetch
 * @param {FetchOptions} options - Allows you to configure how useFetch makes and returns requests
 * @return FetchResult - An object containing information about the result of a fetch request
 *
 * @example
 * ```tsx
 * const DemoUseFetch = () => {
 *     const [value, setValue] = useState("");
 *     const {loading, data} = useFetch("https://api.artic.edu/api/v1/artworks/search?q=" + encodeURIComponent(value));
 *     const list = data?.data.map((e, i) => <li key={i}>{e.title}</li>)
 *     return (
 *         <div>
 *             <input
 *                 type="text"
 *                 value={value}
 *                 onInput={(e) => setValue((e.target as HTMLInputElement).value)}
 *             />
 *             <ul>
 *                 {loading ? "LOADING..." : list}
 *             </ul>
 *         </div>
 *     );
 * };
 * ```
 */
const useFetch = (
    url: string,
    {
        parseType = "json",
        requestOptions = {},
        discardStaleRequests = true,
        retryTimeout = undefined,
    }: FetchOptions = {},
): FetchResult => {
    const [status, setStatus] = useState<number>();
    const [ok, setOk] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(undefined);
    const [retries, setRetries] = useState(1);

    useEffect(() => {
        setRetries(1);
    }, [url, parseType, discardStaleRequests, retryTimeout]);

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;
        (async () => {
            setLoading(true);
            try {
                const response = await fetch(url, discardStaleRequests
                    ? { ...requestOptions, signal }
                    : requestOptions
                );
                setStatus(response.status);
                setOk(response.ok);
                let res = undefined;
                if (response.ok) {
                    if (parseType === "json") {
                        res = await response.json();
                    } else if (parseType === "html" || parseType === "xml" || parseType === "svg") {
                        const html = await response.text();
                        const parser = new DOMParser();
                        res = parser.parseFromString(html,
                            parseType === "html" ? "text/html" :
                                parseType === "svg" ? "image/svg+xml" :
                                    "text/xml"
                        );
                    } else if (parseType === "text") {
                        res = await response.text();
                    } else {
                        if (parseType !== "response")
                            console.error("Unknown parse type: '" + parseType + "'\nReturned 'response' instead.");
                        res = response;
                    }
                } else if (typeof retryTimeout === "function") {
                    const timeoutLength = retryTimeout(retries);
                    if (typeof timeoutLength === "number") {
                        setTimeout(() => setRetries(prevState => prevState + 1), timeoutLength);
                    }
                }
                setData(res);
            } catch { } finally {
                setLoading(false);
            }
        })();
        if (discardStaleRequests) {
            return () => {
                abortController.abort();
            };
        }
    }, [url, parseType, retries, discardStaleRequests, retryTimeout]);
    return {data, loading, ok, status};
};

export default useFetch;