import {act, renderHook, waitFor} from "@testing-library/react";
import {useDefer} from "../src";

test('should defer the updating of a value', async () => {
    const { result, rerender } = await act(async () => {
        // @ts-ignore
        return renderHook((value: string) => useDefer(value, 500), {
            initialProps: "numberOne"
        });
    });

    rerender("numberTwo");

    expect(result.current).toBe(null);
    await waitFor(() => {
        expect(result.current).not.toBe(null);
    });
    expect(result.current).toBe("numberTwo");

});
