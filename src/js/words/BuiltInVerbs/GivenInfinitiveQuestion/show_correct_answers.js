import React from "react";

class ShowCorrectAnswers {

    constructor(verbs) {
        this.verbs = verbs;
    }

    joinBoldWords(words) {
        if (words.length === 0) return '-';

        return words.map(word => <b>{word}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    allAnswers() {
        if (this.verbs.length === 0) return '-';

        return this.verbs.map(verb => {
            return <span key={verb.infinitiv}>
                {this.joinBoldWords(verb.nutid)},{' '}
                {this.joinBoldWords(verb.datid)},{' '}
                {this.joinBoldWords(verb.førnutid)}
            </span>
        }).reduce((prev, curr) => [prev, '; eller ', curr]);
    }

}

export default ShowCorrectAnswers;
