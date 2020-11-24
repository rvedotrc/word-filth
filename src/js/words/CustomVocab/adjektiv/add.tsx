import {withTranslation, WithTranslation} from "react-i18next";
import * as React from "react";
import AddVocabForm, {FieldsProps, GetItemToSaveArgs} from "@components/MyVocab/add_vocab_form";
import {bøj, expandAdjektiv} from "lib/bøjning";
import TextTidier from "lib/text_tidier";
import AdjektivVocabEntry, {Data} from "./adjektiv_vocab_entry";
import {AdderProps} from "lib/types/question";

type T = {
    grundForm: string;
    bøjning: string;
    tForm: string;
    langForm: string;
    komparativ: string;
    superlativ: string;
    engelsk: string;
}

const HeaderComponent = (props: WithTranslation) => {
    const {t} = props;

    return <>
        <h1>{t('my_vocab.add_adjective.heading')}</h1>

        <div className={"help"}>
            <p>{t('my_vocab.add_adjective.help_1')}</p>
            <p>{t('my_vocab.add_adjective.help_2')}</p>
            <p>{t('my_vocab.add_adjective.help_3')}</p>
            <p>{t('my_vocab.add_adjective.help_4')}</p>
        </div>
    </>;
};

const FieldsComponent = (props: FieldsProps<T, HTMLInputElement> & WithTranslation) => {
    const {t, fields} = props;

    const onBlur = (field: "tForm" | "langForm" | "komparativ" | "superlativ") => {
        return () => {
            const stem = fields.grundForm;
            const expanded = bøj(stem, fields[field]);
            props.onChange({...fields, [field]: expanded});
        };
    };

    const onChange = (field: keyof T) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            let newFields = {...fields, [field]: newValue};

            if (field === 'grundForm' || field === 'bøjning') {
                newFields = handleBøjning(newFields);
            }

            props.onChange(newFields);
        };
    };

    const handleBøjning = (fields: T): T => {
        const result = expandAdjektiv(
            TextTidier.normaliseWhitespace(fields.grundForm),
            TextTidier.normaliseWhitespace(fields.bøjning),
        );

        return {...fields, ...result};
    };

    return <>
        <tr>
            <td>{t('my_vocab.add_adjective.grundForm.label')}</td>
            <td>
                <input
                    type="text"
                    size={30}
                    lang={props.vocabLanguage}
                    spellCheck={true}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={fields.grundForm}
                    onChange={onChange('grundForm')}
                    autoFocus={true}
                    ref={props.firstInputRef}
                />
            </td>
        </tr>
        <tr>
            <td>{t('my_vocab.add_adjective.inflection.label')}</td>
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
                <i>{t('my_vocab.add_adjective.inflection.example')}</i>
            </td>
        </tr>
        {['tForm', 'langForm', 'komparativ', 'superlativ']
            .map((field: 'tForm' | 'langForm' | 'komparativ' | 'superlativ') => (
            <tr key={field}>
                <td>{t(`my_vocab.add_adjective.${field}.label`)}</td>
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
    grundForm: "",
    bøjning: "",
    tForm: "",
    langForm: "",
    komparativ: "",
    superlativ: "",
    engelsk: "",
});

const initEditFields = (entry: AdjektivVocabEntry): T => ({
    grundForm: entry.grundForm || "",
    bøjning: "",
    tForm: entry.tForm || "",
    langForm: entry.langForm || "",
    komparativ: entry.komparativ || "",
    superlativ: entry.superlativ || "",
    engelsk: entry.engelsk || "",
});

const getItemToSave = (args: GetItemToSaveArgs<T>) => {
    const {other: fields} = args;

    const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s).toLowerCase();

    const grundForm = tidyLowerCase(fields.grundForm) || null;
    const tForm = tidyLowerCase(fields.tForm) || null;
    const langForm = tidyLowerCase(fields.langForm) || null;
    const komparativ = tidyLowerCase(fields.komparativ) || null;
    const superlativ = tidyLowerCase(fields.superlativ) || null;
    // no toLowerCase
    const engelsk = TextTidier.toMultiValue(fields.engelsk);
    const tags = args.tags;

    if (!grundForm || !tForm || !langForm) return undefined;
    if (!!komparativ !== !!superlativ) return undefined;

    const data: Data = {
        lang: args.lang,
        grundForm,
        tForm,
        langForm,
        komparativ,
        superlativ,
        engelsk: engelsk.length > 0 ? engelsk.join("; ") : null,
        tags,
    };

    return new AdjektivVocabEntry(
        args.vocabKey,
        data,
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
        getSearchText={(fields: T) => fields?.grundForm || ""}
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
