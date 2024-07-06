import {useEffect, useState} from "react";

/**
 * @type {Object} FetchResult
 * @property {any} data - The response to the fetch request. Type depends on selected parseType. Is null if fetch was
 * unsuccessful
 * @property {boolean} loading - Indicates if the fetch is still ongoing (i.e. has not finished). Wait for this to be
 * true before reading other fields. Can be used to display a spinner while waiting for results.
 * @property {boolean} ok - Whether the response was successful (status in the range 200-299) or not.
 * @property {number} status - The HTTP status code. Is null before first fetch has completed.
 */
type FetchResult = {
    data: any,
    loading: boolean,
    ok: boolean,
    status: number | null
}

/**
 * @description Fetches the provided URL and optionally parses the response. Aborts requests when a new request is
 * started before the previous has finished to prevent flickering of stale responses by default.
 * @param url The resource to fetch
 * @param parseType How to parse the result (determines type of returned data). Set to "response" if you don't want to
 * extract the data automatically and receive the response object instead. Defaults to "json".
 * @param options The options passed to the fetch function. Note: custom signals will be overwritten internally.
 * @param discardStaleRequests Discards all responses except the last one made when set to true (default). This prevents
 * flickering of data in the UI and ensures only the correct data is displayed. Only turn this off if you're really sure
 * you want to.
 * @return FetchResult
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