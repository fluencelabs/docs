# CRDT Maps

A map is a kind of [collection](types.md#collection-types) that store arrays of elements that can be accessible by `string` keys. 

```aqua
-- A map creation
map: %u64

-- Write to a map, `foo()` returns `u64`
map <- "key", 1234
map <- "key", foo()
map <- "second key", foo()
```

Access to keys and elements can create different behaviours based on tasks:

```aqua
map: %u64

-- Get arrays of elements ([]u64) by key in place
values <- map.get("key")

-- Get stream of elements (*u64) by key, later you can join on number of elements and wait for specific elements in this stream
valuesStream <- map.getStream("key")
-- ...
join valuesStream[10]

-- Get array of keys ([]string) in place
keys <- map.keys()

-- Get stream of keys (*string)
keysStream <- map.keysStream

-- Check if key contains at least one element, return boolean
keyExist <- map.contains("key")

```

`get`, `keys` and `contains` methods will get non-changed result in-place, on the other hand `getStream` and `keysStream` methods will get streams, so, these streams can be changed over time while a map is updated during the execution. For example:
```aqua
...
map: %string

for p <- peers par:
  on p:
    -- add element to map on different peers
    map <- "exec", p

-- in this case there is no way to predict what number of elements will be in `results` 
results = map.get("exec")

resultsStream = map.getStream("exec")

-- here we can wait for any number of results depends on logic of a program
-- let's wait a respond from 5 peers
join resultsStream[4]

-- after join we can be sure that in `resultsStream` will be 5 or more elements
funcThatNeeds5Responses(resultsStream)
...
```

To dive deeper read about [join behavior](../language/flow/parallel.md#join-behavior) and [streams](crdt-streams.md).

`for` will iterate over key-value pairs. Maps can be used in `for` operations in two ways:

```aqua
map: %u64
-- ...

-- key is a string and value is u64 
for key, value <- map:
  foo(key, value)
  
for kv <- map:
  foo (kv.key, kv.value)

```

### Note
`data` types must be immutable and cannot be an arrow, therefore streams, maps, closures and abilities are not allowed in the type declarations.
