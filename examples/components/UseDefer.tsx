import React, {useState} from 'react';
import {useDefer} from "../../src";

const UseDefer = () => {
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

export default UseDefer;
