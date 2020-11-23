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
        return text.split(/\s*;\s*/)
            .filter(Boolean)
            .map(item => this.normaliseWhitespace(item));
    }

    static parseTags(text: string): string[] | null {
        const tags = Array.from(text.match(/\w+/g) || []);
        if (tags.length === 0) return null;
        return tags;
    }

}

export default TextTidier;
