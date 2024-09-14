"use client";

import React from 'react';
import {useClickOutside} from "@/../src";

const Page = () => {
    const ref = useClickOutside(e => (e.target as HTMLElement).style.backgroundColor = "black");
    return (
        <div style={{padding: '50px', backgroundColor: 'red'}}>
            <div ref={ref} style={{padding: '50px', backgroundColor: 'blue'}}>
                <div style={{padding: '50px', backgroundColor: 'yellow'}}>
                    :)
                </div>
            </div>
        </div>
    );
};

export default Page;
