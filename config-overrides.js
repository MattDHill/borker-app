// through this file we can override the default cra configuration
// see: https://github.com/timarney/react-app-rewired
const path = require('path')

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/

  config.resolve.extensions.push('.wasm')
  // make the file loader ignore wasm files
  const fileLoader = config.module.rules
    .find(section => section.oneOf).oneOf
    .find(rule => rule.loader && rule.loader.includes(`file-loader`))
  fileLoader.exclude.push(wasmExtensionRegExp)

  // and add a dedicated loader for them
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, "src"),
    use: [{loader: require.resolve('wasm-loader'), options: {}}]
  })
  return config
}
