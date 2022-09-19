import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Quick Start

Every Fluence reference node comes with a set of builtin services that are accessible to Aqua programs. Let's use those readily available services to get the timestamp of a few of our peer-to-peer neighborhood nodes with Aqua.

```aqua
-- timestamp_getter.aqua
-- bring the builtin services into scope
import "@fluencelabs/aqua-lib/builtin.aqua"

-- create an identity service to join our results
service Op2("op"):
    identity(s: u64)
    array(a: string, b: u64) -> string

-- function to get ten timestamps from our Kademlia
-- neighborhood peers and return as an array of u64 timestamps
-- the function argument node is our peer id
func ts_getter(node: string) -> []u64:
  -- create a streaming variable
  res: *u64
  -- execute on the specified peer
  on node:
    -- get the base58 representation of the peer id
    k <- Op.string_to_b58(node)
    -- find all (default 20) neighborhood peers from k
    nodes <- Kademlia.neighborhood(k, nil, nil)
    -- for each peer in our neighborhood and in parallel
    for n <- nodes par:
      on n:
        -- try and get the peer's timestamp
        try:
          res <- Peer.timestamp_ms()
    -- flatten nine of our joined results
    Op2.identity(res!9)
  -- return an array of ten timestamps
  <- res
```

The Aqua script essentially creates a workflow originating from our client peer to enumerate neighbor peers for our reference node, calls on the builtin timestamp service on each peer in parallel, joins the results stream after we collect ten timestamps and return our u64 array of timestamps back to the client peer.

See the [ts-oracle example](https://github.com/fluencelabs/examples/tree/d52f06dfc3d30799fe6bd8e3e602c8ea1d1b8e8a/aqua-examples/ts-oracle) for the corresponding Aqua files in the `aqua-script` directory. Now that we have our script, 
let's use [Aqua CLI](../aqua-cli/aqua-cli.md) to run it:

<Tabs>
<TabItem value="Run" label="Run" default>

```sh
# use `aqua run` as your client with some peer id
aqua run \
    -a /dns4/kras-02.fluence.dev/tcp/19001/wss/p2p/12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf \
    -i aqua-scripts/timestamp_getter.aqua \
    -f 'ts_getter("12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf")'
```

</TabItem>
<TabItem value="Result" label="Result">

Here we go. Ten timestamps in micro seconds obtained in parallel:
```json
[
  [
    1624928596292,
    1624928596291,
    1624928596291,
    1624928596299,
    1624928596295,
    1624928596286,
    1624928596295,
    1624928596284,
    1624928596293,
    1624928596289
  ]
]
```

</TabItem>
</Tabs>

And that's it. We now have ten timestamps right from our selected peer's neighbors.
