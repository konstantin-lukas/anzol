import { renderHook } from '@testing-library/react';
import { useFetch } from "../src";

test('should ...', () => {
    const {result} = renderHook(() => useFetch());

    expect(result.current).toEqual(0);
});
