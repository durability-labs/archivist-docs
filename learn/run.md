---
outline: [2, 4]
---
# Run Archivist

As for now, Archivist is implemented only in [Nim](https://nim-lang.org) and can be found in [archivist-node](https://github.com/durability-labs/archivist-node) repository.

It is a command-line application which may be run in a different ways:
 - [Using binary](#using-binary)
 - [Run as a service in Linux](#run-as-a-service-in-linux)
 - [Run as a service in Windows](#run-as-a-service-in-windows) (not supported yet)
 - [Using Docker](#using-docker)
 - [Using Docker Compose](#using-docker-compose)
 - [On Kubernetes](#on-kubernetes)

During the run, it is required to pass [configuration](#configuration) option to the application, which can be done in a different ways.

## Configuration

It is possible to configure Archivist node in several ways:
 1. [CLI options](#cli-options)
 2. [Environment variables](#environment-variables)
 3. [Configuration file](#configuration-file)

The order of priority is the same as above:  
[CLI options](#cli-options) --> [Environment variables](#environment-variables) --> [Configuration file](#configuration-file).

### Common information

#### Units

For some configuration options, we can pass values in common units like following:
```shell
--cache-size=1m/1M/1mb/1MB
--storage-quota=2m/2M/2mb/2MB

--block-mi=1s/1S/1m/1M/1h/1H/1d/1D/1w/1W
--block-ttl=2s/2S/2m/2M/2h/2H/2d/2D/2w/2W
```

#### Logging

Archivist uses [Chronicles](https://github.com/status-im/nim-chronicles) logging library, which allows great flexibility in working with logs.
Chronicles has the concept of topics, which categorize log entries into semantic groups.

Using the `log-level` parameter, you can set the top-level log level like `--log-level="trace"`, but more importantly,
you can set log levels for specific topics like `--log-level="info; trace: marketplace,node; error: blockexchange"`,
which sets the top-level log level to `info` and then for topics `marketplace` and `node` sets the level to `trace` and so on.

### CLI options

```shell
archivist --help

Usage:

archivist [OPTIONS]... command

The following options are available:

     --config-file          Loads the configuration from a TOML file [=none].
     --log-level            Sets the log level [=info].
     --log-format           Specifies what kind of logs should be written to stdout (auto, colors, nocolors,
                            json) [=auto].
     --metrics              Enable the metrics server [=false].
     --metrics-address      Listening address of the metrics server [=127.0.0.1].
     --metrics-port         Listening HTTP port of the metrics server [=8008].
 -d, --data-dir             The directory where the node will store configuration and data.
 -i, --listen-addrs         Multi Addresses to listen on [=/ip4/0.0.0.0/tcp/0].
     --nat                  Specify method to use for determining public address. Must be one of: any, none,
                            upnp, pmp, extip:<IP> [=any].
 -u, --disc-port            Discovery (UDP) port [=8090].
     --net-privkey          Source of network (secp256k1) private key file path or name [=key].
 -b, --bootstrap-node       Specifies one or more bootstrap nodes to use when connecting to the network.
     --max-peers            The maximum number of peers to connect to [=160].
     --num-threads          Number of worker threads ("0" = use as many threads as there are CPU cores
                            available) [=DefaultThreadCount].
     --agent-string         Node agent string which is used as identifier in network [=Archivist Node].
     --api-bindaddr         The REST API bind address [=127.0.0.1].
 -p, --api-port             The REST Api port [=8080].
     --api-cors-origin      The REST Api CORS allowed origin for downloading data. '*' will allow all
                            origins, '' will allow none. [=Disallow all cross origin requests to download
                            data].
     --repo-kind            Backend for main repo store (fs, sqlite, leveldb) [=fs].
 -q, --storage-quota        The size of the total storage quota dedicated to the node [=$DefaultQuotaBytes].
 -t, --block-ttl            Default block timeout in seconds - 0 disables the ttl [=$DefaultBlockTtl].
     --block-mi             Time interval in seconds - determines frequency of block maintenance cycle: how
                            often blocks are checked for expiration and cleanup [=$DefaultBlockInterval].
     --block-mn             Number of blocks to check every maintenance cycle [=1000].
 -c, --cache-size           The size of the block cache, 0 disables the cache - might help on slow hardrives
                            [=0].

Available sub-commands:

archivist persistence [OPTIONS]... command

The following options are available:

     --eth-provider         The URL of the JSON-RPC API of the Ethereum node [=ws://localhost:8545].
     --eth-account          The Ethereum account that is used for storage contracts.
     --eth-private-key      File containing Ethereum private key for storage contracts.
     --marketplace-address  Address of deployed Marketplace contract.
     --validator            Enables validator, requires an Ethereum node [=false].
     --validator-max-slots  Maximum number of slots that the validator monitors [=1000].
                            If set to 0, the validator will not limit the maximum number of slots it
                            monitors.
     --validator-groups     Slot validation groups [=ValidationGroups.none].
                            A number indicating total number of groups into which the whole slot id space
                            will be divided. The value must be in the range [2, 65535]. If not provided, the
                            validator will observe the whole slot id space and the value of the
                            --validator-group-index parameter will be ignored. Powers of twos are advised
                            for even distribution.
     --validator-group-index  Slot validation group index [=0].
                            The value provided must be in the range [0, validatorGroups). Ignored when
                            --validator-groups is not provided. Only slot ids satisfying condition [(slotId
                            mod validationGroups) == groupIndex] will be observed by the validator.
     --reward-recipient     Address to send payouts to (eg rewards and refunds).

Available sub-commands:

archivist persistence prover [OPTIONS]...

The following options are available:

 -cd, --circuit-dir          Directory where the node will store proof circuit data [=data/circuits].
     --circom-r1cs          The r1cs file for the storage circuit [=data/circuits/proof_main.r1cs].
     --circom-wasm          The wasm file for the storage circuit [=data/circuits/proof_main.wasm].
     --circom-zkey          The zkey file for the storage circuit [=data/circuits/proof_main.zkey].
     --circom-no-zkey       Ignore the zkey file - use only for testing! [=false].
     --proof-samples        Number of samples to prove [=5].
     --max-slot-depth       The maximum depth of the slot tree [=32].
     --max-dataset-depth    The maximum depth of the dataset tree [=8].
     --max-block-depth      The maximum depth of the network block merkle tree [=5].
     --max-cell-elements    The maximum number of elements in a cell [=67].
```

### Environment variables

In order to set a configuration option using environment variables, first find the desired [CLI option](#cli-options)
and then transform it in the following way:

 1. prepend it with `ARCHIVIST_`
 2. make it uppercase
 3. replace `-` with `_`

For example, to configure `--log-level`, use `ARCHIVIST_LOG_LEVEL` as the environment variable name.

> [!WARNING]
> Some options can't be configured via environment variables for now [^multivalue-env-var] [^sub-commands].

### Configuration file

A [TOML](https://toml.io/en/) configuration file can also be used to set configuration values. Configuration option names and corresponding values are placed in the file, separated by `=`. Configuration option names can be obtained from the [`archivist --help`](#cli-options) command, and should not include the `--` prefix. For example, a node's log level (`--log-level`) can be configured using TOML as follows:

```toml
log-level = "trace"
```

For option, like `bootstrap-node` and `listen-addrs` which accept multiple values we can specify data as an array
```toml
listen-addrs = [
  "/ip4/0.0.0.0/tcp/1234",
  "/ip4/0.0.0.0/tcp/5678"
]
```

The Archivist node can then read the configuration from this file using the `--config-file` CLI parameter, like:
```shell
archivist --config-file=/path/to/your/config.toml
```

Please check [Run as a service in Linux](#run-as-a-service-in-linux) for a full example of configuration file.

## Auto-discovery

Archivist support marketplace contract auto-discovery based on the chain id, this mapping is done in the [source code](https://github.com/durability-labs/archivist-node/blob/main/archivist/contracts/deployment.nim). In that way we can skip `--marketplace-address` argument and use it just to override a discovered value.

## Run

Basically, we can run Archivist in three different modes:
 - [Archivist node](#archivist-node) - useful for local testing/development and basic/files sharing.
 - [Archivist node with marketplace support](#archivist-node-with-marketplace-support) - you can share files and buy the storage, this is the main mode and should be used by the end users.
 - [Archivist storage node](#archivist-storage-node) - should be used by storage providers or if you would like to sell your local storage.

 We also will touch in some words [Archivist bootstrap node](#archivist-bootstrap-node).

### Using binary

#### Archivist node

We can run Archivist in a simple way like following:
```shell
archivist
```

But, it will use a default `data-dir` value and we can pass a custom one:
```shell
archivist --data-dir=datadir
```

This will run Archivist as an isolated instance, and if we would like to join an existing network, it is required to pass a [bootstrap node](#archivist-bootstrap-node). We can pass multiple nodes as well:
```shell
archivist \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
  --bootstrap-node=spr:CiUIAhIhAhmlZ1XaN44zPDuORyNJV8I79x2eSXt5-9AirVagKCAIEgIDARpJCicAJQgCEiECGaVnVdo3jjM8O45HI0lXwjv3HZ5Je3n70CKtVqAoIAgQ_OfFxQYaCwoJBAWhGBORAnVEGgsKCQQFoRgTkQJ1RCpHMEUCIQCgqSYPxyic9XmOcQYtJDKNprK_Uokz2UzjVZRnPYpOgQIgQ8m96ukov4XZG-j-XH53_vuoy3GkHuneUZ1Xe0luCxk
```

> [!IMPORTANT]
> Make sure you are using a proper value for the [network](/networks/networks) you would like to join.

Also, to make your Archivist node accessible for other network participants, it is required to specify a public IP address which can be used to access your node:
```shell
archivist \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
  --nat=any
```

> [!TIP]
> We can set public IP using curl and IP lookup service, like [ip.archivist.storage](https://ip.archivist.storage).

After that, node will announce itself using your public IP, default UDP ([discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/)) and dynamic TCP port ([data transfer](https://docs.libp2p.io/concepts/transports/overview/)), which can be adjusted in the following way:
```shell
archivist \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070
```

In that way, node will announce itself using specified [multiaddress](https://docs.libp2p.io/concepts/fundamentals/addressing/) and we can check that via [API](https://api.archivist.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/archivist/v1/debug/info | jq -r '.announceAddresses'
```
```json
[
  "/ip4/<your public IP>/tcp/8070"
]
```
Basically, for P2P communication we should specify and configure two ports:
| # | Protocol | Function                                                                 | CLI option       | Example                                |
| - | -------- | ------------------------------------------------------------------------ | ---------------- | -------------------------------------- |
| 1 | UDP      | [Discovery](https://docs.libp2p.io/concepts/discovery-routing/overview/) | `--disc-port`    | `--disc-port=8090`                     |
| 2 | TCP      | [Transport](https://docs.libp2p.io/concepts/transports/overview/)        | `--listen-addrs` | `--listen-addrs=/ip4/0.0.0.0/tcp/8070` |

And, also it is required to setup [port-forwarding](#port-forwarding) on your Internet router, to make your node accessible for participants.

So, a fully working basic configuration will looks like following:
```shell
archivist \
  --data-dir=datadir \
  --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
  --nat=any \
  --disc-port=8090 \
  --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
  --api-cors-origin="*"
```

After node is up and running and port-forwarding configurations was done, we should be able to [Upload a file](/learn/using#upload-a-file)/[Download a file](/learn/using#download-a-file) in the network using [API](/developers/api).

You also can use [Archivist App UI](https://app.archivist.storage) for files upload/download.

And to be able to purchase a storage, we should run [Archivist node with marketplace support](#archivist-node-with-marketplace-support).

#### Archivist node with marketplace support

[Marketplace](/learn/architecture.md#marketplace-architecture) support permits to purchase the storage in Archivist network. Basically, we should add just a `persistence` sub-command and required [CLI options](#cli-options) to the [previous run](#archivist-node).

1. For a daily use, we should consider to run a local blockchain node based on the [network](/networks/networks) you would like to join. That process is described in the [Join Archivist Testnet](/networks/testnet) guide, but for a quick start we can use a public RPC endpoint.

2. Create a file with ethereum private key and set a proper permissions:
   > [!CAUTION]
   > Please use key generation service for demo purpose only.

   ```shell
   response=$(curl -s https://key.archivist.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Show your ethereum address:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```

3. Fill-up your ethereum address with ETH and Tokens based on the the [network](/networks/networks) you would like to join.

4. Specify bootstrap nodes based on the [network](/networks/networks) you would like to join.

5. Run the node:
   ```shell
   archivist \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
     --nat=any \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --api-cors-origin="*" \
     persistence \
     --eth-provider=https://rpc.testnet.archivist.storage \
     --eth-private-key=eth.key
   ```

> [!NOTE]
> We could skip `--marketplace-address` argument and rely on marketplace contract [Auto-discovery](#auto-discovery).

After node is up and running, and your address has founds, you should be able to [Purchase storage](/learn/using#purchase-storage) using [API](/developers/api).

You also can use [Archivist App UI](https://app.archivist.storage) for storage purchase.

#### Archivist storage node

Archivist [storage node](architecture#network-architecture) should be run by storage providers or in case you would like to sell your local storage.

For that, additionally to the [Archivist node with marketplace support](#archivist-node-with-marketplace-support) we should use `prover` sub-command and required [CLI options](#cli-options).

That sub-command will make Archivist to listen for a proof requests on the blockchain and answer them. To compute an answer for the proof request, Archivist will use stored data and circuit files generated by the code in the [archivist-storage-proofs-circuits](https://github.com/durability-labs/archivist-storage-proofs-circuits) repository.

Every [network](/networks/networks) uses its own generated set of the files which are stored in the [archivist-contracts](https://github.com/durability-labs/archivist-contracts/tree/main/verifier/networks) repository and also uploaded to the CDN. Hash of the files set is also known by the [marketplace smart contract](/learn/architecture#smart-contract).

To download circuit files and make them available to Archivist app, we have a stand-alone utility - `cirdl`. It can be [compiled from the sources](/learn/build#circuit-download-tool) or downloaded from the [GitHub release page](https://github.com/durability-labs/archivist-node/releases).

1. Create ethereum key file
   <details>
   <summary>example</summary>

   > [!CAUTION]
   > Please use key generation service for demo purpose only.

   ```shell
   response=$(curl -s https://key.archivist.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Show your ethereum address:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. To download circuit files, we should pass directory, RPC endpoint and optionally marketplace address to the circuit downloader:
   ```shell
   # Create circuit files folder
   mkdir -p datadir/circuits
   chmod 700 datadir/circuits

   # Download circuit files
   cirdl \
     datadir/circuits \
     https://rpc.testnet.archivist.storage
   ```

2. Start Archivist storage node
   ```shell
   archivist \
     --data-dir=datadir \
     --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
     --nat=any \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     persistence \
     --eth-provider=https://rpc.testnet.archivist.storage \
     --eth-private-key=eth.key \
     prover \
     --circuit-dir=datadir/circuits
   ```

> [!NOTE]
> You would need to pass a bootstrap nodes and blockchain RPC endpoint based on the [network](/networks/networks) you would like to join.

> [!NOTE]
> We could skip `--marketplace-address` argument and rely on marketplace contract [Auto-discovery](#auto-discovery).

After node is up and running, and your address has founds, you should be able to [sell the storage](/learn/using#create-storage-availability) using [API](/developers/api).

You also can use [Archivist App UI](https://app.archivist.storage) to sell the storage.

#### Archivist bootstrap node

Bootstrap nodes are used just to help peers with the initial nodes discovery and we need to run Archivist with just some basic options:
```shell
archivist \
  --data-dir=datadir \
  --nat=any \
  --disc-port=8090
```

To get bootstrap node SPR we can use [API](https://api.archivist.storage/#tag/Debug/operation/getDebugInfo) call:
```shell
curl -s localhost:8080/api/archivist/v1/debug/info | jq -r '.spr'
```
```shell
spr:CiUIAhIhApd79-AxPqwRDmu7Pk-berTDtoIoMz0ovKjo85Tz8CUdEgIDARo8CicAJQgCEiECl3v34DE-rBEOa7s-T5t6tMO2gigzPSi8qOjzlPPwJR0Qjv_WtwYaCwoJBFxzjbKRAh-aKkYwRAIgCiTq5jBTaJJb6lUxN-0uNCj8lkV9AGY682D21kIAMiICIE1yxrjbDdiSCiARnS7I2zqJpXC2hOvjB4JoL9SAAk67
```

That SPR record then can be used then by other peers for initial nodes discovery.

We should keep in mind some important things about SPR record (see [ENR](https://eips.ethereum.org/EIPS/eip-778)):
- It uses nodes public IP, discovery port (`--disc-port`) and private key (`--net-privkey`) for record creation
- Specified data is signed on each run and will be changed but still contain specified node data when decoded
- You can decode it by passing to the Archivist node at run and with `--log-level=trace`

For bootstrap node, it is required to forward just discovery port on your Internet router.

### Run as a service in Linux

We can run Archivist as a service via [systemd](https://systemd.io) using following steps

 1. Create an user for Archivist
    ```shell
    sudo useradd \
      --system \
      --home-dir /opt/archivist \
      --shell /usr/sbin/nologin \
      archivist
    ```
    In case you would like to run commands using a created user, you could do it like following `sudo -u archivist ls -la /opt/archivist`.

 2. Install Archivist [using a script](https://github.com/durability-labs/get-archivist) or [build from sources](/learn/build)
    ```shell
    # archivist with cirdl
    curl -s https://get.archivist.storage/install.sh | INSTALL_DIR=/usr/local/bin CIRDL=true bash
    ```

 3. Create directories
    ```shell
    sudo mkdir -p /opt/archivist/data
    sudo mkdir -p /opt/archivist/logs
    ```

 4. Create a configuration file
    ```shell
    sudo vi /opt/archivist/archivist.conf
    ```
    ```toml
    data-dir       = "/opt/archivist/data"
    listen-addrs   = ["/ip4/0.0.0.0/tcp/8070"]
    nat            = "extip:<Public IP>"
    disc-port      = 8090
    api-port       = 8080
    bootstrap-node = [
      "spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w",
      "spr:CiUIAhIhAhmlZ1XaN44zPDuORyNJV8I79x2eSXt5-9AirVagKCAIEgIDARpJCicAJQgCEiECGaVnVdo3jjM8O45HI0lXwjv3HZ5Je3n70CKtVqAoIAgQ_OfFxQYaCwoJBAWhGBORAnVEGgsKCQQFoRgTkQJ1RCpHMEUCIQCgqSYPxyic9XmOcQYtJDKNprK_Uokz2UzjVZRnPYpOgQIgQ8m96ukov4XZG-j-XH53_vuoy3GkHuneUZ1Xe0luCxk",
      "spr:CiUIAhIhAnCcHA-aqMx--nwf8cJyZKJavc-PuYNKKROoW_5Q1JcREgIDARpJCicAJQgCEiECcJwcD5qozH76fB_xwnJkolq9z4-5g0opE6hb_lDUlxEQje7FxQYaCwoJBAXfFdCRAnVOGgsKCQQF3xXQkQJ1TipGMEQCIA22oUekTsDAtsIOyrgtkG702FJPn8Xd-ifEVTUSuu7fAiBv9YyAg9iKuYBhgZKsZBHYfX8l0sXvm80s6U__EGGY-g"
    ]
    storage-quota  = "8gb"
    block-ttl      = "24h"
    log-level      = "info"
    ```

    Make sure to use bootstrap nodes for the [network](/networks/networks) you would like to join, update `nat` variable with a node Public IP and adjust other settings by your needs.

 5. Change folders ownership and permissions
    ```shell
    sudo chown -R archivist:archivist /opt/archivist
    ```

 6. Create systemd unit file
    ```shell
    sudo vi /lib/systemd/system/archivist.service
    ```
    ```shell
    [Unit]
    Description=Archivist service
    Documentation=https://docs.archivist.storage
    After=local-fs.target network-online.target

    [Service]
    MemorySwapMax=0
    TimeoutStartSec=infinity
    Type=exec
    User=archivist
    Group=archivist
    StateDirectory=archivist
    ExecStart=/usr/local/bin/archivist --config-file="/opt/archivist/archivist.conf"
    Restart=always
    RestartSec=3
    StandardOutput=append:/opt/archivist/logs/archivist.log
    StandardError=append:/opt/archivist/logs/archivist.log

    [Install]
    WantedBy=multi-user.target
    ```
    Check `man systemd`, `man systemd.service` and `man systemd.directives` for additional details.

 7. Enable and start Archivist service
    ```shell
    sudo systemctl enable archivist
    sudo systemctl start archivist
    ```

 8. Check service status
    ```shell
    sudo systemctl status archivist
    ```

 9. Enable logs rotation using logrotate
    ```shell
    sudo vi /etc/logrotate.d/archivist
    ```
    ```logrotate
    /opt/archivist/logs/*.log {
      daily
      missingok
      rotate 5
      copytruncate
      nocreate
      nomail
      dateext
      dateyesterday
    }
    ```

 1. Check the logs
    ```shell
    tail -f /opt/archivist/logs/archivist.log
    ```

### Run as a service in Windows

This functionality is not supported yet :construction:

### Using Docker

We also ship Archivist in Docker containers, which can be run on `amd64` and `arm64` platforms.

#### Docker entrypoint

[Docker entrypoint](https://github.com/durability-labs/archivist-node/blob/main/docker/docker-entrypoint.sh), supports some additional options, which can be used for easier configuration:

- `ENV_PATH` - path to the file, in form `env=value` which will be sourced and available for Archivist at run. That is useful for Kubernetes Pods configuration.
- `NAT_IP_AUTO` - when set to `true`, will set `ARCHIVIST_NAT` variable with container internal IP address. It also is useful for Kubernetes Pods configuration, when we perform automated tests.
- `NAT_PUBLIC_IP_AUTO` - used to set `ARCHIVIST_NAT` to public IP address using lookup services, like [ip.archivist.storage](https://ip.archivist.storage). Can be used for Docker/Kubernetes to set public IP in auto mode.
- `ETH_PRIVATE_KEY` - can be used to pass ethereum private key, which will be saved and passed as a value of the `ARCHIVIST_ETH_PRIVATE_KEY` variable. It should be considered as unsafe option and used for testing purposes only.
- When we set `prover` sub-command, entrypoint will run `cirdl` tool to download ceremony files, required by [Archivist storage node](#archivist-storage-node).
- `BOOTSTRAP_NODE_URL` - Archivist node API URL in form of `http://bootstrap:8080`, to be used to get it's SPR as a bootstrap node. That is useful for Docker and Kubernetes configuration.
- `NETWORK` - is a helper variable to simply a specific network join. It helps to automate `BOOTSTRAP_NODE_FROM_URL` variable.
- `BOOTSTRAP_NODE_FROM_URL` - can be used to pass SPR nodes from an URL like [spr.archivist.storage/testnet](https://spr.archivist.storage/testnet).
- `MARKETPLACE_ADDRESS_FROM_URL` - can be used to pass a Marketplace contract address from an URL like [marketplace.archivist.storage/testnet/latest](https://marketplace.archivist.storage/testnet/latest).

#### Docker network

When we are running Archivist using Docker with default [bridge network](https://docs.docker.com/engine/network/drivers/bridge/), it will create a double NAT:
 - One on the Docker side
 - Second on your Internet router

If your Internet router does not support [Full Cone NAT](https://learningnetwork.cisco.com/s/question/0D56e0000CWxJ9sCQF/lets-explain-in-details-full-cone-nat-restricted-cone-nat-and-symmetric-nat-terminologies-vs-cisco-nat-terminologies), you might have an issue and peer discovery and data transport will not work or might work unexpected.

In that case, we should consider the following solutions:
- Use [host network](https://docs.docker.com/engine/network/drivers/host/) for Docker, which is supported only in Linux
- Run [Using binary](#using-binary)
- Use VM/VPS in the Cloud to run Docker with bridge or host network

#### Run using Docker

And we basically can use same options we [used for binary](#using-binary) and additionally it is required to mount volumes and map the ports.

[Archivist storage node](#archivist-storage-node)

1. Create ethereum key file
   <details>
   <summary>example</summary>

   > [!CAUTION]
   > Please use key generation service for demo purpose only.

   ```shell
   response=$(curl -s https://key.archivist.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Show your ethereum address:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. Run Archivist:
```shell
docker run \
  --rm \
  -v $PWD/datadir:/datadir \
  -v $PWD/eth.key:/opt/eth.key \
  -p 8070:8070 \
  -p 8080:8080 \
  -p 8090:8090/udp \
  durabilitylabs/archivist-node:latest \
  archivist \
    --data-dir=/datadir \
    --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w \
    --nat=any \
    --disc-port=8090 \
    --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
    --api-cors-origin="*" \
    --api-bindaddr=0.0.0.0 \
    --api-port=8080 \
    persistence \
    --eth-provider=https://rpc.testnet.archivist.storage \
    --eth-private-key=/opt/eth.key \
    prover \
    --circuit-dir=/datadir/circuits
```

> [!NOTE]
> You would need to pass a bootstrap nodes and blockchain RPC endpoint based on the [network](/networks/networks) you would like to join.

> [!NOTE]
> We could skip `--marketplace-address` argument and rely on marketplace contract [Auto-discovery](#auto-discovery).

### Using Docker Compose

For Docker Compose, it is more suitable to use [environment variables](#environment-variables) for Archivist configuration and we can reuse commands from example above, for Docker.

[Archivist storage node](#archivist-storage-node)

1. Create ethereum key file
   <details>
   <summary>example</summary>

   > [!CAUTION]
   > Please use key generation service for demo purpose only.

   ```shell
   response=$(curl -s https://key.archivist.storage)
   awk -F ': ' '/private/ {print $2}' <<<"${response}" > eth.key
   awk -F ': ' '/address/ {print $2}' <<<"${response}" > eth.address
   chmod 600 eth.key
   ```
   Show your ethereum address:
   ```shell
   cat eth.address
   ```
   ```
   0x412665aFAb17768cd9aACE6E00537Cc6D5524Da9
   ```
   </details>

2. Create `docker-compose.yaml` file:
    ```yaml
    services:
      archivist:
        image: durabilitylabs/archivist-node:latest
        container_name: archivist
        command:
          - archivist
          - persistence
          - prover
        environment:
          - ARCHIVIST_DATA_DIR=/datadir
          - NAT_PUBLIC_IP_AUTO=https://ip.archivist.storage
          - ARCHIVIST_DISC_PORT=8090
          - ARCHIVIST_LISTEN_ADDRS=/ip4/0.0.0.0/tcp/8070
          - ARCHIVIST_API_CORS_ORIGIN="*"
          - ARCHIVIST_API_PORT=8080
          - ARCHIVIST_API_BINDADDR=0.0.0.0
          - ARCHIVIST_ETH_PROVIDER=https://rpc.testnet.archivist.storage
          - ARCHIVIST_ETH_PRIVATE_KEY=/opt/eth.key
          - ARCHIVIST_CIRCUIT_DIR=/datadir/circuits
          - BOOTSTRAP_NODE_FROM_URL=https://spr.archivist.storage/testnet
        ports:
          - 8080:8080/tcp # API
          - 8090:8090/udp # Discovery
          - 8070:8070/tcp # Transport
        volumes:
          - ./datadir:/datadir
          - ./eth.key:/opt/eth.key
        logging:
          driver: json-file
          options:
            max-size: 100m
            max-file: 5
    ```

3. Run Archivist:
   ```shell
   docker compose up
   ```

> [!NOTE]
> You would need to pass a bootstrap nodes and blockchain RPC endpoint based on the [network](/networks/networks) you would like to join.

> [!NOTE]
> We could skip `ARCHIVIST_MARKETPLACE_ADDRESS` variable and rely on marketplace contract [Auto-discovery](#auto-discovery).

### On Kubernetes

Helm chart code is available in [helm-charts](https://github.com/durability-labs/helm-charts) repository, but chart was not published yet.

## How-tos

### NAT Configuration

Use the `--nat` CLI flag to specify how your archivist node should handle NAT traversal. Below are the available options:

**any**(default): This option will automatically try to detect your public IP by checking the routing table or using UPnP/PMP NAT traversal techniques. If successful, it will use the detected public IP and port for the announce address.

**upnp**: This option exclusively uses [UPnP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) to detect the public IP and create a port mapping entry, if your device supports UPnP.

**pmp**: This option uses only [NAT-PMP](https://en.wikipedia.org/wiki/NAT_Port_Mapping_Protocol) to detect the public IP and create a port mapping entry, if your device supports NAT-PMP.

**extIP:[Your Public IP]**:Use this option if you want to manually specify an external IP address and port for the announce address. When selecting this option, you'll need to configure **port forwarding** on your router to ensure that incoming traffic is directed to the correct internal IP and port.

### Port Forwarding

If you're running on a private network, you'll need to set up port forwarding to ensure seamless communication between the archivist node and its peers. It's also recommended to configure appropriate firewall rules for TCP and UDP traffic.
While the specific steps required vary based on your router, they can be summarised as follows:
1. Find your public IP address by either visiting [ip-archivist](https://ip.archivist.storage/) or running `curl ip.archivist.storage`
2. Identify your [private](#determine-your-private-ip) IP address
3. Access your router's settings by entering its IP address (typically [http://192.168.1.1](http://192.168.1.1/)) in your web browser
4. Sign in with administrator credentials and locate the port forwarding settings
5. Set up the discovery port forwarding rule with these settings:
    - External Port: 8090
    - Internal Port: 8090
    - Protocol: UDP
    - IP Address: Your device's private IP address
6. Set up the libp2p port forwarding rule with these settings:
    - External Port: 8070
    - Internal Port: 8070
    - Protocol: TCP
    - IP Address: Your device's private IP address

#### Determine your private IP

To determine your private IP address, run the appropriate command for your OS:

**Linux**:
```shell
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows**:
```shell
ipconfig | findstr /i "IPv4 Address"
```

**MacOs**:
```shell
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Known issues

[^multivalue-env-var]: Environment variables like `ARCHIVIST_BOOTSTRAP_NODE` and `ARCHIVIST_LISTEN_ADDRS` does not support multiple values.
[^sub-commands]: Sub-commands `persistence` and `persistence prover` can't be set via environment variables.
