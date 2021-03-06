import {withTranslation, WithTranslation} from "react-i18next";
import * as React from "react";
import AddVocabForm, {FieldsProps, GetItemToSaveArgs} from "@components/MyVocab/add_vocab_form";
import {bøj, expandSubstantiv} from "lib/bøjning";
import TextTidier from "lib/text_tidier";
import {AdderProps} from "lib/types/question";
import SubstantivVocabEntry, {Data} from "./substantiv_vocab_entry";
import GenderInput from "@components/shared/gender_input";
import * as Gender from "lib/gender";
import DictionaryLinks from "@components/MyVocab/dictionary_links";

type T = {
    køn: Gender.Type | undefined,
    ubestemtEntal: string;
    bøjning: string;
    bestemtEntal: string;
    ubestemtFlertal: string;
    bestemtFlertal: string;
    engelsk: string;
}

const HeaderComponent = (props: WithTranslation) => {
    const {t} = props;

    return <>
        <h1>{t('my_vocab.add_noun.heading')}</h1>

        <div className={"help"}>
            <p>{t('my_vocab.add_noun.help_1')}</p>
            <p>{t('my_vocab.add_noun.help_2')}</p>
        </div>
    </>;
};

const FieldsComponent = (props: FieldsProps<T, HTMLSelectElement> & WithTranslation) => {
    const {t, fields} = props;

    const onBlur = (field: "bestemtEntal" | "ubestemtFlertal" | "bestemtFlertal") => {
        return () => {
            const stem = fields.ubestemtEntal;
            const expanded = bøj(stem, fields[field]);
            props.onChange({...fields, [field]: expanded});
        };
    };

    const onChange = (field: keyof T) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            let newFields = {...fields, [field]: newValue};

            if (field === 'ubestemtEntal' || field === 'bøjning') {
                newFields = handleBøjning(newFields);
            }

            props.onChange(newFields);
        };
    };

    const handleKøn = (value: string | null) => {
        if (value === 'en' || value === 'et' || value === 'pluralis') {
            props.onChange({...fields, køn: value});
        } else {
            props.onChange({...fields, køn: undefined});
        }
    };

    const handleBøjning = (fields: T): T => {
        const result = expandSubstantiv(
            TextTidier.normaliseWhitespace(fields.ubestemtEntal),
            TextTidier.normaliseWhitespace(fields.bøjning),
        );

        return {...fields, ...result};
    };

    const pluralis = (fields.køn === 'pluralis');

    return <>
        <tr>
            <td>{t('my_vocab.add_noun.gender.label')}</td>
            <td>
                <GenderInput
                    value={(fields.køn as any) || null}
                    onChange={handleKøn}
                    autoFocus={true}
                    data-testid="køn"
                    inputRef={props.firstInputRef}
                />
            </td>
        </tr>
        <tr>
            <td>{t('my_vocab.add_noun.ubestemtEntal.label')}</td>
            <td>
                <input
                    type="text"
                    lang={props.vocabLanguage}
                    spellCheck={true}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={fields.ubestemtEntal}
                    onChange={onChange('ubestemtEntal')}
                    disabled={pluralis}
                />
                {!pluralis && <DictionaryLinks lang={props.vocabLanguage} words={[fields.ubestemtEntal]}/>}
            </td>
        </tr>
        <tr>
            <td>{t('my_vocab.add_noun.inflection.label')}</td>
            <td>
                <input
                    type="text"
                    lang={props.vocabLanguage}
                    spellCheck={false}
                    autoCapitalize={'none'}
                    autoComplete={'off'}
                    autoCorrect={'off'}
                    value={fields.bøjning}
                    onChange={onChange('bøjning')}
                    disabled={pluralis}
                />
                {' '}
                <i>{t('my_vocab.add_noun.inflection.example')}</i>
            </td>
        </tr>
        {['bestemtEntal', 'ubestemtFlertal', 'bestemtFlertal'].map((field: 'bestemtEntal' | 'ubestemtFlertal' | 'bestemtFlertal') => (
            <tr key={field}>
                <td>{t(`my_vocab.add_noun.${field}.label`)}</td>
                <td>
                    <input
                        type="text"
                        lang={props.vocabLanguage}
                        spellCheck={true}
                        autoCapitalize={'none'}
                        autoComplete={'off'}
                        autoCorrect={'off'}
                        value={fields[field]}
                        onChange={onChange(field)}
                        onBlur={onBlur(field)}
                        disabled={pluralis && field === 'bestemtEntal'}
                    />
                    {pluralis && field === 'ubestemtFlertal' && <DictionaryLinks lang={props.vocabLanguage} words={[fields.ubestemtFlertal]}/>}
                </td>
            </tr>
        ))}
        <tr>
            <td>{t('question.shared.label.en')}</td>
            <td>
                <input
                    type="text"
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
    køn: undefined,
    ubestemtEntal: "",
    bøjning: "",
    bestemtEntal: "",
    ubestemtFlertal: "",
    bestemtFlertal: "",
    engelsk: "",
});

const initEditFields = (entry: SubstantivVocabEntry): T => ({
    køn: entry.køn as any, /* TODO-any */
    ubestemtEntal: entry.ubestemtEntal || "",
    bøjning: "",
    bestemtEntal: entry.bestemtEntal || "",
    ubestemtFlertal: entry.ubestemtFlertal || "",
    bestemtFlertal: entry.bestemtFlertal || "",
    engelsk: entry.engelsk || "",
});

const getItemToSave = (args: GetItemToSaveArgs<T>) => {
    // Validation logic here is basically duplicating that in SubstantivVocabEntry
    const {other: fields} = args;
    if (!fields.køn) return;

    const tidyLowerCase = (s: string) => TextTidier.normaliseWhitespace(s.toLowerCase());

    const engelsk: string[] = TextTidier.toMultiValue(fields.engelsk);

    const item: Data = {
        lang: args.lang,
        køn: fields.køn,
        ubestemtEntal: tidyLowerCase(fields.ubestemtEntal) || null,
        bestemtEntal: tidyLowerCase(fields.bestemtEntal) || null,
        ubestemtFlertal: tidyLowerCase(fields.ubestemtFlertal) || null,
        bestemtFlertal: tidyLowerCase(fields.bestemtFlertal) || null,
        engelsk: engelsk.length > 0 ? engelsk.join("; ") : null,
        tags: args.tags,
    };

    // Greying the inputs out doesn't remove them from the struct,
    // so we have to do that here.
    if (item.køn === 'pluralis') {
        item.ubestemtEntal = null;
        item.bestemtEntal = null;
    }

    return SubstantivVocabEntry.decodeFromData(
        args.vocabKey,
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
        getSearchText={(fields: T) => fields?.ubestemtEntal || ""}
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
