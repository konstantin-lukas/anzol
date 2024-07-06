import { act, renderHook, waitFor } from '@testing-library/react';
import { useFetch } from "../src";

beforeEach(() => {
    jest.clearAllMocks();
});

function preFetchAssertions(result: any) {
    expect(result.current.data).toEqual(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.ok).toBe(false);
    expect(result.current.status).toEqual(null);
}

function postFetchAssertions(result: any) {
    expect(result.current.ok).toBe(true);
    expect(result.current.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
}
test('should fetch and parse json', async () => {
    const mockData = { message: 'Success' };
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api"
    )));


    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData);
    postFetchAssertions(result);

});

test('should fetch and parse html', async () => {
    const mockData = "<html lang='en'><body><h1>Hello, world!</h1></body></html>";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "html"
    )));


    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).not.toBeInstanceOf(XMLDocument);
    expect(result.current.data).toBeInstanceOf(Document);
    expect((result.current.data as Document).body.querySelector('h1')?.innerHTML).toBe("Hello, world!");
    postFetchAssertions(result);
});

test('should fetch and parse svg', async () => {
    const mockData =
        "<svg height=\"100\" width=\"100\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "  <circle r=\"45\" cx=\"50\" cy=\"50\" fill=\"red\" />\n" +
        "</svg>";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "svg"
    )));


    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBeInstanceOf(Document);
    expect((result.current.data as XMLDocument).querySelector('circle')?.getAttribute('fill')).toBe("red");
    postFetchAssertions(result);
});

test('should fetch and parse xml', async () => {
    const mockData = "<root><info>very interesting</info></root>";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "xml"
    )));


    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBeInstanceOf(Document);
    expect((result.current.data as XMLDocument).querySelector('info')?.textContent).toBe("very interesting");
    postFetchAssertions(result);
});

test('should fetch and parse text', async () => {
    const mockData = "<root><info>very interesting</info></root>";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "text"
    )));

    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(typeof result.current.data).toBe("string");
    expect(result.current.data).toBe(mockData);
    postFetchAssertions(result);
});

test('should fetch and not parse when parse type is invalid', async () => {
    const mockData = "<root><info>very interesting</info></root>";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockData),
            status: 200
        });
    }) as jest.Mock;

    console.error = jest.fn();

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "svf" as "svg"
    )));

    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(typeof result.current.data).toBe("object");
    expect(await result.current.data.text()).toBe(mockData);
    expect(console.error).toHaveBeenCalledTimes(1);
    postFetchAssertions(result);
});


test('should fetch and not parse the response', async () => {
    const mockData = "I'm a teapot.";
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: true,
            statusText: mockData,
            status: 201
        });
    }) as jest.Mock;

    console.error = jest.fn();

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
        "response"
    )));

    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data?.ok).toBe(true);
    expect(result.current.data?.status).toBe(201);
    expect(result.current.data?.statusText).toBe(mockData);
    expect(console.error).toHaveBeenCalledTimes(0);
});

test('should discard stale requests', async () => {
    const mockData1 = { message: 'Success1' };
    const mockData2 = { message: 'Success2' };
    const firstUrl = "https://first-url.com";
    const secondUrl = "https://second-url.com";

    global.fetch = jest.fn(async (url: string) => {
        if (url === firstUrl) {
            await new Promise((r) => setTimeout(r, 1000));
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData1),
                status: 200
            });
        } else {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData2),
                status: 200
            });
        }
    }) as jest.Mock;

    const { result, rerender } = await act(async () => {
        // @ts-ignore
        return renderHook((url: string) => useFetch(url), {
            initialProps: firstUrl
        });
    });

    preFetchAssertions(result);

    rerender(secondUrl);

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData2);
    expect(result.current.ok).toBe(true);
    expect(result.current.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(2);
});


test('should not discard stale requests when asked to do so', async () => {
    const mockData1 = { message: 'Success1' };
    const mockData2 = { message: 'Success2' };
    const firstUrl = "https://first-url.com";
    const secondUrl = "https://second-url.com";

    global.fetch = jest.fn(async (url: string) => {
        if (url === firstUrl) {
            await new Promise((r) => setTimeout(r, 100));
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData1),
                status: 200
            });
        } else {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData2),
                status: 200
            });
        }
    }) as jest.Mock;

    const { result, rerender } = await act(async () => {
        // @ts-ignore
        return renderHook((url: string) => useFetch(url, "json", {}, false), {
            initialProps: firstUrl
        });
    });

    preFetchAssertions(result);

    rerender(secondUrl);

    await new Promise((r) => setTimeout(r, 200));
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData1);
    expect(result.current.ok).toBe(true);
    expect(result.current.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('should return no data on error', async () => {
    global.fetch = jest.fn(async () => {
        await new Promise((r) => setTimeout(r, 0));
        return Promise.resolve({
            ok: false,
            status: 404
        });
    }) as jest.Mock;

    const {result} = await act(() => renderHook(() => useFetch(
        "/api",
    )));

    preFetchAssertions(result);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(null);
    expect(result.current.ok).toBe(false);
    expect(result.current.status).toEqual(404);
    expect(global.fetch).toHaveBeenCalledTimes(1);
});