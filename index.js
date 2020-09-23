const net = require('net');

function log(info, showLog) {
    if (showLog) {
        console.info(`[${new Date().toLocaleString()}] ${info}`);
    }
}

function forwardingServer({ name, port, remoteHost, remotePort, showLog }) {
    const server = net.createServer((serverSocket) => {
        log(`[${name}] [${port}] [INFO] - client connect to ${remoteHost}:${remotePort}`, showLog);
        const client = net.connect({ port: remotePort, host: remoteHost }, () => {
            serverSocket.pipe(client);
        });
        client.on('end', (err) => {
            log(`[${name}] [${port}] [INFO] - ${remoteHost}:${remotePort} closed`, showLog);
            serverSocket.destroy();
        });
        client.on('error', (err) => {
            log(`[${name}] [${port}] [ERROR] - ${err}`, showLog);
            serverSocket.destroy();
        });

        client.pipe(serverSocket);

        serverSocket.on('end', (err) => {
            log(`[${name}] [${port}] [INFO] - ${remoteHost}:${remotePort} closed`, showLog);
            client.destroy();
        });
        serverSocket.on('error', (err) => {
            log(`[${name}] [${port}] [ERROR] - ${err}`, showLog);
            client.destroy();
        });
    });

    server.listen(port, '0.0.0.0', () => {
        log(`[${name}] [${port}] [INFO] - server listening on forwarding to ${remoteHost}:${remotePort}`, showLog);
    });

    return server;
}

module.exports = function (forwardings = [], showLog = false) {
    let servers = {};

    forwardings.forEach(({ name, port, remoteHost, remotePort }) => {
        servers[port] = forwardingServer({ name, port, remoteHost, remotePort, showLog });
    });

    function unListen() {
        Object.values(servers).forEach((server) => server.close());
        servers = null;
    }

    return unListen;
};
