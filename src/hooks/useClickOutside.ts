import { useEffect, useRef } from "react";

export type ClickOutsideEvent = "click" | "dblclick" | "mousedown" | "mouseup" | "pointerdown" | "pointerup";

export interface ClickOutsideOptions {
    eventType?: ClickOutsideEvent,
    includeChildren?: boolean,
}

/**
 * Allows you to listen a clicks outside a specified element and execute a callback.
 * @param callback - A function to execute when the user click's outside the specified element. As a parameter it takes
 * an event which is either a MouseEvent or PointerEvent depending on the {@link eventType} specified. The e.target
 * property will contain the element that was clicked.
 * @param eventType - The type of event to use for detecting clicks. Default is "click".
 * @param includeChildren - If set to true, a click on a child of the target element will count as a click on the
 * target element and not trigger the callback.
 * @return A reference you need to attach to the element to target. Can be used as a normal ref as well.
 * ```tsx
 * const DemoUseClickOutside = () => {
 *     const ref = useClickOutside(e => (e.target as HTMLElement).style.backgroundColor = "black");
 *     return (
 *         <div style={{padding: '50px', backgroundColor: 'red'}}>
 *             <div ref={ref} style={{padding: '50px', backgroundColor: 'blue'}}>
 *                 <div style={{padding: '50px', backgroundColor: 'yellow'}}>
 *                     :)
 *                 </div>
 *             </div>
 *         </div>
 *     );
 * };
 * ```
 */
function useClickOutside(callback: (e: (MouseEvent | PointerEvent)) => void, {
    eventType = "click",
    includeChildren = true,
}: ClickOutsideOptions = {}) {
    const ref = useRef(null);
    useEffect(() => {
        const eventHandler = (e: (MouseEvent | PointerEvent)) => {
            if (ref.current) {
                if (
                    includeChildren && (ref.current as Element).contains(e.target as Element)
                    || !includeChildren && ref.current === e.target
                ) return;
                callback(e);
            }
        };
        window.addEventListener(eventType, eventHandler);
        return () => window.removeEventListener(eventType, eventHandler);
    }, [ref, eventType, includeChildren]);
    return ref;
}

export default useClickOutside;