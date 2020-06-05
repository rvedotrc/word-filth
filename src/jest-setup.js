import Enzyme from "enzyme/build";
import Adapter from "enzyme-adapter-react-16/build";

import i18n from "./i18n-setup";

Enzyme.configure({ adapter: new Adapter() });
i18n.changeLanguage('en');
