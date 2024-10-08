import { act, renderHook } from "@testing-library/react";
import { useLocalStorage, type LocalStorageOptions } from "../src";

async function renderUseLocalStorage({
    initialKey,
    initialOptions,
}: {
    initialKey: string,
    initialOptions?: LocalStorageOptions
}) {
    const {
        result,
        rerender,
    } = await act(async () => {
        return renderHook(({ key, options }) => useLocalStorage(key, options), {
            initialProps: {
                key: initialKey,
                options: initialOptions ?? {},
            },
        });
    });
    return { rerender, result };
}

describe("useLocalStorage", () => {

    const localStorageMock = (() => {
        let store: Record<string, string> = {};

        return {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value;
            },
            removeItem: (key: string) => {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete store[key];
            },
            clear: () => {
                store = {};
            },
        };
    })();

    // Mock the global window localStorage object
    beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
            writable: true,
        });
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });
    
    test("should set a default value when local storage item doesn't exist", async () => {
        const { result } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { initialValue: "Bear" }});
        expect(result.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
    });

    test("should not set a default value when local storage item does exist", async () => {
        const { result: result1 } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { initialValue: "Bear" }});
        expect(result1.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
        const { result: result2 } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { initialValue: "Duck" }});
        expect(result2.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
    });

    test("should not update other instances by default", async () => {
        const { result: result1 } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { initialValue: "Bear" }});
        expect(result1.current[0]).toBe("Bear");
        const { result: result2 } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { initialValue: "Duck" }});
        expect(result2.current[0]).toBe("Bear");

        act(() => result1.current[1]("Giraffe"));
        expect(result1.current[0]).toBe("Giraffe");
        expect(result2.current[0]).toBe("Bear");
    });

    test("should update other instances only if configured to listen and emit", async () => {
        const {
            result: result1,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { propagateChanges: true }});
        const {
            rerender,
            result: result2,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { listenForChanges: true }});

        act(() => result1.current[1]("Giraffe"));
        expect(result1.current[0]).toBe("Giraffe");
        expect(result2.current[0]).toBe("Giraffe");

        rerender({ key: "animal", options: { listenForChanges: false }});
        act(() => result1.current[1]("Chimpanzee"));
        expect(result1.current[0]).toBe("Chimpanzee");
        expect(result2.current[0]).toBe("Giraffe");
    });

    test("should allow switching between keys", async () => {
        const {
            result: result1,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { propagateChanges: true, listenForChanges: true }});
        const {
            rerender,
            result: result2,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { propagateChanges: true, listenForChanges: true }});

        act(() => result1.current[1]("Giraffe"));
        expect(result1.current[0]).toBe("Giraffe");
        expect(result2.current[0]).toBe("Giraffe");

        rerender({ key: "fruit", options: { listenForChanges: true }});
        act(() => result2.current[1]("Apples"));
        expect(result1.current[0]).toBe("Giraffe");
        expect(result2.current[0]).toBe("Apples");
    });

    test("should not emit more events than necessary", async () => {
        Object.defineProperty(window, "localStorage", {
            value: {
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
        const setItemSpy = jest.spyOn(window.localStorage, "setItem");

        const {
            result: result1,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { propagateChanges: true, listenForChanges: true }});
        const {
            result: result2,
        } = await renderUseLocalStorage({ initialKey: "animal", initialOptions: { propagateChanges: true, listenForChanges: true }});

        expect(setItemSpy).toHaveBeenCalledTimes(0);
        act(() => result1.current[1]("Eagle"));
        act(() => result2.current[1]("Unicorn"));
        expect(setItemSpy).toHaveBeenCalledTimes(2);
    });

    test("should support SSG", async () => {
        const { result } = await renderUseLocalStorage({
            initialKey: "animal", initialOptions: { initialValue: "Bear", SSR: false },
        });
        expect(result.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
    });

    test("should support SSG without an initial value and existing local storage key", async () => {
        const { result } = await renderUseLocalStorage({
            initialKey: "animal", initialOptions: { SSR: false },
        });
        expect(result.current[0]).toBe(null);
        expect(window.localStorage.getItem("animal")).toBe(null);
    });

    test("should support SSG with an initial value and existing local storage key", async () => {
        const { result } = await renderUseLocalStorage({
            initialKey: "animal", initialOptions: { SSR: false, initialValue: "Bear" },
        });
        expect(result.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
    });

    test("should support SSG without an initial value but with an existing local storage key", async () => {
        localStorage.setItem("animal", "Bear");
        const { result } = await renderUseLocalStorage({
            initialKey: "animal", initialOptions: { SSR: false },
        });
        expect(result.current[0]).toBe("Bear");
        expect(window.localStorage.getItem("animal")).toBe("Bear");
    });

    test("should support SSG with an initial value but with an existing local storage key", async () => {
        localStorage.setItem("animal", "Giraffe");
        const { result } = await renderUseLocalStorage({
            initialKey: "animal", initialOptions: { SSR: false, initialValue: "Bear" },
        });
        expect(result.current[0]).toBe("Giraffe");
        expect(window.localStorage.getItem("animal")).toBe("Giraffe");
    });
});
