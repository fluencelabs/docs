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

-- Get arrays of elements ([]u64) by key in place, trigger join-behaviour
values <- map.get("key")

-- Get stream of elements (*u64) by key, later you can join and wait for specific elements in this stream
valuesStream <- map.getStream("key")
-- ...
join valuesStream[10]

-- Get array of keys ([]string) in place, trigger join-behaviour
keys <- map.keys()

-- Get stream of keys (*string)
keysStream <- map.keysStream

-- Check if key contains at least one element, return boolean. Trigger join-behaviour
keyExist <- map.contains("key")

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
`data` types must be immutable, therefore streams are not allowed in the type declarations.
