import React from 'react';
import useToggle from "../../src/hooks/useToggle";

const DemoUseToggle = () => {
    const [state, toggle] = useToggle();
    return (
        <>
            <h1>
                My favorite color is: {state ? "green" : "red"}
            </h1>
            <button onClick={toggle}>Change Opinion</button>
        </>
    );
};

export default DemoUseToggle;
