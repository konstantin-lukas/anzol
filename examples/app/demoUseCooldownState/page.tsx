"use client";

import React from 'react';
import {useCooldownState} from "@/../src";

const Page = () => {
    const [state, setState, forceUpdate] = useCooldownState(true, 1000);
    return (
        <>
            <h1>
                My favorite color is: {state ? "green" : "red"}
            </h1>
            <button onClick={() => setState(!state)}>Change Opinion</button>
            <button onClick={() => forceUpdate(!state)}>Change Opinion Immediately</button>
        </>
    );
};

export default Page;
