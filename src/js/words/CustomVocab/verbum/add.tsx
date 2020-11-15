import * as React from 'react';
import AddVocabForm, {FieldsProps, GetItemToSaveArgs} from "@components/MyVocab/add_vocab_form";
import {AdderProps} from "lib/types/question";
import {WithTranslation, withTranslation} from "react-i18next";
import TextTidier from "lib/text_tidier";
import {addParticle, removeParticle} from "lib/particle";
import VerbumVocabEntry, {Data} from "./verbum_vocab_entry";
import {bøj, expandVerbum} from "lib/bøjning";

type T = {
    infinitiv: string;
    bøjning: string;
    nutid: string;
    datid: string;
    førnutid: string;
    engelsk: string;
}

const HeaderComponent = (props: WithTranslation) => {
    const {t} = props;

    return <>
        <h1>{t('my_vocab.add_verb.heading')}</h1>

        <div className={"help"}>
            <p>{t('my_vocab.add_verb.help_1')}</p>
            <p>{t('my_vocab.add_verb.help_2')}</p>
            <p>{t('my_vocab.add_verb.help_3')}</p>
        </div>
    </>;
};

const FieldsComponent = (props: FieldsProps<T> & WithTranslation) => {
    const {t, fields} = props;

    const onBlur = (field: "nutid" | "datid" | "førnutid") => {
        return () => {
            const stem = removeParticle(props.vocabLanguage, fields.infinitiv);
            const expanded = bøj(stem, fields[field]);
            props.onChange({...fields, [field]: expanded});
        };
    };

    const onChange = (field: keyof T) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            let newFields = {...fields, [field]: newValue};

            if (field === 'infinitiv' || field === 'bøjning') {
                newFields = handleBøjning(newFields);
            }

            props.onChange(newFields);
        };
    };

    const handleBøjning = (fields: T): T => {
        const infinitiv = removeParticle(
            props.vocabLanguage,
            TextTidier.normaliseWhitespace(fields.infinitiv)
        );

        const result = expandVerbum(
            props.vocabLanguage,
            infinitiv,
            TextTidier.normaliseWhitespace(fields.bøjning),
        );

        return {...fields, ...result};
    };

    return <>
        <tr>
            <td>{t('my_vocab.add_verb.infinitive.label')}</td>
            <td>
                <input
                    type="text"
                    size={30}
                    lang={props.vocabLanguage}
                    spellCheck={true}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={fields.infinitiv}
                    onChange={onChange('infinitiv')}
                    autoFocus={true}
                    ref={props.firstInputRef}
                />
            </td>
        </tr>
        <tr>
            <td>{t('my_vocab.add_verb.inflection.label')}</td>
            <td>
                <input
                    type="text"
                    size={30}
                    lang={props.vocabLanguage}
                    spellCheck={false}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={fields.bøjning}
                    onChange={onChange('bøjning')}
                />
                {' '}
                <i>{t('my_vocab.add_verb.inflection.example')}</i>
            </td>
        </tr>
        {['nutid', 'datid', 'førnutid'].map((field: 'nutid' | 'datid' | 'førnutid') => (
            <tr key={field}>
                <td>{t(`my_vocab.add_verb.${field}.label`)}</td>
                <td>
                    <input
                        type="text"
                        size={30}
                        lang={props.vocabLanguage}
                        spellCheck={true}
                        autoCapitalize={'none'}
                        autoComplete={'off'}
                        autoCorrect={'off'}
                        value={fields[field]}
                        onChange={onChange(field)}
                        onBlur={onBlur(field)}
                    />
                </td>
            </tr>
        ))}
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
                    value={fields.engelsk}
                    onChange={onChange('engelsk')}
                />
            </td>
        </tr>
    </>;
};

const initEmptyFields = (): T => ({
    infinitiv: "",
    bøjning: "",
    nutid: "",
    datid: "",
    førnutid: "",
    engelsk: "",
});

const initEditFields = (entry: VerbumVocabEntry): T => ({
    infinitiv: removeParticle(entry.lang, entry.infinitiv),
    bøjning: "",
    nutid: entry.nutid.join("; "),
    datid: entry.datid.join("; "),
    førnutid: entry.førnutid.join("; "),
    engelsk: entry.engelsk || "",
});

const getItemToSave = (args: GetItemToSaveArgs<T>) => {
    const {other: fields} = args;

    const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s.toLowerCase());
    const tidyMultiLowerCase = (s: string) => TextTidier.toMultiValue(s.toLowerCase());

    const item: Data = {
        lang: args.lang,
        infinitiv: addParticle(args.lang, tidyLowerCase(fields.infinitiv)),
        nutid: tidyMultiLowerCase(fields.nutid),
        datid: tidyMultiLowerCase(fields.datid),
        førnutid: tidyMultiLowerCase(fields.førnutid),
        engelsk: null,
        tags: args.tags,
        hidesVocabKey: args.hidesVocabKey,
    };

    // TODO: particle
    if (!(item.infinitiv.match(/^(at|å) [a-zæøå]+$/))) return;
    if (!(item.nutid.every(t => t.match(/^[a-zæøå]+$/)))) return;
    if (!(item.datid.every(t => t.match(/^[a-zæøå]+$/)))) return;
    if (!(item.førnutid.every(t => t.match(/^[a-zæøå]+$/)))) return;

    // no toLowerCase
    let engelsk = TextTidier.normaliseWhitespace(fields.engelsk);
    if (engelsk !== '') {
        if (!(engelsk.startsWith('to '))) engelsk = 'to ' + engelsk;
        item.engelsk = engelsk;
    }

    return new VerbumVocabEntry(
        args.vocabKey,
        false,
        item,
    );
};

const A = withTranslation()(AddVocabForm);
const H = withTranslation()(HeaderComponent);
const F = withTranslation()(FieldsComponent);

const Add = (props: AdderProps) => {
    return <A
        HeaderComponent={H}
        FieldsComponent={F}
        getItemToSave={getItemToSave}
        getSearchText={(fields: T) => fields?.infinitiv || ""}
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
