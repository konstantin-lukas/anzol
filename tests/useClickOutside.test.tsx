import { useClickOutside, type ClickOutsideEvent, type ClickOutsideOptions } from "../src";
import React from "react";
import { screen } from "@testing-library/dom";
import { fireEvent, render } from "@testing-library/react";

const DemoUseClickOutside = ({ options }: { options?: ClickOutsideOptions }) => {
    const ref = useClickOutside(e => (e.target as HTMLElement).style.backgroundColor = "black", options);
    return (
        <div style={{ padding: "50px", backgroundColor: "red" }} data-testid="l1">
            <div ref={ref} style={{ padding: "50px", backgroundColor: "blue" }} data-testid="l2">
                <div style={{ padding: "50px", backgroundColor: "yellow" }} data-testid="l3">
                    :)
                </div>
            </div>
        </div>
    );
};


const triggerEvent = (target: HTMLElement, e: ClickOutsideEvent) => {
    switch (e) {
    case "click": fireEvent.click(target, { target }); break;
    case "dblclick": fireEvent.dblClick(target, { target }); break;
    case "mousedown": fireEvent.mouseDown(target, { target }); break;
    case "mouseup": fireEvent.mouseUp(target, { target }); break;
    case "pointerdown": fireEvent.pointerDown(target, { target }); break;
    case "pointerup": fireEvent.pointerUp(target, { target }); break;
    }
};

describe("useClickOutside", () => {
    test("should handle different events correctly", () => {
        ["click", "dblclick", "mousedown", "mouseup", "pointerdown", "pointerup"].forEach(e => {
            const { unmount } = render(<DemoUseClickOutside options={{ eventType: e as ClickOutsideEvent }}/>);
            const l1 = screen.getByTestId("l1");
            const l2 = screen.getByTestId("l2");
            const l3 = screen.getByTestId("l3");

            triggerEvent(l2, e as ClickOutsideEvent);
            expect(l1.style.backgroundColor).not.toBe("black");
            expect(l2.style.backgroundColor).not.toBe("black");
            expect(l3.style.backgroundColor).not.toBe("black");

            triggerEvent(l3, e as ClickOutsideEvent);
            expect(l1.style.backgroundColor).not.toBe("black");
            expect(l2.style.backgroundColor).not.toBe("black");
            expect(l3.style.backgroundColor).not.toBe("black");

            triggerEvent(l1, e as ClickOutsideEvent);
            expect(l1.style.backgroundColor).toBe("black");
            expect(l2.style.backgroundColor).not.toBe("black");
            expect(l3.style.backgroundColor).not.toBe("black");
            unmount();
        });
    });
    test("should allow treating children as not part of the target element", () => {
        render(<DemoUseClickOutside options={{ includeChildren: false }}/>);
        const l1 = screen.getByTestId("l1");
        const l2 = screen.getByTestId("l2");
        const l3 = screen.getByTestId("l3");
        expect(l1.style.backgroundColor).not.toBe("black");
        expect(l2.style.backgroundColor).not.toBe("black");
        expect(l3.style.backgroundColor).not.toBe("black");

        fireEvent.click(l2, { l2 });
        expect(l1.style.backgroundColor).not.toBe("black");
        expect(l2.style.backgroundColor).not.toBe("black");
        expect(l3.style.backgroundColor).not.toBe("black");

        fireEvent.click(l3, { l3 });
        expect(l1.style.backgroundColor).not.toBe("black");
        expect(l2.style.backgroundColor).not.toBe("black");
        expect(l3.style.backgroundColor).toBe("black");

        fireEvent.click(l1, { l1 });
        expect(l1.style.backgroundColor).toBe("black");
        expect(l2.style.backgroundColor).not.toBe("black");
        expect(l3.style.backgroundColor).toBe("black");

    });
});
