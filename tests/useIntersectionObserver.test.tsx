import React from 'react';
import {act, render} from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { useIntersectionObserver } from "../src";
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

const io = mockIntersectionObserver();
IntersectionObserver.prototype.observe = jest.fn(IntersectionObserver.prototype.observe);
IntersectionObserver.prototype.disconnect = jest.fn(IntersectionObserver.prototype.disconnect);

function IntersectionComponent() {
    const [ref, entry] = useIntersectionObserver<HTMLDivElement>();
    return (
        <div ref={ref} data-testid="target-div">
            {entry?.isIntersecting ? "on" : "off"}
        </div>
    );
}

test('mount and unmount the IntersectionObserver to the target element', () => {
    const { unmount } = render(<IntersectionComponent/>);
    const targetDiv = screen.getByTestId("target-div");
    expect(IntersectionObserver.prototype.observe).toHaveBeenCalledWith(targetDiv);
    unmount();
    expect(IntersectionObserver.prototype.disconnect).toHaveBeenCalled();
});

test('change state when intersection changes', () => {
    render(<IntersectionComponent/>);
    const targetDiv = screen.getByTestId("target-div");
    expect(targetDiv.innerHTML).toBe("off");
    act(() => {
        io.enterNode(targetDiv);
    });
    expect(targetDiv.innerHTML).toBe("on");
});