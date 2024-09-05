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
    { name: "bear", call: "roar" },
    { name: "bee", call: "buzz" },
    { name: "tiger", call: "roar" },
    { name: "capybara", call: "squeak" },
    { name: "cat", call: "meow" },
    { name: "chicke", call: "cluck" },
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

async function renderUseLazyLoad({
    initialLimit,
    initialFunc,
    initialOptions,
}: {
    initialLimit?: number,
    initialFunc?: () => Promise<Animal[]>,
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
                func: initialFunc ?? (async (fetchIndex: number) => {
                    const data = await fetch(`https://api.org/animals?length=3&offset=${fetchIndex * 3}`);
                    return await data.json();
                }),
                limit: initialLimit ?? 15,
                options: initialOptions ?? {},
            },
        });
    });
    return { rerender, result };
}

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