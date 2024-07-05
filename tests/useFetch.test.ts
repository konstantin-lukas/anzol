import { act, renderHook, waitFor } from '@testing-library/react';
import { useFetch } from "../src";

beforeEach(() => {
    jest.clearAllMocks();
});
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
        "https://collectionapi.metmuseum.org/public/collection/v1/departments"
    )));

    expect(result.current.data).toEqual(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.ok).toBe(false);
    expect(result.current.status).toEqual(null);
    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData);
    expect(result.current.ok).toBe(true);
    expect(result.current.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);

});

test('should fetch and parse html', async () => {

});

test('should fetch and parse xml', async () => {

});

test('should fetch and parse text', async () => {

});

test('should gracefully handle errors', async () => {

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

    expect(result.current.data).not.toEqual(mockData1);
    expect(result.current.loading).toBe(true);
    expect(result.current.ok).toBe(false);
    expect(result.current.status).toEqual(null);

    rerender(secondUrl);

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData2);
    expect(result.current.ok).toBe(true);
    expect(result.current.status).toEqual(200);
    expect(global.fetch).toHaveBeenCalledTimes(2);
});