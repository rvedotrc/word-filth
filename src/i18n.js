import i18n from "i18next";

import defsEn from './translations.en.json';
import defsDa from './translations.da.json';
import defsNo from './translations.no.json';

const pp = {
    type: 'postProcessor',
    name: 'pp',
    process: (value, key, options) => {
        // console.log('pp', { value, key, options, translator });
        return value.split(/(\{\{\w+\}\})/).map(part =>
            part.startsWith('{{')
            ? options[part.substr(2, part.length - 4)]
            : part
        );
    },
};

i18n.use(pp).init({
    // we init with resources
    resources: {
        en: defsEn,
        da: defsDa,
        no: defsNo,
    },
    fallbackLng: "en",
    debug: false,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    react: {
        wait: true
    },
});

export default i18n;
