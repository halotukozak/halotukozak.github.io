{
  mode: 'development',
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  plugins: [
    TeamCityErrorPlugin {}
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'source-map-loader'
        ],
        enforce: 'pre'
      }
    ]
  },
  entry: {
    main: [
      '/home/bartek/IdeaProjects/halotukozak.github.io/build/js/packages/kozakPortfolio/kotlin/kozakPortfolio.js'
    ]
  },
  output: {
    path: '/home/bartek/IdeaProjects/halotukozak.github.io/build/distributions',
    filename: 'kozakPortfolio.js',
    library: 'kozakPortfolio',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devtool: 'eval-source-map',
  ignoreWarnings: [
    /Failed to parse source map/
  ],
  devServer: {
    open: true,
    static: [
      '/home/bartek/IdeaProjects/halotukozak.github.io/build/processedResources/js/main'
    ]
  },
  stats: {
    warnings: false,
    errors: false
  }
}