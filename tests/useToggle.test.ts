import {act, renderHook, waitFor} from "@testing-library/react";
import {useToggle} from "../src";

test('should toggle a value', async () => {
    const { result, rerender } = await act(async () => {
        return renderHook(() => useToggle(true));
    });

    expect(result.current[0]).toBe(true);
    expect(result.current[0]).toBe(true);
    await act(async () => {
        result.current[1]();
    });
    await waitFor(() => {
        expect(result.current[0]).not.toEqual(true);
    });
    expect(result.current[0]).toBe(false);

});
