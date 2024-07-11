# CRDT Maps

A map is a kind of appendable [collection](types.md#collection-types) that stores key-value pairs. A collection of elements can be accessed using keys of type `string`.

## Creation

How to create a map and write to the map:

```aqua
-- Creation
map: %u64

-- Append different key-value pairs
map <<- "key", 1234
map <<- "key", foo()
map <<- "second key", foo()
```

Maps can contain only immutable [data types](./types.md#data-types) elements. Arrows, streams, other maps, closures and abilities are not allowed in the type declarations.

## Access

Access to keys and elements can create different behaviours based on tasks.

### Get array of elements by a key

Get array of all elements by key:

```aqua
values = map.get("key")
```

### Get stream of elements by a key

Get stream of elements by key, later you can join on the stream to wait for specific number of elements in it:

```aqua
valuesStream <- map.getStream("key")
-- wait for 9 elements
join valuesStream[9]
```

### Get array of keys

Get array of all keys (of type `[]string`) in map:

```aqua
keys <- map.keys()
```

### Get stream of keys

Get stream of keys (of type `*string`):

```aqua
keysStream <- map.keysStream()
```

### Check if a key is presented

Check if key contains at least one element, return boolean:

```aqua
keyExist <- map.contains("key")
```

### Difference between methods

`get`, `keys` and `contains` methods return immutable result in-place, on the other hand `getStream` and `keysStream` methods return streams which will eventually contain updates of the map. For example:

```aqua
map: %string

for p <- peers par:
  on p:
    -- add element to map on different peers
    map <<- "exec", p

-- in this case there is no way to predict what number of elements will be in `results`
results = map.get("exec")

resultsStream = map.getStream("exec")

-- here we can wait for any number of results depends on logic of a program
-- let's wait a respond from 5 peers
join resultsStream[4]

-- after join we can be sure that in `resultsStream` will be 5 or more elements
funcThatNeeds5Responses(resultsStream)

```

To dive deeper read about [join behavior](../language/flow/parallel.md#join-behavior) and [streams](crdt-streams.md).

## Iteration

Maps can be used in `for` operations in two ways:

```aqua
map: %u64

-- key is a string and value is u64
for key, value <- map:
  foo(key, value)

for kv <- map:
  foo(kv.key, kv.value)
```

`for` will iterate over key-value pairs by unique keys. Last write win resolution is applied to the values. Order of iteration generally is the same as the order of insertion. Example:

```aqua
map: %string
map <<- "a", "a1"
map <<- "b", "b1"
map <<- "b", "b2"
map <<- "c", "c1"
map <<- "c", "c2"
map <<- "c", "c3"

result: *string
for k, v <- map:
    result <<- v
```

in the end, `result` will be `["a1", "b2", "c3"]`.
