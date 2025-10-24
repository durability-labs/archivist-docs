---
outline: [2, 4]
---
# Archivist Devnet

The Archivist Devnet has been launched and is ready to be used for development :building_construction:

## Devnet data

### Bootstrap Nodes

 For Devnet we are using separate bootstrap nodes and their SPR's could be found in `devnet.json` config, located in [archivist-config](https://github.com/durability-labs/archivist-config) repository and accessed via endpoint [`config.archivist.storage/devnet.json`](https://config.archivist.storage/devnet.json).
```shell
curl -s https://config.archivist.storage/devnet.json | jq -r '.sprs[].records[]'
```

### Smart contracts

| Contract    | Address                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Token       | [`0x7AC8a39172e44e66F719e0960F1Ee965Fe49AC1c`](https://explorer.devnet.archivist.storage/address/0x7AC8a39172e44e66F719e0960F1Ee965Fe49AC1c) |
| Marketplace | [`marketplace.archivist.storage/devnet/latest`](https://marketplace.archivist.storage/devnet/latest)                                         |

### Endpoints

| # | Service         | URL                                                                                |
| - | --------------- | ---------------------------------------------------------------------------------- |
| 1 | Public RPC      | [rpc.devnet.archivist.storage](https://rpc.devnet.archivist.storage)               |
| 2 | Block explorer  | [explorer.devnet.archivist.storage](https://explorer.devnet.archivist.storage)     |
| 3 | Faucet ETH      | [faucet-arb.devnet.archivist.storage](https://faucet-arb.devnet.archivist.storage) |
| 4 | Faucet TST      | [faucet-tst.devnet.archivist.storage](https://faucet-tst.devnet.archivist.storage) |
