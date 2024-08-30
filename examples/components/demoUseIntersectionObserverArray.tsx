import React, {useMemo} from 'react';
import useIntersectionObserverArray from "../../src/hooks/useIntersectionObserverArray";

const DemoUseIntersectionObserverArray = () => {
    const [ref, entries] = useIntersectionObserverArray<HTMLDivElement>();
    const allInView = useMemo(
        () => !entries.some(x => !x?.isIntersecting),
        [entries],
    );
    return (
        <>
            <h1 style={{
                color: allInView ? "green" : "red",
                position: "fixed",
                left: 0,
                top: 0
            }}>
                Both divs are {allInView ? "" : "not"} in view.
            </h1>

            <div ref={el => {
                if (el) ref.current[0] = el;
            }} style={{marginTop: "200vh", backgroundColor: "red"}}>
                Hello, world!
            </div>

            <div ref={el => {
                if (el) ref.current[1] = el;
            }} style={{marginTop: "20vh", marginBottom: "200vh", backgroundColor: "yellow"}}>
                Hello, world!
            </div>
        </>
    );
};

export default DemoUseIntersectionObserverArray;
