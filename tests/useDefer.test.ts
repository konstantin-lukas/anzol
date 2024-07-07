import {act, renderHook, waitFor} from "@testing-library/react";
import {useDefer} from "../src";

test('should defer the updating of a value', async () => {
    const { result, rerender } = await act(async () => {
        // @ts-ignore
        return renderHook((value: string) => useDefer<string>(value, 500), {
            initialProps: "numberOne"
        });
    });

    rerender("numberTwo");

    expect(typeof result.current).toBe("string");
    expect(result.current).toBe("numberOne");
    await waitFor(() => {
        expect(result.current).not.toBe("numberOne");
    });
    expect(result.current).toBe("numberTwo");

});
