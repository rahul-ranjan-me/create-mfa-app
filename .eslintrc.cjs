module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    strict: [2, "safe"],
    semi: [2, "never"],
    "linebreak-style": "off",
    "no-empty-label": "off",
    "no-await-in-loop": "off",
    "no-continue": "off",
    "no-param-reassign": "off",
    "no-console": "off",
    "max-len": [
      2,
      {
        "code": 120,
        "ignoreComments": true,
        "ignoreTrailingComments": true,
        "ignoreStrings": true,
      },
    ],
    "object-curly-spacing": [2, "always"],
    "comma-dangle": 0,
    "no-multi-spaces": [2, { exceptions: { VariableDeclarator: true } }],
    "no-extra-semi": 1,
    "no-unreachable": 1,
    "import/no-unresolved": 1,
    "no-return-await": 1,
    "import/extensions": [
      "error", {
        "js": "ignorePackages"
      }
    ]
  },
};
