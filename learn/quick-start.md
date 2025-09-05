# Quick Start

To run Archivist through this guide we would need to perform the following steps:
- [Review the disclaimer](/archivist/disclaimer)
- [Get Archivist binary](#get-archivist-binary)
- [Run Archivist](#run-archivist)
- [Interact with Archivist](#interact-with-archivist)

## Get Archivist binary

For quick a start we will use precompiled binaries from [GitHub release page](https://github.com/durability-labs/archivist-node/releases). If you prefer to compile from the sources, please check [Build Archivist](/learn/build).

Please follow the steps for your OS from the list:
- [Linux/macOS](#linux-macos)
- [Windows](#windows)

### Linux/macOS

1. Install latest Archivist release
   ```shell
   curl -s https://get.archivist.storage/install.sh | bash
   ```

2. Install dependencies
   ```shell
   # Debian-based Linux
   sudo apt update && sudo apt install libgomp1
   ```

3. Check the result
   ```shell
   archivist --version
   ```

### Windows

1. Install latest Archivist release
   ```batch
    curl -sO https://get.archivist.storage/install.cmd && install.cmd
   ```

   > [!WARNING]
   > Windows antivirus software and built-in firewalls may cause steps to fail. We will cover some possible errors here, but always consider checking your setup if requests fail - in particular, if temporarily disabling your antivirus fixes it, then it is likely to be the culprit.

   If you see an error like:

   ```batch
   curl: (35) schannel: next InitializeSecurityContext failed: CRYPT_E_NO_REVOCATION_CHECK (0x80092012) - The revocation function was unable to check revocation for the certificate.
   ```

   You may need to add the `--ssl-no-revoke` option to your curl calls, i.e., modify the calls above so they look like this:

   ```batch
    curl -LO --ssl-no-revoke https://...
    ```

2. Update path using console output
    - Current session only
      ```batch
      :: Default installation directory
      set "PATH=%PATH%%LOCALAPPDATA%\Archivist;"
      ```

    - Update PATH permanently
      - Control Panel --> System --> Advanced System settings --> Environment Variables
      - Alternatively, type `environment variables` into the Windows Search box

3. Check the result
   ```shell
   archivist --version
   ```

## Run Archivist

We may [run Archivist in different modes](/learn/run#run), and for a quick start we will run [Archivist node](/learn/run#archivist-node), to be able to share files in the network.

1. Run Archivist

   **Linux/macOS**
   ```shell
   archivist \
     --data-dir=datadir \
     --disc-port=8090 \
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 \
     --nat=any \
     --api-cors-origin="*" \
     --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w
   ```

   **Windows**

   > [!WARNING]
   > Windows might at this stage prompt you to grant internet access to Archivist. You must allow it for things to work.
   > It also might be required to add incoming firewall rules for Archivist and we can use `netsh` utility.

   <details>
   <summary>add firewall rules using netsh</summary>

   ```batch
   :: Add rules
   netsh advfirewall firewall add rule name="Allow Archivist (TCP-In)" protocol=TCP dir=in localport=8070 action=allow
   netsh advfirewall firewall add rule name="Allow Archivist (UDP-In)" protocol=UDP dir=in localport=8090 action=allow

   :: List rules
   netsh advfirewall firewall show rule name=all | find /I "Archivist"

   :: Delete rules
   netsh advfirewall firewall delete rule name="Allow Archivist (TCP-In)"
   netsh advfirewall firewall delete rule name="Allow Archivist (UDP-In)"
   ```
   </details>

   ```batch
   :: Run Archivist
   archivist ^
     --data-dir=datadir ^
     --disc-port=8090 ^
     --listen-addrs=/ip4/0.0.0.0/tcp/8070 ^
     --nat=any ^
     --api-cors-origin="*" ^
     --bootstrap-node=spr:CiUIAhIhA5mg11LZgFQ4XzIRb1T5xw9muFW1ALNKTijyKhQmvKYXEgIDARpJCicAJQgCEiEDmaDXUtmAVDhfMhFvVPnHD2a4VbUAs0pOKPIqFCa8phcQl-XFxQYaCwoJBE4vqKqRAnU6GgsKCQROL6iqkQJ1OipHMEUCIQDfzVYbN6A_O4i29e_FtDDUo7GJS3bkXRQtoteYbPSFtgIgcc8Kgj2ggVJyK16EY9xi4bY2lpTTeNIRjvslXSRdN5w
   ```

   > [!TIP]
   > In the example above we use [Archivist Testnet](/networks/testnet#bootstrap-nodes) bootstrap nodes and thus we join Testnet. If you would like to join a different network, please use [appropriate value](/networks/networks).

2. Configure port-forwarding for the TCP/UDP ports on your Internet router
   | Protocol | Service   | Port   |
   | -------- | --------- | ------ |
   | UDP      | Discovery | `8090` |
   | TCP      | Transport | `8070` |

If you would like to purchase or sell storage, please consider to run [Archivist node with marketplace support](/learn/run#archivist-node-with-marketplace-support) or [Archivist storage node](/learn/run#archivist-storage-node).

## Interact with Archivist

When your Archivist node is up and running you can interact with it using [Archivist App UI](https://app.archivist.storage) for files sharing.

Also, you can interact with Archivist using [Archivist API](/developers/api) and for a walk-through of the API, consider following the [Using Archivist](/learn/using) guide.

## Stay in touch

Want to stay up-date, or looking for further assistance? Try our [discord-server](https://discord.gg/archivist-storage).

Ready to explore Archivist functionality? Please [Join Archivist Testnet](/networks/testnet).

If you want to run Archivist locally without joining the Testnet, consider trying the [Archivist Two-Client Test](/learn/local-two-client-test) or the [Running a Local Archivist Network with Marketplace Support](/learn/local-marketplace).
