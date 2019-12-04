class ExternalLinker {

    static toDDO(dansk) {
        return "https://ordnet.dk/ddo/ordbog?query=" + escape(dansk);
    }

    static toGoogleTranslate(dansk) {
        return "https://translate.google.co.uk/?pli=1#view=home&op=translate&sl=da&tl=en&text=" + encodeURIComponent(dansk);
    }

}

export default ExternalLinker;
