import {useEffect, useState} from "react";

/**
 * @description Fetches the provided URL and optionally parses the response.Aborts requests when a new request is
 * started before the previous has finished to prevent flickering of stale responses.
 */
const useFetch = (url: string, parseAs: "json" | "html" | "xml" | "text" = "json") => {
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
                const response = await fetch(url, { signal });
                setStatus(response.status);
                setOk(response.ok);
                if (!response.ok) {
                    setData(null);
                } else {
                    if (parseAs === "json") {
                        setData(await response.json());
                    } else if (parseAs === "html" || parseAs === "xml") {
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, parseAs === "html" ? "text/html" : "text/xml");
                        setData(doc);
                    } else {
                        setData(await response.text());
                    }
                }
            } catch { } finally {
                setLoading(false);
            }
        })();
        return () => {
            abortController.abort();
        };
    }, [url, parseAs]);
    return {data, loading, ok, status};
};

export default useFetch;