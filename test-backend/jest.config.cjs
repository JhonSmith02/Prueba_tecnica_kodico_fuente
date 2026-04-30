module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false, 
        tsconfig: {
          module: 'CommonJS', // Forzamos CommonJS solo para los tests
          moduleResolution: 'node',
        },
      },
    ],
  },
};