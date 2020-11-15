import * as React from 'react';

import {WithTranslation} from "react-i18next";
import {AdderProps, VocabEntry} from "lib/types/question";
import * as VocabLanguage from "lib/vocab_language";
import {useRef, useState} from "react";
import VocabLanguageInput from "@components/shared/vocab_language_input";
import {currentSettings} from "lib/app_context";
import TextTidier from "lib/text_tidier";

export type FieldsProps<T> = {
    vocabLanguage: VocabLanguage.Type;
    fields: T;
    onChange: (newValue: T) => void;
    firstInputRef: React.RefObject<HTMLInputElement>;
}

export type GetItemToSaveArgs<T> = {
    vocabKey: string;
    hidesVocabKey: string | null;
    lang: VocabLanguage.Type;
    tags: string[] | null;
    other: T | undefined;
}

type Props<V extends VocabEntry, T> = {
    existingEntry?: V;
    HeaderComponent: React.ComponentType;
    FieldsComponent: React.ComponentType<FieldsProps<T>>;
    getItemToSave: (args: GetItemToSaveArgs<T>) => V | undefined;
    getSearchText: (fields: T) => string;
    initEmptyFields: () => T;
    initEditFields: (entry: V) => T;
} & Omit<AdderProps, "editingExistingEntry"> & WithTranslation

const AddVocabForm = function<V extends VocabEntry, T>(props: Props<V, T>) {
    const {t, existingEntry} = props;

    const [vocabKey, setVocabKey] = useState<string>(
        (existingEntry && !existingEntry.readOnly)
        ? existingEntry.vocabKey
        : (props.dbref.push().key as string)
    );

    const [vocabLanguage, setVocabLanguage] = useState<VocabLanguage.Type>(
        existingEntry?.lang
        || currentSettings.getValue().vocabLanguage
    );

    const [tags, setTags] = useState<string>(
        (existingEntry?.getVocabRow?.().tags || []).sort().join(" ")
    );

    const [otherFields, setOtherFields] = useState<T>(
        existingEntry
        ? props.initEditFields(existingEntry)
        : props.initEmptyFields()
    );

    const getItemToSaveArgs = (): GetItemToSaveArgs<T> => ({
        vocabKey,
        hidesVocabKey: (existingEntry && existingEntry.readOnly)
            ? existingEntry.vocabKey
            : null,
        lang: vocabLanguage,
        tags: TextTidier.parseTags(tags),
        other: otherFields,
    });

    const [itemToSave, setItemToSave] = useState<V | undefined>(
        props.getItemToSave(getItemToSaveArgs())
    );

    const HeaderComponent = props.HeaderComponent;
    const FieldsComponent = props.FieldsComponent;

    const firstInputRef = useRef<HTMLInputElement>(null);

    const handleVocabLanguage = (newValue: VocabLanguage.Type) => {
        setVocabLanguage(newValue);
        setItemToSave(
            props.getItemToSave({
                ...getItemToSaveArgs(),
                lang: newValue,
            })
        );
    };

    const handleOtherFields = (newValue: T) => {
        setOtherFields(newValue);
        props.onSearch(props.getSearchText(newValue));
        setItemToSave(
            props.getItemToSave({
                ...getItemToSaveArgs(),
                other: newValue,
            })
        );
    };

    const handleTags = (newValue: string) => {
        setTags(newValue);
        setItemToSave(
            props.getItemToSave({
                ...getItemToSaveArgs(),
                tags: TextTidier.parseTags(newValue)
            })
        );
    };

    const onSubmit = () => {
        if (!itemToSave) return;

        const newRef = props.dbref.child(itemToSave.vocabKey);

        const data = {
            type: itemToSave.type,
            ...itemToSave.encode(),
        };

        newRef.set(data).then(() => {
            props.onSearch('');
            if (existingEntry) {
                props.onCancel();
            } else {
                const newVocabKey = (props.dbref.push().key as string);
                setVocabKey(newVocabKey);

                const newOther = props.initEmptyFields();
                setOtherFields(newOther);

                props.onSearch(props.getSearchText(newOther));

                setItemToSave(
                    props.getItemToSave({
                        ...getItemToSaveArgs(),
                        vocabKey: newVocabKey,
                        other: newOther,
                    })
                );

                firstInputRef?.current?.focus();
            }
        });
    };

    const onDelete = () => {
        if (!window.confirm(t('my_vocab.delete.confirmation.this'))) return;
        if (!existingEntry || existingEntry.readOnly) return;

        props.dbref.child(existingEntry.vocabKey)
            .remove().then(() => {
                props.onCancel();
            });
    };

    return (
        <>
            <HeaderComponent/>

            <form
                onSubmit={e => { e.preventDefault(); onSubmit(); }}
                onReset={props.onCancel}
            >
                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.shared.language.label')}</td>
                            <td>
                                <VocabLanguageInput
                                    autoFocus={false}
                                    data-testid={"vocabulary-language"}
                                    onChange={lang => handleVocabLanguage(lang)}
                                    value={vocabLanguage}
                                />
                            </td>
                        </tr>

                        <FieldsComponent
                            vocabLanguage={vocabLanguage}
                            fields={otherFields}
                            onChange={handleOtherFields}
                            firstInputRef={firstInputRef}
                        />

                        <tr>
                            <td>{t('question.shared.label.tags')}</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    spellCheck={true}
                                    autoCapitalize={'none'}
                                    autoComplete={'off'}
                                    autoCorrect={'off'}
                                    value={tags}
                                    onChange={e => handleTags(e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={
                        existingEntry
                            ? "" + t('my_vocab.shared.update.button')
                            : "" + t('my_vocab.shared.add.button')
                    } disabled={!itemToSave}/>
                    <input type="reset" value={"" + t('my_vocab.shared.cancel.button')}/>
                    {existingEntry && (
                        <input type="button"
                               className="danger"
                               value={"" + t('my_vocab.delete.action.button')}
                               onClick={onDelete}
                               disabled={existingEntry.readOnly}
                        />
                    )}
                </p>

            </form>
        </>
    );
};

export default AddVocabForm;
