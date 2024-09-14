"use client";

import React from "react";
import { usePreferredScheme } from "@/../src";

const Page = () => {
    const scheme = usePreferredScheme();

    return (
        <div style={{
            backgroundColor: scheme === "dark" ? "black" : "white",
            color: scheme === "dark" ? "white" : "black",
        }}>
            I change my color. I&apos;m a chameleon.
        </div>
    );
};

export default Page;
