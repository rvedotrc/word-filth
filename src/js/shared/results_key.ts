const encode = (text: string) => text.replace(/[.#$[\]%]/g, escape);

const decode = unescape;

export { encode, decode };
