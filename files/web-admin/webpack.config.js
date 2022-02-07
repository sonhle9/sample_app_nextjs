/**
 * @type {import('webpack').Configuration}
 */
const webpackConfig = {
  resolve: {
    fallback: {
      buffer: false,
    },
  },
};

module.exports = webpackConfig;
