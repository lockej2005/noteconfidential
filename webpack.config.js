// webpack.config.js
const path = require('path');

module.exports = {
  // Define the entry point of your application
  entry: './src/index.js',
  // Define the output directory and filenames
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // Define fallbacks for Node.js core modules
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
    },
  },
  // ... other configurations ...
};
