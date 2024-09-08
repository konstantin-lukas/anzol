import React from "react";
import useDarkMode from "../../src/hooks/useDarkMode";

const DemoUseDarkMode = () => {
    const { theme, setTheme, toggleTheme } = useDarkMode();
    return (
        <div style={{
            backgroundColor: theme === "dark" ? "black" : "white",
            color: theme === "dark" ? "white" : "black",
        }}>
            I change my color. I'm a chameleon.
            <button onClick={() => setTheme("light")}>Set to light</button>
            <button onClick={() => setTheme("dark")}>Set to dark</button>
            <button onClick={() => toggleTheme()}>Toggle theme</button>
        </div>
    );
};

export default DemoUseDarkMode;
