import * as React from "react";

import * as VocabLanguage from "lib/vocab_language";
import ExternalLinker from "lib/external_linker";

type Props = {
    lang: VocabLanguage.Type;
    words: string[];
}

const DictionaryLinks = (props: Props) => {
    const urls = props.words.map(word =>
        ExternalLinker.toDictionary(props.lang, word)
    ).filter(Boolean) as string[];

    if (urls.length === 0) return null;

    return <span style={{marginLeft: '1em'}}>
        {urls.map((url, index) =>
            <a key={index} href={url} style={{marginLeft: '0.5em', textDecoration: 'none'}}>📘</a>
        )}
    </span>;
};

export default DictionaryLinks;
