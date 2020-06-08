class TextTidier {

    static normaliseWhitespace(text: string) {
        return text.trim().replace(/\s+/g, ' ');
    }

    static discardComments(text: string) {
        return this.normaliseWhitespace(
            text.replace(/\[.*?\]/g, '')
        );
    }

    static toMultiValue(text: string) {
        return text.split(/\s*;\s*/).map(item => this.normaliseWhitespace(item));
    }

}

export default TextTidier;
