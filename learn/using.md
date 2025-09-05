---
outline: [2, 3]
---
# Using Archivist

We can interact with Archivist using [REST API](/developers/api). This document will show you several useful examples.

Also, we can check [Archivist App UI](https://app.archivist.storage).

Command line interpreter on [Linux/macOS](#linux-macos) and [Windows](#windows) works slightly different, so please use steps for your OS.

## Linux/macOS

### Overview
1. [Debug](#debug)
2. [Upload a file](#upload-a-file)
3. [Download a file](#download-a-file)
4. [Local data](#local-data)
5. [Create storage availability](#create-storage-availability)
6. [Purchase storage](#purchase-storage)
7. [View purchase status](#view-purchase-status)

### Debug
An easy way to check that your node is up and running is:

```shell
curl http://localhost:8080/api/archivist/v1/debug/info \
  -w '\n'
```

This will return a JSON structure with plenty of information about your local node. It contains peer information that may be useful when troubleshooting connection issues.

### Upload a file
> [!Warning]
> Once you upload a file to Archivist, other nodes in the network can download it. Please do not upload anything you don't want others to access, or, properly encrypt your data *first*.

```shell
curl -X POST \
  http://localhost:8080/api/archivist/v1/data \
  -H 'Content-Type: application/octet-stream' \
  -w '\n' \
  -T <FILE>
```

On successful upload, you'll receive a CID. This can be used to download the file from any node in the network.

> [!TIP]
> Are you on the [Archivist Discord server](https://discord.gg/archivist-storage)? Post your CID in the [# :wireless: | share-cids](https://discord.com/channels/1395434707566465136/1413402212935401533) channel, see if others are able to download it. Archivist does not (yet?) provide file metadata, so if you want others to be able to open your file, tell them which extension to give it.

### Download a file
When you have a CID of data you want to download, you can use the following commands:

```shell
# paste your CID from the previous step here between the quotes
CID="..."
```

```shell
curl "http://localhost:8080/api/archivist/v1/data/${CID}/network/stream" \
  -o "${CID}.png"
```

Please use the correct extension for the downloaded file, because Archivist does not store yet content-type or extension information.

### Local data
You can view which datasets are currently being stored by your node:

```shell
curl http://localhost:8080/api/archivist/v1/data \
  -w '\n'
```

### Create storage availability
> [!WARNING]
> This step requires that Archivist was started with the [`prover`](/learn/run#archivist-storage-node) option.

In order to start selling storage space to the network, you must configure your node with the following command. Once configured, the node will monitor on-chain requests-for-storage and will automatically enter into contracts that meet these specifications. In order to enter and maintain storage contracts, your node is required to submit zero-knowledge storage proofs. The calculation of these proofs will increase the CPU and RAM usage of Archivist.

```shell
curl -X POST \
  http://localhost:8080/api/archivist/v1/sales/availability \
  -H 'Content-Type: application/json' \
  -w '\n' \
  -d '{
    "totalSize": "8000000",
    "duration": "7200",
    "minPricePerBytePerSecond": "1000",
    "totalCollateral": "80000000"
  }'
```

For descriptions of each parameter, please view the [spec](https://api.archivist.storage/#tag/Marketplace/operation/offerStorage).

### Purchase storage
To purchase storage space from the network, first you must upload your data. Once you have the CID, use the following to create a request-for-storage.

Set your CID:

```shell
# paste your CID from the previous step here between the quotes
CID="..."
echo "CID: ${CID}"
```

Next you can run:

```shell
curl -X POST \
  "http://localhost:8080/api/archivist/v1/storage/request/${CID}" \
  -w '\n' \
  -d '{
    "duration": "3600",
    "pricePerBytePerSecond": "2000",
    "proofProbability": "5",
    "expiry": "1200",
    "nodes": 5,
    "tolerance": 2,
    "collateralPerByte": "1"
  }'
```

For descriptions of each parameter, please view the [spec](https://api.archivist.storage/#tag/Marketplace/operation/createStorageRequest).

When successful, this request will return a Purchase-ID.

### View purchase status
Using a Purchase-ID, you can check the status of your request-for-storage contract:

```shell
# paste your PURCHASE_ID from the previous step here between the quotes
PURCHASE_ID="..."
```

Then:

```shell
curl "http://localhost:8080/api/archivist/v1/storage/purchases/${PURCHASE_ID}" \
  -w '\n'
```

This will display state and error information for your purchase.
| State     | Description                                                                                                                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pending   | Request is waiting for chain confirmation.                                                                                                                                                             |
| Submitted | Request is on-chain. Hosts may now attempt to download the data.                                                                                                                                       |
| Started   | Hosts have downloaded the data and provided proof-of-storage.                                                                                                                                          |
| Failed    | The request was started, but (too many) hosts failed to provide proof-of-storage on time. While the data may still be available in the network, for the purpose of the purchase it is considered lost. |
| Finished  | The request was started successfully and the duration has elapsed.                                                                                                                                     |
| Expired   | (Not enough) hosts have submitted proof-of-storage before the request's expiry elapsed.                                                                                                                |
| Errored   | An unfortunate state of affairs. The 'error' field should tell you more.                                                                                                                               |

## Windows

### Overview {#overview-windows}
1. [Debug](#debug-windows)
2. [Upload a file](#upload-a-file-windows)
3. [Download a file](#download-a-file-windows)
4. [Local data](#local-data-windows)
5. [Create storage availability](#create-storage-availability-windows)
6. [Purchase storage](#purchase-storage-windows)
7. [View purchase status](#view-purchase-status-windows)

### Debug {#debug-windows}
An easy way to check that your node is up and running is:

```batch
curl http://localhost:8080/api/archivist/v1/debug/info
```

This will return a JSON structure with plenty of information about your local node. It contains peer information that may be useful when troubleshooting connection issues.

### Upload a file {#upload-a-file-windows}
> [!Warning]
> Once you upload a file to Archivist, other nodes in the network can download it. Please do not upload anything you don't want others to access, or, properly encrypt your data *first*.

```batch
curl -X POST ^
  http://localhost:8080/api/archivist/v1/data ^
  -H "Content-Type: application/octet-stream" ^
  -T <FILE>
```

On successful upload, you'll receive a CID. This can be used to download the file from any node in the network.

> [!TIP]
> Are you on the [Archivist Discord server](https://discord.gg/archivist-storage)? Post your CID in the [# :wireless: | share-cids](https://discord.com/channels/1395434707566465136/1413402212935401533) channel, see if others are able to download it. Archivist does not (yet?) provide file metadata, so if you want others to be able to open your file, tell them which extension to give it.

### Download a file {#download-a-file-windows}
When you have a CID of data you want to download, you can use the following commands:

```batch
:: paste your CID from the previous step here between the quotes
set CID="..."
```

```batch
curl "http://localhost:8080/api/archivist/v1/data/%CID%/network/stream" ^
  -o "%CID%.png"
```

Please use the correct extension for the downloaded file, because Archivist does not store yet content-type or extension information.

### Local data {#local-data-windows}
You can view which datasets are currently being stored by your node:

```batch
curl http://localhost:8080/api/archivist/v1/data
```

### Create storage availability {#create-storage-availability-windows}
> [!WARNING]
> This step requires that Archivist was started with the [`prover`](/learn/run#archivist-storage-node) option.

In order to start selling storage space to the network, you must configure your node with the following command. Once configured, the node will monitor on-chain requests-for-storage and will automatically enter into contracts that meet these specifications. In order to enter and maintain storage contracts, your node is required to submit zero-knowledge storage proofs. The calculation of these proofs will increase the CPU and RAM usage of Archivist.

```batch
curl -X POST ^
  http://localhost:8080/api/archivist/v1/sales/availability ^
  -H "Content-Type: application/json" ^
  -d "{""totalSize"": ""8000000"", ""duration"": ""7200"", ""minPricePerBytePerSecond"": ""1000"", ""totalCollateral"": ""80000000""}"
```

For descriptions of each parameter, please view the [spec](https://api.archivist.storage/#tag/Marketplace/operation/offerStorage).

### Purchase storage {#purchase-storage-windows}
To purchase storage space from the network, first you must upload your data. Once you have the CID, use the following to create a request-for-storage.

Set your CID:

```batch
:: paste your CID from the previous step here between the quotes
set CID="..."
echo CID: %CID%
```

Next you can run:

```batch
curl -X POST ^
  "http://localhost:8080/api/archivist/v1/storage/request/%CID%" ^
  -H "Content-Type: application/json" ^
  -d "{""duration"": ""3600"",""pricePerBytePerSecond"": ""2000"", ""proofProbability"": ""5"", ""expiry"": ""1200"", ""nodes"": 5, ""tolerance"": 2, ""**collateralPerByte**"": ""1""}"
```

For descriptions of each parameter, please view the [spec](https://api.archivist.storage/#tag/Marketplace/operation/createStorageRequest).

When successful, this request will return a Purchase-ID.

### View purchase status {#view-purchase-status-windows}
Using a Purchase-ID, you can check the status of your request-for-storage contract:

```batch
:: paste your PURCHASE_ID from the previous step here between the quotes
set PURCHASE_ID="..."
```

Then:

```batch
curl "http://localhost:8080/api/archivist/v1/storage/purchases/%PURCHASE_ID%"
```

This will display state and error information for your purchase.
| State     | Description                                                                                                                                                                                            |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Pending   | Request is waiting for chain confirmation.                                                                                                                                                             |
| Submitted | Request is on-chain. Hosts may now attempt to download the data.                                                                                                                                       |
| Started   | Hosts have downloaded the data and provided proof-of-storage.                                                                                                                                          |
| Failed    | The request was started, but (too many) hosts failed to provide proof-of-storage on time. While the data may still be available in the network, for the purpose of the purchase it is considered lost. |
| Finished  | The request was started successfully and the duration has elapsed.                                                                                                                                     |
| Expired   | (Not enough) hosts have submitted proof-of-storage before the request's expiry elapsed.                                                                                                                |
| Errored   | An unfortunate state of affairs. The 'error' field should tell you more.                                                                                                                               |
