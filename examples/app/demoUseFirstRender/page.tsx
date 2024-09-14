"use client";

import React, {useState} from 'react';
import {useFirstRender} from "@/../src";

const Page = () => {
    const isFirstRender = useFirstRender();
    const [count, setCount] = useState(0);
    if (isFirstRender) setCount(count => count + 1);
    return (
        <h1>
            {count}
        </h1>
    );
};

export default Page;
