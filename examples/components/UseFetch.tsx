import React, {useState} from 'react';
import useFetch from "../../src/hooks/useFetch";

const UseFetch = () => {
    const [value, setValue] = useState("");
    const {loading, data} = useFetch("https://api.artic.edu/api/v1/artworks/search?q=" + encodeURIComponent(value));
    const list = data?.data.map((e, i) => <li key={i}>{e.title}</li>)
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

export default UseFetch;
