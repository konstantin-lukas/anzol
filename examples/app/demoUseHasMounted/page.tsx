"use client";

import React from 'react';
import {useHasMounted} from "@/../src";

const Page = () => {
    const hasMounted = useHasMounted();
    if (!hasMounted) {
        return <h1>I am a fallback state :)</h1>;
    }

    return (
        <h1>
            I won't cause any hydration errors :)
        </h1>
    );
};

export default Page;
