const encode = text => text.replace(/[.#$[\]%]/g, escape);

const decode = unescape;

export { encode, decode };
