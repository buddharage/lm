module.exports = {
  moduleNameMapper: {
    'src/([^\\.]*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['node_modules', '.cache'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  globals: {
    __PATH_PREFIX__: '',
  },
  testURL: 'http://localhost',
};
