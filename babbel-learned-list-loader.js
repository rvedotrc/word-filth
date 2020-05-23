const BabbelLearnedListLoader = t => {
    const list = JSON.parse(t);
    const smallerList = list.map(e => ({ danish: e.danish, english: e.english }));
    return JSON.stringify(smallerList);
};

module.exports = BabbelLearnedListLoader;
