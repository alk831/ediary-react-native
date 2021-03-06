const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = {
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [
    ...jestPreset.setupFiles,
    "@testing-library/react-native/cleanup-after-each",
    "./jest.setup.ts",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/utils",
    "<rootDir>/__tests__/data",
    "<rootDir>/storybook",
    "<rootDir>/design-system",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@testing-library|@react-navigation/.*|react-native-svg|react-native-camera|react-native-screens|react-native-swipe-gestures|react-native-gesture-handler|react-native-safe-area-view|react-native-svg-charts|react-native-iphone-x-helper|@react-native-community|react-native-reanimated)/)"
  ],
}
