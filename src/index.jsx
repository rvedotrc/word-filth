import ReactDOM from "react-dom";
import PageRoot from "./js/components/PageRoot.jsx";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <PageRoot />,
        document.getElementById("react_container")
    );
});
