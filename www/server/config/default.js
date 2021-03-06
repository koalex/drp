'use strict';

const fs      = require('fs');
const path    = require('path');
const join    = path.join;
const defer   = require('config/defer').deferConfig;
const appName = require('../package').name;

module.exports = {
    appName,
    ssl: {
        key: defer(cfg => {
            try {
                return fs.readFileSync(process.env.SSL_KEY);
            } catch (err) {
                if (cfg.protocol === 'https' || cfg.protocol === 'http2' || cfg.protocol === 'http/2') {
                    console.error('SSL key not found.');
                    process.exit(1);
                }
            }
        }),
        cert: defer(cfg => {
            try {
                return fs.readFileSync(process.env.SSL_CERT);
            } catch (err) {
                if (cfg.protocol === 'https' || cfg.protocol === 'http2' || cfg.protocol === 'http/2') {
                    console.error('SSL cert not found.');
                    process.exit(1);
                }
            }
        })
    },
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
    origins: process.env.ORIGINS ? process.env.ORIGINS.split(/\s{0,},\s{0,}/) : [],
    staticRoot: join(__dirname, '../', './static'),
    staticWebpackRoot: join(__dirname, '../', './static/webpack_output'),
    projectRoot: join(__dirname, '../'),
    logsRoot: process.env.LOGS_PATH || join(__dirname, '../', './logs'),
    uploadsRoot: process.env.UPLOADS_PATH || join(__dirname, '../', './data'),
    defaultLocale: 'ru',
    mongoose: {
        uri: defer(() => {
            const auth = process.env.MONGOOSE_USER ? `${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASS}@` : '';
            let uri    = `mongodb://${auth}${process.env.MONGOOSE_URI}/${process.env.MONGOOSE_DB_NAME}`;

            if (process.env.MONGOOSE_REPL_SET_NAME) {
                uri += ('?replicaSet=' + process.env.MONGOOSE_REPL_SET_NAME);
            }
            return uri;
        }),
        options: {
            useUnifiedTopology: true,
            replicaSet: process.env.MONGOOSE_REPL_SET_NAME,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: false,
            dbName: process.env.MONGOOSE_DB_NAME,
            // user: process.env.MONGOOSE_USER,
            // pass: process.env.MONGOOSE_PASS,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            keepAlive: 120,
            keepAliveInitialDelay: 300000,
            poolSize: 10,
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            promiseLibrary: global.Promise,
            bufferMaxEntries: 0,
            // family: 4
        }
    }
};