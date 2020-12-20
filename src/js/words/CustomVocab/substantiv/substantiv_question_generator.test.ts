import SubstantivQuestionGenerator from "./substantiv_question_generator";
import SubstantivVocabEntry from "./substantiv_vocab_entry";
import GivenEnglishQuestion, {T} from "./GivenEnglishQuestion";
import {getQuestions} from "lib/questions_and_results";
import {VocabEntry} from "lib/types/question";

describe(SubstantivQuestionGenerator, () => {

  const findQuestion = (vocabEntries: VocabEntry[]): GivenEnglishQuestion | undefined => {
    const questions = getQuestions(vocabEntries);
    const matching = [...questions.values()].filter(q =>
      q instanceof GivenEnglishQuestion
    ) as GivenEnglishQuestion[];
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
      expect(isCorrect({ køn: 'et', ubestemt: 'hund' })).toBeFalsy();
      expect(isCorrect({ køn: 'en', ubestemt: 'dog' })).toBeFalsy();

      expect(isCorrect({ køn: 'en', ubestemt: 'hund' })).toBeTruthy();
      expect(isCorrect({ køn: 'en', ubestemt: 'HUND' })).toBeTruthy();
    });

  });

});
