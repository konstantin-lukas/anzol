import { useRef } from 'react';

function useFirstRender() {
    const isFirstRender = useRef(true);

    if (isFirstRender.current) {
        isFirstRender.current = false;
        return true;
    }

    return false;
}

export default useFirstRender;
