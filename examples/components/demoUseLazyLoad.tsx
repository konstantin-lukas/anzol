import React, {ReactNode} from 'react';
import useLazyLoad from "../../src/hooks/useLazyLoad";

const DemoUseLazyLoad = () => {
    const { loadMore, elements, reachedEnd, isFetching, reset } = useLazyLoad<ReactNode>(35, async (performedFetches) => {
        const data = await fetch(`https://api.artic.edu/api/v1/artworks?page=${performedFetches + 1}&limit=10`);
        const parsedData = await data.json();
        const elements = parsedData?.data ?? [];
        return elements.map((e: { title: string, id: number }) => <li key={e.id}>{e.title}</li>);
    });
    return (
        <div>
            <button onClick={loadMore} disabled={reachedEnd}>Load more</button>
            <button onClick={reset}>Reset</button>
            <ul>
                {elements}
            </ul>
            {isFetching ? <b>LOADING...</b> : ""}
            {reachedEnd ? <b>YOU REACHED THE END</b> : ""}
        </div>
    );
};

export default DemoUseLazyLoad;
