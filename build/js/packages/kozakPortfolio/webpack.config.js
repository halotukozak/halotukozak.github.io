let config = {
  mode: 'development',
  resolve: {
    modules: [
      "node_modules"
    ]
  },
  plugins: [],
  module: {
    rules: []
  }
};

// entry
config.entry = {
    main: ["/home/bartek/IdeaProjects/halotukozak.github.io/build/js/packages/kozakPortfolio/kotlin/kozakPortfolio.js"]
};

config.output = {
    path: "/home/bartek/IdeaProjects/halotukozak.github.io/build/distributions",
    filename: (chunkData) => {
        return chunkData.chunk.name === 'main'
            ? "kozakPortfolio.js"
            : "kozakPortfolio-[name].js";
    },
    library: "kozakPortfolio",
    libraryTarget: "umd",
    globalObject: "this"
};

// source maps
config.module.rules.push({
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
});
config.devtool = 'eval-source-map';
config.ignoreWarnings = [/Failed to parse source map/]

// dev server
config.devServer = {
  "open": true,
  "static": [
    "/home/bartek/IdeaProjects/halotukozak.github.io/build/processedResources/js/main"
  ]
};

// noinspection JSUnnecessarySemicolon
;(function(config) {
    const tcErrorPlugin = require('kotlin-test-js-runner/tc-log-error-webpack');
    config.plugins.push(new tcErrorPlugin())
    config.stats = config.stats || {}
    Object.assign(config.stats, config.stats, {
        warnings: false,
        errors: false
    })
})(config);

// filename.js
config.output.filename = "kozakPortfolio.js"

// proxy.js
config.proxy


// save evaluated config file
;(function(config) {
    const util = require('util');
    const fs = require('fs');
    const evaluatedConfig = util.inspect(config, {showHidden: false, depth: null, compact: false});
    fs.writeFile("/home/bartek/IdeaProjects/halotukozak.github.io/build/reports/webpack/kozakPortfolio/webpack.config.evaluated.js", evaluatedConfig, function (err) {});
})(config);

module.exports = config
