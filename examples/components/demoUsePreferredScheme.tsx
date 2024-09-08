import React from "react";
import { usePreferredScheme } from "../../src";

const DemoUsePreferredScheme = () => {
    const scheme = usePreferredScheme();
    return (
        <div style={{
            backgroundColor: scheme === "dark" ? "black" : "white",
            color: scheme === "dark" ? "white" : "black",
        }}>
            I change my color. I'm a chameleon.
        </div>
    );
};

export default DemoUsePreferredScheme;
