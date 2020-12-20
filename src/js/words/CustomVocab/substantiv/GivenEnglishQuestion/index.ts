import * as React from 'react';

import { encode } from 'lib/results_key';
import {
    AttemptRendererProps,
    CorrectResponseRendererProps, multipleAnswersLabel,
    Question, QuestionFormProps,
    QuestionHeaderProps
} from "lib/types/question";
import Attempt from "./attempt";
import Header from "./header";
import Form from "./form";
import TextTidier from "lib/text_tidier";
import * as VocabLanguage from "lib/vocab_language";
import SimpleCorrectResponse from "@components/shared/simple_correct_response";
import SubstantivVocabEntry from "../substantiv_vocab_entry";
import * as Gender from "lib/gender";

type Args = {
    lang: VocabLanguage.Type;
    engelsk: string;
    answers: Answer[];
    vocabSources: SubstantivVocabEntry[];
}

type Answer = {
    køn: Gender.Type;
    ubestemt: string;
}

export type T = Answer

export type C = Answer

class GivenEnglishQuestion implements Question<T, C> {

    public readonly lang: VocabLanguage.Type;
    public readonly engelsk: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: SubstantivVocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.engelsk = args.engelsk;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        console.assert(args.engelsk !== '');
        console.assert(args.answers.length > 0);
        console.assert(args.answers.every(t => t.ubestemt !== ''));

        this.resultsKey = `lang=${encode(this.lang)}`
            + `:type=SubstantivE2DUE`
            + `:engelsk=${encode(this.engelsk)}`;
    }

    get resultsLabel() {
        return this.engelsk;
    }

    get sortKey() {
        return this.engelsk;
    }

    get answersLabel() {
        return multipleAnswersLabel(
            this.answers.map(answer =>
                answer.køn === 'pluralis'
                    ? answer.ubestemt
                    : `${answer.køn} ${answer.ubestemt}`
            )
        );
    }

    getAttemptComponent(): React.FunctionComponent<AttemptRendererProps<T>> {
        return Attempt;
    }

    getCorrectResponseComponent(): React.FunctionComponent<CorrectResponseRendererProps<C>> {
        return props => SimpleCorrectResponse({
            correct: props.correct.map(c =>
                (c.køn === 'pluralis'
                    ? '[pluralis]'
                    : c.køn
                ) + ' ' + c.ubestemt
            ),
        });
    }

    getQuestionFormComponent(): React.FunctionComponent<QuestionFormProps<T>> {
        return Form(this.lang);
    }

    getQuestionHeaderComponent(): React.FunctionComponent<QuestionHeaderProps<T, C, GivenEnglishQuestion>> {
        return Header;
    }

    get correct(): C[] {
        return this.answers;
    }

    doesAttemptMatchCorrectAnswer(attempt: T, correctAnswer: C): boolean {
        return attempt.køn.trim().toLowerCase() === correctAnswer.køn.trim().toLowerCase()
            && TextTidier.normaliseWhitespace(attempt.ubestemt).toLowerCase() === TextTidier.normaliseWhitespace(correctAnswer.ubestemt).toLowerCase();
    }

    merge(other: Question<any, any>): Question<T, C> | undefined {
        if (!(other instanceof GivenEnglishQuestion)) return;

        return new GivenEnglishQuestion({
            lang: this.lang,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default GivenEnglishQuestion;
