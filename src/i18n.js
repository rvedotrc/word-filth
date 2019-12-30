import i18n from "i18next";

const pp = {
    type: 'postProcessor',
    name: 'pp',
    process: (value, key, options, translator) => {
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
        en: require('./translations.en.json'),
        da: require('./translations.da.json'),
        no: require('./translations.no.json'),
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
