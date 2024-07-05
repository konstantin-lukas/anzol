import React from 'react';
import useFetch from '../hooks/useFetch';

const App: React.FC = () => {
    const result = useFetch();

    return (
        <div>
            <h1>Fetch: {result}</h1>
        </div>
    );
};

export default App;
