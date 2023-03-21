# Introduction

In order to interact with peers of a peer-to-peer network, e.g., to execute an Aqua script, the "client" itself has to be a peer. Such client peers don't have to be publicly accessible or long-running in nature, but they do need to follow the protocol. In case of the Fluence peer-to-peer networks, browsers, command line or node apps are available client-peer built on [js client](https://github.com/fluencelabs/js-client).

The Fluence JS Client is available as a web client, .e.g., for the browser, and for nodejs, e.g., for node apps like FLuence CLI. In either case, js-client allows you to easily connect your dApp to the Fluence network and execute Aqua scripts without having to deep dive into libp2p programming.
