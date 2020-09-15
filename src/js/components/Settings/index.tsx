import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');

import LanguageInput from "@components/shared/language_input";
import * as SettingsLib from "lib/settings";
import * as UILanguage from "lib/ui_language";
import * as VocabLanguage from "lib/vocab_language";
import {currentSettings} from "lib/app_context";
import {CallbackRemover} from "lib/observer";

declare const BUILD_VERSION: string;
declare const BUILD_TIME: number;

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    settings: SettingsLib.Settings;
    unsubscribe: CallbackRemover;
}

class Settings extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        const unsubscribe = currentSettings.observe(settings => this.setState({ settings }));
        this.setState({ unsubscribe });
    }

    componentWillUnmount() {
        this.state?.unsubscribe?.();
    }

    render() {
        if (!this.state) return null;
        const { settings } = this.state;
        if (!settings) return null;

        const { t, i18n } = this.props;

        return (
            <div>
                <h1>{t('settings.header')}</h1>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!settings.deactivateBuiltinVerbs}
                            onChange={() =>
                                new SettingsLib.SettingsSaver(this.props.user)
                                    .setDeactivateBuiltinVerbs(!settings.deactivateBuiltinVerbs)
                            }
                        />
                        {t('settings.disable_builtin_verbs.label')}
                    </label>
                </p>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!settings.activateBabbel}
                            onChange={() =>
                                new SettingsLib.SettingsSaver(this.props.user)
                                    .setActivateBabbel(!settings.activateBabbel)
                            }
                        />
                        {t('settings.enable_babbel.label')}
                    </label>
                </p>

                <h2>{t('settings.language.header')}</h2>

                <p>
                    {t('settings.ui_language.header')}
                    {' '}
                    <LanguageInput
                        key={new Date().toString()} // FIXME: Why is this needed?
                        autoFocus={false}
                        data-testid={"ui-language"}
                        onChange={lang =>
                            new SettingsLib.SettingsSaver(this.props.user)
                                .setUILanguage(lang as UILanguage.Type)
                        }
                        allowedValues={UILanguage.values}
                        value={settings.uiLanguage}
                    />
                </p>

                <p>
                    {t('settings.vocabulary_language.header')}
                    {' '}
                    <LanguageInput
                        key={new Date().toString()} // FIXME: Why is this needed?
                        autoFocus={false}
                        data-testid={"vocabulary-language"}
                        onChange={lang =>
                            new SettingsLib.SettingsSaver(this.props.user)
                                .setVocabLanguage(lang as VocabLanguage.Type)
                        }
                        allowedValues={VocabLanguage.values}
                        value={settings.vocabLanguage}
                    />
                </p>

                <p className="buildVersion">
                    {t('settings.built_from', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        build_version: BUILD_VERSION,
                        build_time: (new Date(BUILD_TIME).toString()),
                    })}
                </p>
            </div>
        );
    }
}

export default withTranslation()(Settings);
