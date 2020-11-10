import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');

import VocabLanguageInput from "@components/shared/vocab_language_input";
import UILanguageInput from "@components/shared/ui_language_input";
import {Settings as SettingsType, SettingsSaver} from "lib/settings";
import {currentSettings} from "lib/app_context";
import {useEffect, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./index.css');

declare const BUILD_VERSION: string;
declare const BUILD_TIME: number;

type Props = {
    user: firebase.User;
} & WithTranslation

const Settings = (props: Props) => {
    const { t } = props;

    const [settings, setSettings] = useState<SettingsType>(currentSettings.getValue());
    useEffect(() => currentSettings.observe(setSettings), []);

    const settingsSaver = new SettingsSaver(props.user);

    return (
        <div>
            <h1>{t('settings.header')}</h1>

            <p>
                <label>
                    <input
                        type="checkbox"
                        checked={settings.deactivateBuiltinVerbs}
                        onChange={() =>
                            settingsSaver.setDeactivateBuiltinVerbs(!settings.deactivateBuiltinVerbs)
                        }
                    />
                    {t('settings.disable_builtin_verbs.label')}
                </label>
            </p>

            <p>
                <label>
                    <input
                        type="checkbox"
                        checked={settings.activateBabbel}
                        onChange={() =>
                            settingsSaver.setActivateBabbel(!settings.activateBabbel)
                        }
                    />
                    {t('settings.enable_babbel.label')}
                </label>
            </p>

            <h2>{t('settings.language.header')}</h2>

            <p>
                {t('settings.ui_language.header')}
                {' '}
                <UILanguageInput
                    autoFocus={false}
                    data-testid={"ui-language"}
                    onChange={lang => settingsSaver.setUILanguage(lang)}
                    value={settings.uiLanguage}
                />
            </p>

            <p>
                {t('settings.vocabulary_language.header')}
                {' '}
                <VocabLanguageInput
                    autoFocus={false}
                    data-testid={"vocabulary-language"}
                    onChange={lang => settingsSaver.setVocabLanguage(lang)}
                    value={settings.vocabLanguage}
                />
            </p>

            <p className={styles.buildVersion}>
                {t('settings.built_from', {
                    skipInterpolation: true,
                    postProcess: 'pp',
                    build_version: BUILD_VERSION,
                    build_time: (new Date(BUILD_TIME).toString()),
                })}
            </p>
        </div>
    );
};

export default withTranslation()(Settings);
