class DecodingError extends Error {

}

const decodeMandatoryText = (from: any, field: string): string => {
    // eslint-disable-next-line no-prototype-builtins
    if (!from.hasOwnProperty(field)) throw new DecodingError();

    const value: any = from[field];
    if (typeof(value) !== 'string') throw new DecodingError();

    const s = (value as string).trimLeft().trimRight();
    if (s === '') throw new DecodingError();

    return s;
};

const decodeOptionalText = (from: any, field: string): string | null => {
    // eslint-disable-next-line no-prototype-builtins
    if (!from.hasOwnProperty(field)) return null;

    const value: any = from[field];
    if (value === null) return null;
    if (typeof(value) !== 'string') throw new DecodingError();

    const s = (value as string).trimLeft().trimRight();
    if (s === '') return null;

    return s;
};

export {
    decodeMandatoryText,
    decodeOptionalText,
    DecodingError,
};
