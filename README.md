# porting

a port forwarding tool 端口转发工具

by lanbo.

# Install

## install global

```shell
npm install porting -g
```

## install local
```shell
npm install porting
```

# Usage

## command-line

1. Use default config file `port-config.json`
    ```shell
    porting
    ```
2. Use custom config file
    ```shell
    porting -c portings.json
    porting --config portings.json
    ```

    config files structure
    ```json
    [
        {
            "name": "ssh",
            "port": "2222",
            "remoteHost": "192.168.1.101",
            "remotePort": "22"
        },
        {
            "name": "web server",
            "port": "8080",
            "remoteHost": "localhost",
            "remotePort": "80"
        }
    ]
    ```
3. Use command-line argument
    ```shell
    porting 2222/192.168.1.101:22,8080/localhost:80
    ```

## as a node.js module

```js
const porting = require('porting');

// This will start the servers
const unListen = porting([
    {
        "name": "ssh",
        "port": "2222",
        "remoteHost": "192.168.1.101",
        "remotePort": "22"
    },
    {
        "name": "web server",
        "port": "8080",
        "remoteHost": "localhost",
        "remotePort": "80"
    }
]);

// This will close the servers
unListen();
```