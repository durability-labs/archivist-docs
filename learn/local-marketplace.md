---
outline: [2, 3]
---
# Running a Local Archivist Network with Marketplace Support

This tutorial will teach you how to run a small Archivist network with the
_storage marketplace_ enabled; i.e., the functionality in Archivist which
allows participants to offer and buy storage in a market, ensuring that
storage providers honor their part of the deal by means of cryptographic proofs.

In this tutorial, you will:

1. [Set Up a Geth PoA network](#_1-set-up-a-geth-poa-network);
2. [Set up The Marketplace](#_2-set-up-the-marketplace);
3. [Run Archivist](#_3-run-archivist);
4. [Buy and Sell Storage in the Marketplace](#_4-buy-and-sell-storage-on-the-marketplace).

## Prerequisites

To complete this tutorial, you will need:

* the [geth](https://github.com/ethereum/go-ethereum) Ethereum client;
  You need version `1.13.x` of geth as newer versions no longer support
  Proof of Authority (PoA). This tutorial was tested using geth version `1.13.15`.
* a Archivist binary, which [you can compile from source](https://github.com/durability-labs/archivist-node#build-and-run).

We will also be using [bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell))
syntax throughout. If you use a different shell, you may need to adapt
things to your platform.

To get started, create a new folder where we will keep the tutorial-related
files so that we can keep them separate from the archivist repository.
We assume the name of the folder to be `marketplace-tutorial`.

## 1. Set Up a Geth PoA Network

For this tutorial, we will use a simple
[Proof-of-Authority](https://github.com/ethereum/EIPs/issues/225) network
with geth. The first step is creating a _signer account_: an account which
will be used by geth to sign the blocks in the network.
Any block signed by a signer is accepted as valid.

### 1.1. Create a Signer Account

To create a signer account, from the `marketplace-tutorial` directory run:

```bash
geth account new --datadir geth-data
```

The account generator will ask you to input a password, which you can
leave blank. It will then print some information,
including the account's public address:

```bash
INFO [09-29|16:49:24.244] Maximum peer count                       ETH=50 total=50
Your new account is locked with a password. Please give a password. Do not forget this password.
Password:
Repeat password:

Your new key was generated

Public address of the key:   0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB
Path of the secret key file: geth-data/keystore/UTC--2024-09-29T14-49-31.655272000Z--33a904ad57d0e2cb8ffe347d3c0e83c2e875e7db

- You can share your public address with anyone. Others need it to interact with you.
- You must NEVER share the secret key with anyone! The key controls access to your funds!
- You must BACKUP your key file! Without the key, it's impossible to access account funds!
- You must REMEMBER your password! Without the password, it's impossible to decrypt the key!
```

In this example, the public address of the signer account is
`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB`.
Yours will print a different address. Save it for later usage.

Next set an environment variable for later usage:

```bash
export GETH_SIGNER_ADDR="0x0000000000000000000000000000000000000000"
echo ${GETH_SIGNER_ADDR} > geth_signer_address.txt
```

> Here make sure you replace `0x0000000000000000000000000000000000000000`
> with your public address of the signer account
> (`0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB` in our example).

### 1.2. Configure The Network and Create the Genesis Block

The next step is telling geth what kind of network you want to run.
We will be running a [pre-merge](https://ethereum.org/en/roadmap/merge/)
network with Proof-of-Authority consensus.
To get that working, create a `network.json` file.

If you set the `GETH_SIGNER_ADDR` variable above you can run the following
command to create the `network.json` file:

```bash
echo  "{\"config\": { \"chainId\": 12345, \"homesteadBlock\": 0, \"eip150Block\": 0, \"eip155Block\": 0, \"eip158Block\": 0, \"byzantiumBlock\": 0, \"constantinopleBlock\": 0, \"petersburgBlock\": 0, \"istanbulBlock\": 0, \"berlinBlock\": 0, \"londonBlock\": 0, \"arrowGlacierBlock\": 0, \"grayGlacierBlock\": 0, \"clique\": { \"period\": 1, \"epoch\": 30000 } }, \"difficulty\": \"1\", \"gasLimit\": \"8000000\", \"extradata\": \"0x0000000000000000000000000000000000000000000000000000000000000000${GETH_SIGNER_ADDR:2}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000\", \"alloc\": { \"${GETH_SIGNER_ADDR}\": { \"balance\": \"10000000000000000000000\"}}}" > network.json
```

You can also manually create the file remembering update it with your
signer public address:

```json
{
  "config": {
    "chainId": 12345,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "arrowGlacierBlock": 0,
    "grayGlacierBlock": 0,
    "clique": {
      "period": 1,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x000000000000000000000000000000000000000000000000000000000000000033A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "0x33A904Ad57D0E2CB8ffe347D3C0E83C2e875E7dB": {
      "balance": "10000000000000000000000"
    }
  }
}
```

Note that the signer account address is embedded in two different places:
* inside of the `"extradata"` string, surrounded by zeroes and stripped of
  its `0x` prefix;
* as an entry key in the `alloc` session.
  Make sure to replace that ID with the account ID that you wrote down in
  [Step 1.1](#_1-1-create-a-signer-account).

Once `network.json` is created, you can initialize the network with:

```bash
geth init --datadir geth-data network.json
```

The output of the above command you may include some warnings, like:

```bash
WARN [08-21|14:48:12.305] Unknown config environment variable      envvar=GETH_SIGNER_ADDR
```

or even errors when running the command for the first time:

```bash
ERROR[08-21|14:48:12.399] Head block is not reachable
```

The important part is that at the end you should see something similar to:

```bash
INFO [08-21|14:48:12.639] Successfully wrote genesis state         database=lightchaindata hash=768bf1..42d06a
```

### 1.3. Start your PoA Node

We are now ready to start our $1$-node, private blockchain.
To launch the signer node, open a separate terminal in the same working
directory and make sure you have the `GETH_SIGNER_ADDR` set.
For convenience use the `geth_signer_address.txt`:

```bash
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
```

Having the `GETH_SIGNER_ADDR` variable set, run:

```bash
geth\
  --datadir geth-data\
  --networkid 12345\
  --unlock ${GETH_SIGNER_ADDR}\
  --nat extip:127.0.0.1\
  --netrestrict 127.0.0.0/24\
  --mine\
  --miner.etherbase ${GETH_SIGNER_ADDR}\
  --http\
  --allow-insecure-unlock
```

Note that, once again, the signer account created in
[Step 1.1](#_1-1-create-a-signer-account) appears both in
`--unlock` and `--allow-insecure-unlock`.

Geth will prompt you to insert the account's password as it starts up.
Once you do that, it should be able to start up and begin "mining" blocks.

Also here, you may encounter errors like:

```bash
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=c845e51a5e470e44 ip=18.138.108.67
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=f23ac6da7c02f84a ip=3.209.45.79
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=ef2d7ab886910dc8 ip=65.108.70.101
ERROR[08-21|15:00:27.625] Bootstrap node filtered by netrestrict   id=6b36f791352f15eb ip=157.90.35.166
```

You can safely ignore them.

If the command above fails with:

```bash
Fatal: Failed to register the Ethereum service: only PoS networks are supported, please transition old ones with Geth v1.13.x
```

make sure, you are running the correct Geth version
(see Section [Prerequisites](#prerequisites))

## 2. Set Up The Marketplace

You will need to open new terminal for this section and geth needs to be
running already. Setting up the Archivist marketplace entails:

1. Deploying the Archivist Marketplace contracts to our private blockchain
2. Setup Ethereum accounts we will use to buy and sell storage in
   the Archivist marketplace
3. Provisioning those accounts with the required token balances

### 2.1. Deploy the Archivist Marketplace Contracts

Make sure you leave the `marketplace-tutorial` directory, and clone
the `durability-labs/archivist-node.git`:

```bash
git clone https://github.com/durability-labs/archivist-node.git
```

> If you just want to clone the repo to run the tutorial, you can
> skip the history and just download the head of the master branch by using
> `--depth 1` option: `git clone --depth 1 https://github.com/durability-labs/archivist-node.git`

Thus, our directory structure for the purpose of this tutorial looks like this:

```bash
|
|-- archivist-node
└-- marketplace-tutorial
```

> You could clone the `durability-labs/archivist-node.git` to some other location.
> Just to keeps things nicely separated it is best to make sure that
> `archivist-node` is not under `marketplace-tutorial` directory.

Now, from the `archivist-node` folder run:

```bash
make update && make
```

> This may take a moment as it will also build the `nim` compiler. Be patient.

Now, in order to start a local Ethereum network run:

```bash
cd vendor/archivist-contracts
npm install
```

> While writing the document we used `node` version `v20.17.0` and
> `npm` version `11.0.0`.

Before continuing you now must **wait until $256$ blocks are mined**
**in your PoAnetwork**, or deploy will fail. This should take about
$4$ minutes and $30$ seconds. You can check which block height you are
currently at by running the following command
**from the `marketplace-tutorial` folder**:

```bash
geth attach --exec web3.eth.blockNumber ./geth-data/geth.ipc
```

once that gets past $256$, you are ready to go.

To deploy contracts, from the `archivist-contracts` directory run:

```bash
export DISTTEST_NETWORK_URL=http://localhost:8545
npx hardhat --network archivistdisttestnetwork deploy
```

If the command completes successfully, you will see the output similar
to this one:

```bash
Deployed Marketplace with Groth16 Verifier at:
0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd
```
> of course your address will be different.

You are now ready to prepare the accounts.

### 2.2. Generate the Required Accounts

We will run $2$ Archivist nodes: a **storage provider**, which will sell storage
on the network, and a **client**, which will buy and use such storage;
we therefore need two valid Ethereum accounts. We could create random
accounts by using one of the many  tools available to that end but, since
this is a tutorial running on a local private network, we will simply
provide you with two pre-made accounts along with their private keys,
which you can copy and paste instead:

First make sure you're back in the `marketplace-tutorial` folder and
not the `archivist-contracts` subfolder. Then set these variables:

**Storage:**
```bash
export ETH_STORAGE_ADDR=0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37
export ETH_STORAGE_PK=0x06c7ac11d4ee1d0ccb53811b71802fa92d40a5a174afad9f2cb44f93498322c3
echo $ETH_STORAGE_PK > storage.pkey && chmod 0600 storage.pkey
```

**Client:**
```bash
export ETH_CLIENT_ADDR=0x9F0C62Fe60b22301751d6cDe1175526b9280b965
export ETH_CLIENT_PK=0x5538ec03c956cb9d0bee02a25b600b0225f1347da4071d0fd70c521fdc63c2fc
echo $ETH_CLIENT_PK > client.pkey && chmod 0600 client.pkey
```

### 2.3. Provision Accounts with Tokens

We now need to transfer some ETH to each of the accounts, as well as provide
them with some Archivist tokens for the storage node to use as collateral and
for the client node to buy actual storage.

Although the process is not particularly complicated, I suggest you use
[the script we prepared](https://github.com/gmega/local-archivist-bare/blob/main/scripts/mint-tokens.js)
for that. This script, essentially:

1. reads the Marketplace contract address and its ABI from the deployment data;
2. transfers $1$ ETH from the signer account to a target account if the target
   account has no ETH balance;
3. mints $n$ Archivist tokens and adds it into the target account's balance.

To use the script, just download it into a local file named `mint-tokens.js`,
for instance using `curl` (make sure you are in
the `marketplace-tutorial` directory):

```bash
# download script
curl https://raw.githubusercontent.com/gmega/archivist-local-bare/main/scripts/mint-tokens.js -o mint-tokens.js
```

Then run:

```bash
# set the contract file location (we assume you are in the marketplace-tutorial directory)
export CONTRACT_DEPLOY_FULL="../archivist-node/vendor/archivist-contracts/deployments/archivistdisttestnetwork"
export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)
# Installs Web3-js
npm install web3
# Provides tokens to the storage account.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x45BC5ca0fbdD9F920Edd12B90908448C30F32a37 1000000000000000000
# Provides tokens to the client account.
node ./mint-tokens.js $CONTRACT_DEPLOY_FULL/TestToken.json $GETH_SIGNER_ADDR 0x9F0C62Fe60b22301751d6cDe1175526b9280b965 1000000000000000000
```

If you get a message like

```bash
Usage: mint-tokens.js <token-hardhat-deploy-json> <signer-account> <receiver-account> <token-ammount>
```

then you need to ensure you provided all the required arguments.
In particular you need to ensure that the `GETH_SIGNER_ADDR` env variable
holds the signer address (we used
`export GETH_SIGNER_ADDR=$(cat geth_signer_address.txt)` above to
make sure it is set).

## 3. Run Archivist

With accounts and geth in place, we can now start the Archivist nodes.

### 3.1. Storage Node

The storage node will be the one storing data and submitting the proofs of
storage to the chain. To do that, it needs access to:

1. the address of the Marketplace contract that has been deployed to
   the local geth node in [Step 2.1](#_2-1-deploy-the-archivist-marketplace-contracts);
2. the sample ceremony files which are shipped in the Archivist contracts repo
  (`archivist-node/vendor/archivist-contracts`).

**Address of the Marketplace Contract.** The contract address can be found
inside of the file `archivist-node/vendor/archivist-contracts/deployments/archivistdisttestnetwork/Marketplace.json`.
We captured that location above in `CONTRACT_DEPLOY_FULL` variable, thus, from
the `marketplace-tutorial` folder just run:

```bash
grep '"address":' ${CONTRACT_DEPLOY_FULL}/Marketplace.json
```

which should print something like:
```bash
"address": "0xCf0df6C52B02201F78E8490B6D6fFf5A82fC7BCd",
```

> This address should match the address we got earlier when deploying
> the Marketplace contract above.

Then run the following with the correct market place address:
```bash
export MARKETPLACE_ADDRESS="0x0000000000000000000000000000000000000000"
echo ${MARKETPLACE_ADDRESS} > marketplace_address.txt
```

where you replace `0x0000000000000000000000000000000000000000` with
the address of the Marketplace contract.

**Prover ceremony files.** The ceremony files are under the
`archivist-node/vendor/archivist-contracts/verifier/networks/archivistdisttestnetwork`
subdirectory. There are three of them: `proof_main.r1cs`, `proof_main.zkey`,
and `prooof_main.wasm`. We will need all of them to start the Archivist storage node.

**Starting the storage node.** Let:

* `PROVER_ASSETS` contain the directory where the prover ceremony files are
  located. **This must be an absolute path**;
* `ARCHIVIST_BINARY` contain the location of your Archivist binary;
* `MARKETPLACE_ADDRESS` contain the address of the Marketplace contract
  (we have already set it above).

Set these paths into environment variables (make sure you are in
the `marketplace-tutorial` directory):

```bash
export CONTRACT_DEPLOY_FULL=$(realpath "../archivist-node/vendor/archivist-contracts/deployments/archivistdisttestnetwork")
export PROVER_ASSETS=$(realpath "../archivist-node/vendor/archivist-contracts/verifier/networks/archivistdisttestnetwork/")
export ARCHIVIST_BINARY=$(realpath "../archivist-node/build/archivist")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
> you may notice, that we have already set the `CONTRACT_DEPLOY_FULL` variable
> above. Here, we make sure it is an absolute path.

To launch the storage node, run:

```bash
${ARCHIVIST_BINARY}\
  --data-dir=./archivist-storage\
  --listen-addrs=/ip4/0.0.0.0/tcp/8080\
  --api-port=8000\
  --disc-port=8090\
  persistence\
  --eth-provider=http://localhost:8545\
  --eth-private-key=./storage.pkey\
  --marketplace-address=${MARKETPLACE_ADDRESS}\
  --validator\
  --validator-max-slots=1000\
  prover\
  --circom-r1cs=${PROVER_ASSETS}/proof_main.r1cs\
  --circom-wasm=${PROVER_ASSETS}/proof_main.wasm\
  --circom-zkey=${PROVER_ASSETS}/proof_main.zkey
```

**Starting the client node.**

The client node is started similarly except that:

* we need to pass the SPR of the storage node so it can form a network with it;
* since it does not run any proofs, it does not require any ceremony files.

We get the Signed Peer Record (SPR) of the storage node so we can bootstrap
the client node with it. To get the SPR, issue the following call:

```bash
curl -H 'Accept: text/plain' 'http://localhost:8000/api/archivist/v1/spr' --write-out '\n'
```

You should get the SPR back starting with `spr:`.

Before you proceed, open new terminal, and enter `marketplace-tutorial` directory.

Next set these paths into environment variables:

```bash
# set the SPR for the storage node
export STORAGE_NODE_SPR=$(curl -H 'Accept: text/plain' 'http://localhost:8000/api/archivist/v1/spr')
# basic vars
export CONTRACT_DEPLOY_FULL=$(realpath "../archivist-node/vendor/archivist-contracts/deployments/archivistdisttestnetwork")
export ARCHIVIST_BINARY=$(realpath "../archivist-node/build/archivist")
export MARKETPLACE_ADDRESS=$(cat marketplace_address.txt)
```
and then run:

```bash
${ARCHIVIST_BINARY}\
  --data-dir=./archivist-client\
  --listen-addrs=/ip4/0.0.0.0/tcp/8081\
  --api-port=8001\
  --disc-port=8091\
  --bootstrap-node=${STORAGE_NODE_SPR}\
  persistence\
  --eth-provider=http://localhost:8545\
  --eth-private-key=./client.pkey\
  --marketplace-address=${MARKETPLACE_ADDRESS}
```

## 4. Buy and Sell Storage on the Marketplace

Any storage negotiation has two sides: a buyer and a seller.
Therefore, before we can actually request storage, we must first offer
some of it for sale.

### 4.1 Sell Storage

The following request will cause the storage node to put out $5\text{MB}$
of storage for sale for $1$ hour, at a minimum price of $1000$ Archivist token
per byte per second, while expressing that maximum penalty (a collateral)
the storage provider is willing to risk for not fulfilling its part of the
contract is limited to $50000000$ tokens (wei) for this specific availability.[^1]
This total collateral will be distributed across all storage requests matching
this availability.

```bash
curl 'http://localhost:8000/api/archivist/v1/sales/availability' \
  --header 'Content-Type: application/json' \
  --data '{
  "totalSize": "5000000",
  "duration": "3600",
  "minPricePerBytePerSecond": "1000",
  "totalCollateral": "50000000"
}'
```

This should return a JSON response containing an `id` (e.g. 
`"id": "0xb55b3bc7aac2563d5bf08ce8a177a38b5a40254bfa7ee8f9c52debbb176d44b0"`)
which identifies this storage offer.

> To make JSON responses more readable, you can try
> [jq](https://jqlang.github.io/jq/) JSON formatting utility
> by just adding `| jq` after the command.
> On macOS you can install with `brew install jq`.

To check the current storage offers for this node, you can issue:

```bash
curl 'http://localhost:8000/api/archivist/v1/sales/availability'
```

or with `jq`:

```bash
curl 'http://localhost:8000/api/archivist/v1/sales/availability' | jq
```

This should print a list of offers, with the one you just created figuring
among them (for our tutorial, there will be only one offer returned
at this time).

### 4.2. Buy Storage

Before we can buy storage, we must have some actual data to request
storage for. Start by uploading a small file to your client node.
On Linux (or macOS) you could, for instance, use `dd` to generate a $1M$ file:

```bash
dd if=/dev/urandom of=./data.bin bs=1M count=1
```

Assuming your file is named `data.bin`, you can upload it with:

```bash
curl --request POST http://localhost:8001/api/archivist/v1/data --header 'Content-Type: application/octet-stream' --write-out '\n' -T ./data.bin
```

Once the upload completes, you should see a _Content Identifier_,
or _CID_ (e.g. `zDvZRwzm2mK7tvDzKScRLapqGdgNTLyyEBvx1TQY37J2CdWdS6Sj`)
for the uploaded file printed to the terminal.
Use that CID in the purchase request:

```bash
# make sure to replace the CID before with the CID you got in the previous step
export CID=zDvZRwzm2mK7tvDzKScRLapqGdgNTLyyEBvx1TQY37J2CdWdS6Sj
```

```bash
curl "http://localhost:8001/api/archivist/v1/storage/request/${CID}" \
  --header 'Content-Type: application/octet-stream' \
  --data "{
    \"duration\": \"600\",
    \"pricePerBytePerSecond\": \"2000\",
    \"proofProbability\": \"3\",
    \"expiry\": \"500\",
    \"nodes\": 3,
    \"tolerance\": 1,
    \"collateralPerByte\": \"1\"
  }" \
  --write-out '\n'
```

The parameters under `--data` say that:

1. we want to purchase storage for our file for $5$ minutes (`"duration": "600"`);
2. we are willing to pay up to $2000$ tokens (wei) per slot per second
   (`"pricePerBytePerSecond": "2000"`). It is then twice as much as
   `minPricePerBytePerSecond`, which we set to $1000$ when creating the availability
   above.
3. our file will be split into three pieces (`"nodes": 3`). 
   Because we set `"tolerance": 1` we only need two (`nodes - tolerance`)
   pieces to rebuild the file; i.e., we can tolerate that at most one node
   stops storing our data; either due to failure or other reasons;
4. we demand `1` token in collateral from storage providers per byte of storage
   per second for each piece of data (called _slots_). Because we provide some redundancy to
   the stored data, the actual size of the stored dataset will be bigger than original
   content (the bigger the `tolerance` the bigger the resulting dataset).
5. finally, the `expiry` puts a time limit for filling all the slots by
   the storage provider(s). If slots are not filled by the `expire` interval,
   the request will timeout and fail.

### 4.3. Track your Storage Requests

POSTing a storage request will make it available in the storage market,
and a storage node will eventually pick it up.

You can poll the status of your request by means of:
```bash
export STORAGE_PURCHASE_ID="6b6e2445f33ed624891f0543fe9dbf4bd0a6971febccaae2431375a5b9a2840d"
curl "http://localhost:8001/api/archivist/v1/storage/purchases/${STORAGE_PURCHASE_ID}"
```

This returns a result like:

```json
{
  "requestId": "0x6b6e2445f33ed624891f0543fe9dbf4bd0a6971febccaae2431375a5b9a2840d",
  "request": {
    "client": "0x9f0c62fe60b22301751d6cde1175526b9280b965",
    "ask": {
      "proofProbability": "3",
      "pricePerBytePerSecond": "2000",
      "collateralPerByte": "1",
      "slots": 3,
      "slotSize": 524288,
      "duration": 600,
      "maxSlotLoss": 1
    },
    "content": {
      "cid": "zDvZRwzm18zqvTRMHhjDmwybKZaomW8bDFtdSyaQ4XM6MmER5fzy"
    },
    "expiry": 500,
    "nonce": "0x5267b832fe9a978fb0dd3912b42fece7c5ac074a9cc3c74bf578b6cee9e43543",
    "id": "0x6b6e2445f33ed624891f0543fe9dbf4bd0a6971febccaae2431375a5b9a2840d"
  },
  "state": "submitted",
  "error": null
}
```

Shows that a request has been submitted but has not yet been filled.
Your request will be successful once `"state"` shows `"started"`.
Anything other than that means the request has not been completely
processed yet, and an `"error"` state other than `null` means it failed.

Well, it was quite a journey, wasn't it? You can congratulate yourself for
successfully finishing the archivist marketplace tutorial!

[^1]: Archivist files get partitioned into pieces called "slots" and distributed
to various storage providers. The collateral refers to one such slot,
and will be slowly eaten away as the storage provider fails to deliver
timely proofs.
