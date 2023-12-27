import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Quick Start

Every Fluence reference node comes with a set of builtin services that are accessible to Aqua programs. 
Let's use those readily available services to get the timestamp of a few of our peer-to-peer neighborhood nodes with Aqua.

```aqua
-- timestamp_getter.aqua
import "@fluencelabs/aqua-lib/builtin.aqua"

func ts_getter(node: string, num_peers: u32) -> []u64:
  res: *u64

  on node:
    key <- Op.string_to_b58(node)
    nodes <- Kademlia.neighborhood(key, nil, [num_peers])
    for n <- nodes par:
      on n:
        try:
          res <- Peer.timestamp_ms()
          
    join res[num_peers - 1]
    
  <- res
```

Let's explain this script line by line. First of all, it brings builtin services (see [aqua-lib](../libraries/aqua-lib.md)) in scope by import:

```aqua
import "@fluencelabs/aqua-lib/builtin.aqua"
```

Next it defines a function named `ts_getter` with two parameters: `node` which is peer id and `num_peers` which is how many neighbors to check. 
That function returns array of obtained timestamps.

```aqua
func ts_getter(node: string, num_peers: u32) -> []u64:
```

On the first line it creates stream variable (see [CRDT Streams](../language/crdt-streams.md)) `res`:

```aqua
res: *u64
```

Then execution is transfered on peer with id that was passed in `node` (see [`on` expression](../language/topology.md#on-expression)):

```aqua
on node:
```

On `node` it obtains no more than `num_peers` neighbour nodes using builtin services:

```aqua
key <- Op.string_to_b58(node)
nodes <- Kademlia.neighborhood(key, nil, [num_peers])
```

After that for each of the obtained nodes in parallel (see [Parallel `for`](../language/flow/iterative.md#parallel-for)) it tries (see [try](../language/flow/conditional#try)) to push local timestamp to `res`:

```aqua
for n <- nodes par:
  on n:
    try:
      res <- Peer.timestamp_ms()
```

Back on `node` element `res[num_peers - 1]` is joined (see [`join` expression](../language/flow/parallel.md#explicit-join-expression)) thus making all results available:

```aqua
join res[num_peers - 1]
```

Finally, stream is converted to scalar (see [Streams Lifecycle](../language/crdt-streams.md#streams-lifecycle-and-guarantees)) and returned:

```aqua
<- res
```

See the [ts-oracle example](https://github.com/fluencelabs/examples/tree/d52f06dfc3d30799fe6bd8e3e602c8ea1d1b8e8a/aqua-examples/ts-oracle) for the corresponding Aqua files in the `aqua-script` directory. 

Now that we have our script, let's use [Fluence CLI](https://github.com/fluencelabs/cli) to run it:

<Tabs>
<TabItem value="Run" label="Run" default>

```sh
# use `fluence run` as your client with some peer id
fluence run \
    --relay /dns4/kras-02.fluence.dev/tcp/19001/wss/p2p/12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf \
    -i aqua-scripts/timestamp_getter.aqua \
    -f 'ts_getter("12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf", 10)'
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

Note that if you try to request too many peers, execution could halt. 
