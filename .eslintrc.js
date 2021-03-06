module.exports = {
  'extends': [
    'airbnb-base'
  ],
  'rules': {
    'space-before-function-paren': [ 2, { 'anonymous': 'always', 'named': 'never' } ],
    'spaced-comment': [ 2, 'always', { 'exceptions': [ '-', '+' ] } ],
    'arrow-spacing': [ 2, { 'before': true, 'after': true } ],
    'no-restricted-syntax': [ 'off' ],
    'object-property-newline': [ 'off', { 'allowMultiplePropertiesPerLine': true } ],
    'import/no-extraneous-dependencies': [ 'off', { 'devDependencies': [ 'util/', '**/*.test.js', '**/*.spec.js' ] } ],
    'no-underscore-dangle': [ 'off' ],
    'comma-dangle': [ 'error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never'
    }]
  },
  'env': {
    'browser': true,
    'node': true,
    'jest': true
  }
}
