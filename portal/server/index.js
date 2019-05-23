/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
/* eslint consistent-return:0 */

const express = require('express');
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;
// const cfenv = require('cfenv');
const app = express();
const argv = require('minimist')(process.argv.slice(2));

// serve the files out of ./app as our main files
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});
// app.use(express.static(__dirname.concat('/app')));

// const appEnv = cfenv.getAppEnv();

app.listen(argv.wp || 3000, '0.0.0.0', () => {
  // print a message when the server starts listening
  console.log('server starting on '.concat('http://localhost:').concat(argv.wp || '3000'));
});
