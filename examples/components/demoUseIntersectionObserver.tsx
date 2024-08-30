import React from 'react';
import useIntersectionObserver from "../../src/hooks/useIntersectionObserver";

const DemoUseIntersectionObserver = () => {
    const [ref, entry] = useIntersectionObserver<HTMLDivElement>();
    return (
        <>
            <h1 style={{color: entry?.isIntersecting ? "green" : "red", position: "fixed", left: 0, top: 0}}>
                The div is {entry?.isIntersecting ? "" : "not"} in view.
            </h1>

            <div ref={ref} style={{marginTop: "200vh", backgroundColor: "red"}}>
                Hello, world!<br/>
                Hello, world!<br/>
                Hello, world!<br/>
                Hello, world!<br/>
                Hello, world!<br/>
                Hello, world!<br/>
                Hello, world!
            </div>
        </>
    );
};

export default DemoUseIntersectionObserver;
