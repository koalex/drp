const path    = require('path');
const nodemon = require('nodemon');

const watch  = [path.join(__dirname, '../')];
const ignore = [
    'node_modules',
    'nodemon.js',
    'test/*',
    'static/*',
    '.idea',
    '.git',
    'logs/*',
    'temp/*',
    'data/*',
    'coverage/*'
];

nodemon({
    delay: 1000,
    script: __dirname + '/server.js',
    watch,
    ignore
});