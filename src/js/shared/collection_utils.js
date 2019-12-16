class CollectionUtils {

    static uniqueStrings(strings) {
        const hash = {};
        strings.map(s => hash[s] = true);
        return Object.keys(hash);
    }

    static groupByString(items, mapper) {
        const byKey = {};
        items.map(item => {
            const key = mapper(item);
            (byKey[key] = (byKey[key] || [])).push(item);
        });
        return byKey;
    };

}

export default CollectionUtils;
