import { useEffect, useRef } from 'react';

export function useAutoScroll<T>(dependency: T) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [dependency]);

    return scrollRef;
}
