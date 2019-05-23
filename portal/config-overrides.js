const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/variables.less'),
  mainLessFile: path.join(__dirname, './src/styles/index.less'),
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
  ],
  indexFileName: 'index.html',
  publicPath: '.',
};
module.exports = function override(config, env) {
  config = updateConfig(config, env, options);
  return config;
};
