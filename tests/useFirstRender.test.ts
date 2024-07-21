import {act, renderHook} from "@testing-library/react";
import {useFirstRender} from "../src";

test('should return true only on the first render', async () => {
    const { result, rerender } = await act(async () => {
        return renderHook(() => useFirstRender());
    });

    expect(result.current).toBe(true);

    rerender();

    expect(result.current).toBe(false);

});
