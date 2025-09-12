---
outline: [2, 4]
---
# Archivist Testnet

The Archivist Testnet has been launched and is ready to be used for testing.

Your participation in the Archivist Testnet is subject to the [Archivist Testnet Terms and Conditions](https://github.com/durability-labs/archivist-testnet-starter/blob/main/Archivist%20Testnet%20Terms%20and%20Conditions.pdf) and [Archivist Testnet Privacy Policy](https://github.com/durability-labs/archivist-testnet-starter/blob/main/Archivist%20Testnet%20Privacy%20Policy.pdf).

**Guides.** We have basic guides covering how to set up a Storage Client which can be used to upload and persist files by buying storage in the Archivist network. We recommend that you start with those.

Running a Storage Provider is more involved and is covered as a separate guide which demonstrates the storage sales side, as well as how to run Archivist with its own local Ethereum execution client.

Guides are available either on Discord, as step-by-step, interactive guides, or here as simple instructions that you can follow:

- **Basic: running a storage client.** [[Discord](#sc-guide-discord) | [web](#sc-guide-web)]
- **Advanced: Running a storage provider.** [[web](#sp-guide-web)]

The guides were tested on the following operating systems:

 - Linux: Ubuntu 24.04, Debian 12, Fedora 40
 - macOS: 15
 - Windows: 11, Server 2022

## Running a Storage Client (Discord Version) {#sc-guide-discord}

You can join [Archivist Discord server](https://discord.gg/archivist-storage) and jump into the [#:tv:|join-testnet](https://discord.com/channels/1395434707566465136/1413397613226758184) channel.

It is mostly the same as a [Web guide](#sc-guide-web), but uses Discord capabilities so you can have an interactive, step-by-step guide, and you also can get a support in the [#:sos:|node-help](https://discord.com/channels/1395434707566465136/1413398454398488727) channel.

## Running a Storage Client (Web Version) {#sc-guide-web}

**Prerequisites**

 - Access to your Internet router so you can [configure port forwarding](#basic-common)

Steps for [Linux/macOS](#basic-linux-macos) and [Windows](#basic-windows) are slightly different, so please use ones for your OS.

<hr>

### Linux/macOS {#basic-linux-macos}

1. Install Archivist binaries from GitHub releases:
   ```shell
   curl -s https://get.archivist.storage/install.sh | bash
   ```

2. Install dependencies when required:
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Generate an ethereum keypair:
   ```shell
   curl -s https://get.archivist.storage/generate.sh | bash
   ```
   Your private key will be saved to `eth.key` and address to  `eth.address` file.

4. Fill-up your address shown on the screen with the tokens:
   - Use the web faucets to mint some [ETH](https://faucet-eth.testnet.archivist.storage) and [TST](https://faucet-tst.testnet.archivist.storage) tokens.
   - We can also do this using Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) channel
     - Use `/set ethaddress` command to enter your generated address
     - Use `/mint` command to receive ETH and TST tokens
     - Use `/balance` command to check if you have received test tokens successfully

5. Run Archivist node:
   ```shell
   curl -s https://get.archivist.storage/run.sh | bash
   ```

6. Configure [port forwarding](#basic-common) and we are ready go to.

### Windows {#basic-windows}

1. Download the master tarball from the Archivist testnet starter repository, and untar its contents:
   > [!WARNING]
   > Windows antivirus software and built-in firewalls may cause steps to fail. We will cover some possible errors here, but always consider checking your setup if requests fail - in particular, if temporarily disabling your antivirus fixes it, then it is likely to be the culprit.

   ```batch
   curl -LO https://github.com/durability-labs/archivist-testnet-starter/archive/main.tar.gz
   ```

   If you see an error like:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   You may need to add the `--ssl-no-revoke` option to your curl call, e.g.:

   ```batch
   curl -LO --ssl-no-revoke https://github.com/durability-labs/archivist-testnet-starter/archive/main.tar.gz
   ```

1. Extract the contents of the tar file, and then delete it:
   ```batch
   tar xzvf master.tar.gz
   del master.tar.gz
   ```

2. Navigate to the scripts folder:
   ```batch
   cd archivist-testnet-starter-master\scripts\windows
   ```

3. Download Archivist binaries from GitHub releases:
   ```batch
   download-online.bat
   ```

4. Generate an ethereum keypair:
   ```batch
   generate.bat
   ```
   Your private key will be saved to `eth.key` and address to  `eth.address` file.

5. Fill-up your address shown on the screen with the tokens:
   - Use the web faucets to mint some [ETH](https://faucet-eth.testnet.archivist.storage) and [TST](https://faucet-tst.testnet.archivist.storage) tokens.
   - We can also do this using Discord [# bot](https://discord.com/channels/895609329053474826/1230785221553819669) channel
     - Use `/set ethaddress` command to enter your generated address
     - Use `/mint` command to receive ETH and TST tokens
     - Use `/balance` command to check if you have received test tokens successfully

6. Run Archivist node:
   ```batch
   run-client.bat
   ```

 7. Configure [port forwarding](#basic-common) and we are ready go to.

### All OS {#basic-common}

Configure [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding) on your Internet router
| # | Protocol | Port   | Description           |
| - | -------- | ------ | --------------------- |
| 1 | `UDP`    | `8090` | `Archivist Discovery` |
| 2 | `TCP`    | `8070` | `Archivist Transport` |

After your node is up and running, you can use the [Archivist API](/developers/api) to be able to interact with your Archivist node, please check our [API walk-through](/learn/using) for more details.

You also can use [Archivist App UI](https://app.archivist.storage) to interact with your local Archivist node.

Need help? Reach out to us in [#:sos:|node-help](https://discord.com/channels/895609329053474826/1286205545837105224) channel or check [troubleshooting guide](/learn/troubleshoot.md).

## Running a Storage Provider (Web Version) {#sp-guide-web}

Work in progress :construction:

## Testnet Data

### Bootstrap Nodes

 Testnet bootstrap nodes records could be found in [GitHub repository](https://github.com/durability-labs/archivist-spr) and accessed via endpoints
 - Archivist - [`spr.archivist.storage/testnet`](https://spr.archivist.storage/testnet)
 - Geth - [`spr.archivist.storage/testnet/geth`](https://spr.archivist.storage/testnet/geth)

### Smart contracts

| Contract    | Address                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token       | [`0x3b7412Ee1144b9801341A4F391490eB735DDc005`](https://sepolia.arbiscan.io/tx/0xa1663765db57b2e62c4b0d1fd14c19c7bb68f294ff8253655ea3d954e11631bd) |
| Verifier    | [`0xfF043672Ea1Da9Be566Ecf683Bfc055BaD2C1B7D`](https://sepolia.arbiscan.io/tx/0x9045fde6f4a6d8c026be51bc56d8aeabf159a5bbaf508e71678e8a7ba62d5be8) |
| Marketplace | [`marketplace.archivist.storage/testnet/latest`](https://marketplace.archivist.storage/testnet/latest)                                            |

### Endpoints

| # | Service             | URL                                                                                  |
| - | ------------------- | ------------------------------------------------------------------------------------ |
| 1 | Arbitrum Public RPC | [rpc.testnet.archivist.storage](https://rpc.testnet.archivist.storage)               |
| 2 | Block explorer      | [sepolia.arbiscan.io](https://sepolia.arbiscan.io)                                   |
| 3 | Faucet ETH          | [faucet-eth.testnet.archivist.storage](https://faucet-eth.testnet.archivist.storage) |
| 4 | Faucet TST          | [faucet-tst.testnet.archivist.storage](https://faucet-tst.testnet.archivist.storage) |
| 5 | Status page         | [status.testnet.archivist.storage](https://status.testnet.archivist.storage)         |
