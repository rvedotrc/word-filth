import * as VocabLanguage from "lib/vocab_language";

class ExternalLinker {

    static toDictionary(lang: VocabLanguage.Type, word: string): string | null {
        if (!word) return null;

        if (lang === 'da') {
            return "https://ordnet.dk/ddo/ordbog?query=" + encodeURIComponent(word);
        } else if (lang === 'no') {
            return `https://ordbok.uib.no/perl/ordbok.cgi?OPP=${encodeURIComponent(word)}&ant_bokmaal=5&ant_nynorsk=5&begge=+&ordbok=begge`;
        } else {
            return null;
        }
    }

    static toGoogleTranslate(lang: VocabLanguage.Type, word: string) {
        return `https://translate.google.co.uk/?pli=1#view=home&op=translate` +
            `&sl=${encodeURIComponent(lang)}` +
            `&tl=en` +
            `&text=${encodeURIComponent(word)}`;
    }

}

export default ExternalLinker;
