import React from "react";
import { useLocalStorage } from "../../src";

function ComponentOne() {
    const [value, setValue] = useLocalStorage("value", { propagateChanges: true, listenForChanges: true });
    return (
        <div style={{ border: "1px solid black" }}>
            <div>{value}</div>
            <button onClick={() => setValue("Duck")}>Set value to "Duck"</button>
        </div>
    );
}

function ComponentTwo() {
    const [value, setValue] = useLocalStorage("value", { propagateChanges: true, listenForChanges: true });
    return (
        <div style={{border: "1px solid black"}}>
            <div>{value}</div>
            <button onClick={() => setValue("Bear")}>Set value to "Bear"</button>
        </div>
    );
}

function DemoUseLocalStorage() {
    const [value, setValue] = useLocalStorage("value", { propagateChanges: true, listenForChanges: true });

    return (
        <>
            <ComponentOne/>
            <ComponentTwo/>
            <input type="text" value={value ?? ""} onChange={(e) => setValue(e.target.value)} />
            <div>{value}</div>
        </>
    );
}

export default DemoUseLocalStorage;