import { act, renderHook, waitFor } from "@testing-library/react";
import { type FetchResult, useFetch } from "../src";

beforeEach(() => {
    jest.clearAllMocks();
});

function preFetchAssertions<T>(result: FetchResult<T>) {
    expect(result.data).toEqual(undefined);
    expect(result.loading).toBe(true);
    expect(result.ok).toBe(false);
    expect(result.status).toEqual(undefined);
}

function postFetchAssertions<T>(result: FetchResult<T>) {
    expect(result.ok).toBe(true);
    expect(result.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
}

describe("useFetch", () => {
    test("should fetch and parse json", async () => {
        const mockData = { message: "Success" };
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
        )));


        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toEqual(mockData);
        postFetchAssertions(result.current);

    });

    test("should fetch and parse html", async () => {
        const mockData = "<html lang='en'><body><h1>Hello, world!</h1></body></html>";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch<Document>(
            "/api",
            {
                parseType: "html",
            },
        )));


        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).not.toBeInstanceOf(XMLDocument);
        expect(result.current.data).toBeInstanceOf(Document);
        expect(result.current.data?.body.querySelector("h1")?.innerHTML).toBe("Hello, world!");
        postFetchAssertions(result.current);
    });

    test("should fetch and parse svg", async () => {
        const mockData =
            "<svg height=\"100\" width=\"100\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "  <circle r=\"45\" cx=\"50\" cy=\"50\" fill=\"red\" />\n" +
            "</svg>";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                parseType: "svg",
            },
        )));


        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toBeInstanceOf(Document);
        expect((result.current.data).querySelector("circle")?.getAttribute("fill")).toBe("red");
        postFetchAssertions(result.current);
    });

    test("should fetch and parse xml", async () => {
        const mockData = "<root><info>very interesting</info></root>";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                parseType: "xml",
            },
        )));


        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toBeInstanceOf(Document);
        expect((result.current.data).querySelector("info")?.textContent).toBe("very interesting");
        postFetchAssertions(result.current);
    });

    test("should fetch and parse text", async () => {
        const mockData = "<root><info>very interesting</info></root>";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                parseType: "text",
            },
        )));

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(typeof result.current.data).toBe("string");
        expect(result.current.data).toBe(mockData);
        postFetchAssertions(result.current);
    });

    test("should fetch and not parse when parse type is invalid", async () => {
        const mockData = "<root><info>very interesting</info></root>";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(mockData),
                status: 200,
            });
        }) as jest.Mock;

        console.error = jest.fn();

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                parseType: "svf" as "svg",
            },
        )));

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(typeof result.current.data).toBe("object");
        expect(await (result.current.data).text()).toBe(mockData);
        expect(console.error).toHaveBeenCalledTimes(1);
        postFetchAssertions(result.current);
    });


    test("should fetch and not parse the response", async () => {
        const mockData = "I'm a teapot.";
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                statusText: mockData,
                status: 201,
            });
        }) as jest.Mock;

        console.error = jest.fn();

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                parseType: "response",
            },
        )));

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data.ok).toBe(true);
        expect(result.current.data.status).toBe(201);
        expect(result.current.data.statusText).toBe(mockData);
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    test("should discard stale requests", async () => {
        const mockData1 = { message: "Success1" };
        const mockData2 = { message: "Success2" };
        const firstUrl = "https://first-url.com";
        const secondUrl = "https://second-url.com";

        global.fetch = jest.fn(async (url: string) => {
            if (url === firstUrl) {
                await new Promise((r) => setTimeout(r, 1000));
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData1),
                    status: 200,
                });
            } else {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData2),
                    status: 200,
                });
            }
        }) as jest.Mock;

        const { result, rerender } = await act(async () => {
            return renderHook((url: string) => useFetch(url), {
                initialProps: firstUrl,
            });
        });

        preFetchAssertions(result.current);

        rerender(secondUrl);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toEqual(mockData2);
        expect(result.current.ok).toBe(true);
        expect(result.current.status).toEqual(200);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });


    test("should not discard stale requests when asked to do so", async () => {
        const mockData1 = { message: "Success1" };
        const mockData2 = { message: "Success2" };
        const firstUrl = "https://first-url.com";
        const secondUrl = "https://second-url.com";

        global.fetch = jest.fn(async (url: string) => {
            if (url === firstUrl) {
                await new Promise((r) => setTimeout(r, 100));
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData1),
                    status: 200,
                });
            } else {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData2),
                    status: 200,
                });
            }
        }) as jest.Mock;

        const { result, rerender } = await act(async () => {
            return renderHook((url: string) => useFetch(url, {
                discardStaleRequests: false,
            }), {
                initialProps: firstUrl,
            });
        });

        preFetchAssertions(result.current);

        await act(async () => {
            rerender(secondUrl);
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData2);
        });

        await act(async () => {
            await new Promise((r) => setTimeout(r, 200));
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData1);
        });
    });

    test("should return no data on error", async () => {
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: false,
                status: 404,
            });
        }) as jest.Mock;

        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
        )));

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toEqual(undefined);
        expect(result.current.ok).toBe(false);
        expect(result.current.status).toEqual(404);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test("should attempt to retry if given a timeout function", async () => {
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: false,
                status: 404,
            });
        }) as jest.Mock;

        const retryTimeout = jest.fn((attempt: number) => attempt);
        const { result } = await act(() => renderHook(() => useFetch(
            "/api",
            {
                retryTimeout,
            },
        )));

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(retryTimeout).toHaveBeenNthCalledWith(20, 20);
        });

        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: true,
                status: 200,
            });
        }) as jest.Mock;
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
        expect(result.current.ok).toBe(true);
        expect(result.current.status).toEqual(200);
    });

    test("should attempt to retry only a limited amount of times", async () => {
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: false,
                status: 404,
            });
        }) as jest.Mock;

        const retryTimeout = jest.fn((attempt: number) => {
            if (attempt < 5) return attempt;
        });

        const retryTimeoutNoLimit = jest.fn((attempt: number) => {
            return attempt;
        });

        const { result, rerender } = await act(async () => {
            return renderHook((retryMethod) => useFetch(
                "/api",
                {
                    retryTimeout: retryMethod,
                },
            ), {
                initialProps: retryTimeout,
            });
        });

        preFetchAssertions(result.current);
        await waitFor(() => {
            expect(retryTimeout).toHaveBeenNthCalledWith(5, 5);
        });
        await new Promise((r) => setTimeout(r, 10));

        expect(retryTimeout).toHaveBeenCalledTimes(5);

        expect(retryTimeoutNoLimit).toHaveBeenCalledTimes(0);
        await act(async () => {
            rerender(retryTimeoutNoLimit);
        });
        await waitFor(() => {
            expect(retryTimeoutNoLimit).not.toHaveBeenCalledTimes(0);
        });
    });

    test("should allow preventing fetches via the pre fetch callback", async () => {
        global.fetch = jest.fn(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return Promise.resolve({
                ok: false,
                status: 404,
            });
        }) as jest.Mock;

        const callback = jest.fn((setState) => {
            setState("banana");
            return false;
        });

        const { result } = renderHook(() => useFetch("/api", { preFetchCallback: callback }));

        expect(result.current.data).toEqual("banana");
        expect(result.current.loading).toBe(false);
        expect(result.current.ok).toBe(false);
        expect(result.current.status).toEqual(undefined);
        await waitFor(() => {
            expect(callback).toHaveBeenCalledTimes(1);
        });
        expect(global.fetch).not.toHaveBeenCalled();

    });
});