const path = require('path');

module.exports = {
    apps : [{
        name: 'DRP',
        script: path.join(__dirname, '../www/server/bin/server.js'),
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        pid_file: path.join(__dirname, 'server.pid'),
        source_map_support: true,
        wait_ready: false,
        listen_timeout: 3000,
        kill_timeout: 2000, // ms
        watch: false,
        autorestart: true,
        min_uptime: 1000, // ms
        max_restarts: 5, // Number of times a script is restarted when it exits in less than min_uptime
        instances: 'max',
        instance_var: 'INSTANCE_ID', // For example, if you want to run a cronjob only on one cluster, you can check: if process.env.NODE_APP_INSTANCE === 0
        merge_logs: true, // merge logs in cluster mode
        log_type: 'json',
        output: path.join(__dirname, '../pm2.out.log'), // is only standard output (console.log)
        error: path.join(__dirname, '../pm2.error.log'), // is only error output (console.error)
        // log: './logs/pm2.combined.outerr.log', // combines output and error, disabled by default
    }],
    deploy: {
        production: {
            env: {
                NODE_ENV: 'production'
            },
            user: 'drp',
            host: ['188.225.79.233'],
            ssh_options: ['StrictHostKeyChecking=no'/*, 'PasswordAuthentication=no'*/],
            ref: 'origin/master',
            repo: 'https://github.com/koalex/drp.git',
            path: '/home/drp/www/drp',
            'post-deploy': 'npm install && npm run bootstrap && npm run build:frontend && pm2 startOrReload pm2/ecosystem.config.js'
        }
    }
};
