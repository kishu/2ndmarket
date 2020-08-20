module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
  future: {
    removeDeprecatedGapUtilities: true,
  }
}
