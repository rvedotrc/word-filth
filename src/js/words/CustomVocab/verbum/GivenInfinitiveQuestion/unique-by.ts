export const uniqueBy = <I, K>(items: I[], keyer: (item: I) => K): I[] => {
    const seenKeys: Set<K> = new Set();
    return items.filter(verb => {
        const key: K = keyer(verb);
        if (seenKeys.has(key)) {
            return false;
        } else {
            seenKeys.add(key);
            return true;
        }
    });
};
