#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const commander = require('commander');

const porting = require('../index');

const pkgJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')).toString());
const version = pkgJson.version;

const { Command } = commander;
const program = new Command();
program.version(version);

const desc = `a port forwarding tool 端口转发工具. current version is ${version}\nby lanbo\n\nUsage:\n1. porting -c port-config.json\n2. porting 2222/localhost:22,8080/localhost:80`;

program
    .arguments('[forwardings]')
    .description(desc)
    .option('-c, --config [config]', 'config file (defaults to port-config.json)')
    .action((args = '', opts) => {
        let forwardings;
        if (args) {
            forwardings = args.split(',').map((str = '') => {
                const [port, remote] = str.split('/');
                const [remoteHost, remotePort] = remote.split(':');
                return {
                    name: `${port} forwarding`,
                    port,
                    remoteHost,
                    remotePort,
                };
            });
        } else {
            const absDir = path.resolve(process.cwd(), opts.config || 'port-config.json');
            forwardings = JSON.parse(fs.readFileSync(absDir).toString());
        }

        console.log(desc + '\n');

        porting(forwardings, true);
    });

program.parse(process.argv);
