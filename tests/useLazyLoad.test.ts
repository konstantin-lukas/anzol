import { act, renderHook } from "@testing-library/react";
import type { LazyLoadOptions } from "../src";
import { useLazyLoad } from "../src";

interface Animal {
    name: string,
    call: string,
}

const animalsMockData = [
    { name: "bear", call: "roar" },
    { name: "mouse", call: "squeak" },
    { name: "lion", call: "roar" },
    { name: "bee", call: "buzz" },
    { name: "tiger", call: "roar" },
    { name: "capybara", call: "squeak" },
    { name: "cat", call: "meow" },
    { name: "chicken", call: "cluck" },
    { name: "cicada", call: "chirp" },
    { name: "dog", call: "woof" },
    { name: "owl", call: "hoot" },
    { name: "pigeon", call: "coo" },
    { name: "crow", call: "caw" },
    { name: "turkey", call: "gobble" },
    { name: "wolf", call: "howl" },
] as Animal[];

global.fetch = jest.fn(async (url: string) => {
    await new Promise((r) => setTimeout(r, 0));
    const [length, offset] = url.split("?")[1].split("&").map(s => parseInt(s.split("=")[1]));
    return Promise.resolve({
        ok: true,
        json: () => animalsMockData.slice(offset, length + offset),
        status: 200,
    });
}) as jest.Mock;

async function fetchFunction(fetchIndex: number) {
    const data = await fetch(`https://api.org/animals?length=3&offset=${fetchIndex * 3}`);
    return await data.json();
}

async function renderUseLazyLoad({
    initialLimit,
    initialFunc,
    initialOptions,
}: {
    initialLimit?: number | (() => number),
    initialFunc?: (n: number) => Promise<Animal[]>,
    initialOptions?: LazyLoadOptions,
    initialLength?: number,
    initialOffset?: number,
}) {
    const {
        result,
        rerender,
    } = await act(async () => {
        return renderHook(({ func, limit, options }) => useLazyLoad<Animal>(limit, func, options), {
            initialProps: {
                func: initialFunc ?? fetchFunction,
                limit: initialLimit ?? 15,
                options: initialOptions ?? {},
            },
        });
    });
    return { rerender, result };
}

describe("useLazyLoad", () => {
    test("should fetch data when triggered to do so and stop when reaching the end", async () => {
        const { result } = await renderUseLazyLoad({});
        expect(result.current.elements).toEqual([]);
        expect(result.current.reachedEnd).toBe(false);
        expect(result.current.isFetching).toBe(false);

        for (let i = 1; i < 5; i++) {
            await act(result.current.loadMore);
            expect(result.current.elements).toEqual(animalsMockData.slice(0, i * 3));
            expect(result.current.reachedEnd).toBe(false);
        }
        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData);
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should truncate the results by default if the final fetch returns more results than expected", async () => {
        const { result } = await renderUseLazyLoad({ initialLimit: 5 });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(false);

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 5));
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should not truncate the results if the final fetch returns more results than expected and configured to do so", async () => {
        const { result } = await renderUseLazyLoad({ initialLimit: 5, initialOptions: { truncate: false }});

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(false);

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 6));
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should reach the end if a batch size is specified and a fetch result returns a shorter result", async () => {
        const { result } = await renderUseLazyLoad({ initialOptions: { batchSize: 10 }});

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should reach the end by default if the fetch function throws an error", async () => {
        const { result } = await renderUseLazyLoad({ initialFunc: () => { throw new Error(); } });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual([]);
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should not reach the end by if the fetch function throws an error and configured to do so", async () => {
        const { result } = await renderUseLazyLoad({
            initialFunc: () => { throw new Error(); },
            initialOptions: { continueOnError: true },
        });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual([]);
        expect(result.current.reachedEnd).toBe(false);
    });

    test("should clear its state when the clear() function is called", async () => {
        const { result } = await renderUseLazyLoad({});

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(false);

        await act(async () => result.current.clear());
        expect(result.current.elements).toEqual([]);
        expect(result.current.reachedEnd).toBe(false);
    });

    test("should allow changing the fetch function", async () => {
        const options = { };
        const { result, rerender } = await renderUseLazyLoad({ initialLimit: 5, initialFunc: fetchFunction, initialOptions: options });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(false);

        rerender({ limit: 5, func: () => { return fetchFunction(2); }, options: options });
        await act(result.current.loadMore);
        expect(result.current.elements).toEqual([...animalsMockData.slice(0, 3), ...animalsMockData.slice(6, 8)]);
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should allow fetching again if the maxElements prop changes to a larger number after reaching the end", async () => {
        const options = { };
        const { result, rerender } = await renderUseLazyLoad({ initialLimit: 3, initialFunc: fetchFunction, initialOptions: options });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 3));
        expect(result.current.reachedEnd).toBe(true);

        rerender({ limit: 5, func: fetchFunction, options: options });
        expect(result.current.reachedEnd).toBe(false);

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 5));
        expect(result.current.reachedEnd).toBe(true);
    });

    test("should allow passing a callback function to calculate the element limit", async () => {
        const { result } = await renderUseLazyLoad({ initialLimit: () => 1 + 1 });

        await act(result.current.loadMore);
        expect(result.current.elements).toEqual(animalsMockData.slice(0, 2));
        expect(result.current.reachedEnd).toBe(true);

    });


    test("should do nothing if currently fetching or having reached the end", async () => {
        const f = jest.fn(() => { throw new Error(); });
        const { result } = await renderUseLazyLoad({ initialFunc: f });

        await act(result.current.loadMore);
        expect(result.current.reachedEnd).toBe(true);
        expect(f).toHaveBeenCalledTimes(1);

        await act(result.current.loadMore);
        expect(f).toHaveBeenCalledTimes(1);
    });
});
