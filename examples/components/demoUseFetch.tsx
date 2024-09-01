import React, {useMemo, useState} from 'react';
import useFetch from "../../src/hooks/useFetch";

const DemoUseFetch = () => {
    const [value, setValue] = useState("");
    const {loading, data} = useFetch<{
        data: { title: string }[]
    }>(
        "https://api.artic.edu/api/v1/artworks/search?q=" + encodeURIComponent(value)
    );
    const list = useMemo(() => data?.data.map((e: any, i: number) => <li key={i}>{e.title}</li>), [data]);
    return (
        <div>
            <input
                type="text"
                value={value}
                onInput={(e) => setValue((e.target as HTMLInputElement).value)}
            />
            <ul>
                {loading ? "LOADING..." : list}
            </ul>
        </div>
    );
};

export default DemoUseFetch;
