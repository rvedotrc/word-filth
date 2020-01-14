import React from "react";

class ShowCorrectAnswers {

    constructor(verbs) {
        this.verbs = verbs;
        this.i = 0;
    }

    makeKey() {
        return "k" + (++this.i);
    }

    joinBoldWords(words) {
        if (words.length === 0) return '-';

        var i = 0;
        return words.map(word => <b key={this.makeKey()}>{word}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    allAnswers() {
        if (this.verbs.length === 0) return '-';

        // TODO: t complex
        return this.verbs.map(verb => {
            return <span key={this.makeKey()}>
                {this.joinBoldWords(verb.nutid)},{' '}
                {this.joinBoldWords(verb.datid)},{' '}
                {this.joinBoldWords(verb.førnutid)}
            </span>
        }).reduce((prev, curr) => [prev, '; eller ', curr]);
    }

}

export default ShowCorrectAnswers;
