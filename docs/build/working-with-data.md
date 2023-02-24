## Working with data

Fluence services, aka serverless Functions as a Service (FaaS), are stateless in nature. In order to handle state, services can be equipped to read from/write to local or remote data storage solutions. For the purpose of our discussion, local data storage solutions are provided by the peer hosting the service and remote data sources are independent of the Fluence service hosting environment, e.g., Filecoin or some MariaDB cluster.

Of course, compute services also want realtime access to data from a variety of (streaming) sources, which is quite often provided through some API hosted outside the Fluence network, such as the [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc). You can do integrate such data sources quite easily by writing *adapters*, i.e., Wasm wrappers, for the target API.

- [Local Data Storage](./local-data-storage.md)
- [Remote Data Storage](./remote-data-storage.md)
- [Data Acquisition](./data-acquisition.md)