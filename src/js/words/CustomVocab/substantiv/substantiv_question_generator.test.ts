import SubstantivQuestionGenerator from "./substantiv_question_generator";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import GivenEnglishUbestemtEntalQuestion, {T} from "./GivenEnglishUbestemtEntalQuestion";
import {getQuestions} from "lib/questions_and_results";
import {VocabEntry} from "lib/types/question";

describe(SubstantivQuestionGenerator, () => {

  const findQuestion = (vocabEntries: VocabEntry[]): GivenEnglishUbestemtEntalQuestion | undefined => {
    const questions = getQuestions(vocabEntries);
    const matching = [...questions.values()].filter(q =>
      q instanceof GivenEnglishUbestemtEntalQuestion
    ) as GivenEnglishUbestemtEntalQuestion[];
    if (matching.length > 1) throw 'too many';
    return matching[0];
  };

  describe('simple', () => {

    const vocabEntry = new SubstantivVocabEntry('k', {
      lang: 'da',
      køn: 'en',
      ubestemtEntal: 'hund',
      bestemtEntal: 'hunden',
      ubestemtFlertal: 'hunde',
      bestemtFlertal: 'hundene',
      engelsk: 'dog',
      tags: null,
    });

    const q = findQuestion([vocabEntry]);
    if (!q) throw 'no q';

    const isCorrect = (attempt: T) => q.correct.some(c =>
        q.doesAttemptMatchCorrectAnswer(attempt, c)
    );

    it('runs 2', () => {
      expect(isCorrect({ køn: 'et', ubestemtEntal: 'hund' })).toBeFalsy();
      expect(isCorrect({ køn: 'en', ubestemtEntal: 'dog' })).toBeFalsy();

      expect(isCorrect({ køn: 'en', ubestemtEntal: 'hund' })).toBeTruthy();
      expect(isCorrect({ køn: 'en', ubestemtEntal: 'HUND' })).toBeTruthy();
    });

  });

});
