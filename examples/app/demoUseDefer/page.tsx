"use client";

import React, {useState} from 'react';
import {useDefer} from "@/../src";

const Page = () => {
    const [value, setValue] = useState("");
    const displayValue = useDefer(value, 500);
    return (
        <div>
            <input
                type="text"
                value={value}
                onInput={(e) => setValue((e.target as HTMLInputElement).value)}
            />
            <ul>
                {displayValue}
            </ul>
        </div>
    );
};

export default Page;
