const encode = (text: string) => {
    return text
        .replace(/[#%$[\]]/g, escape)
        .replace(/\./g, '%2e')
        .replace(/\//g, '%2f')
        ;
};

export { encode };
