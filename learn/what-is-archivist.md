# What is Archivist?

Archivist is a durable, decentralized storage network — think BitTorrent with paid seeders and cryptographic durability guarantees. Data is encrypted locally, erasure-coded, dispersed across independent operators, verified by zero-knowledge proofs, and repaired automatically. No single point of failure.

The protocol targets nine to eleven nines of durability, running on commodity hardware operated by anyone.

## The Problem

Most of your data lives on rented servers: subject to terms you didn't write, in jurisdictions you can't control, mediated by companies that can change their mind, change their policies, or disappear.

This is not hypothetical. Services get deplatformed, accounts get suspended, providers change terms or shut down. In custodial storage, you are a tenant — and tenants can be evicted.

Encrypted cloud services (Mega, Proton Drive, Tresorit) improve on privacy but not on sovereignty. Encryption keeps people from reading your files, not from deleting your account. There is still a company to subpoena. Still a single point of failure.

Self-hosting improves on this but introduces its own fragility. A single server is a single point of failure — one fire, one failed drive, one warrant, and the data is gone. Sovereignty requires distribution: geographic, jurisdictional, and administrative dispersal across independent operators.

## Why Decentralization

Centralized systems will always win on speed and cost — that is what centralization is for. Decentralization is not a cost optimization. It is a hedge against censorship, jurisdictional risk, operator failure, and the slow grind of forgotten backups.

If you want the fastest, cheapest storage and you trust the provider, use centralized storage — it is very good at what it does. If you need storage that no single entity can shut you off from, that requires a different architecture.

## How Archivist Is Different

The difference from traditional peer-to-peer file sharing is not cosmetic — it's architectural:

| | File Sharing (BitTorrent, IPFS) | Decentralized Storage Network (Archivist) |
|---|---|---|
| **Core goal** | Opportunistic *distribution* of bytes | *Persistence* and *verifiability* of bytes |
| **Data lifetime** | As long as someone seeds — no guarantees | Explicit durability budgets with automated repair |
| **Trust model** | Best-effort, no liability for loss | Providers economically on the hook; cryptographic audits prove custody |
| **Integrity** | Block-level hashing | ZK proofs of retrievability, erasure coding |
| **Incentives** | Virtually none | Fee market, token-denominated SLAs, slashable collateral |
| **Repair** | Hope someone re-seeds | Deterministic sampling, erasure-code repair |

File-sharing protocols optimize for speed and reach. Archivist optimizes for durability and accountability.

## The Approach: R.A.P.I.D.

The protocol is built around five components that must work in tandem — remove any one and the durability guarantee breaks:

- **Redundancy** — erasure coding splits data so any subset of fragments can reconstruct the original
- **Auditing** — zero-knowledge proofs verify data possession without downloading it
- **Repair** — detect and correct loss automatically using erasure-coded redundancy
- **Incentives** — collateral, slashing, and rewards align participant behavior
- **Dispersal** — data is spread across independent operators so no single failure takes it down

For the full technical treatment, see the [Architecture](./architecture) page and the [Whitepaper](./whitepaper).

## Origins

Archivist was established in 2025 by the original Codex architects — contributors to the Beacon Chain, PeerDAS, libp2p, and IPFS — building on five years of research and development.

## Current State

Archivist is in the testnet phase. The client implementation is free and open-source software written in Nim. If you're interested, [get started here](./quick-start).

For the philosophical foundation behind the project, read [The Sovereign Storage Manifesto](https://manifesto.archivist.storage).
