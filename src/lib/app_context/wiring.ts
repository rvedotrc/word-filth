import * as I18Next from "i18next";
import {
    currentAllVocab,
    currentCustomVocab,
    currentQuestions, currentQuestionsAndResults,
    currentResults,
    currentSettings,
    currentUILanguage,
    currentUser
} from "lib/app_context";
import {decodeDB, defaultSettings, Settings} from "lib/settings";
import {VocabEntry} from "../../js/words/CustomVocab/types";
import CustomVocab from "../../js/words/CustomVocab";
import BuiltInVerbs from "../../js/words/BuiltInVerbs";
import Questions from "../../js/Questions";
import Results from "../../js/Questions/results";
import {CallbackRemover} from "lib/observer";
import Babbel from "../../js/words/Babbel";

declare const firebase: typeof import('firebase');

export const start = (i18n: I18Next.i18n) => {

    const callbackRemovers: CallbackRemover[] = [];

    // User

    callbackRemovers.unshift(
        firebase.auth().onAuthStateChanged(
            user => currentUser.setValue(user)
        )
    );

    // UI language

    callbackRemovers.unshift(
        currentUILanguage.observe(
            value => i18n.changeLanguage(value)
        )
    );

    // Settings

    let firstSettingsLoadForThisUser: boolean = false;

    let settingsDBRef: firebase.database.Reference | undefined;

    const settingsDBListener = (snapshot: firebase.database.DataSnapshot) => {
        const val = snapshot.val() || {};
        const settings = decodeDB(val);
        currentSettings.setValue(settings);

        if (firstSettingsLoadForThisUser) {
            firstSettingsLoadForThisUser = false;
            currentUILanguage.setValue(settings.uiLanguage);
        }
    };

    callbackRemovers.unshift(() =>
        settingsDBRef?.off('value', settingsDBListener)
    );

    callbackRemovers.unshift(
        currentUser.observe(user => {
            const uid = user?.uid;

            settingsDBRef?.off('value', settingsDBListener);
            settingsDBRef = undefined;

            if (uid) {
                firstSettingsLoadForThisUser = true;
                // FIXME: encapsulation, see also SettingsSaver
                settingsDBRef = firebase.database().ref(`users/${uid}/settings`);
                settingsDBRef.on('value', settingsDBListener);
            } else {
                firstSettingsLoadForThisUser = true;
                currentSettings.setValue(defaultSettings);
            }
        })
    );

    // Custom vocab

    let vocabDBRef: firebase.database.Reference | undefined;

    const vocabDBListener = (snapshot: firebase.database.DataSnapshot) => {
        const customVocab = new CustomVocab(snapshot.val() || {});
        currentCustomVocab.setValue(customVocab.getAll());
    };

    callbackRemovers.unshift(() =>
        vocabDBRef?.off('value', vocabDBListener)
    );

    callbackRemovers.unshift(
        currentUser.observe(user => {
            const uid = user?.uid;

            vocabDBRef?.off('value', vocabDBListener);
            vocabDBRef = undefined;

            if (uid) {
                // FIXME: encapsulation, see also MyVocab (deletion) and LoggedInBox
                vocabDBRef = firebase.database().ref(`users/${uid}/vocab`);
                vocabDBRef.on('value', vocabDBListener);
            } else {
                currentCustomVocab.setValue([]);
            }
        })
    );

    // All vocab

    const vocabMerger = (customVocab: VocabEntry[], settings: Settings) => {
        const entries = [...customVocab];

        if (!settings.deactivateBuiltinVerbs) {
            entries.push(...BuiltInVerbs.getAllAsVocabEntries());
        }

        if (settings.activateBabbel) {
            entries.push(...Babbel.getAllVocabEntries());
        }
        const hiddenKeys = new Set<string>();
        entries.forEach(vocabEntry => {
            if (vocabEntry.hidesVocabKey) hiddenKeys.add(vocabEntry.hidesVocabKey);
        });

        currentAllVocab.setValue(entries.filter(entry => !hiddenKeys.has(entry.vocabKey)));
    };

    callbackRemovers.unshift(
        currentCustomVocab.observe(customVocab =>
            vocabMerger(customVocab, currentSettings.getValue())
        )
    );

    callbackRemovers.unshift(
        currentSettings.observe(settings =>
            vocabMerger(currentCustomVocab.getValue(), settings)
        )
    );

    // Questions

    callbackRemovers.unshift(
        currentAllVocab.observe(vocab =>
            currentQuestions.setValue(
                Questions.getQuestions(vocab)
            )
        )
    );

    // Results

    let resultsDBRef: firebase.database.Reference | undefined;

    const resultsDBListener = (snapshot: firebase.database.DataSnapshot) => {
        currentResults.setValue(Results.loadFromDb(snapshot.val() || {}));
    };

    callbackRemovers.unshift(() =>
        resultsDBRef?.off('value', resultsDBListener)
    );

    callbackRemovers.unshift(
        currentUser.observe(user => {
            const uid = user?.uid;

            resultsDBRef?.off('value', resultsDBListener);
            resultsDBRef = undefined;

            if (uid) {
                // FIXME: encapsulation, see also SpacedRepetition
                resultsDBRef = firebase.database().ref(`users/${uid}/results`);
                resultsDBRef.on('value', resultsDBListener);
            } else {
                currentResults.setValue(new Map());
            }
        })
    );

    // Questions and results

    callbackRemovers.unshift(
        currentQuestions.observe(questions =>
            currentQuestionsAndResults.setValue(
                Questions.getQuestionsAndResults(
                    questions,
                    currentResults.getValue()
                )
            )
        )
    );

    callbackRemovers.unshift(
        currentResults.observe(results =>
            currentQuestionsAndResults.setValue(
                Questions.getQuestionsAndResults(
                    currentQuestions.getValue(),
                    results
                )
            )
        )
    );

    // Teardown

    return () => {
        callbackRemovers.forEach(remover => remover());
    };

};
