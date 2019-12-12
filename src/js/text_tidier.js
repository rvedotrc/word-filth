class TextTidier {

    static normaliseWhitespace(text) {
        return text.trim().replace(/\s+/g, ' ');
    }

    static toMultiValue(text) {
        return text.split(/;+/).map(item => this.normaliseWhitespace(item));
    }

}

export default TextTidier;
