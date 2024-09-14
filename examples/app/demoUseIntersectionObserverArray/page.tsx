"use client";

import React, {useMemo} from 'react';
import {useIntersectionObserverArray} from "@/../src";

const Page = () => {
    const [ref, entries] = useIntersectionObserverArray<HTMLDivElement>();
    const allInView = useMemo(
        () => entries.length > 0 && entries.every(x => x?.isIntersecting),
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
                if (el && ref.current) ref.current[0] = el;
            }} style={{marginTop: "200vh", backgroundColor: "red"}}>
                Hello, world!
            </div>

            <div ref={el => {
                if (el && ref.current) ref.current[1] = el;
            }} style={{marginTop: "20vh", marginBottom: "200vh", backgroundColor: "yellow"}}>
                Hello, world!
            </div>
        </>
    );
};

export default Page;
