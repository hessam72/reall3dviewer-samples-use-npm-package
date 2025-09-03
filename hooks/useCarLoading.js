'use client';
import { useState, useEffect } from 'react';

const useCarLoading = (initialLoading = true, minLoadingTime = 3000) => {
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [loadingStartTime] = useState(Date.now());

    const finishLoading = () => {
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
            setIsLoading(false);
        }, remainingTime);
    };

    return {
        isLoading,
        finishLoading,
        setIsLoading
    };
};

export default useCarLoading;