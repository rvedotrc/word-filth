import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import BuiltInVerbs from '../../words/BuiltInVerbs';
import ShowVerbListRow from './row';
import PropTypes from "prop-types";

class ShowVerbList extends Component {
    render() {
        const { t } = this.props;

        const verbs = BuiltInVerbs.getAll();

        const sortedVerbs = verbs.sort((a, b) => {
            let r = a.infinitiv.localeCompare(b.infinitiv);
            if (r === 0) r = a.tekst.localeCompare(b.tekst);
            return r;
        });

        return (
            <div>
                <h1>{t('show_verb_list.heading')}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>{t('show_verb_list.table.heading.infinitive')}</th>
                            <th>{t('show_verb_list.table.heading.present')}</th>
                            <th>{t('show_verb_list.table.heading.past')}</th>
                            <th>{t('show_verb_list.table.heading.past_participle')}</th>
                            <th>{t('show_verb_list.table.heading.english')}</th>
                            <th>{t('show_verb_list.table.heading.read_more')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedVerbs.map(verb => (
                            <ShowVerbListRow verb={verb} key={verb.tekst}/>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

ShowVerbList.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
};

export default withTranslation()(ShowVerbList);
