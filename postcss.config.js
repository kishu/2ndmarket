// unused

module.exports = (ctx) => ({
  parser: 'postcss-scss',
  plugins: {
      'postcss-import': {
          path: ['src/scss/']
      },
      'autoprefixer': {

      }
  }
})
