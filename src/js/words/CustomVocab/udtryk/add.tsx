import * as React from 'react';
import AddVocabForm, {FieldsProps, GetItemToSaveArgs} from "@components/MyVocab/add_vocab_form";
import {AdderProps} from "lib/types/question";
import {WithTranslation, withTranslation} from "react-i18next";
import UdtrykVocabEntry, {Data} from "./udtryk_vocab_entry";
import TextTidier from "lib/text_tidier";

type T = {
    dansk: string;
    engelsk: string;
}

const HeaderComponent = (props: WithTranslation) => {
    const {t} = props;

    return <>
        <h1>{t('my_vocab.add_phrase.heading')}</h1>

        <div className={"help"}>
            <p>{t('my_vocab.add_phrase.help')}</p>
        </div>
    </>;
};

const FieldsComponent = (props: FieldsProps<T> & WithTranslation) => {
    const {t} = props;

    return <>
        <tr>
            <td>{t(`question.shared.label.${props.vocabLanguage}`)}</td>
            <td>
                <input
                    type="text"
                    size={30}
                    lang={props.vocabLanguage}
                    spellCheck={true}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={props.fields.dansk}
                    onChange={e => props.onChange({
                        ...props.fields,
                        dansk: e.target.value,
                    })}
                    data-testid="dansk"
                    autoFocus={true}
                    ref={props.firstInputRef}
                />
            </td>
        </tr>
        <tr>
            <td>{t('question.shared.label.en')}</td>
            <td>
                <input
                    type="text"
                    size={30}
                    lang={"en"}
                    spellCheck={true}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={props.fields.engelsk}
                    onChange={e => props.onChange({
                        ...props.fields,
                        engelsk: e.target.value,
                    })}
                    data-testid="engelsk"
                />
            </td>
        </tr>
    </>;
};

const initEmptyFields = (): T => ({
    dansk: "",
    engelsk: "",
});

const initEditFields = (entry: UdtrykVocabEntry): T => ({
    dansk: entry.dansk,
    engelsk: entry.engelsk,
});

const getItemToSave = (args: GetItemToSaveArgs<T>) => {
    const data: Data = {
        // hidesVocabKey: args.hidesVocabKey,
        lang: args.lang,
        dansk: TextTidier.normaliseWhitespace(args.other?.dansk || ""),
        engelsk: TextTidier.normaliseWhitespace(args.other?.engelsk || ""),
        tags: args.tags,
    };

    if (data.dansk === '' || data.engelsk === '') return undefined;

    return new UdtrykVocabEntry(args.vocabKey, data);
};

const A = withTranslation()(AddVocabForm);
const H = withTranslation()(HeaderComponent);
const F = withTranslation()(FieldsComponent);

const Add = (props: AdderProps) => {
    return <A
        HeaderComponent={H}
        FieldsComponent={F}
        getItemToSave={getItemToSave}
        getSearchText={(fields: T) => fields?.dansk || ""}
        initEmptyFields={initEmptyFields}
        initEditFields={initEditFields}

        /* pass-through (with one rename) */
        dbref={props.dbref}
        onCancel={props.onCancel}
        onSearch={props.onSearch}
        vocabLanguage={props.vocabLanguage}
        existingEntry={props.editingExistingEntry}
    />;
};

export default Add;
