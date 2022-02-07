module.exports = {
  mode: 'jit',
  presets: [require('@setel/portal-ui/tailwind.config')],
  purge: ['./src/**/*.jsx', './src/**/*.tsx', './src/**/*.html'],
  // if you have additional plugins need to merge them manually
  corePlugins: {
    container: false,
  },
};
