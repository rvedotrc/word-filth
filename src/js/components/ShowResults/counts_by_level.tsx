import * as React from "react";
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
    atLevel: Map<number, number>;
} & WithTranslation

class CountsByLevel extends React.Component<Props, {}> {

    render() {
        const { t, atLevel } = this.props;

        const maxCount = Math.max(0, ...atLevel.values());
        if (maxCount < 1) return null;

        const levels = Array.from({ length: 10 }).map((_, i) => i);

        return (
            <div>
                <p>{t('show_results.level_count')}</p>
                <table style={{width: '100%'}}>
                    <tbody>
                        {levels.map(level => {
                            const thisCount = atLevel.get(level) || 0;
                            return (
                                <tr key={level}>
                                    <td style={{width: '2em'}}>{level}</td>
                                    <td style={{width: '6em'}}>{thisCount}</td>
                                    <td><div style={{backgroundColor: 'red', width: `${100.0 * thisCount / maxCount}%`}}>&nbsp;</div></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default withTranslation()(CountsByLevel);
