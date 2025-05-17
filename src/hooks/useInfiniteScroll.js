import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchMore, options = {}) => {
    const {
        threshold = 0.8,
        rootMargin = '20px',
        enabled = true,
        initialPage = 1
    } = options;

    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const observerRef = useRef(null);
    const targetRef = useRef(null);

    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading && enabled) {
                setPage((prev) => prev + 1);
            }
        },
        [hasMore, loading, enabled]
    );

    useEffect(() => {
        const options = {
            root: null,
            rootMargin,
            threshold,
        };

        observerRef.current = new IntersectionObserver(handleObserver, options);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver, rootMargin, threshold]);

    useEffect(() => {
        const currentTarget = targetRef.current;
        const currentObserver = observerRef.current;

        if (currentTarget && currentObserver) {
            currentObserver.observe(currentTarget);
        }

        return () => {
            if (currentTarget && currentObserver) {
                currentObserver.unobserve(currentTarget);
            }
        };
    }, [targetRef.current]);

    useEffect(() => {
        const loadMore = async () => {
            if (!enabled || loading || !hasMore) return;

            setLoading(true);
            setError(null);

            try {
                const { items, hasMore: moreItems } = await fetchMore(page);
                setHasMore(moreItems);
            } catch (err) {
                setError(err.message);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        loadMore();
    }, [page, fetchMore, enabled]);

    const reset = useCallback(() => {
        setPage(initialPage);
        setHasMore(true);
        setError(null);
    }, [initialPage]);

    return {
        targetRef,
        loading,
        hasMore,
        error,
        page,
        reset
    };
};

export default useInfiniteScroll; 