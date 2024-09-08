import { useEvent } from "../src";
import { fireEvent, render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import React, { useEffect } from "react";

function ElementEventComponent({ event }: { event: string }) {
    const target = useEvent<HTMLDivElement>(event, (e) => {
        const t = (e.target as HTMLDivElement);
        t.style.backgroundColor = t.style.backgroundColor === "green" ? "red" : "green";
    });
    return (
        <div ref={target} data-testid="target-div">
            Hello, world!
        </div>
    );
}

function WindowEventComponent({ event, spyFunction }: { event: string, spyFunction: () => void }) {
    const target = useEvent(event, spyFunction);
    useEffect(() => {
        target(window);
    }, [target]);
    return <></>;
}

function TargetEventComponent({ target, spyFunction }: { target: EventTarget | null, spyFunction: () => void }) {
    const setTarget = useEvent("click", spyFunction);
    useEffect(() => {
        setTarget(target);
    }, [target]);
    return <></>;
}

describe("useEvent", () => {
    test("should register events on elements and deregister them when props change", () => {

        const { rerender } = render(<ElementEventComponent event="mouseover"/>);
        const target = screen.getByTestId("target-div");

        expect(target.style.backgroundColor).not.toBe("red");
        expect(target.style.backgroundColor).not.toBe("green");
        fireEvent.mouseOver(target, { target });
        expect(target.style.backgroundColor).toBe("green");

        rerender(<ElementEventComponent event="click"/>);
        fireEvent.mouseOver(target, { target });
        expect(target.style.backgroundColor).toBe("green");
        fireEvent.click(target, { target });
        expect(target.style.backgroundColor).toBe("red");

    });

    test("should register events on the window and deregister them when props change", () => {

        const spyFunction = jest.fn();
        const { rerender } = render(<WindowEventComponent event="mouseover" spyFunction={ spyFunction }/>);
        const target = window;

        expect(spyFunction).toHaveBeenCalledTimes(0);
        fireEvent.mouseOver(target, { target });
        expect(spyFunction).toHaveBeenCalledTimes(1);

        rerender(<WindowEventComponent event="click" spyFunction={ spyFunction }/>);
        fireEvent.mouseOver(target, { target });
        expect(spyFunction).toHaveBeenCalledTimes(1);
        fireEvent.click(target, { target });
        expect(spyFunction).toHaveBeenCalledTimes(2);

    });

    test("should deregister event listeners when null is passed", () => {

        const spyFunction = jest.fn();
        const { rerender } = render(<TargetEventComponent target={ window } spyFunction={ spyFunction }/>);

        expect(spyFunction).toHaveBeenCalledTimes(0);
        fireEvent.click(window, { window });
        expect(spyFunction).toHaveBeenCalledTimes(1);

        rerender(<TargetEventComponent target={ null } spyFunction={ spyFunction }/>);
        fireEvent.click(window, { window });
        expect(spyFunction).toHaveBeenCalledTimes(1);

    });
});
