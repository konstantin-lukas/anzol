import {useEffect, useState} from "react";

/**
 * Contains information about the result of a fetch request made by useFetch.
 */
export type FetchResult = {
    /** The response to the fetch request. Type depends on selected parseType. Is null if fetch was unsuccessful. */
    data: any,
    /** Indicates if the fetch is still ongoing (i.e. has not finished). Wait for this to be true before reading other
     * fields. Is useful to display a spinner while waiting for results. */
    loading: boolean,
    /** Indicates whether the response was successful (status in the range 200-299) or not. */
    ok: boolean,
    /** The HTTP status code. Is null before first fetch has completed. */
    status: number | null
}

/**
 * Fetches the provided URL and optionally parses the response. Aborts requests when a new request is
 * started before the previous has finished to prevent flickering of stale responses by default.
 *
 * @param url The resource to fetch
 * @param [parseType = 'json'] How to parse the result (determines type of returned data). Set to "response" if you
 * don't want to extract the data automatically and receive the response object instead.
 * @param [options = {}] The options passed to the fetch function. Note: custom signals will be overwritten internally.
 * @param [discardStaleRequests = true] Discards all responses except the last one made. This prevents
 * flickering of data in the UI and ensures only the correct data is displayed. Only turn this off if you're really sure
 * you want to.
 *
 * @return FetchResult
 *
 * @example
 * ```ts
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
    parseType: "json" | "html" | "xml" | "text" | "svg" | "response" = "json",
    options: RequestInit = {},
    discardStaleRequests = true
): FetchResult => {
    const [status, setStatus] = useState<number | null>(null);
    const [ok, setOk] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;
        (async () => {
            setLoading(true);
            try {
                const response = await fetch(url, discardStaleRequests ? { ...options, signal } : options);
                setStatus(response.status);
                setOk(response.ok);
                if (!response.ok) {
                    setData(null);
                } else {
                    if (parseType === "json") {
                        setData(await response.json());
                    } else if (parseType === "html" || parseType === "xml" || parseType === "svg") {
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html,
                            parseType === "html" ? "text/html" :
                                parseType === "svg" ? "image/svg+xml" :
                                    "text/xml"
                        );
                        setData(doc);
                    } else if (parseType === "text") {
                        setData(await response.text());
                    } else {
                        if (parseType !== "response")
                            console.error("Unknown parse type: '" + parseType + "'\nReturned 'response' instead.");
                        setData(response);
                    }
                }
            } catch { } finally {
                setLoading(false);
            }
        })();
        if (discardStaleRequests) {
            return () => {
                abortController.abort();
            };
        }
    }, [url, parseType]);
    return {data, loading, ok, status};
};

export default useFetch;