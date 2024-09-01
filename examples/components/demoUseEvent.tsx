import React, {useEffect} from "react";
import { useEvent } from "../../src";

const DemoUseEvent = () => {
    const clickTarget = useEvent<HTMLDivElement>("click", (e) => {
        const t = (e.target as HTMLDivElement);
        t.style.backgroundColor = t.style.backgroundColor === "red" ? "green" : "red";
    });

    const windowTarget = useEvent("scroll", _ => console.log("scroll"));
    useEffect(() => {
        windowTarget(document);
    }, [windowTarget]);

    return (
        <div
            ref={clickTarget}
            style={{
                padding: 50,
                backgroundColor: "green",
                textAlign: "center",
                display: "inline-block",
                height: "150vh",
            }}
        >
            Click me :)
        </div>
    );
};

export default DemoUseEvent;
