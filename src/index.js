import React from 'react';
import ReactDOM from 'react-dom';

import PageRoot from './js/components/PageRoot';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <PageRoot />,
        document.getElementById("react_container")
    );
});
