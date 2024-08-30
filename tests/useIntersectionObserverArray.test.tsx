import React from 'react';
import {act, render} from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { useIntersectionObserverArray } from "../src";
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

const io = mockIntersectionObserver();
IntersectionObserver.prototype.observe = jest.fn(IntersectionObserver.prototype.observe);
IntersectionObserver.prototype.disconnect = jest.fn(IntersectionObserver.prototype.disconnect);

function IntersectionComponent() {
    const [ref, entries] = useIntersectionObserverArray<HTMLDivElement>();
    return (
        <>
            <div ref={(el) => {
                if (el && ref.current) ref.current[0] = el;
            }} data-testid="target-div1">
                {entries.length > 0 && entries.every(e => e?.isIntersecting) ? "on" : "off"}
            </div>
            <div ref={(el) => {
                if (el && ref.current) ref.current[1] = el;
            }} data-testid="target-div2">
                {entries.length > 0 && entries.every(e => e?.isIntersecting) ? "on" : "off"}
            </div>
        </>
    );
}

test('mount and unmount the IntersectionObserver to the target elements', () => {
    const {unmount} = render(<IntersectionComponent/>);
    const targetDiv1 = screen.getByTestId("target-div1");
    const targetDiv2 = screen.getByTestId("target-div2");
    expect(IntersectionObserver.prototype.observe).toHaveBeenCalledWith(targetDiv1);
    expect(IntersectionObserver.prototype.observe).toHaveBeenCalledWith(targetDiv2);
    unmount();
    expect(IntersectionObserver.prototype.disconnect).toHaveBeenCalled();
});

test('change state when intersection changes', () => {
    render(<IntersectionComponent/>);
    const targetDiv1 = screen.getByTestId("target-div1");
    const targetDiv2 = screen.getByTestId("target-div2");
    expect(targetDiv1.innerHTML).toBe("off");
    expect(targetDiv2.innerHTML).toBe("off");
    act(() => {
        io.enterNode(targetDiv1);
    });
    expect(targetDiv1.innerHTML).toBe("off");
    expect(targetDiv2.innerHTML).toBe("off");
    act(() => {
        io.enterNode(targetDiv2);
    });
    expect(targetDiv1.innerHTML).toBe("on");
    expect(targetDiv2.innerHTML).toBe("on");
});