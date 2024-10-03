import { renderHook } from "@testing-library/react";
import { useHasMounted } from "../src";

describe("useHasMounted", () => {
    test("should return true when mounted", async () => {
        const { result } = renderHook(() => useHasMounted());
        expect(result.current).toBe(true);
    });

});