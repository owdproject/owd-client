// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    mocha: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['eslint:recommended', 'plugin:vue/essential', 'plugin:vue/strongly-recommended'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    'prefer-const': ['error', {
      'destructuring': 'any',
      'ignoreReadBeforeAssign': true
    }],
    'quotes': [2, 'single', 'avoid-escape'],
    'semi': ['error', 'never'],
    'max-len': 0,
    'no-undef': 0,
    'camelcase': 0,
    'no-underscore-dangle': 0,
    'no-var': 2,
    'no-unused-vars': ['error', { 'varsIgnorePattern': '[iI]gnored|next' }],
    'indent': ['error', 2],
    'comma-dangle': 1,
    'no-multi-str': 1,
    'no-mixed-operators': 1,
    'vue/no-reserved-keys': 0,
    'vue/require-default-prop': 0
  }
}