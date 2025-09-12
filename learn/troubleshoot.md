---
outline: [2, 3]
---
# Troubleshoot

Having trouble getting your Archivist node connected to the testnet? Here's a list of common Archivist connection conundrums and steps to diagnose and solve them. If your troubles are not addressed here, check our open issues on Github or reach out via our Discord server.

## Some basics

You've probably already considered these. But just in case:

1. Are you using a VPN? Make sure it's configured correctly to forward the right ports, and make sure you announce your node by the public IP address where you can be reached.
1. Are you using a firewall or other security software? Make sure it's configured to allow incoming connections to Archivist's discovery and peer-to-peer ports.

## Check your announce address

Your node announces your public address to the network, so other nodes can connect to you. A common issue is connection failure due to incorrect announce addresses. Follow these steps to check your announce address.

1. Go to a whats-my-ip site, or `ip.archivist.storage` and note the IP address.
1. Go into your router/modem WAN settings and find the public IP address.
1. These two addresses should match.
1. If they do not, it's possible that A) you're behind a VPN. In this case, it's up to you to disable the VPN or make sure all forwarding is configured correctly. or B) Your internet-service-provider has placed your uplink behind a secondary NAT. ISPs do this to save public IP addresses. The address assigned to your router/moderm is not a 'true' public internet address. Usually this issue can be solved by your ISP. Contact customer support and ask them to give you a public address (sometimes also called Dynamic IP address).
1. Call Archivist's debug/info endpoint. See the [Using Archivist](/learn/using) for the details.
1. In the JSON response, you'll find "announceAddresses".
1. The IP address listed there should match your public IP.
1. If the announce address in the JSON is incorrect, you can adjust it manually by changing Archivist's CLI argument `--nat` or setting the environment variable `ARCHIVIST_NAT`. After you've changed your announce address and restarted your node, please allow some time (20-30mins) for the network to disseminate the updated address.

If you've performed these steps and haven't found any issues, your announce address is probably not the problem.


