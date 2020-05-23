class ExternalLinker {

    static toDDO(dansk: string) {
        return "https://ordnet.dk/ddo/ordbog?query=" + escape(dansk);
    }

    static toGoogleTranslate(dansk: string) {
        return "https://translate.google.co.uk/?pli=1#view=home&op=translate&sl=da&tl=en&text=" + encodeURIComponent(dansk);
    }

}

export default ExternalLinker;
