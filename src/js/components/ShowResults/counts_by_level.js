import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';

class CountsByLevel extends Component {

    render() {
        const { t, atLevel } = this.props;

        const levels = [0,1,2,3,4,5,6,7,8,9];
        const maxCount = Object.values(atLevel).reduce(((x, y) => (y > x ? y : x)), 0);

        if (maxCount < 1) return null;

        return (
            <div>
                <p>{t('show_results.level_count')}</p>
                <table style={{width: '100%'}}>
                    <tbody>
                        {levels.map(level => (
                            <tr key={level}>
                                <td style={{width: '2em'}}>{level}</td>
                                <td style={{width: '6em'}}>{atLevel[level] || 0}</td>
                                <td><div style={{backgroundColor: 'red', width: `${100.0 * (atLevel[level] || 0) / maxCount}%`}}>&nbsp;</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

}

CountsByLevel.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    atLevel: PropTypes.object.isRequired,
};

export default withTranslation()(CountsByLevel);
