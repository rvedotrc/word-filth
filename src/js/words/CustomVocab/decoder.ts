class DecodingError extends Error {

}

const decodeLang = (from: any, field: string): string => {
    const value = from?.[field];
    if (value === undefined) return 'da';

    if (typeof value !== 'string') throw new DecodingError();

    const s = value as string;
    if (s !== 'da' && s !== 'no') throw new DecodingError();

    return s;
};

const decodeKøn = (from: any, field: string): string => {
    const value = from?.[field];
    if (typeof value !== 'string') throw new DecodingError();

    const s = value as string;
    if (s !== 'en' && s !== 'et' && s !== 'pluralis') throw new DecodingError();

    return s;
};

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

const decodeStringList = (from: any, field: string): string[] => {
    const value = from?.[field];
    if (!Array.isArray(field)) throw new DecodingError();

    const unknownArray = value as Array<any>;
    if (!unknownArray.every(item => typeof(item) === 'string')) throw new DecodingError();
    if (unknownArray.length === 0) throw new DecodingError();

    const stringArray = (unknownArray as string[]).map(s => s.trim());
    if (stringArray.some(item => item === '')) throw new DecodingError();

    return stringArray;
};

export {
    decodeLang,
    decodeKøn,
    decodeMandatoryText,
    decodeOptionalText,
    decodeStringList,
    DecodingError,
};
