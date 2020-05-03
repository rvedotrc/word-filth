module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "firebase": "readonly",
        "BUILD_VERSION": "readonly",
        "BUILD_TIME": "readonly",
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "overrides": [
        {
            "files": [
                "**/*.spec.js",
                "**/*.test.js",
                "**/*.spec.jsx",
                "**/*.test.jsx"
            ],
            "env": {
                "jest": true
            }
        }
    ],
    "plugins": [
        "jest",
        "react"
    ],
    "rules": {
        "no-unused-vars": ["error", { "varsIgnorePattern": "^(props|React)$" }]
    }
};
