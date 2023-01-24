module.exports = {
  chainWebpack: (config) => {
    publicPath: process.env.NODE_ENV === 'production' ? '/pokerplanning/' : '/'
    config.resolve.alias.set('vue', '@vue/compat')
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}
