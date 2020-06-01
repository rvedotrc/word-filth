export const uniqueBy = <I, K>(items: I[], keyer: (item: I) => K): I[] => {
    const seenKeys: Set<K> = new Set();
    return items.filter(item => {
        const key: K = keyer(item);
        if (seenKeys.has(key)) {
            return false;
        } else {
            seenKeys.add(key);
            return true;
        }
    });
};

export const unique = <I>(items: I[]): I[] => {
    const seenKeys: Set<I> = new Set();
    return items.filter(item => {
        if (seenKeys.has(item)) {
            return false;
        } else {
            seenKeys.add(item);
            return true;
        }
    });
};
