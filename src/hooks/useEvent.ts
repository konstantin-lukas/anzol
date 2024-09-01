import { useEffect, useState } from "react";

/**
 * Provides a wrapper around the EventListener API. Use the return value to define the event target.
 * @param type - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#type See type on mdn web docs}
 * @param listener - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#listener See listener on mdn web docs}
 * @param options - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options See options on mdn web docs}
 * @param options.catpure - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture See capture on mdn web docs}
 * @param options.once - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#once See once on mdn web docs}
 * @param options.passive - {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive See passive on mdn web docs}
 * @template T - The type of the event target.
 *
 * @return {@link SetStateAction} - A function which is used to assign the event target for convenience. The returned
 * value can be used like a ref when the target is an HTMLElement. If the target is the {@link window} or
 * {@link document}, you can use it like a regular {@link SetStateAction}.
 *
 *
 * @example
 * ```tsx
 * const DemoUseEvent = () => {
 *     const clickTarget = useEvent<HTMLDivElement>("click", (e) => {
 *         const t = (e.target as HTMLDivElement);
 *         t.style.backgroundColor = t.style.backgroundColor === "red" ? "green" : "red";
 *     });
 *
 *     const windowTarget = useEvent("scroll", _ => console.log("scroll"));
 *     useEffect(() => windowTarget(document), [windowTarget]);
 *
 *     return (
 *         <div
 *             ref={clickTarget}
 *             style={{ height: "150vh" }}
 *         >
 *             Click me :)
 *         </div>
 *     );
 * };
 * ```
 */
function useEvent<T extends EventTarget>(
    type: string,
    listener: EventListener,
    options?: {
        capture?: boolean,
        once?: boolean,
        passive?: boolean,
        signal?: AbortSignal,
    },
) {
    const [target, setTarget] = useState<T | null>(null);
    useEffect(() => {
        if (target) {
            target.addEventListener(type, listener, options);
            return () => target.removeEventListener(type, listener, options);
        }
    }, [type, listener, target, options]);
    return setTarget;
}

export default useEvent;